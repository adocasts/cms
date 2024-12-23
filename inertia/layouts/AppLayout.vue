<script setup lang="ts">
import {
  ArrowLeftFromLine,
  Bell,
  CircleUser,
  Database,
  Fingerprint,
  LogOut,
  Receipt,
  User,
  UserPen,
} from 'lucide-vue-next'
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
      class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-10"
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
            <DropdownMenuLabel class="flex items-center gap-3">
              <User class="w-4 h-4" />
              {{ user.username }}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as="a" href="https://adocasts.com">
              <ArrowLeftFromLine class="w-4 h-4" />
              Return to Adocasts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem as="a" href="https://adocasts.com/settings/account">
              <Fingerprint class="w-4 h-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem as="a" href="https://adocasts.com/settings/profile">
              <UserPen class="w-4 h-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem as="a" href="https://adocasts.com/settings/billing">
              <Receipt class="w-4 h-4" />
              Billing Settings
            </DropdownMenuItem>
            <DropdownMenuItem as="a" href="https://adocasts.com/settings/notifications">
              <Bell class="w-4 h-4" />
              Manage Notification
            </DropdownMenuItem>
            <DropdownMenuItem as="a" href="https://adocasts.com/settings/data">
              <Database class="w-4 h-4" />
              Manage Your Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <Link method="post" href="/logout" class="flex items-center gap-2">
                <LogOut class="w-4 h-4 pl-0.5" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <main
      class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col bg-muted/40 p-4 md:p-10"
    >
      <slot />
    </main>

    <ToastManager :messages="messages" />
  </div>
</template>
