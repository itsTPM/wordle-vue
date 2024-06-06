<script setup>
const modelValue = defineModel();
</script>

<template>
  <input
    class="px-4 w-full py-2 bg-input border rounded-md focus:outline outline-2 outline-offset-2 outline-blue-400"
    v-model="modelValue"
  />
</template>
