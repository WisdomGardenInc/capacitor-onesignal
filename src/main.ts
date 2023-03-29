import Vue from "vue";
import App from "@/App.vue";

const initApp = async () => {
  new Vue({
    render: (h) => h(App),
  }).$mount("#app");
};

initApp();
