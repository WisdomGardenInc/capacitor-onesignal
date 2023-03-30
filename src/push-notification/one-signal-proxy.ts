// @ts-nocheck

// some onesignal api no callback, mock it
let logger: { push: (m: string) => void } | undefined;

const mockExecuteCallback = (execute: Function, timeout = 500) => {
  return new Promise<boolean>((resolve) => {
    execute();
    setTimeout(() => resolve(true), timeout);
  });
};

const callbackPlaceholder = () => {
  logger?.push("onesignal proxy callbackPlaceholder");
};

const OneSignalProxy = {
  setLogger(_logger: { push: (m: string) => void }) {
    logger = _logger;
  },

  init: (appId: string) => window.plugins.OneSignal.setAppId(appId),

  promptForPushNotificationsWithUserResponse: (handler: Function) =>
    window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(handler),

  clearOneSignalNotifications(): void {
    return window.plugins.OneSignal.clearOneSignalNotifications();
  },

  setExternalUserId(externalId: string): void {
    let fixedExternalId = externalId;

    if (!fixedExternalId) {
      fixedExternalId = "empty_external_id";
    }

    if (typeof fixedExternalId !== "string") {
      fixedExternalId = "not_string_external_id";
    }

    return window.plugins.OneSignal.setExternalUserId(fixedExternalId);
  },

  setLogLevel(logLevel: number, visualLevel: number): void {
    return window.plugins.OneSignal.setLogLevel(logLevel, visualLevel);
  },

  setSubscription(enable: boolean): void {
    return window.plugins.OneSignal.disablePush(!enable);
  },

  handleNotificationOpened(handler: Function) {
    return window.plugins.OneSignal.setNotificationOpenedHandler(handler);
  },

  handleNotificationReceived(handler: Function) {
    return window.plugins.OneSignal.setNotificationWillShowInForegroundHandler(handler);
  },

  completeNotification(notificationId: string, shouldDisplay: boolean) {
    return window.plugins.OneSignal.completeNotification({ notificationId: notificationId }, shouldDisplay);
  },

  getTags() {
    return new Promise<{ [key: string]: string }>((resolve) => {
      return window.cordova.exec(
        (tags) => {
          logger?.push("getTags length:", Object.keys(tags).length);
          return resolve(tags);
        },
        () => resolve({}),
        "OneSignalPush",
        "getTags",
        []
      );
    });
  },

  sendTag(key: string, value: string): Promise<boolean> {
    return mockExecuteCallback(() => {
      return window.cordova.exec(callbackPlaceholder, callbackPlaceholder, "OneSignalPush", "sendTag", [
        { [key]: value },
      ]);
    });
  },

  sendTags(tags: { [key: string]: string }): Promise<boolean> {
    return mockExecuteCallback(() => {
      logger?.push("onesignal send tags length:" + Object.keys(tags).length);
      return window.cordova.exec(callbackPlaceholder, callbackPlaceholder, "OneSignalPush", "sendTags", [tags]);
    });
  },
  deleteTag(key: string): Promise<boolean> {
    return mockExecuteCallback(() => {
      return window.cordova.exec(callbackPlaceholder, callbackPlaceholder, "OneSignalPush", "deleteTag", [key]);
    });
  },
  deleteTags(keys: string[]): Promise<boolean> {
    return mockExecuteCallback(() => {
      logger?.push("onesignal delete tags length:" + keys.length);
      return window.cordova.exec(callbackPlaceholder, callbackPlaceholder, "OneSignalPush", "deleteTags", keys);
    });
  },
};

export { OneSignalProxy };
