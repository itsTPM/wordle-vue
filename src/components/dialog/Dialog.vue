<template>
  <r-DialogRoot>
    <slot name="trigger"></slot>
    <r-DialogPortal>
      <r-DialogOverlay
        class="fixed inset-0 z-50 data-[state=open]:motion-safe:animate-overlayOpen data-[state=open]:bg-black/50 data-[state=open]:backdrop-blur-md data-[state=closed]:motion-safe:animate-overlayClose"></r-DialogOverlay>
      <slot name="content"></slot>
    </r-DialogPortal>
  </r-DialogRoot>
</template>
