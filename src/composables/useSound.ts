import { audioVolume, volume } from "./useSettings"

export function playSound(sound: string) {
  if (volume.value === 0) {
    return
  }

  const audio = new Audio(sound)
  audio.currentTime = 0
  audio.volume = audioVolume.value
  audio.play()
}
