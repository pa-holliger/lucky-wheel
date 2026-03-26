import { ref, watch } from "vue"

const VOLUME_LEVEL = {
  Max: 0.3,
  Medium: 0.1,
  Off: 0.0,
}

const volumeLevel = ref(_getDefaultVolumeLevel())

watch(volumeLevel, value => localStorage.setItem("volumeLevel", String(value)))

export function useSound() {
  function updateVolumeLevel() {
    if (volumeLevel.value === VOLUME_LEVEL.Max) {
      volumeLevel.value = VOLUME_LEVEL.Medium
      return
    }

    if (volumeLevel.value === VOLUME_LEVEL.Medium) {
      volumeLevel.value = VOLUME_LEVEL.Off
      return
    }

    if (volumeLevel.value === VOLUME_LEVEL.Off) {
      volumeLevel.value = VOLUME_LEVEL.Max
      return
    }
  }

  return { updateVolumeLevel, volumeLevel, VOLUME_LEVEL }
}

export function playSound(sound: string) {
  if (volumeLevel.value === VOLUME_LEVEL.Off) {
    return
  }

  const audio = new Audio(sound)
  audio.currentTime = 0
  audio.volume = volumeLevel.value
  audio.play()
}

function _getDefaultVolumeLevel() {
  const localStorageVolumeLevel = localStorage.getItem("volumeLevel")

  if (!localStorageVolumeLevel || !Object.values(VOLUME_LEVEL).includes(Number(localStorageVolumeLevel))) {
    return VOLUME_LEVEL.Max
  }

  return Number(localStorageVolumeLevel)
}
