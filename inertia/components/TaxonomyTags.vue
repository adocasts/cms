<script setup lang="ts">
import { TreeContract } from '#actions/utils/tree'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '~/components/ui/command'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '~/components/ui/tags-input'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from 'radix-vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: number[]
  taxonomies: TreeContract[]
}>()

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const searchTerm = ref('')
const internalValue = computed({
  get: () =>
    props.modelValue.map((id) => {
      const taxonomy = props.taxonomies.find((item) => item.id === id)
      return taxonomy?.name ?? 'N/A'
    }),
  set: (value) => {
    const ids = value.map((name) => {
      const taxonomy = props.taxonomies.find((item) => item.name === name)
      return taxonomy?.id
    })
    //.filter(Boolean)

    console.log({ value, ids })

    emit('update:modelValue', ids)
  },
})

const options = computed(() => props.taxonomies.filter((i) => !props.modelValue.includes(i.id)))
</script>

<template>
  <TagsInput class="px-0 gap-0" :model-value="internalValue">
    <div class="flex gap-2 flex-wrap items-center px-3">
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
        <ComboboxInput placeholder="Search taxonomies..." as-child>
          <TagsInputInput
            class="w-full px-3"
            :class="internalValue.length > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
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
