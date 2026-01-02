<script setup lang="ts">
import Sortable from 'vuedraggable'
import { DateTime } from 'luxon'
import { CollectionPostFormDto } from '#dtos/collection_content_form'
import { Link } from '@tuyau/inertia/vue'
import { CalendarClock, VideoIcon, X } from 'lucide-vue-next'
import VideoTypes, { VideoTypeDesc } from '#enums/video_types'

defineProps<{
  moduleNumber?: number
}>()

const posts = defineModel<CollectionPostFormDto[]>({ default: [] })
</script>

<template>
  <Sortable
    v-model="posts"
    class="flex flex-col"
    group="posts"
    handle=".handle"
    item-key="id"
    tag="ul"
  >
    <template #item="{ element: post, index }">
      <li
        class="flex flex-wrap items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 duration-300 group draggable relative"
      >
        <div class="flex-1 max-w-full flex items-center gap-4">
          <SortHandle />

          <span class="text-slate-400 slashed-zero w-[3ch] text-sm handle cursor-move">
            <span v-if="moduleNumber">{{ moduleNumber }}.</span>{{ index }}
          </span>

          <Link
            v-if="post.id"
            route="posts.edit"
            :params="{ id: post.id }"
            class="hover:underline text-sm inline-block truncate"
          >
            {{ post.title }}
          </Link>
          <span v-else class="text-sm inline-block truncate">{{ post.title }}</span>

          <span
            v-if="post.publishAt"
            class="text-slate-400 text-xs hidden lg:flex items-center gap-2"
          >
            <CalendarClock class="w-3 h-3" />
            {{ DateTime.fromISO(post.publishAt).toRelative() }}
          </span>

          <span
            v-if="post.videoTypeId"
            class="text-slate-400 text-xs hidden lg:flex items-center gap-2"
          >
            <VideoIcon class="w-3 h-3" />
            {{ VideoTypeDesc[post.videoTypeId as VideoTypes] }}
          </span>
        </div>

        <div
          class="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 duration-300"
        >
          <Button
            size="sm"
            variant="secondary"
            class="hover:text-red-500"
            @click="posts.splice(index, 1)"
          >
            <X class="w-3 h-3" />
            Remove
          </Button>
        </div>
      </li>
    </template>
  </Sortable>
</template>
