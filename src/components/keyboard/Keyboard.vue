<script setup>
import { IconBackspace, IconCornerDownLeft } from "@tabler/icons-vue";

import KeyboardButton from "@/components/keyboard/KeyboardButton.vue";

const emits = defineEmits(["addLetter", "makeGuess", "removeLastLetter"]);
const props = defineProps(["lettersComparison", "swapKeyboardButtons"]);

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
          'order-2': swapKeyboardButtons,
        }"
        @click="$emit('removeLastLetter')"
        aria-label="Remove last letter"
      >
        <IconBackspace
          class="w-8 rotate-180"
          :class="{
            'rotate-0': swapKeyboardButtons,
          }"
          stroke-width="1.5"
          aria-hidden="true"
        ></IconBackspace>
      </KeyboardButton>
      <KeyboardButton
        @click="$emit('addLetter', key)"
        :class="{
          '!bg-emerald-500': lettersComparison[key] == 'Y',
          '!bg-yellow-500': lettersComparison[key] == 'X',
          '!bg-gray-500': lettersComparison[key] == 'N',
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
          '-order-1': swapKeyboardButtons,
        }"
        @click="$emit('makeGuess')"
        aria-label="Make a guess"
      >
        <IconCornerDownLeft
          class="w-8"
          :class="{
            'rotate-180': swapKeyboardButtons,
          }"
          stroke-width="1.5"
          aria-hidden="true"
        ></IconCornerDownLeft>
      </KeyboardButton>
    </div>
  </div>
</template>
