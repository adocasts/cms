<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Menu, Slash, Route, Plus, EllipsisVertical } from 'lucide-vue-next'

const links = [
  {
    text: 'Desktop',
    href: '/',
  },
  {
    text: 'Posts',
    href: '/posts'
  },
  {
    text: 'Collections',
    href: '/collections'
  },
  {
    text: 'Taxonomies',
    href: '/taxonomies'
  },
  {
    text: 'Users',
    href: '/users'
  },
  {
    text: 'Roles',
    href: '/roles'
  },
  {
    text: 'Plans',
    href: '/plans'
  }
]
</script>

<template>
  <nav
    class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
  >
    <Link href="/" class="flex items-center gap-2 text-lg font-semibold md:text-base">
      <img class="logo-black w-auto h-6 md:h-7" src="../assets/logo-black.svg" alt="Adocasts" width="146px" height="28px" />
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
          <MenubarItem :as="Link" href="/posts">
            All Posts
          </MenubarItem>
          <MenubarItem :as="Link" href="/posts/lessons">
            Lessons
          </MenubarItem>
          <MenubarItem :as="Link" href="/posts/streams">
            Livestreams
          </MenubarItem>
          <MenubarItem :as="Link" href="/posts/news">
            News
          </MenubarItem>
          <MenubarItem :as="Link" href="/posts/blogs">
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
          <MenubarItem :as="Link" href="/collections">
            All Collections
          </MenubarItem>
          <MenubarItem :as="Link" href="/collections/series">
            Series
          </MenubarItem>
          <MenubarItem :as="Link" href="/collections/playlists">
            Playlists
          </MenubarItem>
          <MenubarItem :as="Link" href="/collections/paths">
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
          <MenubarItem :as="Link" href="/taxonomies">
            All Taxonomies
          </MenubarItem>
          <MenubarItem :as="Link" href="/taxonomies/contents">
            Content Taxonomies
          </MenubarItem>
          <MenubarItem :as="Link" href="/taxonomies/discussions">
            Discussion Taxonomies
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
          <MenubarItem :as="Link" href="/users">
            Users
          </MenubarItem>
          <MenubarItem :as="Link" href="/roles">
            Roles
          </MenubarItem>
          <MenubarItem :as="Link" href="/plans">
            Plans
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  </nav>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline" size="icon" class="shrink-0 md:hidden">
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span> 
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav class="grid gap-6 text-lg font-medium">
        <Link href="/" class="flex items-center gap-2 text-lg font-semibold">
          <img class="logo-black w-auto h-6 md:h-7" src="../assets/logo-black.svg" alt="Adocasts" width="146px" height="28px" />
          <span class="sr-only">Adocasts</span>
          <span>CMS</span>
        </Link>
        <Link
          v-for="link in links" :key="link.href"
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
  @apply text-muted-foreground transition-colors hover:text-foreground;

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
