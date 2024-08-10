import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => {
    return {
      currentTheme: "light",
      themeWasDetected: false,
    };
  },
  actions: {
    toggleTheme(newTheme) {
      if (newTheme) {
        this.currentTheme = newTheme;
        if (newTheme === "light") {
          document.body.classList.remove("dark");
        } else {
          document.body.classList.add("dark");
        }
        return;
      }

      if (this.currentTheme === "light") {
        this.currentTheme = "dark";
        document.body.classList.add("dark");
      } else {
        this.currentTheme = "light";
        document.body.classList.remove("dark");
      }
    },

    detectSystemTheme() {
      if (this.themeWasDetected) return;

      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        this.toggleTheme("dark");
      } else {
        this.toggleTheme("light");
      }

      this.themeWasDetected = true;
    },
  },
  persist: true,
});
