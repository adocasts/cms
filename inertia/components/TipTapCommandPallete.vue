<script setup lang="ts">
import { computed, Ref } from 'vue'
import type { CommandState } from '~/lib/tiptap/commands/suggestions'

const props = defineProps<{
  commandState: Ref<CommandState>
}>()

const state = computed(() => props.commandState.value)
</script>

<template>
  <div class="items flex flex-col">
    <template v-for="(item, index) in state.items" :key="item.name">
      <button
        class="block py-1 item flex items-center gap-1.5 w-full pl-1 py-1 pr-12 rounded-lg text-left"
        :class="{ 'bg-slate-500/50': state.selectedIndex === index }"
        @click="state.onClick(index)"
      >
        <div
          v-if="item.icon"
          class="w-6 h-6 flex items-center justify-center bg-slate-500 rounded-md"
          :class="{ 'bg-slate-400': state.selectedIndex === index }"
          v-html="item.icon"
        ></div>
        <div class="title text-left text-slate-50">{{ item.title }}</div>
      </button>
    </template>
    <div v-show="!state.items.length" class="text-slate-300">No results found</div>
  </div>
</template>
