<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    cancelText?: string
    actionText?: string
    actionHref: string
    actionData?: Record<string, any>
  }>(),
  {
    cancelText: 'Cancel',
    actionText: 'Delete',
  }
)

const emits = defineEmits(['update:open', 'confirm'])

const internalOpen = computed({
  get: () => props.open,
  set: (value) => emits('update:open', value),
})
</script>

<template>
  <AlertDialog v-model:open="internalOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          <slot />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ cancelText }}</AlertDialogCancel>
        <AlertDialogAction as-child>
          <Link v-if="actionHref" :href="actionHref" method="delete" :data="actionData" as="button" preserve-scroll>
            {{ actionText }}
          </Link>
          <Button v-else type="button" variant="destructive" @click="emits('confirm')">
            {{ actionText }}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
