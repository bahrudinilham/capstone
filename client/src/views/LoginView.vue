<script setup>
import { reactive } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();
const form = reactive({ name: "", email: "" });

async function handleSubmit() {
  try {
    await auth.login(form);
    router.push({ name: "dashboard" });
  } catch (error) {
    // handled in store
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950"
  >
    <form
      class="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-card dark:bg-slate-900"
      @submit.prevent="handleSubmit"
    >
      <div>
        <p
          class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600"
        >
          Learn Track
        </p>
        <h1 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
          Masuk ke dashboard
        </h1>
        <p class="text-sm text-slate-500">
          Gunakan akun demo untuk melihat progres.
        </p>
      </div>

      <div class="space-y-4">
        <label
          class="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Nama
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="John Doe"
            class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label
          class="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Email
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="johndoe@example.com"
            class="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>
      </div>

      <p v-if="auth.error" class="text-sm text-red-500">{{ auth.error }}</p>

      <button
        type="submit"
        class="w-full rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 hover:bg-emerald-600"
        :disabled="auth.loading"
      >
        {{ auth.loading ? "Memproses..." : "Masuk" }}
      </button>
    </form>
  </div>
</template>
