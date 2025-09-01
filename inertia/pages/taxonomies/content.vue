<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { BookCheck } from 'lucide-vue-next'
import { unref } from 'vue'
import { tuyau } from '~/lib/tuyau'
import TaxonomyDto from '#dtos/taxonomy'
import PostDto from '#dtos/post'

const props = defineProps<{
  taxonomy: TaxonomyDto
  posts: PostDto[]
}>()

const form = useForm({
  posts: unref(props.posts),
})

async function onSubmit() {
  const action = form.transform((data) => ({
    postIds: data.posts.map((post) => post.id),
  }))

  await action.put(tuyau.$url('taxonomies.update.content', { params: { id: props.taxonomy.id } }), {
    preserveScroll: true,
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
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="taxonomies.index"> Taxonomies </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="taxonomies.edit" :params="{ id: taxonomy.id }">
              {{ taxonomy.name }}
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
      <PostAutocomplete
        :ignore-ids="form.posts.map((post) => post.id)"
        :next-order="form.posts.length + 1"
        @add="form.posts.push($event)"
      />

      <SortableLessons v-model="form.posts" />
    </div>
  </div>
</template>
