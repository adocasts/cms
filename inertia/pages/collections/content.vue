<script setup lang="ts">
import CollectionDto from '#dtos/collection'
import PostDto from '#dtos/post'
import { CollectionModuleFormDto, CollectionPostFormDto } from '#dtos/collection_content_form'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { BookCheck } from 'lucide-vue-next'
import { unref } from 'vue'

const props = defineProps<{
  collection: CollectionDto
  modules: CollectionDto[]
  posts: PostDto[]
}>()

const form = useForm({
  subcollections: CollectionModuleFormDto.fromArray(unref(props.modules)),
  posts: CollectionPostFormDto.fromArray(unref(props.posts)),
})
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
      <Button @click="">
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
    </div>
  </div>
</template>
