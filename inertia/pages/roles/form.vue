<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { Save, Trash2 } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'
import RoleDto from '#dtos/role'
import useConfirmDestroyDialog from '~/composables/use_confirm_destroy_dialog'
import { toast } from 'vue-sonner'

const props = defineProps<{
  role?: RoleDto
}>()

const destroy = useConfirmDestroyDialog()
const form = useForm({
  name: props.role?.name ?? '',
  description: props.role?.description ?? '',
})

function onSubmit() {
  if (props.role?.id) {
    return form.put(tuyau.$url('roles.update', { params: { id: props.role.id } }))
  }

  form.post(tuyau.$url('roles.store'))
}

function onDelete() {
  const role = props.role

  if (!role) return toast.error('Role not found')

  destroy.value?.show({
    title: 'Delete Role?',
    message: `Are you sure you'd like to delete the role "${role.name}"? Once deleted, it'll be gone forever.`,
    async onConfirm() {
      await router.delete(tuyau.roles({ id: role.id }).$url())
    },
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
            <Link route="roles.index"> Roles </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ role?.id ? `Editing "${role.name}"` : 'New Role' }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <TooltipProvider v-if="!role || Number(role?.meta.users_count) > 0">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="secondary" class="hover:text-red-500" disabled>
              <Trash2 class="w-4 h-4" />
              Delete Role
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm text-slate-500">
              You can't delete a role that has users assigned to it.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button v-else variant="secondary" class="hover:text-red-500" @click="onDelete">
        <Trash2 class="w-4 h-4" />
        Delete Role
      </Button>
      <Button @click="onSubmit">
        <Save class="w-4 h-4" />
        Save
      </Button>
    </div>
  </div>

  <div class="flex gap-10">
    <div
      class="w-full flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <FormInput
        label="Name"
        v-model="form.name"
        :errors="form.errors.name"
        placeholder="My Cool Role"
        required
      />

      <FormInput
        type="textarea"
        label="Description"
        v-model="form.description"
        :error="form.errors.description"
      />
    </div>
  </div>
</template>
