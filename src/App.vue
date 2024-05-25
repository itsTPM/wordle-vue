<script setup>
import { ref } from "vue";
import { Toaster, toast } from "vue-sonner";

import { todayWord, checkWord } from "./words.js";

const letterLimit = 5;
const rows = 6;
const word = todayWord();
const inputWord = ref("");
const guesses = ref([]);
const guessesComparsion = ref([]);
const currentGuess = ref(0);
const isGameWon = ref(false);
const isGameLost = ref(false);

guesses.value = Array(rows).fill("");
guessesComparsion.value = Array(rows).fill("");

window.addEventListener("keydown", (e) => {
  if (isGameWon.value || isGameLost.value) {
    return;
  }

  const key = e.key;

  // this will not work with chinese, japanese, hebrew, arabic and other languages that do not have uppercase/lowercase
  const isLetter = key.toLowerCase() != key.toUpperCase() && key.length === 1;

  if (isLetter) {
    if (inputWord.value.length < letterLimit) {
      inputWord.value += key.toLowerCase();
      guesses.value[currentGuess.value] = inputWord.value;
    }
  } else {
    if (key === "Backspace") {
      inputWord.value = inputWord.value.slice(0, -1);
      guesses.value[currentGuess.value] = inputWord.value;
    }
    if (key === "Enter") {
      if (inputWord.value.length === letterLimit) {
        if (!checkWord(inputWord.value)) {
          toast("Not a valid word!");
          return;
        }

        makeGuess();
      } else {
        toast("Not enough letters!");
      }
    }
  }
});

const makeGuess = () => {
  const guess = inputWord.value;
  const target = word;
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
  guessesComparsion.value[currentGuess.value] = result.join("");

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

  <div
    class="italic p-2 border rounded-md lg:w-[20rem] lg:m-auto bg-gray-50 lg:absolute top-4 left-4 my-4 w-[22rem] max-w-[calc(100vw-2rem)]"
  >
    <p>word of the day: {{ word }}</p>
    <p>input word: {{ inputWord }}</p>
    <p>current guess: {{ currentGuess }}</p>
    <p>guesses: {{ guesses }}</p>
    <p>guesses comparsion: {{ guessesComparsion }}</p>
    <p>game state: {{ isGameWon ? "won" : isGameLost ? "lost" : "playing" }}</p>
  </div>

  <div
    class="p-4 rounded-md border shadow-sm flex flex-col gap-4 max-w-[calc(100vw-2rem)]"
  >
    <h1 class="text-center text-3xl font-['Lato']">wordle-vue</h1>

    <div class="w-80 h-96 flex flex-col gap-2">
      <div class="w-full h-full flex gap-2" v-for="row in rows">
        <span
          v-for="letter in letterLimit"
          class="bg-gray-50 border-2 h-full aspect-square flex items-center justify-center text-center text-3xl uppercase font-bold transition-all duration-300"
          :class="[
            guessesComparsion[row - 1]?.charAt(letter - 1) === 'N'
              ? ['!bg-gray-500', 'text-white', 'border-gray-500']
              : '',
            guessesComparsion[row - 1]?.charAt(letter - 1) === 'Y'
              ? ['!bg-emerald-500', 'text-white', 'border-emerald-500']
              : '',
            guessesComparsion[row - 1]?.charAt(letter - 1) === 'X'
              ? ['!bg-yellow-500', 'text-white', 'border-yellow-500']
              : '',
            guesses[row - 1]?.charAt(letter - 1) ? ['animate-typing'] : '',
          ]"
        >
          {{ guesses[row - 1]?.charAt(letter - 1) }}
        </span>
      </div>
    </div>
  </div>
</template>
