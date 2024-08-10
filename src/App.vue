<script setup>
import { ref, onMounted } from "vue";
import { Toaster, toast } from "vue-sonner";
import {
  IconMoon,
  IconSun,
  IconSettings,
  IconHelp,
  IconChartBar,
} from "@tabler/icons-vue";

import Keyboard from "@/components/keyboard/Keyboard.vue";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/dialog";
import Switch from "@/components/Switch.vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import DebugInfo from "@/components/DebugInfo.vue";
import WordleVueLogo from "../public/logo-text.svg?component";
import { todayWord, randomWord, checkWord } from "@/words.js";

import { useStatisticsStore } from "@/stores/statistics";
const statisticsStore = useStatisticsStore();

import { useSettingsStore } from "./stores/settings";
const settingsStore = useSettingsStore();

import { useThemeStore } from "./stores/theme";
const themeStore = useThemeStore();

// App state

// Game state
const letterLimit = 5;
const rows = 6;
const word = ref("");
const inputWord = ref("");
const guesses = ref([]);
const guessesComparison = ref([]);
const currentGuess = ref(0);
const isGameWon = ref(false);
const isGameLost = ref(false);
const currentMode = ref(""); // 'wordOfTheDay', 'random' or 'custom'
const letters = [..."abcdefghijklmnopqrstuvwxyz"];
const lettersComparison = ref({});
const customWord = ref("");
const customLink = ref("");

guesses.value = Array(rows).fill("");
guessesComparison.value = Array(rows).fill("");

for (const letter of letters) {
  lettersComparison.value[letter] = "";
}

