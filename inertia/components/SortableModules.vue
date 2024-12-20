<script setup lang="ts">
import { CollectionModuleFormDto, CollectionPostFormDto } from '#dtos/collection_content_form'
import { BookMinus, BookPlus, Trash2 } from 'lucide-vue-next'
import Sortable from 'vuedraggable'
import ContentEditable from 'vue-contenteditable'
import { computed, ref } from 'vue'
import useConfirmDestroyDialog from '~/composables/use_confirm_destroy_dialog'

const destroy = useConfirmDestroyDialog()
const modules = defineModel<CollectionModuleFormDto[]>({ default: [] })
const postEditModuleId = ref<number | undefined>(undefined)
const postModuleIndex = computed(() =>
  modules.value.findIndex((mod) => mod.id === postEditModuleId.value)
)

function onDeleteModule(module: CollectionModuleFormDto) {
  destroy.value?.show({
    title: 'Delete Module?',
    message: `Are you sure you'd like to delete the module "${module.name}"? Once deleted, it'll be gone forever and all of it's posts will be disassociated from this collection.`,
    async onConfirm() {
      modules.value = modules.value.filter((mod) => mod.id !== module.id)
    },
  })
}

function onRemovePost(post: CollectionPostFormDto) {
  modules.value[postModuleIndex.value].posts = modules.value[postModuleIndex.value].posts.filter(
    (item) => item.id !== post.id
  )
}
</script>

<template>
  <Sortable v-model="modules" group="modules" handle=".handle" item-key="id" tag="ul">
    <template #item="{ element: module, index }">
      <li class="flex flex-col border-b border-slate-200 pb-4 mb-2 scroll-mt-24">
        <div
          class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative"
        >
          <ContextMenu>
            <ContextMenuTrigger>
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
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                v-if="postEditModuleId !== module.id"
                @click="postEditModuleId = module.id"
              >
                <BookPlus class="w-3 h-3" />
                Add Post
              </ContextMenuItem>
              <ContextMenuItem v-else @click="postEditModuleId = undefined">
                <BookMinus class="w-3 h-3" />
                Cancel Add Post
              </ContextMenuItem>
              <ContextMenuItem @click="onDeleteModule(module)">
                <Trash2 class="w-3 h-3" />
                Delete Module
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <div class="flex gap-2 items-center justify-end">
            <Button
              v-if="postEditModuleId !== module.id"
              variant="secondary"
              size="sm"
              @click="postEditModuleId = module.id"
            >
              <BookPlus class="w-4 h-4" />
              Add Posts
            </Button>
            <Button v-else size="sm" @click="postEditModuleId = undefined">
              <BookMinus class="w-4 h-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              variant="secondary"
              class="hover:text-red-500"
              @click="onDeleteModule(module)"
            >
              <Trash2 class="w-4 h-4" />
              Delete Module
            </Button>
          </div>
        </div>

        <SortableLessons v-model="modules[index].posts" :module-number="index + 1" />

        <PostAutocomplete
          v-if="postEditModuleId === module.id"
          class="px-4 pt-2 ml-[3ch]"
          :collection="module"
          :next-order="(module.posts.length ?? 1) - 1"
          @add="modules[postModuleIndex].posts.push($event)"
        />
      </li>
    </template>
  </Sortable>
</template>
