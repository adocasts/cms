<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { Save, Trash2 } from 'lucide-vue-next'
import { tuyau } from '~/lib/tuyau'
import useConfirmDestroyDialog from '~/composables/use_confirm_destroy_dialog'
import { toast } from 'vue-sonner'
import PlanDto from '#dtos/plan'

const props = defineProps<{
  plan?: PlanDto
}>()

const destroy = useConfirmDestroyDialog()
const form = useForm({
  name: props.plan?.name ?? '',
  slug: props.plan?.slug ?? '',
  description: props.plan?.description ?? '',
  stripePriceId: props.plan?.stripePriceId ?? '',
  stripePriceTestId: props.plan?.stripePriceTestId ?? '',
  price: props.plan?.price ?? 0,
  isActive: props.plan?.isActive ?? true,
})

function onSubmit() {
  if (props.plan?.id) {
    return form.put(tuyau.$url('plans.update', { params: { id: props.plan.id } }))
  }

  form.post(tuyau.$url('plans.store'))
}

function onDelete() {
  const plan = props.plan

  if (!plan) return toast.error('Plan not found')

  destroy.value?.show({
    title: 'Delete Plan?',
    message: `Are you sure you'd like to delete the plan "${plan.name}"? Once deleted, it'll be gone forever.`,
    async onConfirm() {
      await router.delete(tuyau.plans({ id: plan.id }).$url())
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
            <Link route="plans.index"> Plans </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ plan?.id ? `Editing "${plan.name}"` : 'New Plan' }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <TooltipProvider v-if="Number(plan?.meta.users_count) > 0">
        <Tooltip>
          <TooltipTrigger>
            <Button variant="secondary" class="hover:text-red-500" disabled>
              <Trash2 class="w-4 h-4" />
              Delete Plan
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p class="text-sm text-slate-500">
              You can't delete a plan that has users assigned to it.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button v-else-if="plan" variant="secondary" class="hover:text-red-500" @click="onDelete">
        <Trash2 class="w-4 h-4" />
        Delete Plan
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
        placeholder="My Cool Plan"
        required
      />

      <FormInput
        label="Slug"
        v-model="form.slug"
        :errors="form.errors.slug"
        placeholder="Will be generated from name if left empty"
      />

      <FormInput
        type="textarea"
        label="Description"
        v-model="form.description"
        :error="form.errors.description"
        :max="255"
      />

      <FormInput
        label="Stripe Price ID"
        v-model="form.stripePriceId"
        :errors="form.errors.stripePriceId"
        placeholder="The production id for the product price"
      />

      <FormInput
        label="Stripe Price Test ID"
        v-model="form.stripePriceTestId"
        :errors="form.errors.stripePriceTestId"
        placeholder="The test id for the product price"
      />

      <FormInput
        label="Price"
        v-model="form.price"
        :errors="form.errors.price"
        type="number"
        placeholder="99.99"
      />

      <FormInput type="group" :error="form.errors.isActive">
        <div class="flex items-center gap-2">
          <Checkbox v-model:checked="form.isActive" />
          <span>Plan is active</span>
        </div>
      </FormInput>
    </div>
  </div>
</template>
