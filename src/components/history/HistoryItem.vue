<template>
  <div
    class="p-2 rounded-lg border flex items-start h-[60px] gap-2 transition-colors duration-200"
    :class="isRemoving ? 'border-red-600 bg-red-50 shadow shadow-red-600/20' : 'border-neutral-100 bg-neutral-50'">
    <div class="h-6 flex items-center">
      <HistoryColor :color="item.color" />
    </div>

    <div class="flex-1 flex flex-col justify-between h-full">
      <div>
        <span class="text-neutral-900 font-bold">
          {{ getColorLabel(item.color) }}
        </span>
        <span class="text-neutral-600 text-sm">
          ({{ colorPartChance }}%)
        </span>
      </div>

      <span class="text-xs text-neutral-400">
        <template v-if="isRemoving">
          Valider la suppression
        </template>
        <template v-else>
          {{ formattedDate }}
        </template>
      </span>
    </div>

    <div class="flex flex-col justify-between h-full">
      <template v-if="isRemoving">
        <span
          class="i-lucide-x size-4 text-neutral-400 hover:text-red-600 cursor-pointer transition-colors duration-200"
          @click="isRemoving = false" />
        <span
          class="i-lucide-check size-4 text-neutral-400 hover:text-green-600 cursor-pointer transition-colors duration-200"
          @click="removeItem" />
      </template>

      <span
        v-else
        class="i-lucide-trash-2 size-4 text-neutral-400 hover:text-red-600 cursor-pointer transition-colors duration-200"
        @click="handleRemoveItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameResult } from "@/composables/useHistory"
import { computed, ref } from "vue"
import HistoryColor from "@/components/history/HistoryColor.vue"
import { getColorLabel } from "@/helpers/getColorLabel"

const props = defineProps<{
  item: GameResult
}>()

const emit = defineEmits<{
  (e: "removeItem", date: string): void
}>()

const isRemoving = ref(false)

const formattedDate = computed(() => {
  const d = new Date(props.item.date)
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
  return `${time} - ${date}`
})

const colorPartChance = computed(() => {
  return Math.round((props.item.part % 1) * 100)
})

function handleRemoveItem() {
  isRemoving.value = true
}

function removeItem() {
  emit("removeItem", props.item.date)
}
</script>
