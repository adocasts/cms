<script setup lang="ts">
import FrameworkVersionDto from '#dtos/framework_version'
import { Link as ILink, router } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import useConfirmDestroyDialog from '~/composables/use_confirm_destroy_dialog'
import { tuyau } from '~/lib/tuyau'

const props = defineProps<{
  frameworkVersions: FrameworkVersionDto[]
}>()

const destroy = useConfirmDestroyDialog()

function onDestroy(id: number) {
  destroy.value?.show({
    title: 'Delete Framework Version?',
    message: `Are you sure you'd like to delete this framework version? Once deleted, it'll be gone forever.`,
    async onConfirm() {
      await router.delete(tuyau['framework-versions']({ id }).$url(), { preserveScroll: true })
    }
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
        <BreadcrumbItem>
          <BreadcrumbPage>Framework Versions</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <Button as-child>
        <Link route="framework_versions.create">
          <Plus class="w-4 h-4" />
          Create
        </Link>
      </Button>
    </div>
  </div>

  <div class="flex flex-col gap-3">
    <div class="bg-white shadow-xl border border-slate-200 rounded-lg overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50 border-slate-200 border-b">
          <tr>
            <th class="px-6 py-3 font-semibold text-slate-700 text-sm text-left">Name</th>
            <th class="px-6 py-3 font-semibold text-slate-700 text-sm text-left">Slug</th>
            <th class="px-6 py-3 font-semibold text-slate-700 text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fv in frameworkVersions" :key="fv.id" class="hover:bg-slate-50 border-slate-100 border-b">
            <td class="px-6 py-3 text-sm">
              <ILink
                :href="tuyau.$url('framework_versions.edit', { params: { id: fv.id } })"
                class="font-medium text-blue-600 hover:underline"
              >
                {{ fv.name }}
              </ILink>
            </td>
            <td class="px-6 py-3 text-slate-600 text-sm">{{ fv.slug }}</td>
            <td class="px-6 py-3 text-sm text-right">
              <div class="flex justify-end items-center gap-2">
                <Button
                  as-child
                  size="sm"
                  variant="ghost"
                >
                  <ILink :href="tuyau.$url('framework_versions.edit', { params: { id: fv.id } })">
                    Edit
                  </ILink>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  @click="onDestroy(fv.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
          <tr v-if="!frameworkVersions.length">
            <td colspan="3" class="px-6 py-12 text-slate-500 text-sm text-center">
              No framework versions found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
