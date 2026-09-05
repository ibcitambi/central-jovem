<template>
  <div
    class="sorteio-root min-h-dvh bg-black text-white"
    :class="presentation ? 'overflow-hidden' : ''"
  >
    <!-- Modo apresentação (telão) -->
    <div
      v-if="presentation"
      class="relative flex min-h-dvh flex-col items-center justify-center px-[4vw] py-[3vw]"
    >
      <button
        type="button"
        class="absolute top-[2vw] right-[2vw] z-30 rounded border border-white/20 px-3 py-1.5 text-xs tracking-wide text-white/50 transition hover:border-white/50 hover:text-white"
        @click="exitPresentation"
      >
        Sair
      </button>

      <div class="flex items-center justify-center gap-3">
        <img
          :src="`${base}logoIBCI.png`"
          alt="IBCI"
          class="h-8 w-8 shrink-0 object-contain"
          width="32"
          height="32"
        />
        <p class="text-[1.4vw] font-semibold tracking-[0.35em] text-white/80 uppercase">
          Sorteador IBCI
        </p>
      </div>

      <div class="relative mt-[3vw] flex min-h-[32vw] w-full flex-1 items-center justify-center">
        <!-- Countdown overlay -->
        <Transition name="countdown">
          <div
            v-if="countdown != null"
            class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            aria-live="polite"
          >
            <span class="countdown-digit text-[22vw] leading-none font-black text-white">
              {{ countdown }}
            </span>
          </div>
        </Transition>

        <!-- Fogos -->
        <div
          ref="fireworksEl"
          class="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          aria-hidden="true"
        />

        <!-- Números -->
        <div
          v-show="countdown == null"
          class="flex flex-wrap items-center justify-center gap-[3vw]"
        >
          <template v-if="displayNumbers.length">
            <span
              v-for="(num, i) in displayNumbers"
              :key="`${lastRoundN}-${num}-${i}`"
              class="reveal-number font-black text-white tabular-nums"
              :style="{ fontSize: numberFontSize }"
            >
              {{ num }}
            </span>
          </template>
          <span v-else class="text-[12vw] font-light text-white/30">—</span>
        </div>
      </div>

      <p class="mt-[2vw] text-[2.2vw] font-semibold tracking-[0.25em] text-white uppercase">
        Rodada {{ lastRoundN || nextRound }}
      </p>

      <button
        type="button"
        class="mt-[3vw] rounded-full border border-white/40 px-[4vw] py-[1.2vw] text-[1.6vw] font-bold tracking-widest text-white uppercase transition hover:border-cj-yellow hover:text-cj-yellow disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!canDraw || drawing"
        @click="startDraw"
      >
        [ Próximo sorteio ]
      </button>

      <p v-if="poolWarning" class="mt-4 text-sm text-cj-yellow">{{ poolWarning }}</p>
    </div>

    <!-- Modo operador -->
    <div v-else class="mx-auto flex min-h-dvh max-w-4xl flex-col px-8 py-10">
      <header class="mb-10 flex items-center justify-between gap-6">
        <div class="flex min-w-0 items-center gap-3">
          <img
            :src="`${base}logoIBCI.png`"
            alt="Igreja Batista Central em Itambi"
            class="h-10 w-10 shrink-0 object-contain"
            width="120"
            height="120"
          />
          <div class="min-w-0">
            <h1 class="text-3xl font-bold tracking-tight text-white">Sorteador IBCI</h1>
            <!-- <p class="mt-1 text-sm text-white/50">Configuração e histórico</p> -->
          </div>
        </div>
        <button
          type="button"
          class="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:border-cj-yellow hover:text-cj-yellow"
          @click="enterPresentation"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <rect x="2" y="5" width="20" height="13" rx="2" />
            <path d="M8 21h8M12 18v3" />
          </svg>
          Modo Apresentação
        </button>
      </header>

      <!-- Palco -->
      <section class="relative mb-10 overflow-hidden rounded-2xl border border-white/15 bg-black px-6 py-12 text-center">
        <div
          ref="fireworksElOp"
          class="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          aria-hidden="true"
        />

        <Transition name="countdown">
          <div
            v-if="countdown != null"
            class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/80"
            aria-live="polite"
          >
            <span class="countdown-digit text-[8rem] leading-none font-black text-white">
              {{ countdown }}
            </span>
          </div>
        </Transition>

        <div v-show="countdown == null" class="relative z-0 flex min-h-32 flex-wrap items-center justify-center gap-6">
          <template v-if="displayNumbers.length">
            <span
              v-for="(num, i) in displayNumbers"
              :key="`op-${lastRoundN}-${num}-${i}`"
              class="reveal-number text-7xl font-black text-white tabular-nums"
            >
              {{ num }}
            </span>
          </template>
          <span v-else class="text-5xl font-light text-white/30">—</span>
        </div>

        <p v-if="lastRoundN" class="mt-4 text-sm tracking-[0.2em] text-white/60 uppercase">
          Rodada {{ lastRoundN }}
        </p>

        <button
          type="button"
          class="mt-8 inline-flex w-full max-w-md items-center justify-center gap-3 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-lg font-bold tracking-widest text-white uppercase transition hover:border-cj-yellow hover:text-cj-yellow disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!canDraw || drawing"
          @click="startDraw"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          Sortear
        </button>

        <p v-if="poolWarning" class="mt-3 text-sm text-cj-yellow">{{ poolWarning }}</p>
      </section>

      <!-- Configurações -->
      <section class="mb-10 rounded-2xl border border-white/15 p-6">
        <h2 class="mb-5 text-lg font-semibold tracking-wide text-white">Configurações</h2>

        <div class="grid gap-5 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1.5 block text-sm text-white/60">Número inicial</span>
            <input
              v-model.number="min"
              type="number"
              class="w-full rounded-lg border border-white/20 bg-black px-4 py-2.5 text-white outline-none focus:border-cj-yellow"
              @change="onSettingsChange"
            />
          </label>
          <label class="block">
            <span class="mb-1.5 block text-sm text-white/60">Número final</span>
            <input
              v-model.number="max"
              type="number"
              class="w-full rounded-lg border border-white/20 bg-black px-4 py-2.5 text-white outline-none focus:border-cj-yellow"
              @change="onSettingsChange"
            />
          </label>
        </div>

        <fieldset class="mt-5">
          <legend class="mb-2 text-sm text-white/60">Quantidade por rodada</legend>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="min-w-12 rounded-lg border px-4 py-2 text-sm font-semibold transition"
              :class="
                count === n
                  ? 'border-cj-yellow bg-cj-yellow/15 text-cj-yellow'
                  : 'border-white/20 text-white hover:border-white/50'
              "
              @click="setCount(n)"
            >
              {{ n }}
            </button>
          </div>
        </fieldset>

        <fieldset class="mt-5">
          <legend class="mb-2 text-sm text-white/60">Countdown (próximo sorteio)</legend>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="n in [3, 4, 5]"
              :key="`cd-${n}`"
              type="button"
              class="min-w-12 rounded-lg border px-4 py-2 text-sm font-semibold transition"
              :class="
                countdownFrom === n
                  ? 'border-cj-yellow bg-cj-yellow/15 text-cj-yellow'
                  : 'border-white/20 text-white hover:border-white/50'
              "
              @click="setCountdownFrom(n)"
            >
              {{ n }}
            </button>
          </div>
        </fieldset>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-8">
          <label class="inline-flex cursor-pointer items-center gap-3 text-sm text-white">
            <input
              v-model="noRepeat"
              type="checkbox"
              class="h-4 w-4 accent-cj-yellow"
              @change="onSettingsChange"
            />
            Não repetir números
          </label>
          <label class="inline-flex cursor-pointer items-center gap-3 text-sm text-white">
            <input
              v-model="soundEnabled"
              type="checkbox"
              class="h-4 w-4 accent-cj-yellow"
              @change="onSettingsChange"
            />
            Som (tambor / clímax)
          </label>
        </div>

        <fieldset v-if="soundEnabled" class="mt-5">
          <legend class="mb-2 text-sm text-white/60">
            Som do clímax (teste A / C / sample — escolha 1 depois)
          </legend>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in climaxOptions"
              :key="opt.id"
              type="button"
              class="rounded-lg border px-4 py-2 text-sm font-semibold transition"
              :class="
                climaxSound === opt.id
                  ? 'border-cj-yellow bg-cj-yellow/15 text-cj-yellow'
                  : 'border-white/20 text-white hover:border-white/50'
              "
              @click="setClimaxSound(opt.id)"
            >
              {{ opt.label }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-white/30 px-4 py-2 text-sm text-white/80 transition hover:border-white hover:text-white"
              @click="previewClimax"
            >
              Ouvir
            </button>
          </div>
          <p class="mt-2 text-xs text-white/40">
            Sample: Freesound CC0 —
            <a
              class="underline hover:text-white/70"
              href="https://freesound.org/people/deleted_user_7146007/sounds/383884/"
              target="_blank"
              rel="noopener noreferrer"
            >Projection Crash Cymbal</a>
          </p>
        </fieldset>
      </section>

      <!-- Histórico -->
      <section class="mb-10">
        <h2 class="mb-4 text-lg font-semibold tracking-wide text-white">Histórico de rodadas</h2>
        <ul v-if="rounds.length" class="space-y-2">
          <li
            v-for="round in rounds"
            :key="round.n"
            class="flex flex-wrap items-baseline gap-3 rounded-xl border border-white/10 px-4 py-3"
          >
            <span class="text-sm font-semibold tracking-wide text-white/50 uppercase">
              Rodada {{ round.n }}
            </span>
            <span class="text-xl font-bold tabular-nums text-white">
              {{ round.numbers.join(' · ') }}
            </span>
          </li>
        </ul>
        <p v-else class="text-sm text-white/40">Nenhuma rodada ainda.</p>
      </section>

      <button
        type="button"
        class="mb-6 self-start rounded-lg border border-cj-red/60 px-5 py-2.5 text-sm font-semibold text-cj-red transition hover:bg-cj-red/10 disabled:opacity-40"
        :disabled="!rounds.length || drawing"
        @click="clearDraw"
      >
        Limpar sorteio
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const STORAGE_KEY = 'central-jovem:sorteio'
const base = import.meta.env.BASE_URL

const DEFAULT_STATE = () => ({
  settings: {
    min: 1,
    max: 100,
    count: 1,
    countdownFrom: 5,
    noRepeat: true,
    soundEnabled: true,
    climaxSound: 'taiko',
    presentation: false,
  },
  rounds: [],
  usedNumbers: [],
  nextRound: 1,
})

const climaxOptions = [
  { id: 'taiko', label: 'A · Taiko' },
  { id: 'ding', label: 'C · Sino' },
  { id: 'crash', label: 'Sample · Prato' },
]

const min = ref(1)
const max = ref(100)
const count = ref(1)
const countdownFrom = ref(5)
const noRepeat = ref(true)
const soundEnabled = ref(true)
const climaxSound = ref('taiko')
const presentation = ref(false)
const rounds = ref([])
const usedNumbers = ref([])
const nextRound = ref(1)

const drawing = ref(false)
const countdown = ref(null)
const displayNumbers = ref([])
const fireworksEl = ref(null)
const fireworksElOp = ref(null)

let audioCtx = null
let drumInterval = null
let crashBuffer = null
let crashLoadPromise = null

const lastRoundN = computed(() => {
  if (!rounds.value.length) return 0
  return rounds.value[rounds.value.length - 1].n
})

const numberFontSize = computed(() => {
  const n = Math.max(displayNumbers.value.length, 1)
  if (n === 1) return '18vw'
  if (n === 2) return '12vw'
  if (n === 3) return '9vw'
  if (n === 4) return '7vw'
  return '5.5vw'
})

function buildPool() {
  const lo = Math.trunc(Number(min.value))
  const hi = Math.trunc(Number(max.value))
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi) return []
  const used = new Set(noRepeat.value ? usedNumbers.value : [])
  const pool = []
  for (let i = lo; i <= hi; i++) {
    if (!used.has(i)) pool.push(i)
  }
  return pool
}

