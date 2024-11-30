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
const { suggestion } = getSuggestions()

const bubble = ref()

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
    // BubbleMenu.configure({
    //   element: bubble.value,
    // }),
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

          // const selector = document.createElement('select') as HTMLSelectElement
          // selector.classList.add(
          //   'absolute',
          //   'top-1',
          //   'right-1',
          //   'rounded',
          //   'text-xs',
          //   'text-slate-200',
          //   'bg-slate-600',
          //   'border',
          //   'border-slate-700',
          //   'px-2',
          //   'py-1'
          // )
          // selector.setAttribute('contenteditable', 'false')
          // selector.addEventListener('change', (e) => {
          //   const view = props.editor.view
          //   const language = (e.target as HTMLInputElement).value
          //   view.dispatch(view.state.tr.setNodeMarkup(props.getPos(), undefined, { language }))
          // })
          // languages.map((lang) => {
          //   const option = document.createElement('option')
          //   option.value = lang.code
          //   option.textContent = lang.name
          //   option.selected = lang.code === props.node.attrs.language
          //   selector.append(option)
          // })
          // container.append(selector)

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

function onLinkToggle() {
  if (editor.value?.isActive('link')) {
    return editor.value.commands.unsetLink()
  }

  const href = prompt('Enter the link href below')

  if (!href) return

  editor.value?.commands.setLink({ href, target: '_blank', rel: 'nofollow noopener noreferrer' })
}
</script>

<template>
  <div v-if="editor" class="relative border border-slate-200 rounded-md">
    <editor-content :editor="editor" />
  </div>
  <!-- <div ref="bubble" class="bubble-menu bg-slate-100 text-slate-700 text-sm py-1 px-2 rounded-md">
    <div v-if="editor" class="flex items-center space-x-2">
      <button
        type="button"
        @click="editor.commands.toggleHeading({ level: 3 })"
        :class="{ 'text-white': editor.isActive('h3') }"
      >
        H3
      </button>
      <button
        type="button"
        @click="editor.commands.toggleHeading({ level: 4 })"
        :class="{ 'text-white': editor.isActive('h4') }"
      >
        H4
      </button>
      <button
        type="button"
        @click="editor.commands.toggleBold()"
        :class="{ 'text-white': editor.isActive('bold') }"
      >
        Bold
      </button>
      <button
        type="button"
        @click="editor.commands.toggleItalic()"
        :class="{ 'text-white': editor.isActive('italic') }"
      >
        Italic
      </button>
      <button
        type="button"
        @click="editor.commands.toggleStrike()"
        :class="{ 'text-white': editor.isActive('strike') }"
      >
        Strike
      </button>
      <button
        type="button"
        @click="onLinkToggle"
        :class="{ 'text-white': editor.isActive('link') }"
      >
        Link
      </button>
    </div>
  </div> -->
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
