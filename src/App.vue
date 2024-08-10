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

// Stores
import { useStatisticsStore } from "@/stores/statistics";
import { useSettingsStore } from "./stores/settings";
import { useThemeStore } from "./stores/theme";
import { useGameStore } from "./stores/game";
import { useCustomsStore } from "./stores/customs";
import { useGuideStore } from "./stores/guide";
const statisticsStore = useStatisticsStore();
const settingsStore = useSettingsStore();
const themeStore = useThemeStore();
const gameStore = useGameStore();
const customsStore = useCustomsStore();
const guideStore = useGuideStore();

const guideDialogOpen = ref(false);

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", { type: "success" });
  } catch (err) {
    toast("Cannot copy", { type: "error" });
  }
}

window.addEventListener("keydown", (e) => {
  if (
    gameStore.isGameWon ||
    gameStore.isGameLost ||
    settingsStore.onlyOnscreenInput.value
  )
    return;

  const key = e.key;

  // this will not work with chinese, japanese, hebrew, arabic and other languages that do not have uppercase/lowercase
  const isLetter = key.toLowerCase() !== key.toUpperCase() && key.length === 1;

  if (isLetter) {
    gameStore.addLetter(key);
  } else {
    if (key === "Backspace") {
      gameStore.removeLastLetter();
    }
    if (key === "Enter") {
      gameStore.makeGuess();
    }
  }
});

