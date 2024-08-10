import { defineStore } from "pinia";

export const useGuideStore = defineStore("guide", {
  state: () => {
    return {
      seenGuide: false,
    };
  },
  actions: {},
  persist: true,
});
