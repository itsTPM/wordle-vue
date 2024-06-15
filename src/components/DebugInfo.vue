<script setup>
defineProps({
  word: String,
  currentMode: String,
  inputWord: String,
  currentGuess: Number,
  guesses: Array,
  guessesComparison: Array,
  isGameWon: Boolean,
  isGameLost: Boolean,
});
</script>

<template>
  <div
    class="italic p-2 border rounded-md bg-card transition-colors max-w-[30rem] w-full xl:max-w-[22rem] xl:absolute top-0 left-0 m-2"
  >
    <p>word to guess: {{ word }}</p>
    <p>game mode: {{ currentMode }}</p>
    <p>input word: {{ inputWord }}</p>
    <p>current guess: {{ currentGuess }}</p>
    <p>guesses: {{ guesses }}</p>
    <p>guesses comparison: {{ guessesComparison }}</p>
    <p>game state: {{ isGameWon ? "won" : isGameLost ? "lost" : "playing" }}</p>
  </div>
</template>
