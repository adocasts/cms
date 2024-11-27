<script setup lang="ts" generic="T">
import { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'
import { computed } from 'vue'
import { Pagination, PaginationList, PaginationListItem } from '~/components/ui/pagination'
import { Link } from '@inertiajs/vue3'

const props = defineProps<{
  modelValue: SimplePaginatorDtoContract<T>
}>()

const emit = defineEmits(['update:modelValue'])

const meta = computed({
  get: () => props.modelValue.meta,
  set: (value) => emit('update:modelValue', { ...props.modelValue, meta: value }),
})
</script>

<template>
  <Pagination
    v-model:page="meta.currentPage"
    v-slot="{ page }"
    :total="meta.total"
    :sibling-count="1"
    :items-per-page="meta.perPage"
    show-edges
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst :href="meta.firstPageUrl" />
      <PaginationPrev :href="meta.previousPageUrl" />

      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
          <Button
            class="w-8 h-8 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
            as-child
          >
            <Link :href="meta.pagesInRange!.find((range) => range.page === item.value)!.url">
              {{ item.value }}
            </Link>
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext :href="meta.nextPageUrl" />
      <PaginationLast :href="meta.lastPageUrl" />
    </PaginationList>
  </Pagination>
</template>
