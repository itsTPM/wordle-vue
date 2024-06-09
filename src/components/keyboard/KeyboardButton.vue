<script setup>
import Button from "@/components/Button.vue";
</script>

<template>
  <Button
    class="aspect-[1/1.5] bg-primary rounded-md xs:aspect-square text-xl sm:text-2xl uppercase hover:bg-primary-hover duration-200 text-primary-foreground w-full xs:w-auto xs:h-11 sm:h-12"
  >
    <slot></slot>
  </Button>
</template>
