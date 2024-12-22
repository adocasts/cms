<script setup lang="ts">
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'
import { Link } from '@tuyau/inertia/vue'
import { Link as ILink } from '@inertiajs/vue3'
import { DateTime } from 'luxon'
import { ref, watchEffect } from 'vue'
import RoleDto from '#dtos/role'
import { Plus, Users } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'

const props = defineProps<{
  roles: SimplePaginatorDtoContract<RoleDto>
  term: string
}>()

const roles = ref(props.roles)

watchEffect(() => (roles.value = props.roles))
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
          <BreadcrumbPage>Roles</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-center gap-3">
      <Button as-child>
        <Link route="roles.create">
          <Plus class="w-4 h-4" />
          New Role
        </Link>
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xl">
    <Table>
      <TableHeader class="bg-slate-100">
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="role in roles.data" :key="role.id">
          <TableCell class="text-xs">
            {{ role.id }}
          </TableCell>
          <TableCell class="text-xs">
            <Link route="roles.edit" :params="{ id: role.id }" class="hover:underline">
              {{ role.name }}
            </Link>
          </TableCell>
          <TableCell class="text-xs">
            {{ role.description }}
          </TableCell>
          <TableCell class="text-xs">
            {{ Number(role.meta.users_count).toLocaleString() }}
          </TableCell>
          <TableCell class="text-xs">
            {{ DateTime.fromISO(role.createdAt).toFormat('MMM dd, yyyy') }}
            ({{ DateTime.fromISO(role.createdAt).toRelative() }})
          </TableCell>
          <TableCell class="text-xs">
            {{ DateTime.fromISO(role.updatedAt).toFormat('MMM dd, yyyy') }}
            ({{ DateTime.fromISO(role.updatedAt).toRelative() }})
          </TableCell>
          <TableCell>
            <Button size="sm" variant="secondary" as-child>
              <ILink :href="tuyau.$url('users.index', { query: { roleId: role.id } })">
                <Users class="w-3 h-3" />
                View Users
              </ILink>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="p-3 border-t border-slate-200 flex justify-end">
      <Paginator v-model="roles" />
    </div>
  </div>
</template>