const poolSize = computed(() => buildPool().length)

const canDraw = computed(() => {
  const lo = Math.trunc(Number(min.value))
  const hi = Math.trunc(Number(max.value))
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi) return false
  if (count.value < 1 || count.value > 5) return false
  return poolSize.value >= count.value
})

const poolWarning = computed(() => {
  const lo = Math.trunc(Number(min.value))
  const hi = Math.trunc(Number(max.value))
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi) {
    return 'Intervalo inválido: o inicial deve ser ≤ ao final.'
  }
  if (poolSize.value < count.value) {
    return noRepeat.value
      ? `Números insuficientes (restam ${poolSize.value}, precisa de ${count.value}).`
      : `Universo pequeno demais para sortear ${count.value} números.`
  }
  return ''
})

function snapshot() {
  return {
    settings: {
      min: Math.trunc(Number(min.value)) || 1,
      max: Math.trunc(Number(max.value)) || 100,
      count: count.value,
      countdownFrom: countdownFrom.value,
      noRepeat: noRepeat.value,
      soundEnabled: soundEnabled.value,
      climaxSound: climaxSound.value,
      presentation: presentation.value,
    },
    rounds: rounds.value.map((r) => ({ n: r.n, numbers: [...r.numbers] })),
    usedNumbers: [...usedNumbers.value],
    nextRound: nextRound.value,
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()))
  } catch {
    /* quota / private mode */
  }
}

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return
    const s = data.settings || {}
    min.value = Number.isFinite(s.min) ? s.min : 1
    max.value = Number.isFinite(s.max) ? s.max : 100
    count.value = [1, 2, 3, 4, 5].includes(s.count) ? s.count : 1
    countdownFrom.value = [3, 4, 5].includes(s.countdownFrom) ? s.countdownFrom : 5
    noRepeat.value = s.noRepeat !== false
    soundEnabled.value = s.soundEnabled !== false
    climaxSound.value = ['taiko', 'ding', 'crash'].includes(s.climaxSound)
      ? s.climaxSound
      : 'taiko'
    presentation.value = !!s.presentation
    rounds.value = Array.isArray(data.rounds)
      ? data.rounds.map((r) => ({ n: r.n, numbers: [...r.numbers] }))
      : []
    usedNumbers.value = Array.isArray(data.usedNumbers) ? [...data.usedNumbers] : []
    nextRound.value = Number.isFinite(data.nextRound) ? data.nextRound : rounds.value.length + 1
    if (rounds.value.length) {
      displayNumbers.value = [...rounds.value[rounds.value.length - 1].numbers]
    }
  } catch {
    /* ignore corrupt storage */
  }
}

