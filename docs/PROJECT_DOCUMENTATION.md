# Learn Track Dashboard – Dokumentasi Ringkas

## Ringkasan Arsitektur
- **Backend**: Express (Node 20+), Prisma ORM (MySQL), JWT auth. Kode utama di `server/src/`.
- **Frontend**: Vue 3 (Vite), Pinia, Vue Router, Tailwind CSS. Kode utama di `client/`.
- **Data**: Prisma schema di `server/prisma/schema.prisma`, seed contoh di `server/prisma/seed.js`.

## Cara Menjalankan
### Backend
1. Siapkan `.env` dari `.env.example` dan set `DATABASE_URL`, `JWT_SECRET`.
2. Install & generate Prisma client:
   ```bash
   cd server
   npm install
   npm run prisma:generate
   ```
3. Migrasi & seed (opsional):
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
4. Jalankan API:
   ```bash
   npm run dev
   ```

### Frontend
1. ```bash
   cd client
   npm install
   npm run dev
   ```
2. Set `VITE_API_URL` jika API tidak di `http://localhost:4000`.

## Autentikasi
- Endpoint publik hanya `/health` dan `/api/auth/login`.
- Login memerlukan `name` + `email`. Token JWT 1 hari, disuntikkan ke header `Authorization: Bearer <token>`.

## Endpoint Utama (lihat detail di `API_DOCUMENTATION.md`)
- `POST /api/auth/login` → token + user.
- `GET /api/dashboard/summary` → aktivitas mingguan + KPI.
- `GET /api/paths`, `GET /api/paths/:id/detail` → progres per learning path.
- `GET /api/courses?type=standalone` → kursus non-path.
- `GET /api/activity/weekly` → dataset chart aktivitas.
- `GET /api/recommendations/next-path` → rekomendasi path berikutnya (acak dari yang belum diambil).

## Skema Data (ringkas)
- `Student(student_id, name, email)`
- `LearningPath(learning_path_id, learning_path_name)`
- `Course(course_id, learning_path_id, course_name, course_level_str, hours_to_study)`
- `Tutorial(tutorial_id, course_id, tutorial_title)`
- `StudentProgress`:
  - kunci: `progress_id`
  - relasi: `student_id` → Student, `course_name` → Course, `learning_path_id` → LearningPath
  - progres: `completed_tutorials`, `active_tutorials`, `is_graduated`, `final_exam_id`, `final_submission_id`, `started_learning_at`

## Perhitungan Penting (backend)
- **Progress course**: `percent = round(completed / (completed + active) * 100)`, status NOT_STARTED/IN_PROGRESS/COMPLETED; `is_graduated` → 100%.
- **Learning path percent**: rata-rata persen semua course dalam path (termasuk yang belum mulai = 0%).
- **Learning hours**: estimasi menit per course = (`hours_to_study*60` atau `tutorial_count*15`) × rasio progres (`completed + 0.5*active`, dibatasi 100%). Dijumlahkan per course, lalu `Math.round(totalMinutes/60)`. Course tanpa progres tidak dihitung.
- **Courses KPI**: jumlah course unik yang punya progres (>0%).
- **Assessments/Submissions**: hitung baris `StudentProgress` dengan `final_exam_id > 0` / `final_submission_id > 0`.
- **Aktivitas mingguan**: window 7 hari terakhir (mulai hari ini - 6). Ada juga window minggu sebelumnya untuk `wowDeltaPct`.

## Seed Data
- `npm run prisma:seed` menambahkan beberapa learning path, course + tutorial, dan progres untuk 3 siswa (termasuk akun demo: `demo@learntrack.local`).

## Catatan Teknis
- Express 5 + Prisma 6.19. Peringatan Prisma 7 tentang `url` di schema bisa diabaikan jika tetap di v6; untuk v7 gunakan `prisma.config.ts`.
- UI tidak menyediakan registrasi (hanya login). Placeholder login: `John Doe` / `johndoe@example.com`.

## Debug Cepat
- Cek progres user: 
  ```sql
  SELECT course_name, completed_tutorials, active_tutorials FROM StudentProgress WHERE student_id = <ID>;
  ```
- Cek tutorial per course: 
  ```sql
  SELECT course_id, COUNT(*) FROM Tutorial GROUP BY course_id;
  ```
