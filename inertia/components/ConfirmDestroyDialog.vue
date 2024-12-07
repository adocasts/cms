<script setup lang="ts">
import { computed, ref } from 'vue'

export type ShowProps = {
  title: string
  message?: string
  cancelText?: string
  actionText?: string
  actionUrl?: string
  actionData?: Record<string, any>
  onConfirm?: () => void
  onCancel?: () => void
}

type DestroyState = {
  url: string
  data: Record<string, any>
}

type CallbackState = {
  confirm: null | (() => void)
  cancel: null | (() => void)
}

const props = defineProps<{ isOpen: boolean }>()

const isOpen = ref(props.isOpen ?? false)

const text = ref({
  title: '',
  message: '',
  cancel: 'Cancel',
  action: 'Delete',
})

const destroy = ref<DestroyState>({
  url: '',
  data: {},
})

const callbacks = ref<CallbackState>({
  confirm: null,
  cancel: null,
})

const emit = defineEmits(['update:open', 'confirm', 'cancel'])

function show(props: ShowProps) {
  text.value.title = props.title ? props.title : ''
  text.value.message = props.message ? props.message : ''
  text.value.cancel = props.cancelText ? props.cancelText : 'Cancel'
  text.value.action = props.actionText ? props.actionText : 'Delete'
  callbacks.value.confirm = props.onConfirm ? props.onConfirm : null
  callbacks.value.cancel = props.onCancel ? props.onCancel : null
  destroy.value.url = props.actionUrl ? props.actionUrl : ''
  destroy.value.data = props.actionData ? props.actionData : {}
  isOpen.value = true
}

function hide() {
  isOpen.value = false
}

function onAction() {
  emit('confirm')

  if (typeof callbacks.value.confirm === 'function') {
    callbacks.value.confirm()
  }

  hide()
}

function onCancel() {
  emit('cancel')

  if (typeof callbacks.value.cancel === 'function') {
    callbacks.value.cancel()
  }

  hide()
}

defineExpose({ show, hide })
</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ text.title }}</AlertDialogTitle>
        <AlertDialogDescription>
          <slot>
            {{ text.message }}
          </slot>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel">{{ text.cancel }}</AlertDialogCancel>
        <AlertDialogAction as-child>
          <Link
            v-if="destroy.url"
            :href="destroy.url"
            method="delete"
            :data="destroy.data"
            as="button"
            @click="onAction"
            preserve-scroll
          >
            {{ text.action }}
          </Link>
          <Button v-else type="button" variant="destructive" @click="onAction">
            {{ text.action }}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
