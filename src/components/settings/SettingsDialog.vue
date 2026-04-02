<template>
  <Dialog
    title="Paramètres"
    @close="close">
    <div class="p-4 flex flex-col items-center justify-center relative">
      <div class="flex flex-col gap-4 z-10 w-full pointer-events-none">
        <div class="flex items-center justify-between">
          <div class="flex flex-col items-start shrink-0">
            <span class="font-medium">
              Nombre de tours de roue
            </span>
            <span class="text-xs text-neutral-500">
              Chaque tour de roue prend {{ TURN_DURATION_MS / 1000 }} secondes
            </span>
          </div>

          <Input
            v-model="draftSpinTurns"
            class="w-28 pointer-events-auto"
            placeholder="3"
            min="1"
            max="99"
            unit="tours"
            type="number" />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex flex-col items-start shrink-0">
            <span class="font-medium">
              Durée du suspense
            </span>
            <span class="text-xs text-neutral-500">
              Durée pendant laquelle la roue ralentit
            </span>
          </div>

          <Input
            v-model="draftSettleDuration"
            class="w-28 pointer-events-auto"
            placeholder="5"
            min="1"
            max="99"
            unit="s"
            type="number" />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex flex-col items-start shrink-0">
            <span class="font-medium">
              Volume
            </span>
            <span class="text-xs text-neutral-500">
              🎶 Chui bo, j'y crois pas comment qu'chui bo 🎵
            </span>
          </div>

          <input
            v-model.number="draftVolume"
            type="range"
            min="0"
            max="100"
            aria-label="Volume"
            class="w-28 pointer-events-auto">
        </div>
      </div>

      <div class="absolute pl-20 flex items-center justify-end h-20">
        <img
          :src="polineBd"
          alt="poline bdr"
          draggable="false"
          class="size-16 rotate-6 hover:size-32 opacity-20 hover:opacity-100 hover:-rotate-6 transition-all duration-300 ease-out cursor-pointer"
          @click="openPolineBd">
      </div>
    </div>

    <div class="bg-neutral-50 border-t border-neutral-200 p-4 flex justify-between">
      <button
        class="underline text-sm text-neutral-600 hover:text-red-600 transition-colors duration-300 cursor-pointer"
        @click="resetSettings">
        Réinitialiser les paramètres
      </button>

      <button
        class="py-1.5 px-3 shadow-none hover:shadow-sm transition-all duration-300 text-sm bg-green-800 hover:bg-green-700 active:bg-green-900 rounded-md text-white cursor-pointer"
        @click="saveSettings">
        Enregistrer
      </button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import polineBd from "@/assets/polineBd.png"
import Dialog from "@/components/Dialog.vue"
import Input from "@/components/input/Input.vue"
import { useSettings } from "@/composables/useSettings"

const emit = defineEmits<{
  (e: "close"): void
}>()

const { spinTurns, settleDuration, volume, save, DEFAULTS, TURN_DURATION_MS } = useSettings()

const draftSpinTurns = ref(spinTurns.value)
const draftSettleDuration = ref(settleDuration.value)
const draftVolume = ref(volume.value)

function saveSettings() {
  save({
    spinTurns: draftSpinTurns.value,
    settleDuration: draftSettleDuration.value,
    volume: draftVolume.value,
  })
  emit("close")
}

function resetSettings() {
  draftSpinTurns.value = DEFAULTS.spinTurns
  draftSettleDuration.value = DEFAULTS.settleDuration
  draftVolume.value = DEFAULTS.volume
}

function close() {
  emit("close")
}

function openPolineBd() {
  window.open("https://www.exemplaire-editions.fr/exemplaire/projets/financement/et-la-vie-sera-super", "_blank")
}
</script>
