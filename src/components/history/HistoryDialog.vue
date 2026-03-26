<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div
      class="z-10 bg-black/20 absolute inset-0"
      @click="close" />
    <div class="w-80 z-100 relative">
      <img
        v-if="isBlackEmoteVisible"
        :src="blackEmote"
        alt="black emote"
        draggable="false"
        :class="blackEmotePosition"
        class="absolute size-10 z-20 cursor-not-allowed"
        @click="removeEmote('black')">
      <img
        v-if="isRedEmoteVisible"
        :src="redEmote"
        alt="red emote"
        draggable="false"
        :class="redEmotePosition"
        class="absolute size-10 z-20 cursor-not-allowed"
        @click="removeEmote('red')">

      <div class="z-100 relative bg-white border border-neutral-200 shadow-lg rounded-lg overflow-hidden">
        <div class="p-4 flex items-center justify-between bg-neutral-100 border-b border-neutral-200">
          <span class="font-bold">
            Historique
          </span>

          <span
            class="i-lucide-x size-5 text-black hover:text-red-600 cursor-pointer transition-colors duration-200"
            role="button"
            aria-label="Fermer"
            @click="close" />
        </div>

        <div class="h-96 overflow-y-scroll scrollbar-square flex flex-col divide-y divide-neutral-200">
          <template v-if="formattedHistoryByDate.length > 0">
            <HistoryDay
              v-for="group in formattedHistoryByDate"
              :key="group.date"
              :date="group.date"
              :items="group.items"
              @remove-item="removeItem" />
          </template>

          <span
            v-else
            class="text-sm text-neutral-500 px-2">
            Lance la roulette pour commencer à remplir ton historique !
          </span>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import blackEmote from "@/assets/blackEmote.png"
import ouchSound from "@/assets/ouchSound.mp3"
import redEmote from "@/assets/redEmote.png"
import HistoryColor from "@/components/history/HistoryColor.vue"
import HistoryDay from "@/components/history/HistoryDay.vue"
import { useHistory } from "@/composables/useHistory"
import { playSound } from "@/composables/useSound"

const emit = defineEmits<{
  (e: "close"): void
}>()

const { history, removeItem } = useHistory()

const redEmotePosition = ref<string>("")
const blackEmotePosition = ref<string>("")
const isBlackEmoteVisible = ref(true)
const isRedEmoteVisible = ref(true)

onMounted(() => {
  redEmotePosition.value = getRedEmotePosition()
  blackEmotePosition.value = getBlackEmotePosition()
})

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

function getRedEmotePosition() {
  const positions = [
    "rotate-0 -top-10 right-3",
    "rotate-90 bottom-3 -right-10",
    "rotate-180 -bottom-10 right-3",
    "rotate-270 top-3 -left-10",
  ]

  return positions[Math.floor(Math.random() * positions.length)]
}

function getBlackEmotePosition() {
  const positions = [
    "rotate-0 -top-10 left-3",
    "rotate-90 top-3 -right-10",
    "rotate-180 -bottom-10 left-3",
    "rotate-270 bottom-3 -left-10",
  ]

  return positions[Math.floor(Math.random() * positions.length)]
}

function removeEmote(color: string) {
  playOuchSound()

  if (color === "black") {
    isBlackEmoteVisible.value = false
  }
  else {
    isRedEmoteVisible.value = false
  }
}

function playOuchSound() {
  playSound(ouchSound)
}
</script>
