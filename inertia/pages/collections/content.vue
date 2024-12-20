<script setup lang="ts">
import CollectionDto from '#dtos/collection'
import PostDto from '#dtos/post'
import { CollectionModuleFormDto, CollectionPostFormDto } from '#dtos/collection_content_form'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { BookCheck, BookPlus } from 'lucide-vue-next'
import { ref, unref } from 'vue'
import { tuyau } from '~/lib/tuyau'

const props = defineProps<{
  collection: CollectionDto
  modules: CollectionDto[]
  posts: PostDto[]
}>()

const isAddingRootPost = ref(false)
const form = useForm({
  subcollections: CollectionModuleFormDto.fromArray(unref(props.modules)),
  posts: CollectionPostFormDto.fromArray(unref(props.posts)),
})

async function onSubmit() {
  const action = form.transform((data) => ({
    postIds: data.posts.map((post) => post.id),
    subcollections: data.subcollections.map((col) => ({
      id: col.id,
      name: col.name,
      postIds: col.posts.map((post) => post.id),
    })),
  }))

  await action.put(
    tuyau.$url('collections.update.content', { params: { id: props.collection.id } }),
    { preserveScroll: true }
  )
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
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="collections.index"> Collections </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="collections.edit" :params="{ id: collection.id }">
              {{ collection.name }}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Content</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <Button @click="onSubmit">
        <BookCheck class="w-4 h-4" />
        Update Content
      </Button>
    </div>
  </div>

  <div class="flex gap-10">
    <div
      class="w-full flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <SortableModules v-model="form.subcollections" />
      <SortableLessons v-model="form.posts" />

      <PostAutocomplete
        v-if="isAddingRootPost"
        :ignore-ids="form.posts.map((post) => post.id)"
        :next-order="form.posts.length + 1"
        @add="form.posts.push($event)"
      />

      <div class="flex items-center gap-3">
        <Button
          variant="secondary"
          @click="
            form.subcollections.push(
              new CollectionModuleFormDto({ order: form.subcollections.length + 1 })
            )
          "
        >
          <BookPlus class="w-4 h-4" />
          Add New Module
        </Button>

        <Button v-if="!isAddingRootPost" variant="secondary" @click="isAddingRootPost = true">
          <BookPlus class="w-4 h-4" />
          Add New Post
        </Button>
        <Button v-else @click="isAddingRootPost = false">
          <BookPlus class="w-4 h-4" />
          Cancel Add Post
        </Button>
      </div>
    </div>
  </div>
</template>
