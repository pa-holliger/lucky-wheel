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

      <div @click="updateVolumeLevel">
        <span
          :class="displayVolumeLevelIcon?.icon"
          class="size-6 text-white opacity-25 hover:opacity-100 cursor-pointer transition-opacity duration-200"
          role="button"
          :aria-label="displayVolumeLevelIcon?.label" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useSound } from "@/composables/useSound"

const emit = defineEmits<{
  (e: "openHistory"): void
}>()

const { updateVolumeLevel, volumeLevel, VOLUME_LEVEL } = useSound()

function openHistory() {
  emit("openHistory")
}

const volumeLevelIcons = [
  {
    icon: "i-lucide-volume-2",
    label: "Volume max",
    value: VOLUME_LEVEL.Max,
  },
  {
    icon: "i-lucide-volume-1",
    label: "Volume moyen",
    value: VOLUME_LEVEL.Medium,
  },
  {
    icon: "i-lucide-volume-off",
    label: "Volume off",
    value: VOLUME_LEVEL.Off,
  },
]

const displayVolumeLevelIcon = computed(() => {
  return volumeLevelIcons.find(icon => icon.value === volumeLevel.value)
})
</script>
