<template>
  <div class="p-4 grid grid-cols-[1fr_auto_1fr] items-center">
    <div />

    <span class="text-white text-2xl font-bold">
      LA ROULETTE
    </span>

    <div class="flex items-center gap-2 justify-end">
      <span
        class="i-lucide-chart-line size-6 text-white opacity-25 hover:opacity-100 cursor-pointer transition-opacity duration-200"
        role="button"
        aria-label="Historique"
        @click="openHistory" />

      <span
        :class="muted ? 'i-lucide-volume-off' : 'i-lucide-volume-2'"
        class="size-6 text-white opacity-25 hover:opacity-100 cursor-pointer transition-opacity duration-200"
        role="button"
        :aria-label="muted ? 'Activer le son' : 'Couper le son'"
        @click="toggle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSound } from "@/composables/useSound"

const emit = defineEmits<{
  (e: "openHistory"): void
}>()

function openHistory() {
  emit("openHistory")
}

const { muted, toggle } = useSound()
</script>
