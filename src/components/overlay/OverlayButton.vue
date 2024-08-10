<script setup>
import Button from '@/components/Button.vue';
</script>

<template>
  <Button
    class="bg-secondary px-6 py-2 text-secondary-foreground hover:bg-secondary-hover w-full"
  >
    <slot></slot>
  </Button>
</template>
