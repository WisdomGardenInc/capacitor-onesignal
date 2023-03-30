import { OneSignalProxy } from "./one-signal-proxy";
import { JSONType } from "@/types/common";

export type PromiseStringsFunction<T> = (arg1: string[]) => Promise<T>;
let logger: { push: (m: string) => void } | undefined;

const loopInChunks = async (list: string[], proxy: PromiseStringsFunction<boolean>, chunk = 100) => {
  try {
    for (let i = 0; i < list.length; i += chunk) {
      const chunks = list.slice(i, i + chunk);

      await proxy(chunks);
    }
  } catch (e) {
    logger?.push("loopInChunks error" + e);
  }
};

class OneSignalProxyTunnel {
  private TUNNEL = "OneSignalProxy";

  private cachedTagsDeleted?: Promise<void>;

  public async sendTags(tagNumber: number) {
    try {
      const tags = [];
      // 100 is ok
      // 101 tags empty
      // only on iOS
      for (let i = 1; i <= tagNumber; i++) {
        tags.push(`wg_test_tag_${i}`);
      }

      const subscribedTags = await this.getTags();
      const toSubscribeTags = tags;

      const toDeleteTags = Object.keys(subscribedTags).reduce((results: Array<string>, tag: string) => {
        const index = toSubscribeTags.indexOf(tag);

        if (index !== -1 && subscribedTags[tag] === "true") {
          toSubscribeTags.splice(index, 1);
        } else {
          results.push(tag);
        }
        return results;
      }, []);

      logger?.push(`toSubscribeTags length: ${toSubscribeTags.length}`);
      logger?.push(`toDeleteTags length: ${toDeleteTags.length}`);
      if (toSubscribeTags.length > 0) {
        await this._sendTags(toSubscribeTags);
      }
      if (toDeleteTags.length > 0) {
        await loopInChunks(toDeleteTags, async (chunks: string[]) => {
          return await OneSignalProxy.deleteTags(chunks);
        });
      }
    } catch (e) {
      logger?.push("set tags and alias error" + e);
    }
  }

  public async getTags() {
    const subscribedTags = await OneSignalProxy.getTags();

    logger?.push(`OneSignal existed tags length: ${Object.keys(subscribedTags).length}`);
    return subscribedTags;
  }

  public async init(appId: string, handler: Function, _logger: { push: (m: string) => void }) {
    logger = _logger;
    try {
      logger?.push("init");
      this.logSetting();
      await this.start(appId, handler);
      await OneSignalProxy.setSubscription(true);
      OneSignalProxy.setExternalUserId("wg_test_alias");
      logger?.push(`OneSignal add alias: wg_test_alias`);
      // await this.sendTags();

      logger?.push("init finish");
    } catch (e) {
      logger?.push("init error" + e);
    }
  }

  private logSetting() {
    OneSignalProxy.setLogLevel(6, 0);
  }

  private async start(appId: string, handler: Function) {
    try {
      debugger
      OneSignalProxy.setLogger(logger!);
      OneSignalProxy.init(appId);

      OneSignalProxy.handleNotificationReceived((osNotification: JSONType) => {
        OneSignalProxy.completeNotification(osNotification.notification.notificationId, false);
        const data = osNotification.notification.additionalData;

        handler(true, data.message, data);
      });

      OneSignalProxy.handleNotificationOpened((osNotification: JSONType) => {
        const data = osNotification.notification.additionalData;

        handler(false, data.message, data);
      });

      OneSignalProxy.promptForPushNotificationsWithUserResponse((hasPermission: boolean) => {
        logger?.push(`OneSignal has notification permission: ${hasPermission}`);
      });
    } catch (e) {
      logger?.push("start sdk error" + e);
    }
  }

  private async _sendTags(tags: Array<string>) {
    return await loopInChunks(tags, async (chunks: string[]) => {
      const userTags = chunks.reduce((results: { [key: string]: string }, tag) => {
        results[tag] = "true";
        return results;
      }, {});

      try {
        await OneSignalProxy.sendTags(userTags);
      } catch (error) {
        logger?.push(error + "");
      }

      return true;
    });
  }

  public async reset() {
    try {
      await OneSignalProxy.setSubscription(false);
      const subscribedTags = await OneSignalProxy.getTags();
      const subscribedTagsKeys = Object.keys(subscribedTags);

      logger?.push(subscribedTagsKeys.join(", "));

      if (subscribedTagsKeys?.length) {
        logger?.push("start tags delete");
        await loopInChunks(subscribedTagsKeys, async (chunks: string[]) => {
          return await OneSignalProxy.deleteTags(chunks);
        });
        logger?.push("delete tag all loop end");
      } else {
        logger?.push("get cache empty");
      }

      logger?.push("deleteCachedTags end");
    } catch (e) {
      logger?.push("reset error" + e);
    }
  }

  setBadgeNumber(): void {
    OneSignalProxy.clearOneSignalNotifications();
  }
}

export default new OneSignalProxyTunnel();
