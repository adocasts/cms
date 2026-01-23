<script setup lang="ts">
import FrameworkVersionDto from '#dtos/framework_version'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { BookCheck } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'

const props = defineProps<{
  frameworkVersion?: FrameworkVersionDto
}>()

const form = useForm({
  name: props.frameworkVersion?.name ?? '',
  slug: props.frameworkVersion?.slug ?? '',
})

function onSubmit() {
  if (props.frameworkVersion?.id) {
    return form.put(tuyau.$url('framework_versions.update', { params: { id: props.frameworkVersion.id } }))
  }

  form.post(tuyau.$url('framework_versions.store'))
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
            <Link route="framework_versions.index"> Framework Versions </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{
            frameworkVersion?.id ? `Editing "${frameworkVersion.name}"` : 'New Framework Version'
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
      class="flex flex-col gap-4 bg-white shadow-xl p-3 lg:p-6 border border-slate-200 rounded-lg w-full lg:w-3/5"
    >
      <FormInput
        v-model="form.name"
        label="Name"
        placeholder="e.g., Vue 3, React 18, Laravel 10"
        :error="form.errors.name"
      />

      <FormInput
        v-model="form.slug"
        label="Slug"
        placeholder="e.g., vue-3, react-18, laravel-10"
        :error="form.errors.slug"
      />

      <div class="flex justify-end gap-3">
        <Button as-child variant="outline">
          <Link route="framework_versions.index">Cancel</Link>
        </Button>
        <Button @click="onSubmit">
          <BookCheck class="w-4 h-4" />
          Save Framework Version
        </Button>
      </div>
    </div>
  </div>
</template>
