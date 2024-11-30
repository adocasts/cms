<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Commands from '~/lib/tiptap/commands'
import { getSuggestions } from '~/lib/tiptap/commands/suggestions'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import CodeBlock from '@tiptap/extension-code-block'
import { languages } from '~/lib/tiptap/languages'
import Blockquote from '@tiptap/extension-blockquote'
import Dropcursor from '@tiptap/extension-dropcursor'
import HardBreak from '@tiptap/extension-hard-break'
import CharacterCount from '@tiptap/extension-character-count'
import YouTube from '@tiptap/extension-youtube'
import { createImageExtension } from '~/lib/tiptap/upload_image'
import Image from '@tiptap/extension-image'
import { Typography } from '@tiptap/extension-typography'
import { tuyau } from '~/lib/tuyau'
import AssetTypes from '#enums/asset_types'
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue', 'blur'])
const tippy = ref()

const { commandState, suggestion } = getSuggestions(tippy)
console.log({ commandState, suggestion })
const editor = useEditor({
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base m-4 focus:outline-none',
    },
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Type / to see available commands ...',
    }),
    YouTube.configure({
      width: 1280,
      height: 720,
    }),
    Link.configure({
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        target: '_blank',
        rel: 'nofollow noopener noreferrer',
      },
    }),
    Blockquote.configure({}),
    Dropcursor.configure({}),
    HardBreak.configure({}),
    Image.configure({}),
    Typography.configure({
      openDoubleQuote: false,
      closeDoubleQuote: false,
      openSingleQuote: false,
      closeSingleQuote: false,
    }),
    CodeBlock.configure({
      languageClassPrefix: 'language-',
      HTMLAttributes: {
        class: 'code-block',
      },
    }).extend({
      addNodeView() {
        return (props) => {
          const container = document.createElement('div')
          container.classList.add('code-block', 'relative')
          container.dataset.nodeViewWrapper = ''

          const content = document.createElement('pre')
          const code = document.createElement('code')

          code.setAttribute('style', 'whitespace: pre-wrap;')
          content.append(code)
          container.append(content)

          const selector = document.createElement('select') as HTMLSelectElement
          selector.classList.add(
            'absolute',
            'top-1',
            'right-1',
            'rounded',
            'text-xs',
            'text-gray-200',
            'bg-gray-900',
            'border-gray-800',
            'px-2',
            'py-1'
          )
          selector.contentEditable = 'false'
          selector.addEventListener('change', (e) => {
            const view = props.editor.view
            const language = (e.target as HTMLInputElement).value
            view.dispatch(view.state.tr.setNodeMarkup(props.getPos(), undefined, { language }))
          })
          languages.map((lang) => {
            const option = document.createElement('option')
            option.value = lang.code
            option.textContent = lang.name
            option.selected = lang.code === props.node.attrs.language
            selector.append(option)
          })
          container.append(selector)

          return {
            dom: container,
            contentDOM: content,
          }
        }
      },
    }),
    Commands.configure({
      suggestion,
    }),
    createImageExtension(uploadImage),
  ],
  onUpdate: (event) => {
    emit('update:modelValue', event.editor.getHTML())
  },
  onBlur: (event) => {
    emit('blur', event.editor.getHTML())
  },
})

async function uploadImage(file: File) {
  const resp = await tuyau
    .$route('assets.store', { typeId: AssetTypes.CONTENT })
    .$post({ content: file })

  return resp.data.filename
}
</script>

<template>
  <div v-if="editor" class="relative border border-slate-200 rounded-md">
    <editor-content :editor="editor" />
  </div>
  <tippy-singleton ref="tippy" trigger="manual" arrow>
    <template #content>
      <div
        class="items flex flex-col bg-slate-200/90 backdrop-blur-lg border border-slate-300/50 shadow-xl rounded-md p-2"
      >
        <template v-for="(item, index) in commandState.items" :key="item.name">
          <button
            class="block py-1 item flex items-center gap-1.5 w-full pl-1 py-1 pr-12 rounded-lg text-left"
            :class="{ 'bg-slate-300': commandState.selectedIndex === index }"
            @click="commandState.onClick(index)"
          >
            <template x-if="item.icon">
              <div
                class="w-6 h-6 flex items-center justify-center bg-slate-300 rounded-md"
                :class="{ 'bg-slate-400': commandState.selectedIndex === index }"
                v-html="item.icon"
              ></div>
            </template>
            <div class="title text-left" x-text="item.title"></div>
          </button>
        </template>
        <div v-show="!commandState.items.length" class="text-slate-600">No results found</div>
      </div>
    </template>
  </tippy-singleton>
</template>

<style scoped>
:deep(.tiptap) p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
