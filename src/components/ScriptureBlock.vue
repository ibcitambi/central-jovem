<template>
  <blockquote class="relative z-10 mx-auto max-w-2xl px-5 py-8 text-center sm:px-8 sm:py-10">
    <p class="font-serif text-lg leading-relaxed text-white/90 italic sm:text-xl">
      “{{ text }}”
    </p>
    <cite class="mt-5 block text-sm font-medium tracking-wide text-cj-muted not-italic">
      {{ reference }}
    </cite>
  </blockquote>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
})
</script>
