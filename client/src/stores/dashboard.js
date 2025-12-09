import { defineStore } from 'pinia';
import api from '../services/api';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summary: null,
    paths: [],
    pathDetails: {},
    standaloneCourses: [],
    recommendedPath: null,
    activity: { daily: [], cumulative: [], totalMinutes: 0, wowDeltaPct: 0 },
    loading: false,
    error: ''
  }),
  actions: {
    async fetchDashboard() {
      this.loading = true;
      this.error = '';
      try {
        const [summaryRes, pathsRes, coursesRes, activityRes, recommendationRes] = await Promise.all([
          api.get('/api/dashboard/summary'),
          api.get('/api/paths'),
          api.get('/api/courses', { params: { type: 'standalone' } }),
          api.get('/api/activity/weekly'),
          api.get('/api/recommendations/next-path', { validateStatus: (status) => status === 200 || status === 204 })
        ]);

        this.summary = summaryRes.data;
        this.paths = pathsRes.data;
        this.standaloneCourses = coursesRes.data;
        this.activity = activityRes.data;
        this.recommendedPath = recommendationRes.status === 200 ? recommendationRes.data : null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Gagal memuat dashboard';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchPathDetail(pathId) {
      if (this.pathDetails[pathId]) {
        return this.pathDetails[pathId];
      }
      const { data } = await api.get(`/api/paths/${pathId}/detail`);
      this.pathDetails[pathId] = data;
      return data;
    }
  }
});
