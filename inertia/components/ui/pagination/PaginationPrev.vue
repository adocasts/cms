<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { ChevronLeft } from 'lucide-vue-next'
import { PaginationPrev, type PaginationPrevProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { Link } from '@inertiajs/vue3'

const props = withDefaults(
  defineProps<PaginationPrevProps & { class?: HTMLAttributes['class']; href: string }>(),
  {
    asChild: true,
  }
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationPrev v-bind="delegatedProps">
    <Button :class="cn('w-8 h-8 p-0', props.class)" variant="outline">
      <Link :href="href">
        <ChevronLeft class="h-4 w-4" />
      </Link>
    </Button>
  </PaginationPrev>
</template>
