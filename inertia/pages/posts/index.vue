<script setup lang="ts">
import type PostDto from '#dtos/post';
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types';
import { ref, watchEffect } from 'vue';
import { Link } from '@tuyau/inertia/vue'
import { StateDesc } from '#enums/states';
import { PostTypeDesc } from '#enums/post_types';

const props = defineProps<{
  posts: SimplePaginatorDtoContract<PostDto>
}>()

const posts = ref(props.posts)

watchEffect(() => (posts.value = props.posts))
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Author</TableHead>
        <TableHead>State</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Publish Date</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="post in posts.data" :key="post.id">
        <TableCell>
          <Link route="posts.show" :params="{ id: post.id }">
            {{ post.title }}
          </Link>
          <a :href="`https://adocasts.com/${post.routeUrl}`">
            {{ post.slug }}
          </a>
        </TableCell>
        <TableCell>
          {{ post.authors.at(0)?.username }}
        </TableCell>
        <TableCell>
          {{ StateDesc[post.stateId] }}
        </TableCell>
        <TableCell>
          {{ PostTypeDesc[post.postTypeId] }}
        </TableCell>
        <TableCell>
          {{ post.publishAtDisplay }}
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
