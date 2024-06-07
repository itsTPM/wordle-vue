<script setup>
import { IconBackspace, IconCornerDownLeft } from "@tabler/icons-vue";

import KeyboardButton from "@/components/keyboard/KeyboardButton.vue";

const emits = defineEmits(["addLetter", "makeGuess", "removeLastLetter"]);

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <div
      v-for="row in keyboard"
      :key="row"
      class="flex gap-1 items-center justify-center w-full"
    >
      <KeyboardButton
        v-if="keyboard.indexOf(row) === keyboard.length - 1"
        class="bg-secondary hover:bg-secondary-hover aspect-[1.5/1] text-secondary-foreground"
        @click="$emit('removeLastLetter')"
      >
        <IconBackspace
          class="w-8 rotate-180"
          stroke-width="1.5"
        ></IconBackspace>
      </KeyboardButton>
      <KeyboardButton
        @click="$emit('addLetter', key)"
        v-for="key in row"
        :key="key"
      >
        {{ key }}
      </KeyboardButton>
      <KeyboardButton
        v-if="keyboard.indexOf(row) === keyboard.length - 1"
        class="bg-secondary hover:bg-secondary-hover aspect-[1.5/1] text-secondary-foreground"
        @click="$emit('makeGuess')"
      >
        <IconCornerDownLeft class="w-8" stroke-width="1.5"></IconCornerDownLeft>
      </KeyboardButton>
    </div>
  </div>
</template>
