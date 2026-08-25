# TaskMate - Debugged Starter

TaskMate adalah starter Next.js + Prisma 7 + PostgreSQL + Redis + MinIO + n8n + pgAdmin. Auth sudah diselaraskan ke **NextAuth v4.24.15** sesuai dependency project.

## Jalankan semuanya

Dari folder `TaskMate/infrastructure`:

```bash
docker compose up --build -d
```

Tunggu container `taskmate-postgres` menjadi healthy dan `taskmate-web` selesai menjalankan `prisma db push`.

## URL

- Web: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- pgAdmin: http://localhost:5050
- MinIO Console: http://localhost:9001
- n8n: http://localhost:5678

## Akun admin otomatis

- Email: `admin@taskmate.com`
- Password: diambil dari environment variable `ADMIN_PASSWORD` (lihat `.env.example`)
- Role: `ADMIN`

Container web menjalankan `prisma db push` lalu `scripts/seed-admin.mjs`, sehingga akun admin akan dibuat/di-upsert otomatis.

## Debug yang sudah dilakukan

- [x] Sinkronisasi API dengan `next-auth@4.24.15`; menghapus penggunaan API v5 `handlers/auth()`.
- [x] `app/api/auth/[...nextauth]/route.ts` diperbaiki untuk NextAuth v4.
- [x] Halaman login dipindahkan dari `app/api/login/page.tsx` ke `app/login/page.tsx`.
- [x] `NEXTAUTH_SECRET` digunakan konsisten.
- [x] Dashboard/Admin/User memakai `getServerSession(authOptions)`.
- [x] Root `/` tidak lagi menampilkan isi tabel User atau password hash.
- [x] Register API tidak mengembalikan password hash.
- [x] Ditambahkan halaman Register.
- [x] Ditambahkan validasi role ADMIN/USER untuk halaman.
- [x] Ditambahkan Dockerfile untuk Next.js.
- [x] Service `web` ditambahkan ke Docker Compose.
- [x] Koneksi antar-container memakai hostname Docker: `postgres`, `redis`, `minio`, `n8n`.
- [x] Admin bootstrap otomatis.
- [x] Cache `.next` dan `node_modules` tidak disertakan dalam paket.

## Catatan

Jika port `5432` di Windows dipakai PostgreSQL native, hentikan service PostgreSQL Windows terlebih dahulu agar tidak bentrok dengan container PostgreSQL TaskMate.