onMounted(() => {
  themeStore.initTheme();

  // Check is user seen guide
  if (!guideStore.seenGuide) {
    guideStore.seenGuide = true;
    guideDialogOpen.value = true;
  }

  // Check if current url has word param & set game mode based on it
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("word") && urlParams.get("word") !== "") {
    gameStore.changeGameMode("custom");
    try {
      gameStore.word = atob(urlParams.get("word"));
    } catch (e) {
      toast(
        "Error decoding the custom word parameter. Game mode switched to word of the day",
        {
          type: "error",
          duration: 3000,
        }
      );

      gameStore.changeGameMode(settingsStore.defaultGameMode.value);
      return;
    }
    if (atob(urlParams.get("word")).length !== gameStore.letterLimit) {
      toast(
        `Custom word must be exactly ${gameStore.letterLimit} letters long. Game mode switched to word of the day`,
        {
          type: "error",
          duration: 3000,
        }
      );

      gameStore.changeGameMode(settingsStore.defaultGameMode.value);
    }
  } else {
    gameStore.changeGameMode(settingsStore.defaultGameMode.value);
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
    class="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-10 backdrop-blur-xl transition-all duration-300 flex flex-col items-center justify-center"
    :class="
      gameStore.isGameWon || gameStore.isGameLost
        ? ['translate-y-0', 'visible']
        : ['-translate-y-full', 'invisible']
    "
  >
    <p class="text-3xl text-center font-semibold text-foreground">
      <template v-if="gameStore.isGameWon">
        🎉 Congratulations! You won!
      </template>
      <template v-else-if="gameStore.isGameLost">
        😭 You lost! The word was
        <span class="underline underline-offset-4 font-extrabold">{{
          gameStore.word
        }}</span>
      </template>
    </p>
    <p class="text-xl mt-2">Wanna play again?</p>

    <ul class="flex flex-col gap-2 mt-2">
      <li>
        <Button
          class="bg-secondary px-6 py-2 text-secondary-foreground hover:bg-secondary-hover w-full"
          @click="gameStore.changeGameMode('random')"
        >
          Play in Random mode
        </Button>
      </li>
      <li v-if="gameStore.currentGameMode !== 'wordOfTheDay'">
        <Button
          class="bg-secondary px-6 py-2 text-secondary-foreground hover:bg-secondary-hover w-full"
          @click="gameStore.changeGameMode('wordOfTheDay')"
        >
          Play in Word of the day mode
        </Button>
      </li>
    </ul>
  </div>

  <header
    class="bg-primary relative w-full border-b px-4 flex flex-col items-baseline md:items-center justify-center gap-2 py-2 max-h-xs:py-1"
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
                  <template v-if="gameStore.currentGameMode === 'wordOfTheDay'">
                    Word of the day
                  </template>
                  <template v-if="gameStore.currentGameMode === 'random'">
                    Random word
                  </template>
                  <template v-else-if="gameStore.currentGameMode === 'custom'">
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
                  <Switch
                    :id="keyName"
                    v-model="setting.value"
                    v-if="setting.type === 'switch'"
                  ></Switch>
                  <select
                    class="px-4 py-2 bg-input border rounded-md focus-visible:outline outline-2 outline-offset-2 outline-blue-400 text-foreground"
                    :name="keyName"
                    :id="keyName"
                    v-model="setting.value"
                    v-else-if="setting.type === 'select'"
                  >
                    <option
                      v-for="(option, idx) in setting.options"
                      :key="idx"
                      :value="option.value"
                    >
                      {{ option.title }}
                    </option>
                  </select>
                  <div class="flex items-center">
                    <label :for="keyName">
                      {{ setting.title }}
                    </label>
                  </div>
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
    class="flex flex-col max-h-xs:gap-2 gap-4 items-center w-full pt-2 min-h-xs:py-4 relative"
  >
    <DebugInfo v-if="settingsStore.showDebugInfo.value"></DebugInfo>

    <div class="flex">
      <Dialog>
        <template #trigger>
          <r-DialogTrigger
            class="uppercase px-6 py-2 bg-secondary text-secondary-foreground font-bold text-xs transition-colors text-center hover:bg-secondary-hover select-none"
            type="button"
            as="button"
            aria-label="Open game mode dialog"
          >
            <template v-if="gameStore.currentGameMode === 'wordOfTheDay'">
              Word of the day
            </template>
            <template v-if="gameStore.currentGameMode === 'random'">
              Random word
            </template>
            <template v-else-if="gameStore.currentGameMode === 'custom'">
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
                :disabled="gameStore.currentGameMode === 'wordOfTheDay'"
                @click="gameStore.changeGameMode('wordOfTheDay')"
                >Word of the day</Button
              >
              <Button
                class="bg-secondary px-3 py-2 disabled:text-secondary disabled:bg-primary hover:bg-secondary-hover"
                :disabled="gameStore.currentGameMode === 'random'"
                @click="gameStore.changeGameMode('random')"
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
            <template v-if="customsStore.customLink === ''">
              <DialogDescription>
                Enter any word and get a special link to share with your friend
              </DialogDescription>
              <form
                class="flex flex-col xs:grid w-full gap-2 grid-rows-1 grid-cols-4"
                @submit.prevent="customsStore.makeCustomLink"
              >
                <Input
                  placeholder="Your word"
                  type="text"
                  name="customWord"
                  v-model="customsStore.customWord"
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
                  v-model="customsStore.customLink"
                  class="col-span-3 text-gray-400"
                />
                <Button
                  class="p-2 bg-[#6a85c9] text-white border-[#405895] hover:bg-[#8699c7] hover:border-[#646f8b] border"
                  @click="copyToClipboard(customsStore.customLink)"
                >
                  Copy
                </Button>
              </div>
              <p class="text-xs text-black/50 dark:text-white/50 mt-2">
                <Button
                  @click="customsStore.resetCustoms"
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
      <div
        class="w-full h-full flex max-h-xs:gap-1 gap-2"
        v-for="row in gameStore.rows"
      >
        <span
          v-for="letter in gameStore.letterLimit"
          class="bg-gray-50 dark:bg-white/5 border-2 h-full aspect-square flex items-center justify-center text-center text-3xl uppercase font-bold transition-all duration-300 w-full"
          :class="[
            gameStore.guessesComparison[row - 1]?.charAt(letter - 1) === 'N'
              ? ['!bg-gray', 'text-white', 'border-gray']
              : '',
            gameStore.guessesComparison[row - 1]?.charAt(letter - 1) === 'Y'
              ? ['!bg-green', 'text-white', 'border-green']
              : '',
            gameStore.guessesComparison[row - 1]?.charAt(letter - 1) === 'X'
              ? ['!bg-yellow', 'text-white', 'border-yellow']
              : '',
            gameStore.guesses[row - 1]?.charAt(letter - 1)
              ? ['animate-typing']
              : '',
          ]"
        >
          {{ gameStore.guesses[row - 1]?.charAt(letter - 1) }}
        </span>
      </div>
    </div>

    <Keyboard></Keyboard>
  </main>
</template>
