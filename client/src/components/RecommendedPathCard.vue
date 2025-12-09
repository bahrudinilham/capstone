<script setup>
const props = defineProps({
  recommendation: {
    type: Object,
    default: null
  }
});
</script>

<template>
  <div v-if="recommendation" class="card-surface p-5">
    <p class="text-xs uppercase tracking-wide text-emerald-600">Rekomendasi berikutnya</p>
    <h3 class="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
      {{ recommendation.title }}
    </h3>
    <p class="text-sm text-slate-500">Total course: {{ recommendation.totalCourses }}</p>
  </div>
  <div v-else class="card-surface p-5 text-sm text-slate-500">
    Belum ada rekomendasi learning path.
  </div>
</template>
