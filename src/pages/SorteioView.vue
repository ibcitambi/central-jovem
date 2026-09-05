<template>
  <div
    class="sorteio-root bg-black text-white"
    :class="presentation ? 'h-dvh max-h-dvh overflow-hidden' : 'min-h-dvh'"
  >
    <!-- Modo apresentação (telão) -->
    <div v-if="presentation" class="presentation-stage">
      <button type="button" class="presentation-exit" @click="exitPresentation">
        Sair
      </button>

      <header class="presentation-header">
        <img
          :src="`${base}logoIBCI.png`"
          alt="IBCI"
          class="presentation-logo"
          width="120"
          height="120"
        />
        <h1 class="presentation-title">Sorteador IBCI</h1>
      </header>

      <div class="presentation-stage-main">
        <Transition name="countdown">
          <div
            v-if="countdown != null"
            class="presentation-countdown"
            aria-live="polite"
          >
            <span class="countdown-digit presentation-countdown-digit">{{ countdown }}</span>
          </div>
        </Transition>

        <div ref="fireworksEl" class="presentation-fireworks" aria-hidden="true" />

        <div
          v-show="countdown == null"
          class="presentation-numbers"
          :style="numbersLayout"
        >
          <template v-if="displayNumbers.length">
            <span
              v-for="(num, i) in displayNumbers"
              :key="`${lastRoundN}-${num}-${i}`"
              class="reveal-number presentation-number"
              :style="{ fontSize: numberFontSize }"
            >
              {{ num }}
            </span>
          </template>
          <span v-else class="presentation-empty">—</span>
        </div>
      </div>

      <footer class="presentation-footer">
        <p class="presentation-round">
          Rodada {{ lastRoundN || nextRound }}
        </p>
        <button
          type="button"
          class="presentation-draw"
          :disabled="!canDraw || drawing"
          @click="startDraw"
        >
          [ Próximo sorteio ]
        </button>
        <p v-if="poolWarning" class="presentation-warn">{{ poolWarning }}</p>
      </footer>
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
              class="reveal-number text-7xl font-bold text-white tabular-nums"
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

        <label class="mt-5 block max-w-[12rem]">
          <span class="mb-1.5 block text-sm text-white/60">Countdown (1–10)</span>
          <input
            v-model.number="countdownFrom"
            type="number"
            min="1"
            max="10"
            step="1"
            class="w-full rounded-lg border border-white/20 bg-black px-4 py-2.5 text-white outline-none focus:border-cj-yellow"
            @change="onCountdownChange"
          />
        </label>

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
          <legend class="mb-2 text-sm text-white/60">Som do clímax</legend>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in climaxOptions"
              :key="opt.id"
              type="button"
              class="rounded-lg border px-3 py-2 text-sm font-semibold transition"
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const STORAGE_KEY = 'central-jovem:sorteio'
const base = import.meta.env.BASE_URL

const DEFAULT_STATE = () => ({
  settings: {
    min: 1,
    max: 100,
    count: 1,
    countdownFrom: 3,
    noRepeat: true,
    soundEnabled: true,
    climaxSound: 'projection',
    presentation: false,
  },
  rounds: [],
  usedNumbers: [],
  nextRound: 1,
})

const climaxOptions = [
  { id: 'projection', label: 'Projection' },
  { id: 'long', label: 'Long crash' },
  { id: 'kitStack', label: 'Kit stack' },
]

const CLIMAX_IDS = climaxOptions.map((o) => o.id)

const min = ref(1)
const max = ref(100)
const count = ref(1)
const countdownFrom = ref(5)
const noRepeat = ref(true)
const soundEnabled = ref(true)
const climaxSound = ref('projection')
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
const sampleBuffers = new Map()
const sampleLoadPromises = new Map()

const SAMPLE_FILES = {
  projection: 'sounds/crash-cymbal.mp3',
  long: 'sounds/crash-long.mp3',
  zildjianA16: 'sounds/crash-zildjian-a16.mp3',
  splash: 'sounds/crash-splash.mp3',
  multi: 'sounds/multi-zildjian.mp3',
}

