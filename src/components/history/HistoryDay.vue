<template>
  <div class="flex flex-col gap-2 p-2">
    <div
      class="flex items-center justify-between group cursor-pointer"
      @click="isOpen = !isOpen">
      <div class="flex-1 flex flex-col items-start px-2">
        <span class="text-neutral-900 font-medium">
          {{ date }}
        </span>
        <div class="flex justify-between w-full">
          <span class="text-xs text-neutral-400">
            {{ getPlayedCount() }} :
            {{ getPlayedCount("black") }}, {{ getPlayedCount("red") }}
          </span>
          <span class="text-xs text-neutral-400" />
        </div>
      </div>

      <span
        class="i-lucide-chevron-right size-4 text-neutral-400 group-hover:text-neutral-900 transition-all duration-200"
        :class="{ 'rotate-90': isOpen }" />
    </div>
    <div
      v-show="isOpen"
      class="flex flex-col gap-1">
      <HistoryItem
        v-for="item in items"
        :key="item.date"
        :item="item"
        @remove-item="removeItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameResult } from "@/composables/useHistory"
import { ref } from "vue"
import HistoryItem from "@/components/history/HistoryItem.vue"

const props = defineProps<{
  date: string
  items: GameResult[]
}>()

const emit = defineEmits<{
  (e: "removeItem", date: string): void
}>()

const isOpen = ref(true)

function removeItem(date: string) {
  emit("removeItem", date)
}

function getPlayedCount(color?: string) {
  if (!color) {
    const count = props.items.length
    return count === 1 ? "1 partie" : `${count} parties`
  }

  if (color === "black") {
    const count = props.items.filter(item => item.color === "black").length
    return count === 1 ? "1 noire" : `${count} noires`
  }

  const count = props.items.filter(item => item.color === "red").length
  return count === 1 ? "1 rouge" : `${count} rouges`
}
</script>
