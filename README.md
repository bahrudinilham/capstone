## Prasyarat

- Node.js 20+ dan npm.
- MySQL berjalan dan dapat diakses; siapkan database (contoh: `learntrack`).

## Konfigurasi Lingkungan

- `server/.env` (salin dari `.env.example`):
  - `DATABASE_URL="mysql://user:password@host:port/learntrack"`
  - `JWT_SECRET="ubah-secret-anda"`
- `client/.env` (opsional, salin dari `.env.example`):
  - `VITE_API_URL="http://localhost:4000"` jika backend tidak memakai port default atau berjalan di host lain.

## Menjalankan Backend

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate   # terapkan skema ke database
npm run dev             # API di http://localhost:4000
```

Catatan data: belum ada seeder bawaan; tambah data `Student`, `LearningPath`, `Course`, `Tutorial`, dan `StudentProgress` lewat SQL/Prisma sesuai kebutuhan. Untuk course mandiri, gunakan learning path bernama persis `Non Learning Path`.

## Menjalankan Frontend

```bash
cd client
npm install
npm run dev             # http://localhost:5173
```

## Skrip Penting

- Backend (`server`): `npm run dev`, `npm start`, `npm run prisma:generate`, `npm run prisma:migrate`.
- Frontend (`client`): `npm run dev`, `npm run build`, `npm run preview`.
