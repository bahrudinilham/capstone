<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  path: { type: Object, required: true },
  lessons: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['load-detail']);

const STATUS_META = {
  NOT_STARTED: {
    label: 'Belum dimulai',
    textClass: 'text-slate-500',
    dotClass: 'bg-slate-300'
  },
  IN_PROGRESS: {
    label: 'Sedang dipelajari',
    textClass: 'text-amber-600',
    dotClass: 'bg-amber-400'
  },
  COMPLETED: {
    label: 'Selesai',
    textClass: 'text-emerald-600',
    dotClass: 'bg-emerald-400'
  }
};

function getStatusMeta(status) {
  return STATUS_META[status] || STATUS_META.NOT_STARTED;
}

function requestDetail(open) {
  if (!open && !props.lessons.length && !props.loading) {
    emit('load-detail', props.path.id);
  }
}
</script>

<template>
  <div class="card-surface p-5">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-slate-500">{{ path.official ? 'Learning Path' : 'Mandiri' }}</p>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ path.title }}</h3>
      </div>
      <div class="text-right text-sm text-slate-500">
        <p class="font-semibold text-slate-900 dark:text-white">{{ path.percent }}%</p>
        <p>{{ path.startedLessons ?? path.completedLessons ?? 0 }} / {{ path.totalLessons }}</p>
      </div>
    </div>
    <div class="mt-4 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        class="h-full rounded-full bg-emerald-500"
        :style="{ width: `${path.percent}%` }"
        role="progressbar"
        :aria-valuenow="path.percent"
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>

    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
        @click="() => requestDetail(open)"
        :aria-expanded="open"
      >
        <span>Detail progres</span>
        <ChevronDownIcon class="h-5 w-5 transition-transform" :class="{ 'rotate-180': open }" />
      </DisclosureButton>
      <DisclosurePanel class="mt-4 space-y-3">
        <div v-if="loading" class="space-y-2">
          <div v-for="index in 3" :key="index" class="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div v-else-if="lessons.length === 0" class="text-sm text-slate-500">
          Belum ada detail progres untuk path ini.
        </div>
        <div v-else class="space-y-4">
          <div v-for="lesson in lessons" :key="lesson.id" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <div class="flex flex-col">
                <span class="text-slate-600 dark:text-slate-300">{{ lesson.title }}</span>
                <span
                  class="mt-1 inline-flex items-center gap-2 text-xs font-medium"
                  :class="getStatusMeta(lesson.status).textClass"
                >
                  <span
                    class="h-2 w-2 rounded-full"
                    :class="getStatusMeta(lesson.status).dotClass"
                  />
                  {{ getStatusMeta(lesson.status).label }}
                </span>
              </div>
              <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ lesson.percent }}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                class="h-full rounded-full bg-emerald-500"
                :style="{ width: `${lesson.percent}%` }"
                role="progressbar"
                :aria-valuenow="lesson.percent"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>