function onSettingsChange() {
  persist()
}

function setCount(n) {
  count.value = n
  persist()
}

function setCountdownFrom(n) {
  countdownFrom.value = n
  persist()
}

function setClimaxSound(id) {
  climaxSound.value = id
  persist()
}

function previewClimax() {
  ensureAudio()
  playClimax()
}

function enterPresentation() {
  presentation.value = true
  persist()
}

function exitPresentation() {
  presentation.value = false
  persist()
}

function onKeydown(e) {
  if (e.key === 'Escape' && presentation.value) {
    exitPresentation()
  }
}

function ensureAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    audioCtx = new Ctx()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function noiseBuffer(ctx, duration) {
  const len = Math.floor(ctx.sampleRate * duration)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function playDrumHit() {
  const ctx = ensureAudio()
  if (!ctx || !soundEnabled.value) return
  const t = ctx.currentTime

  // corpo grave (caixa/timbal)
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(140 + Math.random() * 40, t)
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.12)
  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.55, t)
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14)
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.15)

  // ataque de membrana
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 0.05)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 220 + Math.random() * 80
  filter.Q.value = 2.5
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.35, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  src.start(t)
  src.stop(t + 0.06)
}

/** A) Taiko / bumbo grave — thud seco. */
function playTaiko() {
  const ctx = ensureAudio()
  if (!ctx || !soundEnabled.value) return
  const t = ctx.currentTime

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(90, t)
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.45)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.95, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.55)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.56)

  const osc2 = ctx.createOscillator()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(55, t)
  osc2.frequency.exponentialRampToValueAtTime(30, t + 0.35)
  const g2 = ctx.createGain()
  g2.gain.setValueAtTime(0.5, t)
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  osc2.connect(g2)
  g2.connect(ctx.destination)
  osc2.start(t)
  osc2.stop(t + 0.42)

  const click = ctx.createBufferSource()
  click.buffer = noiseBuffer(ctx, 0.04)
  const bp = ctx.createBiquadFilter()
  bp.type = 'lowpass'
  bp.frequency.value = 400
  const cg = ctx.createGain()
  cg.gain.setValueAtTime(0.4, t)
  cg.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
  click.connect(bp)
  bp.connect(cg)
  cg.connect(ctx.destination)
  click.start(t)
  click.stop(t + 0.05)
}

