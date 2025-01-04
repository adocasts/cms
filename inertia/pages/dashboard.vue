<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import type { GetDashboardCountsContract } from '#actions/dashboard/get_dashboard_counts'
import { secondsToTimestring, toLocaleString } from '~/lib/utils'
import { nextTick, onMounted, ref } from 'vue'
import AreaChart from '~/components/ui/chart-area/AreaChart.vue'

defineProps<{
  counts: GetDashboardCountsContract
}>()

const analytics = ref<HTMLIFrameElement | null>(null)

onMounted(() => {
  setTimeout(() => {
    const height = analytics.value?.contentDocument?.body.clientHeight
    console.log({ height })
    if (height) {
      analytics.value!.style.height = `${height}px`
    }
  }, 3000)
})
</script>

<template>
  <Head title="Homepage" />

  <div class="shadow-lg mb-6 rounded-lg overflow-hidden">
    <div class="grid gap-4 md:grid-cols-3 md:gap-0 lg:grid-cols-5 bg-white">
      <Card class="-mr-px rounded-none rounded-tl-lg border-b-0 shadow-none">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> Users </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ toLocaleString(counts.users.total) }}
          </div>
        </CardContent>
      </Card>
      <Card class="-mr-px rounded-none">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> Posts Published </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ toLocaleString(counts.posts) }}
          </div>
        </CardContent>
      </Card>
      <Card class="-mr-px rounded-none">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> Total Video Runtime </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ secondsToTimestring(counts.postSeconds) }}
          </div>
        </CardContent>
      </Card>
      <Card class="-mr-px rounded-none">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> Active/Completed Series </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ toLocaleString(counts.series) }}
          </div>
        </CardContent>
      </Card>
      <Card class="rounded-none rounded-tr-lg">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> Topics Covered </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ toLocaleString(counts.topics) }}
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="bg-white border border-t-0 rounded-b-lg py-4 -m-x-px">
      <AreaChart
        class="w-full h-[225px]"
        index="month"
        :show-x-axis="true"
        :show-y-axis="true"
        :show-legend="false"
        :data="counts.users.monthly"
        :categories="['total']"
        :colors="['#6574cd']"
      />
    </div>
  </div>

  <div class="-mx-8">
    <iframe
      plausible-embed
      src="https://analytics.adocasts.com/share/adocasts.com?auth=bto1Dk1R4evg8bUsSCT7G&embed=true&theme=light&background=#ffffff"
      scrolling="no"
      frameborder="0"
      loading="lazy"
      style="width: 1px; min-width: 100%; height: 1600px"
    ></iframe>
  </div>
</template>
