<script setup lang="ts">
import PostFormDto from '#dtos/post_form'
import TaxonomyDto from '#dtos/taxonomy'
import CaptionLanguages, { CaptionLanguageDesc } from '#enums/caption_languages'
import CaptionTypes, { CaptionTypeDesc } from '#enums/caption_types'
import PaywallTypes, { PaywallTypeDesc } from '#enums/paywall_types'
import PostTypes, { PostTypeDesc } from '#enums/post_types'
import States from '#enums/states'
import VideoTypes, { VideoTypeDesc, VideoTypesOrdered } from '#enums/video_types'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import {
  Plus,
  BookCheck,
  BookDashed,
  BookKey,
  BookLock,
  ChevronsUpDown,
  Trash2,
} from 'lucide-vue-next'
import { DateTime } from 'luxon'
import { computed } from 'vue'
import { tuyau } from '~/lib/tuyau'
import { enumKeys } from '~/lib/utils'

const props = defineProps<{
  post?: PostFormDto
  taxonomies: TaxonomyDto[]
}>()

const form = useForm({
  title: props.post?.title ?? '',
  slug: props.post?.slug ?? '',
  description: props.post?.description ?? '',
  pageTitle: props.post?.pageTitle ?? '',
  metaDescription: props.post?.metaDescription ?? '',
  canonical: props.post?.canonical ?? '',
  body: props.post?.body ?? '',
  repositoryUrl: props.post?.repositoryUrl ?? '',
  isFeatured: props.post?.isFeatured ?? false,
  isLive: props.post?.isLive ?? false,
  isUpdatingContent: false,
  livestreamUrl: props.post?.livestreamUrl ?? '',
  videoTypeId: props.post?.videoTypeId?.toString() ?? VideoTypes.NONE.toString(),
  videoUrl: props.post?.videoUrl ?? '',
  videoBunnyId: props.post?.videoBunnyId ?? '',
  videoSeconds: props.post?.videoSeconds ?? 0,
  timezone: props.post?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  publishAtDate: props.post?.publishAtDate ?? '',
  publishAtTime: props.post?.publishAtTime ?? '',
  postTypeId: props.post?.postTypeId.toString() ?? PostTypes.LESSON.toString(),
  stateId: props.post?.stateId.toString() ?? States.DRAFT,
  paywallTypeId: props.post?.paywallTypeId.toString() ?? PaywallTypes.NONE.toString(),
  thumbnail: {
    id: props.post?.thumbnail?.id,
    altText: props.post?.thumbnail?.altText ?? '',
    credit: props.post?.thumbnail?.credit ?? '',
  },
  captions: props.post?.captions ?? [],
  chapters: props.post?.chapters ?? [],
  taxonomyIds: props.post?.taxonomyIds ?? [],
})

const publishAt = computed(() => {
  const iso = [form.publishAtDate, form.publishAtTime].filter(Boolean).join('T')
  return iso && DateTime.fromISO(iso)
})

function secondsToTimecode(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsRemainder = seconds % 60
  return [
    hours && hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secondsRemainder && secondsRemainder.toString().padStart(2, '0'),
  ]
    .filter(Boolean)
    .join(':')
}

function onSubmit(stateId: States = Number(form.stateId)) {
  const action = form.transform((data) => {
    data.stateId = stateId
    return data
  })

  if (props.post?.id) {
    return action.put(tuyau.$url('posts.update', { params: { id: props.post.id } }))
  }

  action.post(tuyau.$url('posts.store'))
}
</script>

