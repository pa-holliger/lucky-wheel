<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <div
      class="z-10 bg-black/20 absolute inset-0"
      @click="close" />
    <div
      class="z-100 relative"
      :class="dialogSize">
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
            {{ title }}
          </span>

          <span
            class="i-lucide-x size-5 text-black hover:text-red-600 cursor-pointer transition-colors duration-200"
            role="button"
            aria-label="Fermer"
            @click="close" />
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import blackEmote from "@/assets/blackEmote.png"
import ouchSound from "@/assets/ouchSound.mp3"
import redEmote from "@/assets/redEmote.png"
import { playSound } from "@/composables/useSound"

const props = withDefaults(defineProps<{
  title: string
  size?: "small" | "default"
}>(), {
  size: "default",
})

const emit = defineEmits<{
  (e: "close"): void
}>()

const redEmotePosition = ref<string>("")
const blackEmotePosition = ref<string>("")
const isBlackEmoteVisible = ref(true)
const isRedEmoteVisible = ref(true)

onMounted(() => {
  redEmotePosition.value = getRedEmotePosition()
  blackEmotePosition.value = getBlackEmotePosition()
})

const dialogSize = computed(() => {
  switch (props.size) {
    case "small":
      return "w-80"
    case "default":
    default:
      return "w-[500px]"
  }
})

function close() {
  emit("close")
}

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
