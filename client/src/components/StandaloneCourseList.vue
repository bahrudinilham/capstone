<script setup>
const props = defineProps({
  courses: { type: Array, default: () => [] }
});

const STATUS_META = {
  COMPLETED: { label: 'Selesai', textClass: 'text-emerald-600', dotClass: 'bg-emerald-400' },
  IN_PROGRESS: { label: 'Sedang dipelajari', textClass: 'text-amber-600', dotClass: 'bg-amber-400' },
  NOT_STARTED: { label: 'Belum dimulai', textClass: 'text-slate-500', dotClass: 'bg-slate-300' }
};

function getStatus(percent) {
  if (percent >= 100) return STATUS_META.COMPLETED;
  if (percent > 0) return STATUS_META.IN_PROGRESS;
  return STATUS_META.NOT_STARTED;
}
</script>

<template>
  <div class="card-surface p-5">
    <div class="space-y-4">
      <article
        v-for="course in courses"
        :key="course.id"
        class="rounded-2xl border border-slate-100 p-4 dark:border-slate-800"
      >
        <div class="flex items-center justify-between text-sm">
          <div>
            <p class="font-medium text-slate-800 dark:text-white">{{ course.title }}</p>
            <span
              class="mt-1 inline-flex items-center gap-2 text-xs font-medium"
              :class="getStatus(course.percent).textClass"
            >
              <span class="h-2 w-2 rounded-full" :class="getStatus(course.percent).dotClass" />
              {{ getStatus(course.percent).label }}
            </span>
          </div>
          <span class="font-semibold text-slate-800 dark:text-white">{{ course.percent }}%</span>
        </div>
        <div class="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            class="h-full rounded-full bg-emerald-500"
            :style="{ width: `${course.percent}%` }"
            role="progressbar"
            :aria-valuenow="course.percent"
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </article>
    </div>
  </div>
</template>
