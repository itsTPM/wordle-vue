<script setup>
import { ref, onMounted } from "vue";
import { Toaster, toast } from "vue-sonner";
import { IconMoon, IconSun, IconSettings } from "@tabler/icons-vue";

import Keyboard from "@/components/keyboard/Keyboard.vue";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/dialog";
import Switch from "./components/Switch.vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import DebugInfo from "./components/DebugInfo.vue";
import { todayWord, checkWord } from "@/words.js";

const theme = ref("light");

const letterLimit = 5;
const rows = 6;
const word = ref("");
const inputWord = ref("");
const guesses = ref([]);
const guessesComparison = ref([]);
const currentGuess = ref(0);
const isGameWon = ref(false);
const isGameLost = ref(false);
const currentMode = ref(""); // 'wordOfTheDay' or 'custom'

guesses.value = Array(rows).fill("");
guessesComparison.value = Array(rows).fill("");

const customWord = ref("");
const customLink = ref("");

const settings = ref({ showDebugInfo: false });

const toggleTheme = () => {
  if (theme.value == "light") {
    theme.value = "dark";
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    theme.value = "light";
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

const makeCustomLink = () => {
  const b64Word = btoa(customWord.value);
  customLink.value = `${window.location.origin}/?word=${b64Word}`;
};

const copyCustomLink = async () => {
  try {
    await navigator.clipboard.writeText(customLink.value);
    toast("Link copied!", { type: "success" });
  } catch (err) {
    toast("Cannot copy", { type: "error" });
  }
};

const resetCustomDialog = () => {
  customWord.value = "";
  customLink.value = "";
};

const addLetter = (letter) => {
  if (inputWord.value.length < letterLimit) {
    inputWord.value += letter.toLowerCase();
    guesses.value[currentGuess.value] = inputWord.value;
  }
};

const removeLastLetter = () => {
  inputWord.value = inputWord.value.slice(0, -1);
  guesses.value[currentGuess.value] = inputWord.value;
};

window.addEventListener("keydown", (e) => {
  if (isGameWon.value || isGameLost.value) {
    return;
  }

  const key = e.key;

  // this will not work with chinese, japanese, hebrew, arabic and other languages that do not have uppercase/lowercase
  const isLetter = key.toLowerCase() !== key.toUpperCase() && key.length === 1;

  if (isLetter) {
    addLetter(key);
  } else {
    if (key === "Backspace") {
      removeLastLetter();
    }
    if (key === "Enter") {
      makeGuess();
    }
  }
});

const makeGuess = () => {
  if (inputWord.value.length !== letterLimit) {
    toast("Not enough letters!");
    return;
  }

  if (!checkWord(inputWord.value)) {
    toast("Not a valid word!");
    return;
  }

  const guess = inputWord.value;
  const target = word.value;
  inputWord.value = "";

  const result = Array(letterLimit).fill("N");
  const targetLetterCount = {};

  // Count the letters in the target word
  for (const letter of target) {
    targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
  }

  // First pass: find correct letters (Y)
  for (let i = 0; i < letterLimit; i++) {
    if (guess[i] === target[i]) {
      result[i] = "Y";
      targetLetterCount[guess[i]]--;
    }
  }

  // Second pass: find misplaced letters (X)
  for (let i = 0; i < letterLimit; i++) {
    if (
      result[i] !== "Y" &&
      target.includes(guess[i]) &&
      targetLetterCount[guess[i]] > 0
    ) {
      result[i] = "X";
      targetLetterCount[guess[i]]--;
    }
  }

  guesses.value[currentGuess.value] = guess;
  guessesComparison.value[currentGuess.value] = result.join("");

  if (guess === target) {
    toast("You won!", { type: "success" });
    setTimeout(() => {
      isGameWon.value = true;
    }, 1000);
  } else if (currentGuess.value === rows - 1) {
    toast("You lost! The word was " + target, { type: "error" });
    isGameLost.value = true;
  }

  currentGuess.value++;
};

onMounted(() => {
  // Theme detection
  const localStorageTheme = window.localStorage.getItem("theme");
  if (
    localStorageTheme !== null &&
    (localStorageTheme !== undefined) & (localStorageTheme !== "")
  ) {
    if (localStorageTheme == "dark") {
      theme.value = "dark";
      document.body.classList.add("dark");
    }
  } else {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      window.localStorage.setItem("theme", "dark");
    } else {
      window.localStorage.setItem("theme", "light");
    }
  }

  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("word") && urlParams.get("word") !== "") {
    currentMode.value = "custom";
    try {
      word.value = atob(urlParams.get("word"));
    } catch (e) {
      toast(
        "Error decoding the custom word parameter. Game mode switched to word of the day",
        {
          type: "error",
          duration: 3000,
        }
      );

      currentMode.value = "wordOfTheDay";
      word.value = todayWord();
      return;
    }
    if (atob(urlParams.get("word")).length !== letterLimit) {
      toast(
        `Custom word must be exactly ${letterLimit} letters long. Game mode switched to word of the day`,
        {
          type: "error",
          duration: 3000,
        }
      );

      currentMode.value = "wordOfTheDay";
      word.value = todayWord();
    }
  } else {
    currentMode.value = "wordOfTheDay";
    word.value = todayWord();
  }
});

