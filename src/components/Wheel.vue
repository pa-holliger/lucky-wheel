<template>
  <div class="flex flex-col items-center">
    <div
      class="relative flex items-center justify-center size-[600px]"
      @click="spin">
      <img
        :src="wheelBorder"
        alt="wheel border"
        draggable="false"
        class="size-full select-none absolute inset-0">
      <img
        :src="wheelArrow"
        alt="wheel arrow"
        draggable="false"
        class="size-16 absolute -top-4">
      <img
        :src="wheel"
        alt="wheel"
        draggable="false"
        :class="{ 'cursor-pointer': !isSpinning }"
        class="size-[500px] select-none"
        :style="{ transform: `rotate(${rotation}deg)` }">
      <Transition name="result">
        <div
          v-if="!isSpinning && hasSpinned"
          class="fixed flex flex-col items-center scale-150 select-none pointer-events-none">
          <Emote :emote="selectedPartColor" />
          <div
            :class="selectedPartColor === 'red' ? 'bg-red-800' : 'bg-neutral-900'"
            class="p-2 rounded-lg text-white text-3xl uppercase border border-white font-bold">
            {{ getColorLabel(selectedPartColor) }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import clickSound from "@/assets/clickSound.wav"
import victorySound from "@/assets/victorySound.flac"
import wheel from "@/assets/wheel.webp"
import wheelArrow from "@/assets/wheelArrow.webp"
import wheelBorder from "@/assets/wheelBorder.webp"
import Emote from "@/components/Emote.vue"
import { useHistory } from "@/composables/useHistory"
import { TURN_DURATION_MS, useSettings } from "@/composables/useSettings"
import { playSound } from "@/composables/useSound"
import { getColorLabel } from "@/helpers/getColorLabel"

const { addResult } = useHistory()
const { spinTurns, settleDurationMs } = useSettings()
const rotation = ref(0)
const isSpinning = ref(false)
const hasSpinned = ref(false)
const targetAngle = ref(0)

const WHEEL_PART_COUNT = 16

const selectedPart = computed(() => {
  return targetAngle.value / 360 * WHEEL_PART_COUNT
})

const selectedPartColor = computed(() => {
  return Math.floor(selectedPart.value) % 2 !== 0 ? "red" : "black"
})

function setFavicon(color: "red" | "black") {
  const link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (link) {
    link.href = `/favicon-${color}.ico`
  }
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function spin() {
  if (isSpinning.value) {
    return
  }
  isSpinning.value = true

  const startRotation = rotation.value
  const settleMs = settleDurationMs.value

  // Phase 1 : N tours + offset aléatoire, vitesse constante
  const randomOffset = Math.random() * 360
  const spinMs = spinTurns.value * TURN_DURATION_MS
  const phase1Distance = spinTurns.value * 360 + randomOffset
  const phase1Speed = phase1Distance / spinMs

  // Phase 2 : easeOutCubic, vitesse initiale = phase1Speed (continuité)
  // dérivée de easeOutCubic en t=0 → 3, donc settleArc * 3 / settleMs = phase1Speed
  const settleArc = phase1Speed * settleMs / 3

  const phase1End = startRotation + phase1Distance
  const endRotation = phase1End + settleArc
  targetAngle.value = ((endRotation % 360) + 360) % 360

  const partAngle = 360 / WHEEL_PART_COUNT
  let lastPartIndex = Math.floor(rotation.value / partAngle)

  const startTime = performance.now()

  function animate(now: number) {
    const elapsed = now - startTime

    const currentPartIndex = Math.floor(rotation.value / partAngle)
    if (currentPartIndex !== lastPartIndex) {
      playSound(clickSound)
      lastPartIndex = currentPartIndex
    }

    if (elapsed < spinMs) {
      const progress = elapsed / spinMs
      rotation.value = startRotation + (phase1End - startRotation) * progress
      requestAnimationFrame(animate)
    }
    else if (elapsed < spinMs + settleMs) {
      const progress = (elapsed - spinMs) / settleMs
      rotation.value = phase1End + settleArc * easeOutCubic(progress)
      requestAnimationFrame(animate)
    }
    else {
      rotation.value = endRotation
      hasSpinned.value = true
      isSpinning.value = false
      addResult({
        color: selectedPartColor.value,
        part: selectedPart.value,
        date: new Date().toISOString(),
      })
      setFavicon(selectedPartColor.value)
      playSound(victorySound)
    }
  }

  requestAnimationFrame(animate)
}
</script>

<style scoped>
.result-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-leave-active {
  transition: all 0.2s ease-in;
}

.result-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(10px);
}

.result-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
