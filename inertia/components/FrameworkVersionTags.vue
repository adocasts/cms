<script setup lang="ts">
import FrameworkVersionDto from '#dtos/framework_version'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from 'radix-vue'
import { computed, ref } from 'vue'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '~/components/ui/command'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '~/components/ui/tags-input'

const props = defineProps<{
  modelValue: number[]
  frameworkVersions: FrameworkVersionDto[]
}>()

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const searchTerm = ref('')
const internalValue = computed({
  get: () =>
    props.modelValue.map((id) => {
      const fv = props.frameworkVersions.find((item) => item.id === id)
      return fv?.name ?? 'N/A'
    }),
  set: (value) => {
    const ids = value.map((name) => {
      const fv = props.frameworkVersions.find((item) => item.name === name)
      return fv?.id
    })

    emit('update:modelValue', ids)
  },
})

const options = computed(() => props.frameworkVersions.filter((i) => !props.modelValue.includes(i.id)))
</script>

<template>
  <TagsInput class="gap-0 px-0" :model-value="internalValue">
    <div class="flex flex-wrap items-center gap-2 px-3">
      <TagsInputItem v-for="item in internalValue" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot
      v-model="internalValue"
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="w-full"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Search framework versions..." as-child>
          <TagsInputInput
            class="px-3 w-full"
            :class="internalValue.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="data-[side=left]:slide-in-from-right-2 data-[side=top]:slide-in-from-bottom-2 bg-popover data-[side=bottom]:slide-in-from-top-2 data-[side=right]:slide-in-from-left-2 shadow-md mt-2 border rounded-md outline-none w-[--radix-popper-anchor-width] text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="item in options"
                :key="item.id"
                :value="item.name"
                @select.prevent="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = ''
                      internalValue = [...internalValue, ev.detail.value]
                    }

                    if (options.length === 0) {
                      open = false
                    }
                  }
                "
              >
                {{ item.name }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>
