<script setup lang="ts">
import TaxonomyDto from '#dtos/taxonomy'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { Link as ILink } from '@inertiajs/vue3'
import { BookCheck, ChevronsUpDown, CornerLeftDown, DnaOff } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'
import { enumKeys } from '~/lib/utils'
import TaxonomyTypes, { TaxonomyTypeDesc } from '#enums/taxonomy_types'
import { computed } from 'vue'

const props = defineProps<{
  taxonomy?: TaxonomyDto
  parent?: TaxonomyDto
}>()

const rootParentId = computed(() => {
  if (props.parent?.rootParentId) return props.parent.rootParentId
  if (props.parent) return props.parent.id
  return null
})

const form = useForm({
  parentId: props.parent?.id ?? null,
  rootParentId: rootParentId.value,
  name: props.taxonomy?.name ?? '',
  slug: props.taxonomy?.slug ?? '',
  description: props.taxonomy?.description ?? '',
  pageTitle: props.taxonomy?.pageTitle ?? '',
  metaDescription: props.taxonomy?.metaDescription ?? '',
  taxonomyTypeId: props.taxonomy?.taxonomyTypeId ?? TaxonomyTypes.CONTENT,
  asset: {
    id: props.taxonomy?.assetId,
    altText: props.taxonomy?.asset?.altText ?? '',
    credit: props.taxonomy?.asset?.credit ?? '',
  },
})

function onSubmit() {
  if (props.taxonomy?.id) {
    return form.put(tuyau.$url('taxonomies.update', { params: { id: props.taxonomy.id } }))
  }

  form.post(tuyau.$url('taxonomies.store'))
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
        <BreadcrumbItem v-if="parent" class="hidden md:block">
          <BreadcrumbLink as-child>
            <ILink :href="`/taxonomies?parentId=${parent.id}`"> {{ parent.name }} </ILink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="parent" class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{
            taxonomy?.id ? `Editing "${taxonomy.name}"` : 'New Taxonomy'
          }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <Button @click="onSubmit">
        <BookCheck class="w-4 h-4" />
        Save
      </Button>
    </div>
  </div>

  <div class="flex gap-10">
    <div
      class="w-full lg:w-3/5 flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <div
        v-if="parent && form.parentId"
        class="bg-slate-50 p-3 rounded-lg flex items-center justify-between gap-3"
      >
        <div class="flex items-center gap-3 font-bold">
          <CornerLeftDown class="w-4 h-4" />
          {{ parent.name }}
        </div>
        <div class="flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            @click="(form.parentId = null) || (form.rootParentId = null)"
          >
            <DnaOff class="w-3 h-3" />
            Detach From Parent
          </Button>
        </div>
      </div>
      <FormInput
        label="Name"
        v-model="form.name"
        :errors="form.errors.name"
        :max="100"
        placeholder="My Cool Taxonomy"
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
        label="Taxonomy Type"
        v-model="form.taxonomyTypeId"
        :errors="form.errors.taxonomyTypeId"
      >
        <SelectItem
          v-for="name in enumKeys(TaxonomyTypes)"
          :key="name"
          :value="TaxonomyTypes[name]"
        >
          {{ TaxonomyTypeDesc[TaxonomyTypes[name]] }}
        </SelectItem>
      </FormInput>
    </div>

    <div class="w-full lg:w-2/5 flex flex-col gap-4">
      <div class="-mx-3 lg:-mx-6">
        <AssetUpload
          name="thumbnail"
          idle-label="Upload Thumbnail"
          class="bg-white p-3 lg:p-6 rounded-lg border border-slate-200 shadow-xl"
          v-model="form.asset"
          :asset="taxonomy?.asset"
          :error="form.errors.asset"
        />
      </div>
    </div>
  </div>
</template>
