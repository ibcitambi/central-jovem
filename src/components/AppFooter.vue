<template>
  <footer class="relative z-10 mt-auto border-t border-white/10 px-5 py-10 sm:px-8">
    <div class="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
      <img
        :src="`${base}logoIBCI.png`"
        alt="Igreja Batista Central em Itambi"
        class="h-14 w-auto object-contain opacity-90"
        width="56"
        height="56"
      />
      <div>
        <p class="text-sm font-semibold tracking-wide text-white">
          Igreja Batista Central em Itambi
        </p>
        <p class="mt-1 font-serif text-sm text-cj-muted italic">
          Uma família de braços estendidos para servir
        </p>
      </div>
      <a
        :href="playlistUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm font-medium text-white/70 underline-offset-4 transition hover:text-cj-yellow hover:underline"
      >
        Playlist no YouTube
      </a>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  playlistUrl: {
    type: String,
    required: true,
  },
})

const base = import.meta.env.BASE_URL
</script>
