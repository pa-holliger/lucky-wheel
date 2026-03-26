<template>
  <div
    class="p-2 bg-neutral-50 rounded-lg border border-neutral-100 flex items-start justify-between gap-2">
    <HistoryColor :color="item.color" />
    <div class="flex flex-col items-end">
      <span class="text-neutral-600">
        {{ colorLabel }} ({{ colorPartChance }}%)
      </span>
      <span class="text-xs text-neutral-400">
        {{ formattedDate }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameResult } from "@/composables/useHistory"
import { computed } from "vue"
import HistoryColor from "@/components/history/HistoryColor.vue"

const props = defineProps<{
  item: GameResult
}>()

const formattedDate = computed(() => {
  const d = new Date(props.item.date)
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
  return `${time} - ${date}`
})

const colorLabel = computed(() => {
  return props.item.color === "red" ? "Rouge" : "Noir"
})

const colorPartChance = computed(() => {
  return Math.round((props.item.part % 1) * 100)
})
</script>
