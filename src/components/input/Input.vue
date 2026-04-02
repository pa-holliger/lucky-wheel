<template>
  <div
    class="flex items-center rounded-md px-2 h-9 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-red-800 cursor-text"
    @click="focus">
    <input
      ref="inputRef"
      v-model="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
      :type="type">

    <span
      v-if="unit"
      class="text-xs text-neutral-500 select-none pointer-events-none">
      {{ unit }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

const props = withDefaults(defineProps<{
  modelValue: number | string
  placeholder: string
  type?: HTMLInputElement["type"]
  min?: HTMLInputElement["min"]
  max?: HTMLInputElement["max"]
  unit?: string
}>(), {
  type: "text" as HTMLInputElement["type"],
})

const emit = defineEmits<{
  (e: "update:modelValue", value: number | string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})

function focus() {
  inputRef.value?.focus()
}
</script>