const lastRoundN = computed(() => {
  if (!rounds.value.length) return 0
  return rounds.value[rounds.value.length - 1].n
})

const numberFontSize = computed(() => {
  const n = Math.max(displayNumbers.value.length, 1)
  if (presentation.value) {
    if (n === 1) return 'min(32vh, 28vw)'
    if (n === 2) return 'min(26vh, 20vw)'
    if (n === 3) return 'min(20vh, 15vw)'
    if (n === 4) return 'min(16vh, 12vw)'
    return 'min(13vh, 9.5vw)'
  }
  if (n === 1) return '18vw'
  if (n === 2) return '12vw'
  if (n === 3) return '9vw'
  if (n === 4) return '7vw'
  return '5.5vw'
})

/** Espalha na largura da tela; gap mínimo evita colisão. */
const numbersLayout = computed(() => {
  const n = displayNumbers.value.length
  if (n <= 1) {
    return {
      width: '100%',
      justifyContent: 'center',
      gap: '0',
    }
  }
  return {
    width: 'min(94vw, 1680px)',
    justifyContent: 'space-evenly',
    gap: n === 2 ? '4vw' : n === 3 ? '2.5vw' : '1.5vw',
  }
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
    countdownFrom.value =
      Number.isFinite(s.countdownFrom) && s.countdownFrom >= 1 && s.countdownFrom <= 10
        ? Math.trunc(s.countdownFrom)
        : 5
    noRepeat.value = s.noRepeat !== false
    soundEnabled.value = s.soundEnabled !== false
    climaxSound.value = CLIMAX_IDS.includes(s.climaxSound) ? s.climaxSound : 'projection'
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

function onCountdownChange() {
  let n = Math.trunc(Number(countdownFrom.value))
  if (!Number.isFinite(n)) n = 5
  countdownFrom.value = Math.min(10, Math.max(1, n))
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

function lockPresentationScroll(locked) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  document.body.style.overflow = locked ? 'hidden' : ''
}

watch(presentation, (on) => lockPresentationScroll(on), { immediate: true })

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

  // corpo grave (mais baixo que o clímax)
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(140 + Math.random() * 40, t)
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.12)
  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.28, t)
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14)
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.15)

  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 0.05)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 220 + Math.random() * 80
  filter.Q.value = 2.5
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.18, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  src.start(t)
  src.stop(t + 0.06)
}

async function loadSample(id) {
  if (sampleBuffers.has(id)) return sampleBuffers.get(id)
  if (sampleLoadPromises.has(id)) return sampleLoadPromises.get(id)
  const file = SAMPLE_FILES[id]
  if (!file) return null
  const ctx = ensureAudio()
  if (!ctx) return null
  const promise = (async () => {
    try {
      const url = `${import.meta.env.BASE_URL}${file}`
      const res = await fetch(url)
      const arr = await res.arrayBuffer()
      const buffer = await ctx.decodeAudioData(arr.slice(0))
      sampleBuffers.set(id, buffer)
      return buffer
    } catch {
      sampleLoadPromises.delete(id)
      return null
    }
  })()
  sampleLoadPromises.set(id, promise)
  return promise
}

function playBuffer(buffer, { gain = 0.95, duration = 2.4, rate = 1, when = 0 } = {}) {
  const ctx = ensureAudio()
  if (!ctx || !buffer) return
  const t = ctx.currentTime + when
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.playbackRate.value = rate
  const g = ctx.createGain()
  const playLen = Math.min(duration, buffer.duration / rate)
  g.gain.setValueAtTime(gain, t)
  g.gain.setValueAtTime(gain, t + playLen * 0.55)
  g.gain.exponentialRampToValueAtTime(0.001, t + playLen)
  src.connect(g)
  g.connect(ctx.destination)
  src.start(t, 0, playLen)
}

async function playSample(id, opts = {}) {
  if (!soundEnabled.value) return
  const buffer = await loadSample(id)
  if (!buffer) return
  playBuffer(buffer, opts)
}

