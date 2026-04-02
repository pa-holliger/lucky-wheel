<template>
  <Dialog
    title="Historique"
    size="small"
    @close="close">
    <div class="h-96 overflow-y-scroll scrollbar-square flex flex-col divide-y divide-neutral-200">
      <template v-if="formattedHistoryByDate.length > 0">
        <HistoryDay
          v-for="group in formattedHistoryByDate"
          :key="group.date"
          :date="group.date"
          :items="group.items"
          @remove-item="removeItem" />
      </template>

      <div
        v-else
        class="flex flex-col items-center justify-center gap-4 p-4 h-full">
        <span class="i-lucide-ghost size-6 text-neutral-400 animate-ghost hover:text-neutral-200 transition-colors cursor-help" />
        <span class="text-center text-xs text-neutral-600">Tu n'as pas encore joué de parties</span>
      </div>
    </div>

    <div class="px-4 py-2 bg-neutral-100 border-t border-neutral-200 flex justify-center items-center gap-8">
      <div
        v-for="percentage in formattedPercentages"
        :key="percentage.color"
        class="flex items-center gap-2">
        <HistoryColor :color="percentage.color" />

        <span class="text-sm font-medium">
          {{ percentage.value }}%
        </span>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Dialog from "@/components/Dialog.vue"
import HistoryColor from "@/components/history/HistoryColor.vue"
import HistoryDay from "@/components/history/HistoryDay.vue"
import { useHistory } from "@/composables/useHistory"

const emit = defineEmits<{
  (e: "close"): void
}>()

const { history, removeItem } = useHistory()

function close() {
  emit("close")
}

const formattedPercentages = computed(() => {
  return [
    { color: "red", value: getPercentage("red") },
    { color: "black", value: getPercentage("black") },
  ]
})

function getPercentage(color: string) {
  const colorCount = history.value.filter(item => item.color === color).length

  if (colorCount === 0) {
    return 0
  }

  const percentage = colorCount / history.value.length * 100
  return Number(percentage.toFixed(2))
}

const formattedHistoryByDate = computed(() => {
  const groups = new Map<string, typeof history.value>()

  for (const item of history.value) {
    const key = new Date(item.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    const group = groups.get(key)
    if (group) {
      group.push(item)
    }
    else {
      groups.set(key, [item])
    }
  }

  return Array.from(groups.entries(), ([date, items]) => ({ date, items }))
})
</script>
