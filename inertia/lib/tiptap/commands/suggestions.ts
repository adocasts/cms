import { commandList } from './list'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import { TippyComponent, TippyContent, TippyOptions, useTippy } from 'vue-tippy'
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

export const getSuggestions = ({ isBasic = false, isFreeUser = false } = {}) => {
  let state: SuggestionProps
  let tippy: UseTippyInstance

  const commandState = ref<CommandState>({
    selectedIndex: 0,
    items: [],
    open(props: SuggestionProps) {
      tippy = useTippy(document.getElementById('portal')!, {
        theme: 'translucent',
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
      const item = this.items[index]

      if (item) {
        state.command(item)
      }
    },
    onKeyDown({ event }: SuggestionKeyDownProps) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
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
            state = props
            commandState.value.items = props.items
            commandState.value.open(props)
          },

          onUpdate(props: SuggestionProps) {
            state = props

            commandState.value.selectedIndex = 0
            commandState.value.items = props.items

            tippy.setProps({
              getReferenceClientRect: () => props.clientRect!()!,
            })
          },

          onKeyDown(props: SuggestionKeyDownProps) {
            if (props.event.key === 'Escape') {
              this.onExit()
              return true
            }

            return commandState.value.onKeyDown(props)
          },

          onExit() {
            commandState.value.close()
          },
        }
      },
    },
  }
}
