<script setup>
import { useGameStore } from '@/stores/game';
const gameStore = useGameStore();
</script>

<template>
  <div
    class="italic p-2 border rounded-md bg-card transition-colors max-w-[30rem] w-full xl:max-w-[22rem] xl:absolute top-0 left-0 m-2">
    <p>word to guess: {{ gameStore.word }}</p>
    <p>game mode: {{ gameStore.currentGameMode }}</p>
    <p>input word: {{ gameStore.inputWord }}</p>
    <p>current guess: {{ gameStore.currentGuess }}</p>
    <p>guesses: {{ gameStore.guesses }}</p>
    <p>guesses comparison: {{ gameStore.guessesComparison }}</p>
    <p>
      game state:
      {{ gameStore.isGameWon ? 'won' : gameStore.isGameLost ? 'lost' : 'playing' }}
    </p>
  </div>
</template>
