<script setup>
import Button from "@/components/Button.vue";
</script>

<template>
  <Button
    class="bg-primary rounded-md aspect-square text-xl sm:text-2xl uppercase hover:bg-primary-hover duration-200 text-primary-foreground w-full xs:w-auto xs:h-11 sm:h-12"
  >
    <slot></slot>
  </Button>
</template>
