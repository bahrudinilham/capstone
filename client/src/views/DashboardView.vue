<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DashboardHeader from "../components/DashboardHeader.vue";
import ActivityCard from "../components/ActivityCard.vue";
import KpiGrid from "../components/KpiGrid.vue";
import PathProgressCard from "../components/PathProgressCard.vue";
import StandaloneCourseList from "../components/StandaloneCourseList.vue";
import RecommendedPathCard from "../components/RecommendedPathCard.vue";
import { useDashboardStore } from "../stores/dashboard";
import { useAuthStore } from "../stores/auth";
import { CalendarIcon } from "@heroicons/vue/24/outline";

const dashboard = useDashboardStore();
const auth = useAuthStore();
const detailLoadingId = ref(null);
const router = useRouter();

onMounted(() => {
  if (auth.isAuthenticated) {
    dashboard.fetchDashboard();
  }
});

async function handleDetail(pathId) {
  if (detailLoadingId.value === pathId) return;
  detailLoadingId.value = pathId;
  try {
    await dashboard.fetchPathDetail(pathId);
  } finally {
    detailLoadingId.value = null;
  }
}

function handleLogout() {
  auth.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="flex justify-end">
        <button
          class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white dark:border-slate-700 dark:text-slate-300"
          @click="handleLogout"
        >
          Keluar
        </button>
      </div>

      <DashboardHeader :user="auth.user" />

      <div v-if="dashboard.summary" class="space-y-4">
        <ActivityCard
          :total-minutes="dashboard.activity.totalMinutes"
          :wow-delta-pct="dashboard.activity.wowDeltaPct"
          :series="dashboard.activity.cumulative"
        />
        <KpiGrid :kpis="dashboard.summary.kpis" />
        <RecommendedPathCard :recommendation="dashboard.recommendedPath" />
      </div>
      <div v-else class="card-surface h-48 animate-pulse" />

      <div class="grid gap-6 md:grid-cols-2">
        <section>
          <div class="mb-4 flex items-center gap-3">
            <CalendarIcon class="h-8 w-8 text-slate-500" />
            <p class="text-xl font-bold text-slate-900 dark:text-white">
              Progres Kelas Learning Path
            </p>
          </div>
          <div class="space-y-4">
            <PathProgressCard
              v-for="path in dashboard.paths"
              :key="path.id"
              :path="path"
              :lessons="dashboard.pathDetails[path.id]?.lessons || []"
              :loading="
                detailLoadingId === path.id && !dashboard.pathDetails[path.id]
              "
              @load-detail="handleDetail"
            />
          </div>
        </section>
        <section>
          <div class="mb-4 flex items-center gap-3">
            <CalendarIcon class="h-8 w-8 text-slate-500" />
            <p class="text-xl font-bold text-slate-900 dark:text-white">
              Progres Kelas Non Learning Path
            </p>
          </div>
          <StandaloneCourseList :courses="dashboard.standaloneCourses" />
        </section>
      </div>
    </div>
  </div>
</template>
