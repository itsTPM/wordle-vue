import { defineStore } from 'pinia';

export const useCustomsStore = defineStore('customs', {
  state: () => {
    return {
      customWord: '',
      customLink: '',
    };
  },
  actions: {
    makeCustomLink() {
      const b64Word = btoa(this.customWord);
      this.customLink = `${window.location.origin}/?word=${b64Word}`;
    },
    resetCustoms() {
      this.customWord = '';
      this.customLink = '';
    },
  },
});
