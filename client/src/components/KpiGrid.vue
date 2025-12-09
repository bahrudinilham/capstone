<script setup>
import { AcademicCapIcon, ClockIcon, RectangleStackIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  kpis: {
    type: Object,
    default: () => ({ courses: 0, learningHours: 0, assessments: 0, submissions: 0 })
  }
});

const items = [
  { label: 'Courses', key: 'courses', icon: AcademicCapIcon },
  { label: 'Learning Hours', key: 'learningHours', icon: ClockIcon },
  { label: 'Assessments', key: 'assessments', icon: RectangleStackIcon },
  { label: 'Submission', key: 'submissions', icon: DocumentTextIcon }
];
</script>

<template>
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <article
      v-for="item in items"
      :key="item.key"
      class="card-surface flex items-center gap-3 px-4 py-3"
    >
      <component :is="item.icon" class="h-8 w-8 rounded-2xl bg-emerald-100 p-1.5 text-emerald-600" />
      <div>
        <p class="text-xs uppercase tracking-wide text-slate-500">{{ item.label }}</p>
        <p class="text-2xl font-semibold text-slate-900 dark:text-white">{{ props.kpis[item.key] ?? 0 }}</p>
      </div>
    </article>
  </div>
</template>
