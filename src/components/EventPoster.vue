<template>
  <div class="poster-frame relative mx-auto aspect-[1080/1920] w-full overflow-hidden">
    <div
      class="poster-bg absolute inset-0"
      :style="{ backgroundImage: `url(${base}CultoFundo.jpg)` }"
    />

    <div class="poster-montage absolute inset-x-0 top-0 h-[64%]">
      <div
        class="h-full w-full poster-montage-img"
        :style="{ backgroundImage: `url(${base}JovensGrupo.jpg)` }"
      />
    </div>

    <div
      class="absolute inset-0 bg-gradient-to-b from-cj-black/40 via-cj-black/50 to-cj-black"
    />

    <div
      class="poster-content relative z-10 flex h-full flex-col items-center text-center"
    >
      <img
        :src="`${base}LogoCentralJovem.svg`"
        alt="Central Jovem"
        class="poster-logo h-auto"
      />

      <p class="poster-eyebrow mt-auto font-bold text-cj-yellow uppercase">
        Culto de Jovens
      </p>

      <h2 class="poster-title font-script leading-[0.85] text-white">
        Constantes
      </h2>

      <p class="poster-scripture font-serif text-white/90 italic">
        “{{ text }}”
      </p>
      <p class="poster-ref font-semibold text-cj-yellow/90 uppercase">
        {{ reference }}
      </p>

      <div class="poster-seminarist mt-auto font-medium text-white">
        {{ seminarist }}
      </div>

      <div class="poster-date-main font-extrabold tracking-tight text-white">
        {{ dateMain }}
      </div>
      <div class="poster-date-sub font-semibold text-cj-yellow uppercase">
        {{ dateSub }}
      </div>

      <div class="poster-church font-semibold text-white">
        Igreja Batista Central em Itambi
      </div>
      <div class="poster-address text-cj-muted">{{ address }}</div>
    </div>
  </div>
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
  seminarist: {
    type: String,
    required: true,
  },
  dateMain: {
    type: String,
    required: true,
  },
  dateSub: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
})

const base = import.meta.env.BASE_URL
</script>
