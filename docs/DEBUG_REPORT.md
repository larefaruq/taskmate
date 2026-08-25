# TaskMate Debug Report

## Status

The project was reviewed and patched as a consistent starter using the dependency versions already present in `apps/web/package.json`.

## Fixed

1. **NextAuth version/API mismatch**
   - Project dependency: `next-auth@4.24.15`.
   - Replaced Auth.js/NextAuth v5-style `handlers`, `auth()`, `signIn()`, `signOut()` exports with NextAuth v4 `authOptions` + `NextAuth(authOptions)`.
   - Route handler now exports `GET`/`POST` from the v4 handler.

2. **Login route location**
   - Moved `app/api/login/page.tsx` to `app/login/page.tsx`.
   - `/login` is now the real login page.

3. **Session/role handling**
   - Server pages use `getServerSession(authOptions)`.
   - JWT and session callbacks carry `id` and `role`.
   - `/dashboard` redirects by role.
   - `/admin` rejects non-admin users.
   - `/user` rejects non-user users.

4. **Credential safety**
   - Root `/` no longer dumps the `User` table or password hashes.
   - Register API never returns the password hash.
   - Register input is validated with Zod.

5. **Dockerization**
   - Added `apps/web/Dockerfile`.
   - Added `web` service to `infrastructure/docker-compose.yaml`.
   - Container-to-container URLs use Docker service names (`postgres`, `redis`, `minio`, `n8n`).
   - Web container runs `prisma db push`, seeds the admin account, then starts Next.js.

6. **Admin bootstrap**
   - Added `apps/web/scripts/seed-admin.mjs`.
   - Default admin is controlled by `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `infrastructure/.env`.

## Validation performed

- Prisma/TypeScript static type-check (`npx tsc --noEmit`) passed on the patched source using the project's installed dependencies.
- `docker-compose.yaml` was parsed successfully with a YAML parser and contains the expected services: `web`, `postgres`, `redis`, `pgadmin`, `minio`, `n8n`.

## Environment limitation

The current tool environment does not have Docker available and could not download Next.js SWC binaries from npm, so a full Docker build/run could not be executed here. The project is prepared for the user's Docker Desktop environment; first run should be:

```bash
cd infrastructure
docker compose up --build -d
```

## Expected first-run endpoints

- Web: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- pgAdmin: `http://localhost:5050`
- MinIO Console: `http://localhost:9001`
- n8n: `http://localhost:5678`

## Default admin

- Email: `admin@taskmate.com`
- Password: `admin123`
- Role: `ADMIN`

Change the default production password/secret before deployment to the public internet.
