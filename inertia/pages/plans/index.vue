<script setup lang="ts">
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'
import { Link } from '@tuyau/inertia/vue'
import { Link as ILink } from '@inertiajs/vue3'
import { DateTime } from 'luxon'
import { ref, watchEffect } from 'vue'
import RoleDto from '#dtos/plan'
import { Plus, TicketPercent, Users } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'
import PlanDto from '#dtos/plan'

const props = defineProps<{
  plans: SimplePaginatorDtoContract<PlanDto>
}>()

const plans = ref(props.plans)

watchEffect(() => (plans.value = props.plans))
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
          <BreadcrumbPage>Plans</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-center gap-3">
      <Button variant="secondary">
        <TicketPercent class="w-4 h-4" />
        Run New Coupon
      </Button>
      <Button as-child>
        <Link route="plans.create">
          <Plus class="w-4 h-4" />
          New Plan
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
          <TableHead>Users</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Coupon</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="plan in plans.data" :key="plan.id">
          <TableCell class="text-xs">
            {{ plan.id }}
          </TableCell>
          <TableCell class="text-xs">
            <Link route="plans.edit" :params="{ id: plan.id }" class="hover:underline">
              {{ plan.name }}
              <span v-if="plan.isActive" class="text-green-500 text-xs">(Active)</span>
              <span v-else class="text-red-500 text-xs">(Inactive)</span>
            </Link>
          </TableCell>
          <TableCell class="text-xs">
            {{ Number(plan.meta.users_count).toLocaleString() }}
          </TableCell>
          <TableCell class="text-xs">
            <span :class="{ 'text-slate-500 line-through': plan.hasActiveSale }">
              {{ plan.displayPrice }}
            </span>
            <span v-if="plan.hasActiveSale" class="text-green-500"
              >({{ plan.displaySalePrice }})</span
            >
          </TableCell>
          <TableCell>
            {{ plan.couponCode ?? '--' }}
          </TableCell>
          <TableCell class="text-xs">
            {{ DateTime.fromISO(plan.createdAt).toFormat('MMM dd, yyyy') }}
            ({{ DateTime.fromISO(plan.createdAt).toRelative() }})
          </TableCell>
          <TableCell class="text-xs">
            {{ DateTime.fromISO(plan.updatedAt).toFormat('MMM dd, yyyy') }}
            ({{ DateTime.fromISO(plan.updatedAt).toRelative() }})
          </TableCell>
          <TableCell>
            <Button size="sm" variant="secondary" as-child>
              <ILink :href="tuyau.$url('users.index', { query: { planId: plan.id } })">
                <Users class="w-3 h-3" />
                View Users
              </ILink>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="p-3 border-t border-slate-200 flex justify-end">
      <Paginator v-model="plans" />
    </div>
  </div>
</template>