/** Vários pratos de kit juntos (crash + splash + multi). */
async function playKitStack() {
  if (!soundEnabled.value) return
  const [crash, splash, multi] = await Promise.all([
    loadSample('zildjianA16'),
    loadSample('splash'),
    loadSample('multi'),
  ])
  if (crash) playBuffer(crash, { gain: 0.9, duration: 2.2, when: 0 })
  if (splash) playBuffer(splash, { gain: 0.75, duration: 1.8, rate: 1.02, when: 0.02 })
  if (multi) {
    playBuffer(multi, { gain: 0.85, duration: 1.6, when: 0.04 })
    playBuffer(multi, { gain: 0.65, duration: 1.6, rate: 0.96, when: 0.07 })
  }
  if (!crash && !splash && !multi) {
    await playSample('projection')
  }
}

function playClimax() {
  if (climaxSound.value === 'kitStack') {
    playKitStack()
    return
  }
  playSample(climaxSound.value, { gain: 1, duration: 2.5 })
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

  const from = Math.min(10, Math.max(1, Math.trunc(Number(countdownFrom.value)) || 5))
  countdownFrom.value = from
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
  Object.keys(SAMPLE_FILES).forEach((id) => loadSample(id))
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  lockPresentationScroll(false)
  stopDrumroll()
  if (audioCtx) {
    audioCtx.close().catch(() => {})
    audioCtx = null
  }
})

</script>

<style scoped>
.sorteio-root {
  font-family: Outfit, system-ui, sans-serif;
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

/* Modo apresentação: tela cheia fixa (não depende da árvore do Vue/Tailwind clamp) */
.presentation-stage {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #000;
  padding: 2.5vh 3vw;
  box-sizing: border-box;
}

.presentation-exit {
  position: absolute;
  top: 1.5vh;
  right: 2vw;
  z-index: 60;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.4rem;
  padding: 0.45rem 0.85rem;
  font-size: clamp(0.8rem, 1.4vh, 1rem);
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
  background: transparent;
  cursor: pointer;
}

.presentation-exit:hover {
  border-color: rgba(255, 255, 255, 0.55);
  color: #fff;
}

.presentation-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5vw;
  min-height: 12vh;
  padding-top: 1vh;
}

.presentation-logo {
  height: clamp(3.5rem, 10vh, 7rem);
  width: clamp(3.5rem, 10vh, 7rem);
  object-fit: contain;
  flex-shrink: 0;
}

.presentation-title {
  margin: 0;
  font-size: clamp(2.25rem, 7.5vh, 5.5rem);
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
  color: #fff;
}

.presentation-stage-main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
}

.presentation-countdown,
.presentation-fireworks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.presentation-countdown {
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.presentation-fireworks {
  z-index: 15;
  overflow: hidden;
}

.presentation-countdown-digit {
  font-family: Outfit, system-ui, sans-serif;
  font-size: min(28vh, 30vw);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #fff;
}

.presentation-numbers {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0 2vw;
  box-sizing: border-box;
}

.presentation-number {
  font-family: Outfit, system-ui, sans-serif;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #fff;
}

.presentation-empty {
  font-family: Outfit, system-ui, sans-serif;
  font-size: min(18vh, 20vw);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.3);
}

.presentation-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6vh;
  min-height: 14vh;
  padding-bottom: 1vh;
  justify-content: center;
}

.presentation-round {
  margin: 0;
  font-size: clamp(1.25rem, 3.5vh, 2.4rem);
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #fff;
}

.presentation-draw {
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 9999px;
  padding: 1.2vh 3.5vw;
  font-size: clamp(1rem, 2.6vh, 1.6rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
  background: transparent;
  cursor: pointer;
}

.presentation-draw:hover:not(:disabled) {
  border-color: #f5d90a;
  color: #f5d90a;
}

.presentation-draw:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.presentation-warn {
  margin: 0;
  max-width: 90%;
  text-align: center;
  font-size: clamp(0.8rem, 1.8vh, 1.1rem);
  color: #f5d90a;
}
</style>