/** C) Sino / ding limpo — toque cristalino. */
function playDing() {
  const ctx = ensureAudio()
  if (!ctx || !soundEnabled.value) return
  const t = ctx.currentTime
  const fundamentals = [880, 1320, 1760]

  fundamentals.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    const g = ctx.createGain()
    const peak = i === 0 ? 0.45 : 0.18
    g.gain.setValueAtTime(0.001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.1 - i * 0.15)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 1.2)
  })
}

async function loadCrashSample() {
  if (crashBuffer) return crashBuffer
  if (crashLoadPromise) return crashLoadPromise
  const ctx = ensureAudio()
  if (!ctx) return null
  crashLoadPromise = (async () => {
    try {
      const url = `${import.meta.env.BASE_URL}sounds/crash-cymbal.mp3`
      const res = await fetch(url)
      const arr = await res.arrayBuffer()
      crashBuffer = await ctx.decodeAudioData(arr.slice(0))
      return crashBuffer
    } catch {
      crashLoadPromise = null
      return null
    }
  })()
  return crashLoadPromise
}

/** Sample Freesound — Projection Crash Cymbal (trecho inicial). */
async function playCrashSample() {
  if (!soundEnabled.value) return
  const ctx = ensureAudio()
  if (!ctx) return
  const buffer = await loadCrashSample()
  if (!buffer) {
    playDing()
    return
  }
  const t = ctx.currentTime
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.7, t)
  g.gain.setValueAtTime(0.7, t + 1.2)
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.8)
  src.connect(g)
  g.connect(ctx.destination)
  src.start(t, 0, 2.0)
}

