<script setup lang="ts">
import AutocompleteDto from '#dtos/autocomplete'
import CollectionDto from '#dtos/collection'
import { CollectionModuleFormDto, CollectionPostFormDto } from '#dtos/collection_content_form'
import { useForm } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import { tuyau } from '~/lib/tuyau'

type PostModuleAutocomplete = {
  moduleId?: number
  postId: number | null
  postOptions: AutocompleteDto[]
  postData: CollectionPostFormDto[]
}

const props = defineProps<{
  collection?: CollectionDto | CollectionModuleFormDto
  ignoreIds?: number[]
  nextOrder: number
}>()

const emit = defineEmits(['add'])

const post = useForm<PostModuleAutocomplete>({
  postId: null,
  postOptions: [],
  postData: [],
})

async function onPostSearch(term: string) {
  if (!term) return (post.postOptions = [])

  const ignoreIds = getIgnoreIds()
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

  adding.order = props.nextOrder

  emit('add', adding)

  post.postId = null
}

function getIgnoreIds() {
  if (props.ignoreIds) return props.ignoreIds
  return props.collection?.posts.map((post) => post.id) ?? []
}
</script>

<template>
  <div>
    <Autocomplete
      v-model="post.postId"
      :options="post.postOptions"
      @search="onPostSearch"
      @update:modelValue="onPostCommit"
    />
  </div>
</template>
