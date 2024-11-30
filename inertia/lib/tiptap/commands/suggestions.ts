import { commandList } from './list'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import { TippyComponent, TippyContent, TippyInstance, TippyOptions, useTippy } from 'vue-tippy'
import { h, Ref, ref } from 'vue'
import TipTapCommandPallete from '~/components/TipTapCommandPallete.vue'
import { Instance, Props } from 'tippy.js'

export type UseTippyInstance = {
  tippy: Ref<Instance<Props> | undefined>
  refresh: () => void
  refreshContent: () => void
  setContent: (value: TippyContent) => void
  setProps: (value: TippyOptions) => void
  destroy: () => void
  hide: () => void
  show: () => void
  disable: () => void
  enable: () => void
  unmount: () => void
  mount: () => void
  state: Ref<{
    isEnabled: boolean
    isVisible: boolean
    isDestroyed: boolean
    isMounted: boolean
    isShown: boolean
  }>
}

export type CommandState = {
  selectedIndex: number
  items: SuggestionProps['items']
  open(props: SuggestionProps): void
  close(): void
  onClick(index: number): void
  onKeyDown(props: SuggestionKeyDownProps): boolean
  upHandler(): void
  downHandler(): void
  enterHandler(): void
}

export const getSuggestions = (
  popup: Ref<TippyComponent>,
  { isBasic = false, isFreeUser = false } = {}
) => {
  let state: SuggestionProps
  let tippy: UseTippyInstance

  const commandState = ref<CommandState>({
    selectedIndex: 0,
    items: [],
    open(props: SuggestionProps) {
      tippy = useTippy(document.getElementById('portal')!, {
        allowHTML: true,
        getReferenceClientRect: () => props.clientRect!()!,
        appendTo: () => document.getElementById('context')!,
        content: h(TipTapCommandPallete, {
          commandState,
        }),
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      })
    },
    close() {
      tippy.destroy()
    },
    onClick(index: number) {
      console.log({ index, item: this.items[index] })
      const item = this.items[index]

      if (item) {
        state.command(item)
      }

      this.close()
    },
    onKeyDown({ event }: SuggestionKeyDownProps) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        // call('tiptapCommand', 'upHandler')
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        // call('tiptapCommand', 'downHandler')
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        // call('tiptapCommand', 'enterHandler')
        return true
      }

      return false
    },
    upHandler() {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },
    enterHandler() {
      this.onClick(this.selectedIndex)
    },
  })

  function mount(name: string, data: Ref<CommandState>) {
    // console.log({
    //   singleton: popup.value.singleton,
    // })
    // popup.value.singleton.show(document.getElementById('portal'))
    // const context = document.getElementById('context')!
    // const event = new CustomEvent('mounted', { detail: { name, data } })
    // context.dispatchEvent(event)
  }

  function call(namespace: string, name: string, args?: any) {
    const context = document.getElementById('context')!
    const event = new CustomEvent('call', { detail: { namespace, name, args } })
    context.dispatchEvent(event)
  }

  return {
    commandState,

    suggestion: {
      items: ({ query }: { query: string }) => {
        return [
          ...commandList.filter((cmd) => typeof cmd.isPlusOnly !== 'boolean' || !isFreeUser),
        ].filter((item) => {
          const isTitleMatch = item.title.toLowerCase().startsWith(query.toLowerCase())
          const isNameMatch = item.name.toLowerCase().startsWith(query.toLowerCase())
          const isBasicMatch = isBasic ? item.basic !== false : true
          return isBasicMatch && (isTitleMatch || isNameMatch)
        })
      },

      render() {
        return {
          onStart: (props: SuggestionProps) => {
            console.log('onStart', { popup })
            state = props
            commandState.value.items = props.items
            commandState.value.open(props)
            //     const component = `
            //   <div class="items flex flex-col bg-slate-200/90 backdrop-blur-lg border border-slate-300/50 shadow-xl rounded-md p-2">
            //     <template x-for="(item, index) in state.tiptapCommand.items" :key="index">
            //       <button class="item flex items-center gap-1.5 w-full pl-1 py-1 pr-12 rounded-lg text-left" :class="{ 'bg-slate-300': state.tiptapCommand.selectedIndex === index }" @click="state.tiptapCommand.onClick(index)" class="block py-1">
            //         <template x-if="item.icon">
            //           <div
            //             class="w-6 h-6 flex items-center justify-center bg-slate-300 rounded-md"
            //             :class="{ 'bg-slate-400': state.tiptapCommand.selectedIndex === index }"
            //             x-html="item.icon"
            //           ></div>
            //         </template>
            //         <div class="title" class="text-left" x-text="item.title"></div>
            //       </button>
            //     </template>
            //     <div x-show="!state.tiptapCommand.items.length" class="text-slate-600">
            //       No results found
            //     </div>
            //   </div>
            // `

            // mount('tiptapCommand', commandState)
          },

          onUpdate(props: SuggestionProps) {
            console.log('onUpdate')
            state = props

            commandState.value.selectedIndex = 0
            commandState.value.items = props.items

            // mount('tiptapCommand', { ...commandState, ...props })

            popup.value.setProps({
              getReferenceClientRect: () => props.clientRect!()!,
            })
          },

          onKeyDown(props: SuggestionKeyDownProps) {
            if (props.event.key === 'Escape') {
              popup.value.hide()

              return true
            }

            return commandState.value.onKeyDown(props)
          },

          onExit() {
            // popup.destroy()
          },
        }
      },
    },
  }
}
