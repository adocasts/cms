<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: string
    modelValue?: string | number
    placeholder?: string
    label?: string
    error?: string
    disabled?: boolean
    required?: boolean
    max?: number
  }>(),
  {
    type: 'string',
  }
)

const emits = defineEmits(['update:modelValue', 'blur'])

const inputEl = ref()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

defineExpose({ inputEl })
</script>

<template>
  <div class="grid gap-1">
    <Label class="grid gap-1">
      <span v-if="label">{{ label }} </span>
      <div v-if="type === 'color'" class="relative w-full items-center">
        <input
          v-model="internalValue"
          :type="type"
          :class="{ 'absolute start-2 inset-y-2 w-6 h-6 rounded': type === 'color' }"
          :disabled="disabled"
          @blur="$emit('blur')"
        />
        <Input
          ref="inputEl"
          v-model="internalValue"
          class="pl-10"
          :disabled="disabled"
          :placeholder="placeholder"
          :required="required"
          @blur="$emit('blur')"
        />
      </div>
      <Select
        v-else-if="type === 'select'"
        v-model="internalValue"
        ref="inputEl"
        :disabled="disabled"
        :required="required"
        @blur="$emit('blur')"
      >
        <SelectTrigger>
          <slot name="trigger">
            <SelectValue :placeholder="placeholder" />
          </slot>
        </SelectTrigger>
        <SelectContent>
          <slot />
        </SelectContent>
      </Select>
      <Textarea
        v-else-if="type === 'textarea'"
        v-model="internalValue"
        ref="inputEl"
        :disabled="disabled"
        @blur="$emit('blur')"
      />
      <slot v-else-if="type === 'group'" />
      <Input
        v-else
        v-model="internalValue"
        ref="inputEl"
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
        :required="required"
        @blur="$emit('blur')"
      />
    </Label>
    <div class="flex items-center justify-between gap-3">
      <div v-if="error" class="flex-1 text-red-500 text-xs">
        {{ error }}
      </div>
      <div v-else></div>
      <div v-if="typeof internalValue === 'string' && max" class="text-slate-500 text-xs">
        {{ internalValue.length }} / {{ max }}
      </div>
      <div v-else-if="typeof internalValue === 'number' && max" class="text-slate-500 text-xs">
        Max of {{ max }}
      </div>
    </div>
  </div>
</template>