<template>
  <div class="flex justify-between items-center gap-3 mb-3">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="dashboard"> Dashboard </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="posts.index"> Posts </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ post?.id ? `Editing "${post.title}"` : 'New Post' }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex justify-end items-center gap-1.5">
      <Button
        v-if="!post?.id || post.stateId === States.DRAFT"
        @click="onSubmit(States.DRAFT)"
        variant="secondary"
      >
        <BookDashed class="w-4 h-4" />
        Draft
      </Button>
      <Button @click="onSubmit(States.UNLISTED)" variant="secondary">
        <BookKey class="w-4 h-4" />
        Unlisted
      </Button>
      <Button @click="onSubmit(States.PRIVATE)" variant="secondary">
        <BookLock class="w-4 h-4" />
        Private
      </Button>
      <Button @click="onSubmit(States.PUBLIC)">
        <BookCheck class="w-4 h-4" />
        <span v-if="publishAt && publishAt > DateTime.now()">
          Schedule Publish for {{ publishAt.toFormat('MMM dd, yy HH:mm') }}
        </span>
        <span v-else> Publish Now </span>
      </Button>
    </div>
  </div>

  <div class="flex gap-10">
    <div
      class="w-full lg:w-3/5 flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <FormInput
        label="Title"
        v-model="form.title"
        :errors="form.errors.title"
        :max="100"
        placeholder="My Cool Post"
        required
      />

      <FormInput
        label="Slug"
        v-model="form.slug"
        :errors="form.errors.slug"
        :max="255"
        placeholder="Will auto generate from title if left empty"
      />

      <FormInput
        type="textarea"
        label="Description"
        v-model="form.description"
        :error="form.errors.description"
        :max="255"
      />

      <Collapsible>
        <CollapsibleTrigger as-child>
          <Button variant="outline" class="w-full flex items-center justify-between">
            Search Engine Optimization (SEO)
            <ChevronsUpDown class="w-4 h-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div class="flex flex-col gap-3 py-3">
            <FormInput
              label="Page Title"
              v-model="form.pageTitle"
              :errors="form.errors.pageTitle"
              :max="100"
              placeholder="Enter a concise SEO friendly page title, uses post title when left empty"
            />

            <FormInput
              label="Meta Description"
              type="textarea"
              v-model="form.metaDescription"
              :errors="form.errors.metaDescription"
              :max="255"
              placeholder="Enter a concise SEO friendly meta description, uses post description when left empty"
            />

            <FormInput
              label="Canonical URL"
              type="url"
              v-model="form.canonical"
              :errors="form.errors.canonical"
              :max="255"
              placeholder="Cross-posting from another site? Link the original here"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <FormInput
        type="group"
        label="Publish At"
        :errors="form.errors.publishAtDate || form.errors.publishAtTime"
      >
        <DatePicker v-model:date="form.publishAtDate" v-model:time="form.publishAtTime" />
      </FormInput>

      <FormInput
        label="Mark Content as Updated"
        type="group"
        :error="form.errors.isUpdatingContent"
      >
        <div class="flex items-center gap-2">
          <Checkbox v-model:checked="form.isUpdatingContent" />
          <span>Is the content (body or video) being updated?</span>
        </div>
      </FormInput>

      <FormInput
        type="select"
        label="Lesson Type"
        v-model="form.postTypeId"
        :errors="form.errors.postTypeId"
      >
        <SelectItem
          v-for="name in enumKeys(PostTypes)"
          :key="name"
          :value="PostTypes[name].toString()"
        >
          {{ PostTypeDesc[PostTypes[name]] }}
        </SelectItem>
      </FormInput>

      <FormInput
        type="select"
        label="Paywall Type"
        v-model="form.paywallTypeId"
        :errors="form.errors.paywallTypeId"
      >
        <SelectItem
          v-for="name in enumKeys(PaywallTypes)"
          :key="name"
          :value="PaywallTypes[name].toString()"
        >
          {{ PaywallTypeDesc[PaywallTypes[name]] }}
        </SelectItem>
      </FormInput>

      <FormInput
        label="Repository URL"
        type="url"
        v-model="form.repositoryUrl"
        :errors="form.errors.repositoryUrl"
        :max="255"
        placeholder="Have code associated with this post? Provide the repository URL here"
      />

      <FormInput type="group" label="Taxonomies" :error="form.errors.taxonomyIds">
        <TaxonomyTags v-model="form.taxonomyIds" :taxonomies="taxonomies" />
      </FormInput>

      <FormInput type="group" label="Body" :error="form.errors.body">
        <TipTapEditor v-model="form.body" />
      </FormInput>
    </div>

    <div class="w-full lg:w-2/5 flex flex-col gap-4">
      <div class="-mx-3 lg:-mx-6">
        <AssetUpload
          name="thumbnail"
          idle-label="Upload Thumbnail"
          class="bg-white p-3 lg:p-6 rounded-lg border border-slate-200 shadow-xl"
          v-model="form.thumbnail"
          :asset="post?.thumbnail"
          :error="form.errors.thumbnail"
        />
      </div>

      <div class="-mx-3 lg:-mx-6">
        <div
          class="bg-white p-3 lg:p-6 rounded-lg border border-slate-200 shadow-xl flex flex-col gap-3"
        >
          <VideoPreview
            v-model:duration="form.videoSeconds"
            :video-type-id="form.videoTypeId"
            :bunny-id="form.videoBunnyId"
            :video-url="form.videoUrl"
          />

          <FormInput
            type="select"
            label="Video Source"
            v-model="form.videoTypeId"
            placeholder="Have a video? Where is it stored?"
            :errors="form.errors.videoTypeId"
          >
            <SelectItem v-for="id in VideoTypesOrdered" :key="id" :value="id.toString()">
              {{ VideoTypeDesc[id] }}
            </SelectItem>
          </FormInput>

          <FormInput
            v-if="Number(form.videoTypeId) === VideoTypes.YOUTUBE"
            label="YouTube Video URL"
            type="url"
            v-model="form.videoUrl"
            :errors="form.errors.videoUrl"
            :max="255"
            placeholder="Enter the YouTube Video URL"
          />

          <FormInput
            v-else-if="Number(form.videoTypeId) === VideoTypes.BUNNY"
            label="Bunny Video Id"
            v-model="form.videoBunnyId"
            :errors="form.errors.videoBunnyId"
            :max="500"
            placeholder="Enter the Bunny Stream Video Id"
          />

          <FormInput
            v-else-if="Number(form.videoTypeId) === VideoTypes.R2"
            label="R2 Video Id"
            v-model="form.videoUrl"
            :max="255"
            placeholder="Enter the R2 Video Id (directory name)"
          />

          <FormInput
            v-if="Number(form.videoTypeId) !== VideoTypes.NONE"
            type="group"
            label="Video Length (in seconds)"
            :error="form.errors.videoSeconds"
          >
            <NumberField v-model="form.videoSeconds">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </FormInput>

          <fieldset
            v-if="Number(form.videoTypeId) === VideoTypes.R2"
            class="border rounded-lg border-slate-300 p-4 -mx-4"
          >
            <legend class="-mx-2 px-2">Captions</legend>

            <div
              v-if="form.captions"
              v-for="(caption, index) in form.captions"
              :key="caption.id ?? caption.language"
              class="flex gap-2"
            >
              <FormInput
                type="select"
                label="Language"
                class="flex-1"
                v-model="form.captions[index].language"
              >
                <SelectItem v-for="id in CaptionLanguages" :key="id" :value="id.toString()">
                  {{ CaptionLanguageDesc[id] }}
                </SelectItem>
              </FormInput>

              <FormInput type="select" label="Type" v-model="form.captions[index].type">
                <SelectItem v-for="id in CaptionTypes" :key="id" :value="id.toString()">
                  {{ CaptionTypeDesc[id] }}
                </SelectItem>
              </FormInput>

              <Button
                type="button"
                size="icon"
                variant="secondary"
                class="hover:text-red-500 mt-5"
                @click="form.captions.splice(index, 1)"
              >
                <Trash2 class="h-3 w-3" />
              </Button>
            </div>

            <Button
              type="button"
              size="sm"
              class="mt-2"
              variant="secondary"
              @click="
                form.captions.push({
                  type: CaptionTypes.SRT,
                  language: CaptionLanguages.ENGLISH,
                  label: '',
                })
              "
            >
              <Plus class="h-3 w-3" />
              Add Caption
            </Button>
          </fieldset>

          <fieldset
            v-if="Number(form.videoTypeId) === VideoTypes.R2"
            class="border rounded-lg border-slate-300 p-4 -mx-4"
          >
            <legend class="-mx-2 px-2">Chapters</legend>

            <div
              v-if="form.chapters"
              v-for="(chapter, index) in form.chapters"
              :key="chapter.id ?? chapter.start"
              class="flex gap-2"
            >
              <FormInput
                label="Start"
                class="w-[67px] text-xs"
                v-model="form.chapters[index].start"
                placeholder="00:00"
              />

              <FormInput
                label="End"
                class="w-[67px] text-xs"
                v-model="form.chapters[index].end"
                placeholder="00:00"
              />

              <FormInput
                label="Text"
                class="flex-1 text-xs"
                v-model="form.chapters[index].text"
                placeholder="Chapter text"
              />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                class="hover:text-red-500 mt-5"
                @click="form.chapters.splice(index, 1)"
              >
                <Trash2 class="h-3 w-3" />
              </Button>
            </div>

            <Button
              type="button"
              size="sm"
              class="mt-2"
              variant="secondary"
              @click="
                form.chapters.push({
                  start: form.chapters[form.chapters.length - 1]?.end ?? '00:00',
                  end: secondsToTimecode(form.videoSeconds) ?? '00:00',
                  text: '',
                })
              "
            >
              <Plus class="h-3 w-3" />
              Add Chapter
            </Button>
          </fieldset>

          <FormInput
            v-if="Number(form.videoTypeId) === VideoTypes.YOUTUBE"
            type="group"
            :error="form.errors.isLive"
          >
            <div class="flex items-center gap-2">
              <Checkbox v-model:checked="form.isLive" />
              <span>Is this a livestream?</span>
            </div>
          </FormInput>
        </div>
      </div>
    </div>
  </div>
</template>
