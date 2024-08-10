<script setup>
import { IconBackspace, IconCornerDownLeft } from "@tabler/icons-vue";

import KeyboardButton from "@/components/keyboard/KeyboardButton.vue";

// Stores
import { useSettingsStore } from "@/stores/settings";
import { useGameStore } from "@/stores/game";
const settingsStore = useSettingsStore();
const gameStore = useGameStore();

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];
</script>

<template>
  <div class="flex flex-col max-h-xs:gap-1 gap-2 w-full select-none">
    <div
      v-for="row in keyboard"
      :key="row"
      class="flex gap-1 items-center justify-center w-full"
    >
      <KeyboardButton
        v-if="keyboard.indexOf(row) === keyboard.length - 1"
        class="bg-secondary hover:bg-secondary-hover xs:!aspect-[1.5/1] text-secondary-foreground"
        :class="{
          'order-2': settingsStore.swapKeyboardButtons.value,
        }"
        @click="gameStore.removeLastLetter"
        aria-label="Remove last letter"
      >
        <IconBackspace
          class="w-8 rotate-180"
          :class="{
            'rotate-0': settingsStore.swapKeyboardButtons.value,
          }"
          stroke-width="1.5"
          aria-hidden="true"
        ></IconBackspace>
      </KeyboardButton>
      <KeyboardButton
        @click="gameStore.addLetter(key)"
        :class="{
          '!bg-green': gameStore.lettersComparison[key] == 'Y',
          '!bg-yellow': gameStore.lettersComparison[key] == 'X',
          '!bg-gray': gameStore.lettersComparison[key] == 'N',
        }"
        v-for="key in row"
        :key="key"
      >
        {{ key }}
      </KeyboardButton>
      <KeyboardButton
        v-if="keyboard.indexOf(row) === keyboard.length - 1"
        class="bg-secondary hover:bg-secondary-hover xs:!aspect-[1.5/1] text-secondary-foreground"
        :class="{
          '-order-1': settingsStore.swapKeyboardButtons.value,
        }"
        @click="gameStore.makeGuess"
        aria-label="Make a guess"
      >
        <IconCornerDownLeft
          class="w-8"
          :class="{
            'rotate-180': settingsStore.swapKeyboardButtons.value,
          }"
          stroke-width="1.5"
          aria-hidden="true"
        ></IconCornerDownLeft>
      </KeyboardButton>
    </div>
  </div>
</template>
