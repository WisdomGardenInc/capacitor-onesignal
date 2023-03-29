<template>
  <div :class="$style.main">
    <div :class="[$style.area, $style.title]">Test Onesignal</div>
    <div :class="[$style.area, $style.controls]">
      <button @click="reload()">Reload Page</button>
      <div :class="[$style.areaSubTitle]">Onesignal Functions:</div>
      <div :class="[$style.onesignalControls]">
        <button @click="init()">Init</button>
        <button @click="sendTags(100)">Send 100 tags</button>
        <button @click="sendTags(101)">Send 101 tags</button>
        <button @click="getTags()">Get tags</button>
        <button @click="reset()">Reset</button>
      </div>
    </div>
    <div :class="[$style.area, $style.console]">
      <span>Console:</span>
      <textarea ref="consoleOut" readonly disabled :value="logsText"></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { Plugins } from "@capacitor/core";
import Notification from "@/push-notification/native";

const consoleOut = ref<HTMLTextAreaElement>();
const ONESIGNAL_APP_ID = "";
const logs = ref<string[]>([]);

const logger = {
  push: (message: string) => {
    console.log(message);
    logs.value.push(message);
  },
};

const handlerMessage = (...args: any[]) => {
  logs.value.push("handlerMessage:\n");
  logs.value.push(args.join("\n"));
};

const init = () => {
  Notification.init(ONESIGNAL_APP_ID, handlerMessage, logger);
};
const sendTags = (tagsNumber: number) => {
  logs.value.push("\n\n");
  Notification.sendTags(tagsNumber);
};
const getTags = () => {
  logs.value.push("\n\n");
  Notification.getTags();
};

const reset = () => {
  logs.value.push("\n\n");
  Notification.reset();
};

const reload = () => {
  window.location.reload();
};

const logsText = computed(() => logs.value.join("\n"));

onMounted(() => {
  Plugins.SplashScreen.hide();
});

watch(
  () => logs.value,
  () => {
    console.log("111");
    consoleOut.value?.scrollTo(0, (consoleOut.value?.scrollHeight || 0) + 40);
  },
  { deep: true }
);
</script>

<style module>
* {
  margin: 0;
  padding: 0;
}

body {
  padding: env(safe-area-inset-top, 20px) env(safe-area-inset-right, 20px) env(safe-area-inset-bottom, 20px)
    env(safe-area-inset-left, 20px);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.main {
  padding: 16px;
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  height: calc(100% - 32px);
}

.area {
  width: 100%;
  margin-top: 16px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.controls {
  display: block;
}
.areaSubTitle {
  margin: 16px 0 8px 0;
}
.onesignalControls {
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
}

.console {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.console textarea {
  margin-top: 8px;
  height: 80%;
  resize: none;
}

button {
  padding: 4px 6px;
}
</style>
