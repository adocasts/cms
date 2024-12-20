<script setup lang="ts">
import { GripVertical } from 'lucide-vue-next'
</script>

<template>
  <div
    class="text-slate-400 hover:text-slate-950 handle cursor-move opacity-0 group-hover:opacity-100 duration-300 absolute right-full top-1/2 -translate-y-1/2 pl-2"
  >
    <GripVertical class="w-4 h-4" />
  </div>
</template>
