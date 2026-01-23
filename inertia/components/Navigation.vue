<script setup lang="ts">
import CollectionTypes from '#enums/collection_types'
import PostTypes from '#enums/post_types'
import TaxonomyTypes from '#enums/taxonomy_types'
import { Link } from '@inertiajs/vue3'
import { EllipsisVertical, Menu, Plus } from 'lucide-vue-next'

const links = [
  {
    text: 'Desktop',
    href: '/',
  },
  {
    text: 'Posts',
    href: '/posts',
  },
  {
    text: 'Collections',
    href: '/collections',
  },
  {
    text: 'Taxonomies',
    href: '/taxonomies',
  },
  {
    text: 'Versions',
    href: '/framework-versions',
  },
  {
    text: 'Users',
    href: '/users',
  },
  {
    text: 'Roles',
    href: '/roles',
  },
  {
    text: 'Plans',
    href: '/plans',
  },
]
</script>

<template>
  <nav
    class="hidden md:flex md:flex-row flex-col md:items-center gap-6 md:gap-5 lg:gap-6 font-medium md:text-sm text-lg"
  >
    <Link href="/" class="flex items-center gap-2 font-semibold md:text-base text-lg">
      <img
        class="w-auto h-6 md:h-7 logo-black"
        src="../assets/logo-black.svg"
        alt="Adocasts"
        width="146px"
        height="28px"
      />
      <span class="sr-only">Adocasts</span>
      <span>CMS</span>
    </Link>

    <Menubar class="border-none">
      <MenubarMenu>
        <MenubarTrigger :as="Link" href="/">Dashboard</MenubarTrigger>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Posts</MenubarTrigger>
        <MenubarContent>
          <MenubarItem :as="Link" href="/posts"> All Posts </MenubarItem>
          <MenubarItem :as="Link" :href="`/posts?postTypeId=${PostTypes.LESSON}`">
            Lessons
          </MenubarItem>
          <MenubarItem :as="Link" :href="`/posts?postTypeId=${PostTypes.LIVESTREAM}`">
            Livestreams
          </MenubarItem>
          <MenubarItem :as="Link" :href="`/posts?postTypeId=${PostTypes.NEWS}`"> News </MenubarItem>
          <MenubarItem :as="Link" :href="`/posts?postTypeId=${PostTypes.BLOG}`">
            Blogs
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem :as="Link" href="/posts/create">
            <Plus class="w-4 h-4" />
            New Post
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Collections</MenubarTrigger>
        <MenubarContent>
          <MenubarItem :as="Link" href="/collections"> All Collections </MenubarItem>
          <MenubarItem :as="Link" :href="`/collections?collectionTypeId=${CollectionTypes.SERIES}`">
            Series
          </MenubarItem>
          <MenubarItem
            :as="Link"
            :href="`/collections?collectionTypeId=${CollectionTypes.PLAYLIST}`"
          >
            Playlists
          </MenubarItem>
          <MenubarItem :as="Link" :href="`/collections?collectionTypeId=${CollectionTypes.PATH}`">
            Learning Paths
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem :as="Link" href="/collections/create">
            <Plus class="w-4 h-4" />
            New Collection
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Taxonomies</MenubarTrigger>
        <MenubarContent>
          <MenubarItem :as="Link" href="/taxonomies"> All Taxonomies </MenubarItem>
          <MenubarItem :as="Link" :href="`/taxonomies?taxonomyTypeId=${TaxonomyTypes.CONTENT}`">
            Content Taxonomies
          </MenubarItem>
          <MenubarItem :as="Link" :href="`/taxonomies?taxonomyTypeId=${TaxonomyTypes.DISCUSSION}`">
            Discussion Taxonomies
          </MenubarItem>
          <MenubarItem :as="Link" href="/taxonomies?rootParentId=1">
            AdonisJS Taxonomies
          </MenubarItem>

          <MenubarSeparator />

          <MenubarItem :as="Link" href="/taxonomies/create">
            <Plus class="w-4 h-4" />
            New Taxonomy
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>
          <EllipsisVertical class="w-4 h-4" aria-label="More Options" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem :as="Link" href="/framework-versions"> Framework Versions </MenubarItem>
          <MenubarItem :as="Link" href="/users"> Users </MenubarItem>
          <MenubarItem :as="Link" href="/roles"> Roles </MenubarItem>
          <MenubarItem :as="Link" href="/plans"> Plans </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </nav>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline" size="icon" class="md:hidden shrink-0">
        <Menu class="w-5 h-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav class="gap-6 grid font-medium text-lg">
        <Link href="/" class="flex items-center gap-2 font-semibold text-lg">
          <img
            class="w-auto h-6 md:h-7 logo-black"
            src="../assets/logo-black.svg"
            alt="Adocasts"
            width="146px"
            height="28px"
          />
          <span class="sr-only">Adocasts</span>
          <span>CMS</span>
        </Link>
        <Link
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="mobile-link"
          :class="{ active: $page.url.startsWith(link.href) }"
        >
          {{ link.text }}
        </Link>
      </nav>
    </SheetContent>
  </Sheet>
</template>

<style scoped>
.desktop-link {
  @apply text-muted-foreground hover:text-foreground transition-colors;

  &.active {
    @apply text-foreground;
  }
}

.mobile-link {
  @apply text-muted-foreground hover:text-foreground;

  &.active {
    @apply text-foreground;
  }
}
</style>
