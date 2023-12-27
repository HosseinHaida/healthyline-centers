<template>
  <main>
    <nav
      class="fixed z-50 hidden w-full items-center justify-between bg-slate-50 px-4 py-2 text-slate-800 md:flex"
    >
      <div class="flex items-center gap-10">
        <NuxtLink class="nav-link" to="/">خانه</NuxtLink>
        <NuxtLink class="nav-link">ورود به سامانه</NuxtLink>
        <NuxtLink class="nav-link">خرید اشتراک</NuxtLink>
        <NuxtLink class="nav-link"> ایجاد رزومه علمی-کاربردی </NuxtLink>
        <NuxtLink class="nav-link">عضو خانواده هست؟</NuxtLink>
        <NuxtLink class="nav-link"> تأیید اصالت گواهی کار </NuxtLink>
      </div>
      <div>
        <img src="/logo.svg" alt="لوگو" class="h-10" />
      </div>
    </nav>
    <div class="md:pt-14">
      <slot />
    </div>
  </main>
</template>

<script lang="ts" setup></script>

<style scoped>
.router-link-active {
  @apply before:border-orange-500 !important;
}

.nav-link:before {
  @apply ml-1 inline-block h-3 w-3 rounded-full border-4 border-blue-500 transition-all duration-300 content-[''] hover:border-blue-300;
}
</style>
