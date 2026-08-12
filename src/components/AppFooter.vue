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
      <div class="flex items-center gap-6">
        <a
          href="https://www.instagram.com/ibci_itambi/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da Igreja Batista Central em Itambi"
          class="text-white/70 transition hover:text-cj-yellow"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a
          href="https://www.youtube.com/@igrejabatistacentralemitam9496"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube da Igreja Batista Central em Itambi"
          class="text-white/70 transition hover:text-cj-yellow"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
            <path d="M10.5 9.3v5.4l4.8-2.7z" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const base = import.meta.env.BASE_URL
</script>
