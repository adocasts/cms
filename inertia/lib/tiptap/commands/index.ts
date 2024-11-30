import { Extension, Range } from '@tiptap/core'
import Suggestion, { SuggestionProps } from '@tiptap/suggestion'
import { Editor } from '@tiptap/vue-3'

export type CommandParams = { editor: Editor; range: Range; props: SuggestionProps }

export default Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: CommandParams) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
