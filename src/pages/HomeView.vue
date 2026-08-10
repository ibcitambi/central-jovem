<template>
  <div class="relative flex min-h-dvh flex-col overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,32,160,0.28),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(224,0,0,0.18),transparent_45%),radial-gradient(ellipse_at_20%_70%,rgba(245,217,10,0.08),transparent_40%)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.07]"
      :style="{
        backgroundImage: `url(${base}FundoIBCI.jpg)`,
        backgroundSize: 'min(420px, 80vw)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 18%',
      }"
      aria-hidden="true"
    />

    <AppHeader />
    <main class="relative z-10 flex flex-1 flex-col">
      <EventHero />
      <ScriptureBlock :text="verseText" :reference="verseReference" />
      <div class="mx-auto flex justify-center px-5 pb-8 sm:px-8">
        <a
          :href="playlistUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 border border-white/20 px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-cj-yellow hover:text-cj-yellow"
        >
          Ouvir playlist
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
    <AppFooter :playlist-url="playlistUrl" />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import EventHero from '../components/EventHero.vue'
import ScriptureBlock from '../components/ScriptureBlock.vue'
import AppFooter from '../components/AppFooter.vue'

const base = import.meta.env.BASE_URL

const playlistUrl =
  'https://youtube.com/playlist?list=PLUa59kdjq5Hg&si=fzKv_tEZ7BeQzE4H'

const verseText =
  'Portanto, meus amados irmãos, sede firmes e constantes, sempre abundantes na obra do Senhor, sabendo que o vosso trabalho não é vão no Senhor.'

const verseReference = '1 Coríntios 15:58'
</script>