function playClimax() {
  if (climaxSound.value === 'ding') {
    playDing()
    return
  }
  if (climaxSound.value === 'crash') {
    playCrashSample()
    return
  }
  playTaiko()
}

function startDrumroll() {
  stopDrumroll()
  if (!soundEnabled.value) return
  ensureAudio()
  let gap = 160
  const tick = () => {
    playDrumHit()
    gap = Math.max(55, gap - 10)
    drumInterval = setTimeout(tick, gap)
  }
  tick()
}

function stopDrumroll() {
  if (drumInterval) {
    clearTimeout(drumInterval)
    drumInterval = null
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function cryptoShufflePick(pool, n) {
  const arr = [...pool]
  for (let i = arr.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    const j = buf[0] % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, n).sort((a, b) => a - b)
}

function spawnBurst(host, originX, originY, particleCount) {
  const colors = ['#f5d90a', '#e00000', '#ffffff', '#ff6b00', '#f5d90a', '#ffe566']
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('span')
    p.className = 'fw-particle'
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.25
    const dist = (presentation.value ? 140 : 90) + Math.random() * (presentation.value ? 280 : 160)
    p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`)
    p.style.background = colors[i % colors.length]
    p.style.boxShadow = `0 0 14px ${colors[i % colors.length]}, 0 0 4px #fff`
    p.style.left = originX
    p.style.top = originY
    host.appendChild(p)
    setTimeout(() => p.remove(), 1200)
  }
}

function spawnFireworks() {
  const host = presentation.value ? fireworksEl.value : fireworksElOp.value
  if (!host) return
  host.innerHTML = ''
  // várias explosões no palco, antes dos números
  spawnBurst(host, '50%', '42%', 56)
  setTimeout(() => spawnBurst(host, '28%', '50%', 36), 120)
  setTimeout(() => spawnBurst(host, '72%', '48%', 36), 200)
  setTimeout(() => spawnBurst(host, '50%', '55%', 40), 320)
}

async function startDraw() {
  if (drawing.value || !canDraw.value) return
  drawing.value = true
  displayNumbers.value = []

  if (soundEnabled.value) {
    ensureAudio()
    startDrumroll()
  }

  const from = [3, 4, 5].includes(countdownFrom.value) ? countdownFrom.value : 5
  const sequence = []
  for (let n = from; n >= 1; n--) sequence.push(n)

  for (const n of sequence) {
    countdown.value = n
    await sleep(800)
  }
  countdown.value = null

  stopDrumroll()
  playClimax()
  spawnFireworks()

  // clímax visual: fogos primeiro, números depois
  await sleep(700)

  const pool = buildPool()
  const picked = cryptoShufflePick(pool, count.value)
  const roundN = nextRound.value

  rounds.value = [...rounds.value, { n: roundN, numbers: picked }]
  const usedSet = new Set(usedNumbers.value)
  for (const num of picked) usedSet.add(num)
  usedNumbers.value = [...usedSet]
  nextRound.value = roundN + 1
  persist()

  displayNumbers.value = picked
  drawing.value = false
}

function clearDraw() {
  if (!rounds.value.length) return
  if (!confirm('Limpar todas as rodadas e números já sorteados? As configurações serão mantidas.')) {
    return
  }
  rounds.value = []
  usedNumbers.value = []
  nextRound.value = 1
  displayNumbers.value = []
  persist()
}

onMounted(() => {
  hydrate()
  window.addEventListener('keydown', onKeydown)
  ensureAudio()
  loadCrashSample()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  stopDrumroll()
  if (audioCtx) {
    audioCtx.close().catch(() => {})
    audioCtx = null
  }
})

</script>

<style scoped>
.sorteio-root {
  font-family: system-ui, Arial, sans-serif;
}

.countdown-enter-active,
.countdown-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.countdown-enter-from,
.countdown-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.countdown-digit {
  animation: pulse-count 0.8s ease-out;
}

@keyframes pulse-count {
  0% {
    transform: scale(0.5);
    opacity: 0.4;
  }
  40% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.reveal-number {
  animation: reveal-pop 0.45s ease-out;
}

@keyframes reveal-pop {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  70% {
    transform: scale(1.12);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* :deep — partículas são criadas via DOM e não recebem o data-v do scoped */
:deep(.fw-particle) {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  margin-left: -6px;
  margin-top: -6px;
  box-shadow: 0 0 10px #fff;
  animation: fw-fly 1.05s cubic-bezier(0.15, 0.75, 0.35, 1) forwards;
  will-change: transform, opacity;
}

@keyframes fw-fly {
  0% {
    transform: translate(0, 0) scale(1.2);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.15);
    opacity: 0;
  }
}
</style>
