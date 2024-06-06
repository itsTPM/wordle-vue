<script setup>
import Button from "./Button.vue";
</script>

<template>
  <Button
    class="bg-primary rounded-md aspect-square text-2xl uppercase hover:bg-primary-hover duration-200 text-primary-foreground h-12"
  >
    <slot></slot>
  </Button>
</template>
