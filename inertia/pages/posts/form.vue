<script setup lang="ts">
import AssetDto from '#dtos/asset'
import PostDto from '#dtos/post'
import TaxonomyDto from '#dtos/taxonomy'
import PaywallTypes from '#enums/paywall_types'
import PostTypes, { PostTypeDesc } from '#enums/post_types'
import States from '#enums/states'
import VideoTypes, { VideoTypeDesc } from '#enums/video_types'
import { useForm } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import { ChevronsUpDown } from 'lucide-vue-next'
import { enumKeys } from '~/lib/utils'

const props = defineProps<{
  post?: PostDto
  thumbnail?: AssetDto
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
  livestreamUrl: props.post?.livestreamUrl ?? '',
  videoTypeId: props.post?.videoTypeId ?? '',
  videoUrl: props.post?.videoUrl ?? '',
  videoBunnyId: props.post?.videoBunnyId ?? '',
  videoSeconds: props.post?.videoSeconds ?? 0,
  timezone: props.post?.timezone ?? '',
  publishAtDate: props.post?.publishAtDate ?? '',
  publishAtTime: props.post?.publishAtTime ?? '',
  postTypeId: props.post?.postTypeId ?? PostTypes.LESSON.toString(),
  stateId: props.post?.stateId ?? States.DRAFT,
  paywallTypeId: props.post?.paywallTypeId ?? PaywallTypes.NONE.toString(),
  thumbnail: {
    id: props.thumbnail?.id,
    altText: props.thumbnail?.altText,
    credit: props.thumbnail?.credit,
  },
  taxonomyIds: props.post?.taxonomies.map((row) => row.id) ?? [],
})
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
  </div>

  <div class="flex gap-10">
    <div
      class="w-full lg:w-3/5 flex flex-col gap-4 p-3 lg:p-6 bg-white shadow-xl rounded-lg border border-slate-200"
    >
      <FormInput
        label="Title"
        v-model="form.title"
        :errors="form.errors.title"
        placeholder="My Cool Post"
        required
      />

      <FormInput
        label="Slug"
        v-model="form.slug"
        :errors="form.errors.slug"
        placeholder="Will auto generate from title if left empty"
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
              placeholder="Enter a concise SEO friendly page title, uses post title when left empty"
            />

            <FormInput
              label="Meta Description"
              v-model="form.metaDescription"
              :errors="form.errors.metaDescription"
              placeholder="Enter a concise SEO friendly meta description, uses post description when left empty"
            />

            <FormInput
              label="Canonical URL"
              type="url"
              v-model="form.canonical"
              :errors="form.errors.canonical"
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
          {{ name }}
        </SelectItem>
      </FormInput>

      <FormInput
        label="Repository URL"
        type="url"
        v-model="form.repositoryUrl"
        :errors="form.errors.repositoryUrl"
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
          :asset="thumbnail"
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
            <SelectItem
              v-for="name in enumKeys(VideoTypes)"
              :key="name"
              :value="VideoTypes[name].toString()"
            >
              {{ VideoTypeDesc[VideoTypes[name]] }}
            </SelectItem>
          </FormInput>

          <FormInput
            v-if="form.videoTypeId == VideoTypes.YOUTUBE"
            label="YouTube Video URL"
            type="url"
            v-model="form.videoUrl"
            :errors="form.errors.videoUrl"
            placeholder="Enter the YouTube Video URL"
          />

          <FormInput
            v-else-if="form.videoTypeId == VideoTypes.BUNNY"
            label="Bunny Video Id"
            v-model="form.videoBunnyId"
            :errors="form.errors.videoBunnyId"
            placeholder="Enter the Bunny Stream Video Id"
          />

          <FormInput
            v-if="form.videoTypeId"
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

          <FormInput
            v-if="form.videoTypeId == VideoTypes.YOUTUBE"
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
