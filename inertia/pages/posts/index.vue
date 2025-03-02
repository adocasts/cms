<script setup lang="ts">
import type PostDto from '#dtos/post'
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'
import { ref, watchEffect } from 'vue'
import { Link } from '@tuyau/inertia/vue'
import { StateDesc } from '#enums/states'
import PostTypes, { PostTypeDesc } from '#enums/post_types'
import { PaywallTypeDesc } from '#enums/paywall_types'
import { DateTime } from 'luxon'
import { Plus, Trash2 } from 'lucide-vue-next'
import { router, useForm } from '@inertiajs/vue3'
import { tuyau } from '~/lib/tuyau'
import useConfirmDestroyDialog from '~/composables/use_confirm_destroy_dialog'

const props = defineProps<{
  postTypeId: PostTypes
  posts: SimplePaginatorDtoContract<PostDto>
  term: string
}>()

const destroy = useConfirmDestroyDialog()
const posts = ref(props.posts)
const search = useForm({ term: props.term ?? '' })

watchEffect(() => (posts.value = props.posts))

async function onDelete(post: PostDto) {
  destroy.value?.show({
    title: 'Delete Post?',
    message: `Are you sure you'd like to delete the post "${post.title}"? Once deleted, it'll be gone forever.`,
    async onConfirm() {
      await router.delete(tuyau.posts({ id: post.id }).$url(), { preserveScroll: true })
    },
  })
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
        <BreadcrumbItem v-if="postTypeId" class="hidden md:block">
          <BreadcrumbLink as-child>
            <Link route="posts.index"> Posts </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="postTypeId" class="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{{ postTypeId ? PostTypeDesc[postTypeId] : 'Posts' }}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-center gap-3">
      <Input
        v-model="search.term"
        placeholder="Search posts ..."
        @blur="search.get(tuyau.$url('posts.index'))"
      />
      <Button :as="Link" route="posts.create">
        <Plus class="w-4 h-4" />
        New Post
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xl">
    <Table>
      <TableHeader class="bg-slate-100">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Published</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="post in posts.data" :key="post.id">
          <TableCell>
            <Link route="posts.edit" :params="{ id: post.id }" class="hover:underline">
              {{ post.title }}
            </Link>
            <div class="text-slate-600 text-xs">
              <a :href="`https://adocasts.com${post.routeUrl}`" class="hover:underline">
                {{ post.slug }}
              </a>
            </div>
          </TableCell>
          <TableCell>
            {{ post.authors.at(0)?.username }}
          </TableCell>
          <TableCell>
            {{ StateDesc[post.stateId] }}
            <div class="text-xs text-slate-600">
              {{ PaywallTypeDesc[post.paywallTypeId].split('-').at(1) }}
            </div>
          </TableCell>
          <TableCell>
            {{ PostTypeDesc[post.postTypeId] }}
          </TableCell>
          <TableCell>
            <div v-if="post.publishAt">
              <div>
                {{ DateTime.fromISO(post.publishAt).toRelative() }}
              </div>
              <div class="text-slate-600 text-xs">
                {{ DateTime.fromISO(post.publishAt).toFormat('MMM dd, yyyy H:mm') }}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Button variant="ghost" size="sm" class="hover:text-red-500" @click="onDelete(post)">
              <Trash2 class="w-3 h-3" />
              Delete
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="p-3 border-t border-slate-200 flex justify-end">
      <Paginator v-model="posts" />
    </div>
  </div>
</template>
