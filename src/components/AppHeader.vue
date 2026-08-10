<template>
  <header class="relative z-10 px-5 pt-8 sm:px-8 sm:pt-10">
    <div class="mx-auto flex max-w-3xl items-center justify-center">
      <img
        :src="`${base}LogoCentralJovem.svg`"
        alt="Central Jovem — Igreja Batista Central em Itambi"
        class="h-auto w-full max-w-[280px] object-contain sm:max-w-[340px]"
        width="340"
        height="236"
      />
    </div>
  </header>
</template>

<script setup>
const base = import.meta.env.BASE_URL
</script>
