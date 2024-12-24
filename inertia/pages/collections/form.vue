<script setup lang="ts">
import CollectionDto from '#dtos/collection'
import TaxonomyDto from '#dtos/taxonomy'
import CollectionTypes, { CollectionTypeDesc } from '#enums/collection_types'
import Difficulties, { DifficultyDesc } from '#enums/difficulties'
import States from '#enums/states'
import Status, { StatusDesc } from '#enums/status'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { BookCheck, BookKey, BookLock, ChevronsUpDown } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'
import { enumKeys } from '~/lib/utils'

const props = defineProps<{
  collection?: CollectionDto
  taxonomies: TaxonomyDto[]
}>()

const form = useForm({
  name: props.collection?.name ?? '',
  slug: props.collection?.slug ?? '',
  description: props.collection?.description ?? '',
  pageTitle: props.collection?.pageTitle ?? '',
  metaDescription: props.collection?.metaDescription ?? '',
  youtubePlaylistUrl: props.collection?.youtubePlaylistUrl ?? '',
  repositoryUrl: props.collection?.repositoryUrl ?? '',
  collectionTypeId: props.collection?.collectionTypeId ?? CollectionTypes.SERIES,
  stateId: props.collection?.stateId ?? States.UNLISTED,
  statusId: props.collection?.statusId ?? Status.COMING_SOON,
  difficultyId: props.collection?.difficultyId ?? Difficulties.BEGINNER,
  asset: {
    id: props.collection?.assetId,
    altText: props.collection?.asset?.altText ?? '',
    credit: props.collection?.asset?.credit ?? '',
  },
  taxonomyIds: props.collection?.taxonomies.map((tax) => tax.id) ?? [],
})

function onSubmit(stateId: States = form.stateId) {
  const action = form.transform((data) => {
    data.stateId = stateId
    return data
  })

  if (props.collection?.id) {
    return action.put(tuyau.$url('collections.update', { params: { id: props.collection.id } }))
  }

  action.post(tuyau.$url('collections.store'))
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
        <BreadcrumbItem>
          <BreadcrumbPage>{{
            collection?.id ? `Editing "${collection.name}"` : 'New Collection'
          }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <Button @click="onSubmit(States.UNLISTED)" variant="secondary">
        <BookKey class="w-4 h-4" />
        Unlisted
      </Button>
      <Button @click="onSubmit(States.PRIVATE)" variant="secondary">
        <BookLock class="w-4 h-4" />
        Private
      </Button>
      <Button @click="onSubmit(States.PUBLIC)">
        <BookCheck class="w-4 h-4" />
        Save
      </Button>
    </div>
  </div>

  <div class="flex gap-10">
    <div
      class="w-full lg:w-3/5 flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <FormInput
        label="Title"
        v-model="form.name"
        :errors="form.errors.name"
        :max="100"
        placeholder="My Cool Collection"
        required
      />

      <FormInput
        label="Slug"
        v-model="form.slug"
        :errors="form.errors.slug"
        :max="150"
        placeholder="Will auto generate from title if left empty"
      />

      <FormInput
        type="textarea"
        label="Description"
        v-model="form.description"
        :errors="form.errors.description"
        :max="255"
      />

      <Collapsible>
        <CollapsibleTrigger as-child>
          <Button variant="outline" class="w-full flex items-center justify-between">
            Search Engine Optimization (SEO)
            <ChevronsUpDown class="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div class="flex flex-col gap-3 py-3">
            <FormInput
              label="Page Title"
              v-model="form.pageTitle"
              :errors="form.errors.pageTitle"
              :max="100"
              placeholder="Enter a concise SEO friendly page title, uses post title when left empty"
            />

            <FormInput
              type="textarea"
              label="Meta Description"
              v-model="form.metaDescription"
              :errors="form.errors.metaDescription"
              :max="255"
              placeholder="Enter a concise SEO friendly meta description, uses post description when left empty"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <FormInput
        type="select"
        label="Collection Type"
        v-model="form.collectionTypeId"
        :errors="form.errors.collectionTypeId"
      >
        <SelectItem
          v-for="name in enumKeys(CollectionTypes)"
          :key="name"
          :value="CollectionTypes[name]"
        >
          {{ CollectionTypeDesc[CollectionTypes[name]] }}
        </SelectItem>
      </FormInput>

      <FormInput
        type="select"
        label="Status"
        v-model="form.statusId"
        :errors="form.errors.statusId"
      >
        <SelectItem v-for="name in enumKeys(Status)" :key="name" :value="Status[name]">
          {{ StatusDesc[Status[name]] }}
        </SelectItem>
      </FormInput>

      <FormInput
        type="select"
        label="Difficulty"
        v-model="form.difficultyId"
        :errors="form.errors.difficultyId"
      >
        <SelectItem v-for="name in enumKeys(Difficulties)" :key="name" :value="Difficulties[name]">
          {{ DifficultyDesc[Difficulties[name]] }}
        </SelectItem>
      </FormInput>

      <FormInput
        label="Repository URL"
        type="url"
        v-model="form.repositoryUrl"
        :errors="form.errors.repositoryUrl"
        :max="255"
        placeholder="Have code associated with this collection? Provide the repository URL here"
      />

      <FormInput
        label="YouTube Playlist URL"
        type="url"
        v-model="form.youtubePlaylistUrl"
        :errors="form.errors.youtubePlaylistUrl"
        :max="255"
        placeholder="Have a YouTube playlist for this series? Link it here"
      />

      <FormInput type="group" label="Taxonomies" :error="form.errors.taxonomyIds">
        <TaxonomyTags v-model="form.taxonomyIds" :taxonomies="taxonomies" />
      </FormInput>
    </div>

    <div class="w-full lg:w-2/5 flex flex-col gap-4">
      <div class="-mx-3 lg:-mx-6">
        <AssetUpload
          name="thumbnail"
          idle-label="Upload Thumbnail"
          class="bg-white p-3 lg:p-6 rounded-lg border border-slate-200 shadow-xl"
          v-model="form.asset"
          :asset="collection?.asset"
          :error="form.errors.asset"
        />
      </div>
    </div>
  </div>
</template>
