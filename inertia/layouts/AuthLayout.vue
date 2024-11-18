<script setup lang="ts">
defineProps<{
  messages: Record<string, string | Record<string, string>>
}>()
</script>

<template>
  <div>
    <header>
      <nav class="flex items-center justify-between p-6 lg:px-8">
        <div class="flex lg:flex-1">
          <Link href="/" class="flex items-center gap-2 text-lg font-semibold md:text-base">
            <img class="logo-black w-auto h-6 md:h-7" src="../assets/logo-black.svg" alt="Adocasts" width="146px" height="28px" />
            <span class="sr-only">Adocasts</span>
            <span>CMS</span>
          </Link>
        </div>
        <div v-if="!$page.url.includes('/organizations')" class="flex flex-1 justify-end gap-4">
          <Link href="/register" class="text-sm font-semibold leading-6 text-slate-900">
            Register
          </Link>
          <Link href="/login" class="text-sm font-semibold leading-6 text-slate-900"> Login </Link>
        </div>
      </nav>
    </header>
    <div class="p-6 lg:p-8">
      <div class="flex flex-col justify-center space-y-6 w-full sm:w-[350px] mx-auto">
        <slot />
      </div>
    </div>

    <ToastManager :messages="messages" />
  </div>
</template>
