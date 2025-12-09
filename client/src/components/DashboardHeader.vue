<script setup>
import { BookOpenIcon, UserCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  title: { type: String, default: 'Runtutan Belajar' },
  description: { type: String, default: 'Pantau progres belajarmu setiap hari' },
  user: { type: Object, default: () => ({}) }
});
</script>

<template>
  <header class="rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-sm dark:from-slate-800/80 dark:to-slate-800/40">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <BookOpenIcon class="h-5 w-5" />
          <span class="text-sm font-semibold uppercase tracking-[0.2em]">Runtutan Belajar</span>
        </div>
        <h1 class="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{{ props.title }}</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">{{ props.description }}</p>
      </div>
      <div class="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2 shadow-sm dark:bg-slate-900/70">
        <UserCircleIcon class="h-10 w-10 text-emerald-500" />
        <div>
          <p class="text-sm text-slate-500 dark:text-slate-300">Halo kembali,</p>
          <p class="text-base font-semibold text-slate-900 dark:text-white">{{ props.user?.name || 'Learner' }}</p>
        </div>
      </div>
    </div>
  </header>
</template>
