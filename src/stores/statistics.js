import { defineStore } from "pinia";

export const useStatisticsStore = defineStore("statistics", {
  state: () => {
    return {
      wordOfTheDay: {
        title: "Word of the day",
        win: 0,
        lose: 0,
      },
      random: {
        title: "Random word",
        win: 0,
        lose: 0,
      },
      custom: {
        title: "Custom word",
        win: 0,
        lose: 0,
      },
    };
  },
  actions: {
    pushToStatistics(mode, result) {
      this[mode][result]++;
    },
    exportStatistics() {
      const url = new URL(window.location.origin);
      url.searchParams.append("statistics", JSON.stringify(this.$state));

      return url.href;
    },
  },
  persist: true,
});
