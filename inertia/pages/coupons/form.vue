<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { Save, Trash2 } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'
import { toast } from 'vue-sonner'
import { DateTime } from 'luxon'
import CouponDurations, { CouponDurationDesc } from '#enums/coupon_durations'
import { enumKeys } from '~/lib/utils'
import PlanDto from '#dtos/plan'

type Form = {
  couponCode: string
  couponDiscountFixed: number | null
  couponDiscountPercent: number | null
  couponStartAt: string
  couponEndAt: string
  couponDurationId: number
  stripeCouponId: string
  planIds: number[]
}

defineProps<{ plans: PlanDto[] }>()

const form = useForm<Form>({
  couponCode: '',
  couponDiscountFixed: null,
  couponDiscountPercent: null,
  couponStartAt: DateTime.now().toFormat('yyyy-MM-dd'),
  couponEndAt: DateTime.now().plus({ weeks: 1 }).toFormat('yyyy-MM-dd'),
  couponDurationId: CouponDurations.FOREVER,
  stripeCouponId: '',
  planIds: [],
})

function togglePlan(plan: PlanDto) {
  if (form.planIds.includes(plan.id)) {
    form.planIds = form.planIds.filter((id) => id !== plan.id)
  } else {
    form.planIds.push(plan.id)
  }
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
            <Link route="plans.index"> Plans </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Run New Coupon</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <Button @click="form.post(tuyau.$url('coupons.run'))">
        <Save class="w-4 h-4" />
        Run Coupon
      </Button>
    </div>
  </div>

  <div class="flex gap-10">
    <div
      class="w-full flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <FormInput
        label="Coupon Code"
        v-model="form.couponCode"
        :errors="form.errors.couponCode"
        placeholder="Code customer will enter during checkout"
      />

      <FormInput
        label="Stripe Coupon ID"
        v-model="form.stripeCouponId"
        :errors="form.errors.stripeCouponId"
        placeholder="Id of the Stripe Coupon"
      />

      <FormInput
        label="Fixed Discount Amount"
        v-model="form.couponDiscountFixed"
        :errors="form.errors.couponDiscountFixed"
        type="number"
        placeholder="Cent value of fixed discount (ex: 800 = $8.00)"
      />

      <FormInput
        label="Percentage Discount Amount"
        v-model="form.couponDiscountPercent"
        :errors="form.errors.couponDiscountPercent"
        type="number"
        placeholder="Percent value of percentage discount (ex: 10 = 10%)"
      />

      <FormInput
        type="select"
        label="Coupon Duration"
        v-model="form.couponDurationId"
        :errors="form.errors.couponDurationId"
      >
        <SelectItem
          v-for="name in enumKeys(CouponDurations)"
          :key="name"
          :value="CouponDurations[name]"
        >
          {{ CouponDurationDesc[CouponDurations[name]] }}
        </SelectItem>
      </FormInput>

      <div class="flex items-center gap-4">
        <FormInput
          type="date"
          label="Start Date"
          v-model="form.couponStartAt"
          :errors="form.errors.couponStartAt"
        />

        <FormInput
          type="date"
          label="End Date"
          v-model="form.couponEndAt"
          :errors="form.errors.couponEndAt"
        />
      </div>

      <FormInput type="group" label="Plans Included in Sale" :error="form.errors.planIds">
        <Label v-for="plan in plans" :key="plan.id" class="flex items-center gap-2">
          <Checkbox :checked="form.planIds.includes(plan.id)" @update:checked="togglePlan(plan)" />
          <span>{{ plan.name }}</span>
        </Label>
      </FormInput>
    </div>
  </div>
</template>
