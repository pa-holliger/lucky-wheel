<template>
  <div class="bg-neutral-900 h-dvh flex items-center justify-center flex-col">
    <span class="text-white text-2xl font-bold">Lucky Wheel !</span>
    <div
      class="flex flex-col items-center transition-transform ease-out"
      :class="zoomed ? 'scale-150' : 'scale-100'"
      :style="{ transitionDuration: `${ZOOM_DURATION}ms` }">
      <span class="text-2xl text-white">
        ↓
      </span>
      <div
        class="relative flex items-center justify-center"
        @click="spin">
        <img
          :src="wheel"
          alt="wheel"
          :class="{ 'cursor-pointer': !isSpinning }"
          class="size-96"
          :style="{ transform: `rotate(${rotation}deg)` }">
        <Transition name="result">
          <div
            v-if="!isSpinning"
            class="fixed bg-black p-2 rounded-lg text-white">
            {{ selectedPartColor }}
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import wheel from "@/assets/wheel.svg"

const rotation = ref(0)
const isSpinning = ref(false)
const zoomed = ref(false)
const targetAngle = ref(0)

const WHEEL_PART_COUNT = 16
const SPIN_DURATION = 3000
const SETTLE_DURATION = 500
const ZOOM_DURATION = 600

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function spin() {
  if (isSpinning.value) {
    return
  }
  isSpinning.value = true
  zoomed.value = false

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

  const startTime = performance.now()

  console.log(targetAngle.value, selectedPart.value, selectedPartColor.value)

  function animate(now: number) {
    const elapsed = now - startTime

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
      zoomed.value = true
      isSpinning.value = false
    }
  }

  requestAnimationFrame(animate)
}

const selectedPart = computed(() => {
  return targetAngle.value / 360 * WHEEL_PART_COUNT
})

const selectedPartColor = computed(() => {
  return Math.floor(selectedPart.value) % 2 !== 0 ? "red" : "black"
})
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
