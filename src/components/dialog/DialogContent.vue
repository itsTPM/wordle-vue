<template>
  <r-DialogContent
    @keydown.stop
    class="fixed left-1/2 top-1/2 z-50 w-[25rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 border p-3 shadow-xl bg-background rounded-md data-[state=open]:animate-dialogShow focus-visible:outline outline-2 outline-offset-2 outline-blue-400 max-h-[calc(100vh-2rem)] overflow-y-auto"
  >
    <slot></slot>
  </r-DialogContent>
</template>
