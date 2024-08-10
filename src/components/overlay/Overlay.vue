<script setup>
import OverlayButton from "@/components/overlay/OverlayButton.vue";

import { useGameStore } from "@/stores/game";
const gameStore = useGameStore();
</script>

<template>
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
        <OverlayButton @click="gameStore.changeGameMode('random')">
          Play in Random mode
        </OverlayButton>
      </li>
      <li v-if="gameStore.currentGameMode !== 'wordOfTheDay'">
        <OverlayButton @click="gameStore.changeGameMode('wordOfTheDay')">
          Play in Word of the day mode
        </OverlayButton>
      </li>
    </ul>
  </div>
</template>
