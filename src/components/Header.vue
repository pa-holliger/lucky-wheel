<template>
  <div class="p-4 grid grid-cols-[auto_1fr] items-center group hover:bg-neutral-900/40 transition-all duration-300">
    <span class="text-white opacity-25 group-hover:opacity-100 text-2xl font-bold transition-opacity duration-300">
      LA ROULETTE
    </span>

    <div class="flex items-center gap-2 justify-end">
      <span
        class="i-lucide-chart-line size-6 text-white opacity-25 hover:opacity-100 cursor-pointer transition-opacity duration-200"
        role="button"
        aria-label="Historique"
        @click="openHistory" />

      <span
        class="i-lucide-settings size-6 text-white opacity-25 hover:opacity-100 cursor-pointer transition-opacity duration-200"
        role="button"
        aria-label="Paramètres"
        @click="openSettings" />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "openHistory"): void
  (e: "openSettings"): void
}>()

function openHistory() {
  emit("openHistory")
}

function openSettings() {
  emit("openSettings")
}
</script>
