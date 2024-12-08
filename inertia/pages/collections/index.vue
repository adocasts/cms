<script setup lang="ts">
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'
import { ref, watchEffect } from 'vue'
import { Link } from '@tuyau/inertia/vue'
import { StateDesc } from '#enums/states'
import { Plus, Slash, Trash2 } from 'lucide-vue-next'
import { router, useForm } from '@inertiajs/vue3'
import { tuyau } from '~/lib/tuyau'
import useConfirmDestroyDialog from '~/composables/use_confirm_destroy_dialog'
import CollectionTypes, { CollectionTypeDesc } from '#enums/collection_types'
import CollectionDto from '#dtos/collection'
import { StatusDesc } from '#enums/status'

const props = defineProps<{
  collectionTypeId: CollectionTypes
  collections: SimplePaginatorDtoContract<CollectionDto>
  term: string
}>()

const destroy = useConfirmDestroyDialog()
const collections = ref(props.collections)
const search = useForm({ term: props.term ?? '' })

watchEffect(() => (collections.value = props.collections))

async function onDelete(collection: CollectionDto) {
  destroy.value?.show({
    title: 'Delete Collection?',
    message: `Are you sure you'd like to delete the collection "${collection.name}"? Once deleted, it'll be gone forever.`,
    async onConfirm() {
      await router.delete(tuyau.collections({ id: collection.id }).$url(), { preserveScroll: true })
    },
  })
}
</script>

<template>
  <div class="flex justify-between items-center gap-3 mb-3">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="dashboard"> Dashboard </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem v-if="collectionTypeId" class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="collections.index"> Collections </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="collectionTypeId" class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{
            collectionTypeId ? CollectionTypeDesc[collectionTypeId] : 'Collections'
          }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-center gap-3">
      <Input
        v-model="search.term"
        placeholder="Search collections ..."
        @blur="search.get(tuyau.$url('collections.index'))"
      />
      <Button :as="Link" route="collections.create">
        <Plus class="w-4 h-4" />
        New Collection
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xl">
    <Table>
      <TableHeader class="bg-slate-100">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>
            <div class="flex items-center gap-2">
              <span>State</span>
              <Slash class="w-3 h-3 text-slate-600" />
              <span>Status</span>
            </div>
          </TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Content</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="collection in collections.data" :key="collection.id">
          <TableCell>
            <Link route="collections.edit" :params="{ id: collection.id }" class="hover:underline">
              {{ collection.name }}
            </Link>
            <div class="text-slate-600 text-xs">
              <a :href="`https://adocasts.com/series/${collection.slug}`" class="hover:underline">
                {{ collection.slug }}
              </a>
            </div>
          </TableCell>
          <TableCell>
            <div class="flex items-center gap-2">
              <span>{{ StateDesc[collection.stateId] }}</span>
              <Slash class="w-3 h-3 text-slate-600" />
              <span>{{ StatusDesc[collection.statusId] }}</span>
            </div>
          </TableCell>
          <TableCell>
            {{ CollectionTypeDesc[collection.collectionTypeId] }}
          </TableCell>
          <TableCell>
            <div class="text-xs">
              <div>{{ collection.meta.posts_count }} Posts</div>
              <div>{{ collection.children.length }} Modules</div>
            </div>
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              class="hover:text-red-500"
              @click="onDelete(collection)"
            >
              <Trash2 class="w-3 h-3" />
              Delete
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="p-3 border-t border-slate-200 flex justify-end">
      <Paginator v-model="collections" />
    </div>
  </div>
</template>
