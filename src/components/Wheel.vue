<template>
  <div class="flex flex-col items-center">
    <span class="size-6 text-white i-lucide-arrow-down" />
    <div
      class="relative flex items-center justify-center"
      @click="spin">
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
import wheel from "@/assets/wheel.svg"
import Emote from "@/components/Emote.vue"
import { useHistory } from "@/composables/useHistory"
import { playSound } from "@/composables/useSound"
import { getColorLabel } from "@/helpers/getColorLabel"

const { addResult } = useHistory()
const rotation = ref(0)
const isSpinning = ref(false)
const hasSpinned = ref(false)
const targetAngle = ref(0)

const WHEEL_PART_COUNT = 16
const SPIN_DURATION = 3000
const SETTLE_DURATION = 5000

const selectedPart = computed(() => {
  return targetAngle.value / 360 * WHEEL_PART_COUNT
})

const selectedPartColor = computed(() => {
  return Math.floor(selectedPart.value) % 2 !== 0 ? "red" : "black"
})

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function spin() {
  if (isSpinning.value) {
    return
  }
  isSpinning.value = true

  const startRotation = rotation.value
  targetAngle.value = Math.random() * 360

  const currentAngle = ((startRotation % 360) + 360) % 360
  let offset = targetAngle.value - currentAngle
  if (offset < 0) {
    offset += 360
  }

  const fullSpins = SPIN_DURATION / 1000
  const totalDistance = fullSpins * 360 + offset
  const endRotation = startRotation + totalDistance

  // settleArc calibré pour que la vitesse soit continue à la transition
  // Phase 1 (linéaire) vitesse finale = Phase 2 (easeOutCubic) vitesse initiale
  const settleArc = totalDistance / (1 + 3 * SPIN_DURATION / SETTLE_DURATION)
  const phase1End = endRotation - settleArc

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

    if (elapsed < SPIN_DURATION) {
      const progress = elapsed / SPIN_DURATION
      rotation.value = startRotation + (phase1End - startRotation) * progress
      requestAnimationFrame(animate)
    }
    else if (elapsed < SPIN_DURATION + SETTLE_DURATION) {
      const progress = (elapsed - SPIN_DURATION) / SETTLE_DURATION
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
