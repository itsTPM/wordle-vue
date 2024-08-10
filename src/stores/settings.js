import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      showDebugInfo: {
        title: "Show debug info",
        value: false,
      },
      onlyOnscreenInput: {
        title: "Onscreen keyboard input only",
        value: false,
      },
      swapKeyboardButtons: {
        title: "Swap 'Enter' and 'Backspace' buttons",
        value: false,
      },
    };
  },
  actions: {
    pushToStatistics(mode, result) {
      this[mode][result]++;
    },
  },
  persist: true,
});
