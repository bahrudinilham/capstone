<script setup>
import { computed } from 'vue';
import { ArrowTrendingUpIcon } from '@heroicons/vue/24/solid';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
} from 'chart.js';
import { Line } from 'vue-chartjs';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const props = defineProps({
  totalMinutes: { type: Number, default: 0 },
  wowDeltaPct: { type: Number, default: null },
  series: { type: Array, default: () => [] }
});

const labels = computed(() => props.series.map((_, index) => `Hari ${index + 1}`));
const dataset = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      data: props.series,
      fill: true,
      backgroundColor: 'rgba(16, 185, 129, 0.18)',
      borderColor: '#059669',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.45
    }
  ]
}));

const totalHours = computed(() => Math.round((props.totalMinutes / 60) * 10) / 10);
const deltaState = computed(() => {
  if (props.wowDeltaPct === null || props.wowDeltaPct === undefined) {
    return {
      label: 'Tidak ada data minggu lalu',
      badgeClass: 'bg-slate-100 text-slate-600',
      iconClass: 'text-slate-600'
    };
  }
  const isPositive = props.wowDeltaPct >= 0;
  return {
    label: `${props.wowDeltaPct}% vs minggu lalu`,
    badgeClass: isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
    iconClass: isPositive ? 'text-emerald-700' : 'text-red-700'
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { display: false },
    y: { display: false }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      callbacks: {
        label: (ctx) => `${ctx.parsed.y} menit`
      }
    }
  }
};
</script>

<template>
  <div class="card-surface p-6">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Aktivitas Belajar</h2>
        <p class="text-sm text-slate-500 dark:text-slate-300">Perbandingan dengan minggu lalu</p>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-300">Total jam</p>
            <p class="text-4xl font-semibold text-slate-900 dark:text-white">{{ totalHours }} <span class="text-base font-medium">Jam</span></p>
          </div>
          <span
            class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
            :class="deltaState.badgeClass"
          >
            <ArrowTrendingUpIcon class="h-4 w-4" :class="deltaState.iconClass" />
            <span>{{ deltaState.label }}</span>
          </span>
        </div>
      </div>
      <div class="h-32 w-full md:w-72">
        <Line :data="dataset" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>
