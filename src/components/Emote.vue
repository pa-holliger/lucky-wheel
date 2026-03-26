<template>
  <img
    :src="emoteImage"
    alt="emote"
    draggable="false"
    class="size-10">
</template>

<script setup lang="ts">
import { computed } from "vue"
import blackEmote from "@/assets/blackEmote.png"
import redEmote from "@/assets/redEmote.png"

const props = defineProps<{
  emote: "black" | "red"
}>()

const emoteImage = computed(() => {
  switch (props.emote) {
    case "black":
      return blackEmote
    case "red":
    default:
      return redEmote
  }
})
</script>
