<script setup lang="ts">
import UserDto from '#dtos/user'
import Roles, { RoleDesc } from '#enums/roles'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { Trash2 } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'
import { enumKeys } from '~/lib/utils'

const props = defineProps<{
  user: UserDto
}>()

const form = useForm({
  roleId: props.user.roleId,
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
            <Link route="users.index"> Users </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ user.username }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <Button variant="secondary" class="hover:text-red-500">
        <Trash2 class="w-4 h-4" />
        Delete Account
      </Button>
    </div>
  </div>

  <div class="flex gap-10">
    <div
      class="w-full lg:w-1/3 flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <h4 class="text-lg font-bold">Change User's Role</h4>
      <form
        @submit.prevent="form.patch(tuyau.$url('users.update.role', { params: { id: user.id } }))"
      >
        <FormInput type="select" v-model="form.roleId" :errors="form.errors.roleId">
          <SelectItem v-for="name in enumKeys(Roles)" :key="name" :value="Roles[name]">
            {{ RoleDesc[Roles[name]] }}
          </SelectItem>
        </FormInput>

        <div class="flex justify-end mt-4">
          <Button type="submit"> Update Role </Button>
        </div>
      </form>
    </div>
  </div>
</template>