const changeMode = (newMode) => {
  currentMode.value = newMode;

  currentGuess.value = 0;
  inputWord.value = "";
  guesses.value = Array(rows).fill("");
  guessesComparison.value = Array(rows).fill("");

  for (const letter of letters) {
    lettersComparison.value[letter] = "";
  }

  if (newMode === "random") {
    word.value = randomWord();
  } else {
    word.value = todayWord();
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

const setLetterComparison = (letter, match) => {
  if (
    (match === "X" && lettersComparison.value[letter] === "Y") ||
    (match === "N" && lettersComparison.value[letter] === "X") ||
    (match === "N" && lettersComparison.value[letter] === "Y")
  )
    return;
  lettersComparison.value[letter] = match;
};

window.addEventListener("keydown", (e) => {
  if (
    isGameWon.value ||
    isGameLost.value ||
    settingsStore.onlyOnscreenInput.value
  )
    return;

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

const guideDialogOpen = ref(false);

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
      setLetterComparison(target[i], "Y");
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
      setLetterComparison(guess[i], "X");
    }
  }

  for (let i = 0; i < result.length; i++) {
    const letter = result[i];

    if (letter == "N") {
      setLetterComparison(guess[i], "N");
    }
  }

  guesses.value[currentGuess.value] = guess;
  guessesComparison.value[currentGuess.value] = result.join("");

  if (guess === target) {
    statisticsStore.pushToStatistics(currentMode.value, "win");
    toast("You won!", { type: "success" });
    setTimeout(() => {
      isGameWon.value = true;
    }, 1000);
  } else if (currentGuess.value === rows - 1) {
    statisticsStore.pushToStatistics(currentMode.value, "lose");
    toast("You lost! The word was " + target, { type: "error" });
    isGameLost.value = true;
  }

  currentGuess.value++;
};

onMounted(() => {
  themeStore.detectSystemTheme();

  // Check is user seen guide
  const seenGuide = window.localStorage.getItem("seenGuide");

  if (!seenGuide) {
    window.localStorage.setItem("seenGuide", "true");

    guideDialogOpen.value = true;
  }

  // Check if current url has word param & set game mode based on it
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
  <Toaster
    position="top-center"
    :expand="true"
    :duration="1500"
    :theme="themeStore.currentTheme"
  />

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

  <header
    class="bg-primary relative w-full border-b px-4 flex flex-col items-baseline xs:items-center justify-center gap-2 py-2 max-h-xs:py-1 xs:py-4"
  >
    <ul class="absolute bottom-1/2 translate-y-1/2 right-2 flex xs:gap-2">
      <li class="h-12">
        <Button
          class="w-12 aspect-square overflow-clip hover:bg-secondary text-black/75 dark:text-white/75 relative"
          :aria-label="
            themeStore.currentTheme === 'light'
              ? 'Switch to dark theme'
              : 'Switch to light theme'
          "
          @click="themeStore.toggleTheme()"
        >
          <IconMoon
            class="w-8 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            stroke-width="2"
            aria-hidden="true"
            v-if="themeStore.currentTheme === 'light'"
          ></IconMoon>
          <IconSun
            class="w-8 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            stroke-width="2"
            aria-hidden="true"
            v-else
          ></IconSun>
        </Button>
      </li>

      <li class="h-12">
        <Dialog v-model:open="guideDialogOpen">
          <template #trigger>
            <r-DialogTrigger
              class="w-12 aspect-square overflow-clip hover:bg-secondary text-black/75 dark:text-white/75 relative"
              type="button"
              :as="Button"
              aria-label="Open guide dialog"
            >
              <IconHelp
                class="w-8 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
                stroke-width="2"
              ></IconHelp>
            </r-DialogTrigger>
          </template>
          <template #content>
            <DialogContent>
              <DialogClose></DialogClose>
              <DialogTitle>Help</DialogTitle>
              <DialogDescription
                class="text-center text-sm pt-0 text-black/75 dark:text-white/75"
              >
                How to play
              </DialogDescription>
              <div class="flex flex-col gap-1">
                <p>In Wordle game you need to guess word with only 6 tries.</p>
                <p class="border-l-4 pl-4 text-black/75 dark:text-white/75">
                  Each guess should be a valid 5-letter word from English
                  dictionary.
                </p>
                <hr class="my-4" />
                <p class="font-medium">Highlighting</p>
                <ul>
                  <li>
                    <span class="text-green">Green</span> means that the letter
                    is in the word, and located in correct place.
                  </li>
                  <li>
                    <span class="text-yellow">Yellow</span> means that the
                    letter is in the word, but is located in a different place.
                  </li>
                  <li>
                    <span class="text-gray">Gray</span> means that the letter is
                    not presented in the word.
                  </li>
                </ul>
                <hr class="my-4" />
                <p class="font-medium">Change game mode</p>
                <p>
                  You can select between 'Word of the day' and 'Random word'
                  modes.
                </p>
                <div
                  class="uppercase px-6 py-2 bg-secondary text-secondary-foreground font-bold text-xs text-center max-w-48 select-none"
                >
                  <template v-if="currentMode === 'wordOfTheDay'">
                    Word of the day
                  </template>
                  <template v-if="currentMode === 'random'">
                    Random word
                  </template>
                  <template v-else-if="currentMode === 'custom'">
                    Custom word
                  </template>
                </div>
                <p class="text-xs text-black/50 dark:text-white/50">
                  Find this button on the page to change game mode.
                </p>
              </div>
            </DialogContent>
          </template>
        </Dialog>
      </li>
      <li class="h-12">
        <Dialog>
          <template #trigger>
            <r-DialogTrigger
              class="w-12 aspect-square overflow-clip hover:bg-secondary text-black/75 dark:text-white/75 relative"
              type="button"
              :as="Button"
              aria-label="Open settings dialog"
            >
              <IconSettings
                class="w-8 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
                stroke-width="2"
              ></IconSettings>
            </r-DialogTrigger>
          </template>
          <template #content>
            <DialogContent aria-describedby="undefined">
              <DialogClose></DialogClose>
              <DialogTitle>Settings</DialogTitle>
              <ul class="flex flex-col gap-6 py-6">
                <li
                  class="flex gap-2"
                  v-for="(setting, keyName) in settingsStore.$state"
                >
                  <Switch :id="keyName" v-model="setting.value"></Switch>
                  <label :for="keyName"> {{ setting.title }} </label>
                </li>
              </ul>
            </DialogContent>
          </template>
        </Dialog>
      </li>
      <li class="h-12">
        <Dialog>
          <template #trigger>
            <r-DialogTrigger
              class="w-12 aspect-square overflow-clip hover:bg-secondary text-black/75 dark:text-white/75 relative"
              type="button"
              :as="Button"
              aria-label="Open statistics dialog"
            >
              <IconChartBar
                class="w-8 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
                stroke-width="2"
              ></IconChartBar>
            </r-DialogTrigger>
          </template>
          <template #content>
            <DialogContent aria-describedby="undefined">
              <DialogClose></DialogClose>
              <DialogTitle>Statistics</DialogTitle>
              <template v-for="(gameMode, _, idx) in statisticsStore.$state">
                <div class="flex flex-col gap-1">
                  <p class="font-semibold">{{ gameMode.title }}</p>
                  <ul>
                    <li>Wins: {{ gameMode.win }}</li>
                    <li>Loses: {{ gameMode.lose }}</li>
                  </ul>
                </div>
                <hr
                  class="my-4"
                  v-if="idx != Object.keys(statisticsStore.$state).length - 1"
                />
              </template>
            </DialogContent>
          </template>
        </Dialog>
      </li>
    </ul>

    <WordleVueLogo
      class="fill-foreground max-h-xs:h-5 h-6"
      aria-hidden="true"
    ></WordleVueLogo>

    <h1 class="sr-only">Wordle Vue game</h1>

    <p
      class="uppercase tracking-wide font-extrabold text-xs text-black/25 dark:text-white/25 -mt-1 select-none"
    >
      in development
    </p>
  </header>

  <main
    class="flex flex-col max-h-xs:gap-2 gap-4 items-center w-full pt-2 xs:py-4 relative"
  >
    <DebugInfo
      :word
      :currentMode
      :inputWord
      :currentGuess
      :guesses
      :guessesComparison
      :isGameWon
      :isGameLost
      v-if="settingsStore.showDebugInfo.value"
    ></DebugInfo>

    <div class="flex">
      <Dialog>
        <template #trigger>
          <r-DialogTrigger
            class="uppercase px-6 py-2 bg-secondary text-secondary-foreground font-bold text-xs transition-colors text-center hover:bg-secondary-hover select-none"
            type="button"
            as="button"
            aria-label="Open game mode dialog"
          >
            <template v-if="currentMode === 'wordOfTheDay'">
              Word of the day
            </template>
            <template v-if="currentMode === 'random'"> Random word </template>
            <template v-else-if="currentMode === 'custom'">
              Custom word
            </template>
          </r-DialogTrigger>
        </template>
        <template #content>
          <DialogContent aria-describedby="undefined">
            <DialogClose></DialogClose>
            <DialogTitle>Change game mode</DialogTitle>
            <div class="flex gap-2 py-6">
              <Button
                class="bg-secondary px-3 py-2 disabled:text-secondary disabled:bg-primary hover:bg-secondary-hover"
                :disabled="currentMode === 'wordOfTheDay'"
                @click="changeMode('wordOfTheDay')"
                >Word of the day</Button
              >
              <Button
                class="bg-secondary px-3 py-2 disabled:text-secondary disabled:bg-primary hover:bg-secondary-hover"
                :disabled="currentMode === 'random'"
                @click="changeMode('random')"
                >Random</Button
              >
            </div>
          </DialogContent>
        </template>
      </Dialog>

      <Dialog>
        <template #trigger>
          <r-DialogTrigger
            class="uppercase px-6 py-2 bg-primary font-bold text-xs border-r border-y text-primary-foreground hover:bg-secondary-hover select-none border-l-0 rounded-none hidden xs:block"
            type="button"
            :as="Button"
          >
            Make wordle with your word!
          </r-DialogTrigger>
          <r-DialogTrigger
            class="uppercase aspect-square h-8 bg-primary font-bold text-xs border-r border-y text-primary-foreground hover:bg-secondary-hover select-none border-l-0 rounded-none block xs:hidden"
            type="button"
            :as="Button"
          >
            +
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
                class="flex flex-col xs:grid w-full gap-2 grid-rows-1 grid-cols-4"
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
                  type="submit"
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
              <div
                class="flex flex-col xs:grid grid-rows-1 grid-cols-4 gap-2 w-full"
              >
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
      class="w-72 max-w-80 max-h-96 xs:w-80 xs:h-96 flex flex-col max-h-xs:gap-1 select-none gap-2"
    >
      <div class="w-full h-full flex max-h-xs:gap-1 gap-2" v-for="row in rows">
        <span
          v-for="letter in letterLimit"
          class="bg-gray-50 dark:bg-white/5 border-2 h-full aspect-square flex items-center justify-center text-center text-3xl uppercase font-bold transition-all duration-300 w-full"
          :class="[
            guessesComparison[row - 1]?.charAt(letter - 1) === 'N'
              ? ['!bg-gray', 'text-white', 'border-gray']
              : '',
            guessesComparison[row - 1]?.charAt(letter - 1) === 'Y'
              ? ['!bg-green', 'text-white', 'border-green']
              : '',
            guessesComparison[row - 1]?.charAt(letter - 1) === 'X'
              ? ['!bg-yellow', 'text-white', 'border-yellow']
              : '',
            guesses[row - 1]?.charAt(letter - 1) ? ['animate-typing'] : '',
          ]"
        >
          {{ guesses[row - 1]?.charAt(letter - 1) }}
        </span>
      </div>
    </div>

    <Keyboard
      :lettersComparison
      :swapKeyboardButtons="settingsStore.swapKeyboardButtons.value"
      @addLetter="(letter) => addLetter(letter)"
      @makeGuess="makeGuess"
      @removeLastLetter="removeLastLetter"
    ></Keyboard>
  </main>
</template>
