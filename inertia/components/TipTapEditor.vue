<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Commands from '~/lib/tiptap/commands'
import { getSuggestions } from '~/lib/tiptap/commands/suggestions'
import Blockquote from '@tiptap/extension-blockquote'
import Dropcursor from '@tiptap/extension-dropcursor'
import HardBreak from '@tiptap/extension-hard-break'
import YouTube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import { Typography } from '@tiptap/extension-typography'
import AssetTypes from '#enums/asset_types'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import UploadImage from '~/lib/tiptap/upload_image'
import axios from 'axios'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue', 'blur'])
const { suggestion } = getSuggestions()
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
    CodeBlockShiki.configure({
      defaultTheme: 'github-dark',
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

          const selector = document.createElement('div') as HTMLDivElement
          selector.classList.add(
            'absolute',
            'top-1',
            'right-1',
            'rounded',
            'text-xs',
            'text-slate-200',
            'bg-slate-600',
            'border',
            'border-slate-700',
            'px-2',
            'py-1'
          )

          selector.textContent = props.node.attrs.language ?? 'plaintext'
          container.append(selector)

          return {
            dom: container,
            contentDOM: content,
          }
        }
      },
      onDestroy() {},
    }),
    Commands.configure({
      suggestion,
    }),
    UploadImage.configure({
      uploadFn: uploadImage,
    }),
  ],
  onUpdate: (event) => {
    emit('update:modelValue', event.editor.getHTML())
  },
  onBlur: (event) => {
    emit('blur', event.editor.getHTML())
  },
})

async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('content', file)

  const { data } = await axios.post(`/assets/${AssetTypes.CONTENT}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return `/assets/${data.filename}`
}
</script>

<template>
  <div v-if="editor" class="relative border border-slate-200 rounded-md">
    <editor-content :editor="editor" />
  </div>
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
