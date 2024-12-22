<script setup lang="ts">
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'
import { Link } from '@tuyau/inertia/vue'
import { DateTime } from 'luxon'
import { useForm } from '@inertiajs/vue3'
import { tuyau } from '~/lib/tuyau'
import Roles, { RoleDesc } from '#enums/roles'
import UserDto from '#dtos/user'
import Plans, { PlanDesc } from '#enums/plans'
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  roleId: Roles
  planId: Plans
  users: SimplePaginatorDtoContract<UserDto>
  term: string
}>()

const users = ref(props.users)
const search = useForm({ term: props.term ?? '' })

watchEffect(() => (users.value = props.users))
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
        <BreadcrumbItem v-if="roleId || planId" class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="users.index"> Users </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="roleId" class="hidden md:block" />
        <BreadcrumbItem v-if="roleId">
          <BreadcrumbPage>{{ roleId ? RoleDesc[roleId] : 'Users' }}</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="planId" class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ planId ? PlanDesc[planId] : 'Users' }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-center gap-3">
      <Input
        v-model="search.term"
        placeholder="Search users ..."
        @blur="search.get(tuyau.$url('users.index'))"
      />
    </div>
  </div>

  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xl">
    <Table>
      <TableHeader class="bg-slate-100">
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users.data" :key="user.id">
          <TableCell class="text-xs">
            {{ user.id }}
          </TableCell>
          <TableCell class="text-xs">
            <Link route="users.show" :params="{ id: user.id }" class="hover:underline">
              {{ user.username }}
            </Link>
          </TableCell>
          <TableCell class="text-xs">
            <div class="flex items-center gap-1.5">
              <div class="truncate">
                {{ user.email }}
              </div>
              <span v-if="user.isEmailVerified" class="text-xs text-green-600">(Verified)</span>
            </div>
          </TableCell>
          <TableCell class="text-xs">
            {{ PlanDesc[user.planId] }}
          </TableCell>
          <TableCell class="text-xs">
            {{ DateTime.fromISO(user.createdAt).toFormat('MMM dd, yyyy') }}
            ({{ DateTime.fromISO(user.createdAt).toRelative() }})
          </TableCell>
          <TableCell class="text-xs">
            {{ DateTime.fromISO(user.updatedAt).toFormat('MMM dd, yyyy') }}
            ({{ DateTime.fromISO(user.updatedAt).toRelative() }})
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="p-3 border-t border-slate-200 flex justify-end">
      <Paginator v-model="users" />
    </div>
  </div>
</template>
