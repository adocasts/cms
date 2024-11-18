<script setup lang="ts">
import { CircleUser } from 'lucide-vue-next'
import { Link } from '@inertiajs/vue3'
import UserDto from '#dtos/user'

const props = defineProps<{
  user: UserDto
  messages: Record<string, any>
}>()
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <header
      class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
    >
      <Navigation v-bind="props" />

      <div class="flex flex-1 items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{{ user.username }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem :as="Link" href="/settings/profile">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem :as="Link" href="/settings/account">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <Link method="post" href="/logout">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10"
    >
      <slot />
    </main>

    <ToastManager :messages="messages" />
  </div>
</template>
