<script setup lang="ts">
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { cn, createDebounce } from '~/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { ref } from 'vue'
import type AutocompleteDto from '#dtos/autocomplete'

defineProps<{
  options: AutocompleteDto[]
}>()

const value = defineModel<number | undefined>({ default: undefined })
const emit = defineEmits(['update:modelValue', 'search'])
const debounce = createDebounce()

const open = ref(false)
const searchTerm = ref('')
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" role="combobox" :aria-expanded="open" class="justify-between">
        {{ value ? options.find((option) => option.id === value)?.name : 'Select item...' }}

        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command
        v-model="value"
        v-model:search-term="searchTerm"
        @input="debounce(() => $emit('search', searchTerm))"
      >
        <CommandInput placeholder="Search ..." />
        <CommandEmpty>No matches found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.id"
              :value="option.id"
              @select="open = false"
            >
              <Check
                :class="cn('mr-2 h-4 w-4', value === option.id ? 'opacity-100' : 'opacity-0')"
              />
              {{ option.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
