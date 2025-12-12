# Dokumentasi API – Learn Track Dashboard

Base URL default: `http://localhost:4000`. Semua endpoint (kecuali `/health` dan `/api/auth/login`) memerlukan header `Authorization: Bearer <token>`.

Respons galat umumnya berbentuk `{"message": "<deskripsi>"}` dengan status HTTP yang sesuai.

## Autentikasi
### POST /api/auth/login
Login tanpa password memakai kombinasi nama + email yang terdaftar di tabel `Student`.
Request:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```
Respons 200:
```json
{
  "token": "<jwt>",
  "user": { "id": 1, "name": "John Doe", "email": "johndoe@example.com" }
}
```
Galat umum: 400 (field kurang), 401 (kombinasi nama/email tidak cocok).

## Kesehatan Layanan
### GET /health
Respons 200:
```json
{ "status": "ok" }
```

## Dashboard & Aktivitas
### GET /api/dashboard/summary
Mengembalikan KPI pengguna aktif.
Respons 200:
```json
{
  "kpis": {
    "courses": 3,
    "learningHours": 12,
    "assessments": 1,
    "submissions": 2
  }
}
```

### GET /api/activity/weekly
Aktivitas 7 hari terakhir (menit belajar per hari + kumulatif) dan perbandingan dengan minggu sebelumnya.
Respons 200:
```json
{
  "daily": [20, 35, 0, 45, 15, 10, 30],
  "cumulative": [20, 55, 55, 100, 115, 125, 155],
  "totalMinutes": 155,
  "wowDeltaPct": 18
}
```
Catatan: `wowDeltaPct` bernilai `null` jika tidak ada data minggu sebelumnya.

## Learning Path
### GET /api/paths
Daftar learning path yang punya progres untuk pengguna.
Contoh respons 200:
```json
[
  {
    "id": 1,
    "title": "Data Science Foundations",
    "official": true,
    "percent": 60,
    "completedLessons": 1,
    "startedLessons": 2,
    "totalLessons": 3
  }
]
```

### GET /api/paths/:id/detail
Detail lesson/course dalam sebuah learning path.
Respons 200:
```json
{
  "id": 1,
  "title": "Data Science Foundations",
  "lessons": [
    { "id": 10, "title": "Intro to Python", "courseTitle": "Intro to Python", "percent": 100, "status": "COMPLETED" },
    { "id": 11, "title": "Data Wrangling", "courseTitle": "Data Wrangling", "percent": 50, "status": "IN_PROGRESS" }
  ]
}
```
Galat: 404 jika `:id` tidak ditemukan.

## Kursus Mandiri
### GET /api/courses?type=standalone
Mengembalikan course yang terhubung ke learning path `Non Learning Path`.
Contoh respons 200:
```json
[
  { "id": 30, "title": "Git Fundamentals", "percent": 100 },
  { "id": 31, "title": "Command Line Basics", "percent": 40 }
]
```
Galat: 400 jika parameter `type` tidak didukung.

## Rekomendasi
### GET /api/recommendations/next-path
Mengembalikan rekomendasi learning path yang belum pernah diambil pengguna (acak dari 5 teratas).
Respons 200:
```json
{ "id": 5, "title": "Cloud Practitioner", "totalCourses": 4 }
```
Respons 204 (tanpa body) jika tidak ada rekomendasi yang tersedia.
