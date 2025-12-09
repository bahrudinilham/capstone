# Dokumentasi Proyek Learn Track Dashboard

## Ringkasan
Learn Track Dashboard adalah aplikasi full-stack (Express + Prisma/MySQL, Vue 3 + Tailwind) untuk memantau progres belajar siswa: ringkasan aktivitas mingguan, KPI, progres learning path, kursus mandiri, dan rekomendasi path berikutnya.

## Arsitektur & Stack
- **Backend:** Node.js, Express 5, Prisma ORM (MySQL), JWT untuk autentikasi.
- **Frontend:** Vue 3 (Vite), Pinia, Vue Router, Tailwind CSS, Chart.js via vue-chartjs, Headless UI, Heroicons.
- **Database:** MySQL dengan skema `Student`, `Course`, `LearningPath`, `Tutorial`, `StudentProgress`.

Struktur utama:
```
server/  # API Express + Prisma
client/  # Frontend Vite + Vue
```

## Cara Menjalankan
1. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env   # set DATABASE_URL & JWT_SECRET
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed     # data demo
   npm run dev             # API di port 4000
   ```
2. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev             # app di http://localhost:5173
   ```
   Opsional: set `VITE_API_URL` di `client/.env` jika bukan ke `http://localhost:4000`.

## Alur Autentikasi
- Login tanpa password menggunakan kombinasi nama + email (`POST /api/auth/login`), menghasilkan JWT 1 hari.
- Middleware `authenticate` memeriksa header `Authorization: Bearer <token>`.

## Endpoints Penting
- `GET /health`
- `POST /api/auth/login`
- `GET /api/dashboard/summary` (aktivitas 7 hari + KPI)
- `GET /api/paths`, `GET /api/paths/:id/detail`
- `GET /api/courses?type=standalone`
- `GET /api/activity/weekly`
- `GET /api/recommendations/next-path`

Detail lengkap ada di `API_DOCUMENTATION.md`.

## Skema Data Ringkas (Prisma)
- `Student(student_id, name, email)`
- `LearningPath(learning_path_id, learning_path_name)`
- `Course(course_id, learning_path_id, course_name, course_level_str, hours_to_study)`
- `Tutorial(tutorial_id, course_id, tutorial_title)`
- `StudentProgress(progress_id, student_id, course_name, learning_path_id, active_tutorials, completed_tutorials, is_graduated, final_exam_id, final_submission_id, started_learning_at, ...)`

Relasi utama:
- `StudentProgress.course_name` → `Course.course_name`
- `StudentProgress.learning_path_id` → `LearningPath.learning_path_id`

## Perhitungan Dashboard (Backend)
- **Aktivitas mingguan:** ambil progres 7 hari terakhir, estimasi menit per entry (`hours_to_study*60` atau `tutorial*15`, bobot progres `completed + 0.5*active`), susun series harian/kumulatif, bandingkan dengan minggu sebelumnya (`wowDeltaPct`, `null` jika baseline 0).
- **KPI Courses:** jumlah course unik yang punya progres (completed/active/persen > 0).
- **Learning Hours:** untuk setiap course dengan progres, ambil estimasi menit terbesar, jumlahkan, lalu `Math.round(totalMenit/60)`.
- **Assessments/Submissions:** hitung baris `StudentProgress` dengan `final_exam_id > 0` atau `final_submission_id > 0`.
- **Path percent:** rata-rata persen per course dalam path, pembilang `completedLessons` = course 100%.

## Frontend
- **State:** Pinia store `auth` (JWT, user), `dashboard` (summary, paths, detail, standalone, rekomendasi).
- **Routing:** `/login` (form), `/dashboard` (protected). Registrasi dinonaktifkan.
- **Komponen utama:** `ActivityCard`, `KpiGrid`, `PathProgressCard`, `StandaloneCourseList`, `RecommendedPathCard`.
- **Grafik:** Chart.js line area untuk aktivitas kumulatif.

## Seed & Demo
- Seed menyediakan beberapa student demo (lihat `server/prisma/seed.js`), termasuk `demo@learntrack.local` dengan progres contoh.

## Troubleshooting Cepat
- **Learning hours tidak berubah:** pastikan ada `StudentProgress` dengan `completed/active > 0` untuk user login dan tanggal dalam 7 hari (untuk kartu aktivitas). Restart backend setelah mengubah kode.
- **Course tidak terdeteksi:** pastikan `course_name` di `StudentProgress` cocok dengan `Course.course_name` dan ada progres > 0.
- **Token invalid:** set `JWT_SECRET` di `.env`, login ulang.

## Lisensi & Catatan
Tidak ada lisensi spesifik pada repo ini (default package.json). Perhatikan peringatan Prisma 7: koneksi DB sebaiknya dipindah ke `prisma.config.ts` jika upgrade dari Prisma 6.
