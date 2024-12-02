<script setup lang="ts">
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { computed, ref } from 'vue'
import AssetTypes from '#enums/asset_types'
import { tuyau } from '~/lib/tuyau'
import { FilePondFile } from 'filepond'
import AssetDto from '#dtos/asset'

const props = defineProps<{
  name: string
  asset?: AssetDto
  error?: string
  idleLabel?: string
  modelValue: {
    id?: number
    altText?: string
    credit?: string
  }
}>()

const emit = defineEmits(['update:modelValue'])

const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)
const filepond = ref()
const pond = computed(() => filepond.value?._pond)

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const files = ref(
  [
    props.asset && {
      source: props.asset.filename,
      options: {
        type: 'local',
        metadata: {
          id: props.asset.id,
        },
      },
    },
  ].filter(Boolean)
)

const server = ref({
  process: {
    url: `/assets/${AssetTypes.THUMBNAIL}`,
    withCredentials: true,
  },
  fetch: {
    url: '/assets?fetch=',
    withCredentials: true,
  },
  load: {
    url: '/assets?load=',
    withCredentials: true,
  },
})

function onFilePondInit() {
  pond.value.on('processfiles', () => {
    const file = filepond.value._pond.getFiles()[0]
    const resp = JSON.parse(file.serverId)
    internalValue.value.id = resp.id
    files.value = [
      {
        source: resp.filename,
        options: {
          type: 'local',
          metadata: {
            id: resp.id,
          },
        },
      },
    ]
  })

  pond.value.on('removefile', async (_: any, file: FilePondFile) => {
    const { id } = file.getMetadata()

    if (!id) return

    await tuyau.$route('assets.destroy', { id }).$delete()
  })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <FilePond
      ref="filepond"
      :name="name"
      :label-idle="idleLabel ?? 'Upload Asset'"
      accepted-file-types="image/jpeg, image/png"
      :server="server"
      :files="files"
      @init="onFilePondInit"
    />

    <FormInput
      v-show="internalValue.id"
      label="Alt Text"
      v-model="internalValue.altText"
      :error="error"
      :placeholder="`Description of ${name}`"
    />

    <FormInput
      v-show="internalValue.id"
      label="Credit"
      v-model="internalValue.credit"
      :error="error"
      :placeholder="`Provide ${name} credit`"
    />
  </div>
</template>
