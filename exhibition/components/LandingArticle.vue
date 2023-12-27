<template>
  <div class="flex-column items-center gap-8 md:flex" :dir="rtl && 'ltr'">
    <div class="flex-column space-y-3">
      <div class="flex">
        <span class="rounded-lg bg-orange-600 px-4 py-1 text-orange-50">
          {{ label }}
        </span>
        <div
          class="relative grow translate-y-[45%] border-t-2 border-orange-600"
          :class="rtl ? 'border-r-2' : 'border-l-2'"
        />
      </div>

      <h1 :dir="rtl ? 'rtl' : 'ltr'">{{ title }}</h1>

      <ul :dir="rtl ? 'rtl' : 'ltr'">
        <li
          class="before:bg-primary lg:text-md flex items-center text-sm before:inline-block before:h-3 before:w-3 before:rounded-full before:content-['']"
          :class="
            rtl ? 'before:right-0 before:ml-2' : 'before:left-0 before:mr-2'
          "
          v-for="(item, i) in list"
          :key="i"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div
      class="mt-6 h-44 w-44 rounded-full bg-orange-200 md:mt-0 lg:h-56 lg:w-56"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
  },
  label: {
    type: String,
    default: "",
  },
  list: {
    type: Array<String>,
  },
  rtl: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped></style>
