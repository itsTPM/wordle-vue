<script setup>
import Button from '@/components/Button.vue';
</script>

<template>
  <Button
    class="aspect-[1/1.5] bg-primary xs:aspect-square text-2xl uppercase hover:bg-primary-hover duration-200 text-primary-foreground w-full xs:w-auto xs:h-12"
  >
    <slot></slot>
  </Button>
</template>
