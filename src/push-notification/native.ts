import { Ref } from "vue";
import OneSignalTunnel from "./one-signal";

class NativeTunnel {
  public async init(appId: string, handler: Function, logger: {push: (m: string) => void}) {
    return await OneSignalTunnel.init(appId, handler, logger);
  }

  public async sendTags(tagsNumber: number) {
    return await OneSignalTunnel.sendTags(tagsNumber);
  }

  public async getTags() {
    return await OneSignalTunnel.getTags();
  }

  public async reset() {
    return await OneSignalTunnel.reset();
  }

  setBadgeNumber(number: number): void {
    OneSignalTunnel.setBadgeNumber();
  }
}

export default new NativeTunnel();
