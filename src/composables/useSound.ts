import { ref, watch } from "vue"

const muted = ref(localStorage.getItem("muted") === "true")

watch(muted, mutedValue => localStorage.setItem("muted", String(mutedValue)))

export function useSound() {
  function toggle() {
    muted.value = !muted.value
  }
  return { muted, toggle }
}

export function playSound(sound: string) {
  if (muted.value) {
    return
  }

  const audio = new Audio(sound)
  audio.currentTime = 0
  audio.play()
}
