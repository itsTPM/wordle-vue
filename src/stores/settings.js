import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      showDebugInfo: {
        title: 'Show debug info',
        type: 'switch',
        value: false,
      },
      onlyOnscreenInput: {
        title: 'Onscreen keyboard input only',
        type: 'switch',
        value: false,
      },
      swapKeyboardButtons: {
        title: "Swap 'Enter' and 'Backspace' buttons",
        type: 'switch',
        value: false,
      },
      defaultGameMode: {
        title: 'Default game mode',
        type: 'select',
        value: 'wordOfTheDay',
        options: [
          { value: 'wordOfTheDay', title: 'Word of the day' },
          { value: 'random', title: 'Random' },
        ],
      },
    };
  },
  actions: {},
  persist: true,
});
