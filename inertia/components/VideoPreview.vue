<script setup lang="ts">
import VideoTypes from '#enums/video_types'
import { VideoOff } from 'lucide-vue-next'
import { computed, watch } from 'vue'

const props = defineProps<{
  duration: number
  videoTypeId: number | string | null
  videoUrl: string | null
  bunnyId: string | null
}>()

const emit = defineEmits(['update:duration'])

const videoId = computed(() => {
  if (props.videoTypeId == VideoTypes.BUNNY) return props.bunnyId
  if (props.videoTypeId == VideoTypes.YOUTUBE) return getYouTubeVideoId(props.videoUrl)
  if (props.videoTypeId == VideoTypes.R2) return props.videoUrl
})

const showEmbed = computed(() => isSourceValid(videoId.value))

function getYouTubeVideoId(source: string | null) {
  if (!source) return ''
  return source
    .replace('www.', '')
    .replace('https://youtu.be/', 'https://youtube.com/watch?v=')
    .replace('https://youtube-nocookie.com/embed/', 'https://youtube.com/watch?v=')
    .replace('https://youtube.com/embed/', 'https://youtube.com/watch?v=')
    .replace('https://youtube.com/watch?v=', '')
    .trim()
    .split('&')[0]
}

function isSourceValid(source?: string | null) {
  if (!source) return false
  if (props.videoTypeId == VideoTypes.BUNNY) return !!source
  if (props.videoTypeId == VideoTypes.YOUTUBE) return !!source.length
  if (props.videoTypeId == VideoTypes.R2) return !!source.length
}

watch(
  () => videoId.value,
  () => {
    if (props.videoTypeId == VideoTypes.YOUTUBE && showEmbed.value) {
      onYouTubeInit()
    }
  }
)

function onYouTubeInit() {
  const embedApiSrc = 'https://www.youtube.com/iframe_api'
  const exists = document.querySelector(`script[src="${embedApiSrc}"]`)

  if (!exists) {
    const tag = document.createElement('script')
    tag.src = embedApiSrc
    document.body.appendChild(tag)
  }

  //@ts-ignore
  window.onYouTubeIframeAPIReady = function () {
    const player = new YT.Player('youtubeVideoPreviewEmbed', {
      videoId: videoId.value!,
      events: {
        onReady: () => emit('update:duration', player.getDuration()),
      },
    })
  }
}

function onVideoReady(event: any) {
  emit('update:duration', Math.round(event.target.duration))
}
</script>

<template>
  <div
    v-if="videoTypeId == VideoTypes.BUNNY"
    class="aspect-video rounded overflow-hidden bg-gray-100 shadow-inner"
  >
    <div
      v-show="!showEmbed"
      class="text-gray-700 flex flex-col h-full w-full items-center justify-center"
    >
      <VideoOff class="w-12 h-12" />
      <h4 class="font-semibold">No Video</h4>
      <p class="text-xs">Enter a valid video id to add a video to this post</p>
    </div>
    <video v-if="showEmbed" controls @loadedmetadata="onVideoReady">
      <source
        :src="`https://videos.adocasts.com/${bunnyId}/play_480p.mp4`"
        size="480"
        type="video/mp4"
      />
    </video>
  </div>
  <div
    v-else-if="videoTypeId == VideoTypes.R2"
    class="aspect-video rounded overflow-hidden bg-gray-100 shadow-inner"
  >
    <div
      v-show="!showEmbed"
      class="text-gray-700 flex flex-col h-full w-full items-center justify-center"
    >
      <VideoOff class="w-12 h-12" />
      <h4 class="font-semibold">No Video</h4>
      <p class="text-xs">Enter a valid video id to add a video to this post</p>
    </div>
    <video v-if="showEmbed" controls @loadedmetadata="onVideoReady">
      <source :src="`https://vid.adocasts.com/${videoUrl}/video.mp4`" size="480" type="video/mp4" />
    </video>
  </div>
  <div
    v-else-if="videoTypeId == VideoTypes.YOUTUBE"
    class="aspect-video rounded overflow-hidden bg-gray-100 shadow-inner"
  >
    <div
      v-show="!showEmbed"
      class="text-gray-700 flex flex-col h-full w-full items-center justify-center"
    >
      <VideoOff class="w-12 h-12" />
      <h4 class="font-semibold">No Video</h4>
      <p class="text-xs">Enter a valid youtube video url to add a video to this post</p>
    </div>
    <div id="youtubeVideoPreviewEmbed" class="w-full" v-once></div>
  </div>
</template>
