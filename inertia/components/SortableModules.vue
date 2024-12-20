<script setup lang="ts">
import { CollectionModuleFormDto, CollectionPostFormDto } from '#dtos/collection_content_form'
import { BookMinus, BookPlus } from 'lucide-vue-next'
import Sortable from 'vuedraggable'
import ContentEditable from 'vue-contenteditable'
import { computed } from 'vue'
import type AutocompleteDto from '#dtos/autocomplete'
import { tuyau } from '~/lib/tuyau'
import { useForm } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'

type PostModuleAutocomplete = {
  moduleId?: number
  postId: number | null
  postOptions: AutocompleteDto[]
  postData: CollectionPostFormDto[]
}

const modules = defineModel<CollectionModuleFormDto[]>({ default: [] })
const post = useForm<PostModuleAutocomplete>({
  moduleId: undefined, // radix-ui wants undefined instead of null
  postId: null,
  postOptions: [],
  postData: [],
})

const postModuleIndex = computed(() => modules.value.findIndex((mod) => mod.id === post.moduleId))
const postModule = computed(() => modules.value.at(postModuleIndex.value))

async function onPostSearch(term: string) {
  if (!term) return (post.postOptions = [])

  const ignoreIds = postModule.value?.posts.map((post) => post.id)
  const response = await tuyau.posts.search.$get({
    query: { term, ignoreIds },
  })

  post.postData = response.data.data
  post.postOptions = response.data.options
}

function onPostCommit(id?: number) {
  if (!id) return post.reset()

  const adding = post.postData.find((item) => item.id === post.postId)

  if (!adding) {
    return toast.error('Could not find the desired post')
  }

  adding.order = (postModule.value?.posts.length ?? 1) - 1

  modules.value[postModuleIndex.value].posts.push(adding)

  post.postId = null
}
</script>

<template>
  <Sortable v-model="modules" group="modules" handle=".handle" item-key="id" tag="ul">
    <template #item="{ element: module, index }">
      <li class="flex flex-col border-b border-slate-200 pb-4 mb-2 scroll-mt-24">
        <div
          class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative"
        >
          <div class="flex items-center gap-4">
            <SortHandle />
            <ContentEditable
              v-model="modules[index].name"
              class="font-bold cursor-pointer"
              tag="div"
              no-nl
              no-html
            />
            <span class="text-slate-400 text-sm slashed-zero hidden md:inline-block">
              {{ module.posts?.length ?? 0 }} Posts
            </span>
          </div>

          <div class="flex gap-2 items-center justify-end">
            <Button
              v-if="post.moduleId !== module.id"
              variant="secondary"
              size="sm"
              @click="post.moduleId = module.id"
            >
              <BookPlus class="w-4 h-4" />
              Add Posts
            </Button>
            <Button v-else size="sm" @click="post.moduleId = undefined">
              <BookMinus class="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>

        <SortableLessons v-model="modules[index].posts" :module="module" />

        <div v-if="post.moduleId == module.id" class="px-4 pt-2 ml-[3ch]">
          <Autocomplete
            v-model="post.postId"
            :options="post.postOptions"
            @search="onPostSearch"
            @update:modelValue="onPostCommit"
          />
        </div>
      </li>
    </template>
  </Sortable>
  <div>
    <Button
      variant="secondary"
      @click="modules.push(new CollectionModuleFormDto({ order: modules.length + 1 }))"
    >
      <BookPlus class="w-4 h-4" />
      Add New Module
    </Button>
  </div>
</template>