// Disable double tap to zoom on iOS Safari
// https://stackoverflow.com/a/73334551/
document.ondblclick = function (e) {
  e.preventDefault();
};
</script>

<template>
  <Toaster position="top-center" :expand="true" :duration="1500" />

  <div
    class="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.25)] z-10 backdrop-blur-md transition-all duration-300 flex items-center justify-center"
    :class="
      isGameWon
        ? ['translate-y-0', 'visible']
        : ['-translate-y-full', 'invisible']
    "
  >
    <p class="text-3xl text-center font-semibold">Congratulations! You won!</p>
  </div>

  <DebugInfo
    :word
    :currentMode
    :inputWord
    :currentGuess
    :guesses
    :guessesComparison
    :isGameWon
    :isGameLost
    v-if="settings.showDebugInfo"
  ></DebugInfo>

  <div
    class="p-2 xs:p-4 rounded-md border shadow-sm flex flex-col gap-4 max-w-[calc(100vw-1rem)] items-center relative w-full xs:w-[unset] pt-12"
  >
    <div class="absolute top-2 right-2 flex gap-2">
      <Button
        class="w-10 h-10 overflow-clip hover:bg-primary text-black/75 dark:text-white/75 relative"
        @click="toggleTheme"
      >
        <IconMoon
          class="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          stroke-width="2"
          v-if="theme === 'light'"
        ></IconMoon>
        <IconSun
          class="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          stroke-width="2"
          v-else
        ></IconSun>
      </Button>
      <Dialog>
        <template #trigger>
          <r-DialogTrigger
            class="w-10 h-10 overflow-clip hover:bg-primary text-black/75 dark:text-white/75 relative"
            :as="Button"
          >
            <IconSettings
              class="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              stroke-width="2"
            ></IconSettings>
          </r-DialogTrigger>
        </template>
        <template #content>
          <DialogContent aria-describedby="undefined">
            <DialogClose></DialogClose>
            <DialogTitle>Settings</DialogTitle>
            <div class="flex gap-2 py-6">
              <Switch id="debug" v-model="settings.showDebugInfo"></Switch>
              <label for="debug"> Show debug info </label>
            </div>
          </DialogContent>
        </template>
      </Dialog>
    </div>

    <div class="flex justify-center items-center flex-col">
      <h1 class="text-center text-3xl font-['Lato']">Wordle Vue</h1>
      <span class="uppercase font-bold text-xs tracking-wide text-secondary">
        In Development
      </span>
    </div>

    <div class="flex flex-col xs:flex-row gap-2 xs:gap-0">
      <span
        class="uppercase px-6 py-2 bg-secondary text-secondary-foreground font-bold text-xs transition-colors text-center"
      >
        <template v-if="currentMode === 'wordOfTheDay'">
          Word of the day
        </template>
        <template v-else-if="currentMode === 'custom'"> Custom word</template>
      </span>

      <Dialog>
        <template #trigger>
          <r-DialogTrigger
            class="uppercase px-6 py-2 bg-primary font-bold text-xs border-r border-y text-primary-foreground hover:bg-secondary-hover select-none transition-colors cursor-pointer focus:outline outline-2 outline-offset-2 outline-blue-400 border-l xs:border-l-0"
          >
            Make wordle with your word!
          </r-DialogTrigger>
        </template>
        <template #content>
          <DialogContent>
            <DialogClose></DialogClose>
            <DialogTitle>Make wordle with your word!</DialogTitle>
            <template v-if="customLink === ''">
              <DialogDescription>
                Enter any word and get a special link to share with your friend
              </DialogDescription>
              <form
                class="grid w-full gap-2 grid-rows-1 grid-cols-4"
                @submit.prevent="makeCustomLink"
              >
                <Input
                  placeholder="Your word"
                  type="text"
                  name="customWord"
                  v-model="customWord"
                  required
                  maxlength="5"
                  minlength="5"
                  class="col-span-3"
                />
                <Button
                  class="p-2 bg-[#5f9f55] text-white border-[#45873b] hover:bg-[#86ae80] hover:border-[#799672] border"
                >
                  Get link
                </Button>
              </form>
              <p class="text-xs mt-1 text-black/50 dark:text-white/50">
                You can use words that aren't even in the dictionary.
              </p>
            </template>
            <template v-else>
              <DialogDescription> Custom link for your word </DialogDescription>
              <div class="grid grid-rows-1 grid-cols-4 gap-2 w-full">
                <Input
                  type="text"
                  disabled
                  name="customLink"
                  v-model="customLink"
                  class="col-span-3 text-gray-400"
                />
                <Button
                  class="p-2 bg-[#6a85c9] text-white border-[#405895] hover:bg-[#8699c7] hover:border-[#646f8b] border"
                  @click="copyCustomLink"
                >
                  Copy
                </Button>
              </div>
              <p class="text-xs text-black/50 dark:text-white/50 mt-2">
                <Button
                  @click="resetCustomDialog"
                  class="underline hover:text-secondary-hover hover:underline-offset-4 underline-offset-2 transition-all"
                >
                  Click here
                </Button>
                to reset this dialog and make link for another word
              </p>
            </template>
          </DialogContent>
        </template>
      </Dialog>
    </div>

    <div
      class="w-full max-w-80 max-h-96 xs:w-80 xs:h-96 flex flex-col gap-2 select-none"
    >
      <div class="w-full h-full flex gap-2" v-for="row in rows">
        <span
          v-for="letter in letterLimit"
          class="bg-gray-50 dark:bg-white/5 border-2 h-full aspect-square flex items-center justify-center text-center text-3xl uppercase font-bold transition-all duration-300 w-full"
          :class="[
            guessesComparison[row - 1]?.charAt(letter - 1) === 'N'
              ? ['!bg-gray-500', 'text-white', 'border-gray-500']
              : '',
            guessesComparison[row - 1]?.charAt(letter - 1) === 'Y'
              ? ['!bg-emerald-500', 'text-white', 'border-emerald-500']
              : '',
            guessesComparison[row - 1]?.charAt(letter - 1) === 'X'
              ? ['!bg-yellow-500', 'text-white', 'border-yellow-500']
              : '',
            guesses[row - 1]?.charAt(letter - 1) ? ['animate-typing'] : '',
          ]"
        >
          {{ guesses[row - 1]?.charAt(letter - 1) }}
        </span>
      </div>
    </div>

    <Keyboard
      @addLetter="(letter) => addLetter(letter)"
      @makeGuess="makeGuess"
      @removeLastLetter="removeLastLetter"
    ></Keyboard>
  </div>
</template>
