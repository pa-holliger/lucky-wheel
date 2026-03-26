<template>
  <div
    :class="color === 'red' ? 'bg-red-600' : 'bg-neutral-900'"
    class="size-4 rounded-full outline outline-white shrink-0" />
</template>

<script setup lang="ts">
defineProps<{
  color: string
}>()
</script>
