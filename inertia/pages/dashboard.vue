<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import type { GetDashboardCountsContract } from '#actions/dashboard/get_dashboard_counts';
import { secondsToTimestring, toLocaleString } from '~/lib/utils';

defineProps<{
  counts: GetDashboardCountsContract
}>()
</script>

<template>
  <Head title="Homepage" />

  <div class="grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Users
        </CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ toLocaleString(counts.users) }}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Posts Published
        </CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ toLocaleString(counts.posts) }}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Total Video Runtime
        </CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ secondsToTimestring(counts.postSeconds) }}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Active/Completed Series
        </CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ toLocaleString(counts.series) }}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">
          Topics Covered
        </CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          {{ toLocaleString(counts.topics) }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>