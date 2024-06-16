<script setup>
const modelValue = defineModel();
</script>

<template>
  <r-SwitchRoot
    class="w-11 h-6 focus-visible:outline focus-visible:outline-white focus-visible:outline-offset-2 flex bg-secondary shadow-sm rounded-full relative data-[state=checked]:bg-foreground cursor-pointer"
    v-model:checked="modelValue"
  >
    <r-SwitchThumb
      class="block aspect-square h-[calc(100%-0.25rem)] my-auto bg-primary shadow-sm rounded-full transition-transform duration-200 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[calc(100%+0.125rem)]"
    />
  </r-SwitchRoot>
</template>
