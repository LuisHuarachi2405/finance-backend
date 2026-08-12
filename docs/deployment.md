# Deployment Guide (VPS + Docker)

Version: 1.0

Deploys the API (Postgres + NestJS app + Caddy reverse proxy) to a VPS via
Docker Compose, replacing the Neon-hosted database used until now.

Domain: `luishuarachi.tech` (frontend, deployed later from this same VPS).
API subdomain: `api.luishuarachi.tech`.

---

# 1. DNS

Before starting the containers, create an **A record** for `api.luishuarachi.tech`
pointing at the VPS's public IP address (at whichever registrar/DNS provider
manages `luishuarachi.tech`). Caddy will not be able to get an HTTPS
certificate until this resolves correctly — give DNS a few minutes to
propagate before the first deploy.

When the frontend is ready, add an A record for `luishuarachi.tech` (and
`www`) too, and uncomment its block in the `Caddyfile`.

---

# 2. VPS prerequisites

SSH into the VPS, then:

```bash
# Install Docker Engine + the Compose plugin (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh

# Allow HTTP/HTTPS (and SSH, if not already open)
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow OpenSSH
ufw enable
```

Clone the repository onto the VPS (or pull a release artifact — whatever your
usual flow is):

```bash
git clone <repo-url> finance-backend
cd finance-backend
```

---

# 3. Configure environment

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and replace every `change-me-*` placeholder:

- `POSTGRES_PASSWORD` — a real password (also used inside `DATABASE_URL`/`DIRECT_URL`).
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — generate with `openssl rand -base64 32`, run twice for two different values.
- `CORS_ORIGIN` — already set to `luishuarachi.tech`; extend it once the frontend has its final domain/subdomain if different.

`.env.production` is git-ignored — it never leaves the VPS.

---

# 4. First deploy

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This builds the API image, starts Postgres, runs `prisma migrate deploy`
automatically (via the image's entrypoint) before the API starts, and brings
up Caddy, which requests an HTTPS certificate for `api.luishuarachi.tech`.

Check it came up clean:

```bash
docker compose -f docker-compose.prod.yml logs -f api
```

Once running, `https://api.luishuarachi.tech/docs` should serve Swagger.

---

# 5. Updating after a change

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations run automatically on every restart of the `api` service (safe to
run repeatedly — `prisma migrate deploy` is idempotent).

---

# 6. Backups

Deliberately **not set up yet** (deferred on purpose to prioritize getting the
deploy working first). Unlike Neon, this Postgres instance has no automatic
backups — until this is addressed, a VPS failure means data loss. A minimal
starting point when ready:

```bash
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup-$(date +%F).sql
```

Wire that into a cron job (and copy the output off the VPS, e.g. to S3/Backblaze)
before treating this deployment as the sole source of truth for real data.

---

# 7. CI/CD (GitHub Actions)

Two workflows live in `.github/workflows/`:

- **`ci.yml`** — runs on every PR targeting `main`: install, lint, build, test.
  Nothing gets merged without passing this.
- **`deploy.yml`** — runs on every push to `main` (i.e. right after a PR is
  merged). Re-runs the same lint/build/test job first; only if it passes does
  the `deploy` job SSH into the VPS and run:
  ```bash
  git pull origin main
  docker compose -f docker-compose.prod.yml up -d --build
  ```

So the day-to-day flow becomes: work on a branch → open a PR → CI checks it →
merge to `main` → it deploys itself. No manual SSH step needed anymore for
routine updates (the manual command in section 5 is still useful for the
very first deploy, or for debugging).

## One-time setup

1. **Generate a dedicated SSH keypair** (don't reuse your personal one) —
   run this locally, not on the VPS:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ./gh-actions-deploy -N ""
   ```
   This creates `gh-actions-deploy` (private key) and `gh-actions-deploy.pub`
   (public key).

2. **Authorize the public key on the VPS** — append it to the deploy user's
   `~/.ssh/authorized_keys`:
   ```bash
   cat gh-actions-deploy.pub | ssh <user>@<vps-ip> "cat >> ~/.ssh/authorized_keys"
   ```

3. **Add repo secrets** on GitHub (`Settings -> Secrets and variables -> Actions`):
   | Secret | Value |
   |---|---|
   | `VPS_HOST` | VPS public IP or hostname |
   | `VPS_USER` | SSH user on the VPS |
   | `VPS_SSH_KEY` | contents of the **private** key (`gh-actions-deploy`) |
   | `VPS_DEPLOY_PATH` | absolute path to the cloned repo on the VPS, e.g. `/home/<user>/finance-backend` |

4. **Delete the local keypair files** once the private key is saved as a
   GitHub secret — they don't need to exist anywhere else.

From then on, merging to `main` deploys automatically. Watch it run under the
repo's **Actions** tab.
