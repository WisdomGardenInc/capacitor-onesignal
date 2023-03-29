// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    $style: { readonly [key: string]: string };
    /**
     * @deprecated
     */
    $forceCompute: (computedName: string, forceUpdate = true) => void;
    /**
     * @deprecated
     */
    $forceComputeAll: (forceUpdate = true, updateChildren = false) => void;
  }
}
