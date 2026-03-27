<template>
  <div
    class="flex flex-col h-dvh bg-neutral-900 bg-cover bg-center"
    :style="{ backgroundImage: `url(${background})` }">
    <Header @open-history="openHistory" />

    <div class="flex-1 flex items-center justify-center overflow-hidden">
      <Wheel />
    </div>

    <Footer />
  </div>

  <Transition name="fade">
    <HistoryDialog
      v-if="isHistoryDialogOpen"
      @close="isHistoryDialogOpen = false" />
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue"
import background from "@/assets/background.avif"
import Footer from "@/components/Footer.vue"
import Header from "@/components/Header.vue"
import HistoryDialog from "@/components/history/HistoryDialog.vue"
import Wheel from "@/components/Wheel.vue"

const isHistoryDialogOpen = ref(false)

function openHistory() {
  isHistoryDialogOpen.value = true
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
