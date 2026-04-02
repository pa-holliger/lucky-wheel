import { computed, ref } from "vue"

const MAX_AUDIO_VOLUME = 0.3

export const TURN_DURATION_MS = 1500

export const DEFAULTS = {
  spinTurns: 3,
  settleDuration: 5,
  volume: 50,
} as const

function _loadSettings() {
  try {
    const raw = localStorage.getItem("settings")
    if (raw) {
      return JSON.parse(raw)
    }
  }
  catch {}
  return {}
}

function _migrateLegacyVolume(): number {
  const legacy = localStorage.getItem("volumeLevel")
  if (legacy) {
    localStorage.removeItem("volumeLevel")
    return Math.round(Number(legacy) / MAX_AUDIO_VOLUME * 100)
  }
  return DEFAULTS.volume
}

const stored = _loadSettings()

export const spinTurns = ref<number>(stored.spinTurns ?? DEFAULTS.spinTurns)
export const settleDuration = ref<number>(stored.settleDuration ?? DEFAULTS.settleDuration)
export const volume = ref<number>(stored.volume ?? _migrateLegacyVolume())

export const audioVolume = computed(() => volume.value / 100 * MAX_AUDIO_VOLUME)

function _persist() {
  localStorage.setItem("settings", JSON.stringify({
    spinTurns: spinTurns.value,
    settleDuration: settleDuration.value,
    volume: volume.value,
  }))
}

export function useSettings() {
  const spinDurationMs = computed(() => spinTurns.value * 1000)
  const settleDurationMs = computed(() => settleDuration.value * 1000)

  function save(values: { spinTurns: number, settleDuration: number, volume: number }) {
    spinTurns.value = values.spinTurns
    settleDuration.value = values.settleDuration
    volume.value = values.volume
    _persist()
  }

  function reset() {
    save({ ...DEFAULTS })
  }

  return {
    spinTurns,
    settleDuration,
    spinDurationMs,
    settleDurationMs,
    volume,
    save,
    reset,
    DEFAULTS,
    TURN_DURATION_MS,
  }
}
