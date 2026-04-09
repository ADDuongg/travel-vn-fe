# Deploy VPS -- Huong dan tung buoc

> File nay la huong dan thuc hanh.
> Moi buoc gom: **lenh can chay** + **giai thich lenh do lam gi**.
> Ban doc tu tren xuong, chay tung lenh theo thu tu.

**Truoc khi deploy:** dien day du cac gia tri trong [PHAN 0: CHECKLIST GIA TRI CAN DIEN](#phan-0-checklist-gia-tri-can-dien) (GitLab Variables, VPS, file `.env*`, registry, runner).

---

## Muc luc

- [PHAN 0: CHECKLIST GIA TRI CAN DIEN](#phan-0-checklist-gia-tri-can-dien)
- [PHAN A: HIEU TONG QUAN](#phan-a-hieu-tong-quan)
- [PHAN B: SETUP VPS LAN DAU](#phan-b-setup-vps-lan-dau)
- [PHAN C: SETUP GITLAB CI/CD](#phan-c-setup-gitlab-cicd)
- [PHAN D: DEPLOY LAN DAU (MANUAL)](#phan-d-deploy-lan-dau-manual)
- [PHAN E: SAU KHI CI/CD HOAT DONG](#phan-e-sau-khi-cicd-hoat-dong)
- [PHAN F: QUAN LY HANG NGAY](#phan-f-quan-ly-hang-ngay)
- [PHAN G: ROLLBACK (QUAY LAI VERSION CU)](#phan-g-rollback-quay-lai-version-cu)
- [PHAN H: TROUBLESHOOTING](#phan-h-troubleshooting)

---

## PHAN 0: CHECKLIST GIA TRI CAN DIEN

> Muc dich: ban **thay placeholder** bang gia tri that cua du an (domain, IP, registry, keys).
> **Khong** commit secret vao git. GitLab Variables + file `.env*` da co trong `.gitignore` / khong commit.

### 0.1 Bang tong hop -- o dau dien gi

| Gia tri | Bat buoc | O dau dien | Vi du (placeholder) |
|---------|----------|------------|---------------------|
| IP hoac hostname VPS | Co | GitLab CI Variable `VPS_HOST` | `<VPS_IP>` hoac `vps.yourdomain.com` |
| User SSH tren VPS | Co | GitLab CI Variable `VPS_USER` | `root` hoac `<ssh_user>` |
| Private key SSH (CI deploy) | Co | GitLab CI Variable `SSH_PRIVATE_KEY` | Noi dung file `~/.ssh/id_ed25519` (key pair da add public key len VPS) |
| Duong dan image GitLab Registry | Co | Tren VPS: bien `CI_REGISTRY_IMAGE`; trong compose: default `registry.gitlab.com/<group>/<project>` | Lay tai GitLab: **Deploy → Container Registry** (copy path, khong co `https://`) |
| Domain frontend staging | Co | `.env.staging` + GitLab Variables (scope staging) cho `VITE_*` | `https://staging.<DOMAIN>` |
| Domain frontend production | Co | `.env.production` + GitLab Variables (scope production) | `https://<DOMAIN>` |
| URL API backend (staging) | Co | `VITE_API_BASE_URL`, `VITE_APP_API_URL` (scope staging) | `https://staging.<DOMAIN>/api` hoac URL API that |
| URL API backend (production) | Co | Cung ten bien (scope production) | `https://<DOMAIN>/api` hoac URL API that |
| URL Socket (staging / prod) | Co | `VITE_SOCKET_URL` (2 scope) | Thuong trung origin frontend hoac origin API (tuy backend) |
| Stripe public key (test) | Neu dung Stripe | Scope **staging** | `pk_test_...` |
| Stripe public key (live) | Neu dung Stripe | Scope **production** | `pk_live_...` |
| `VITE_DROP_CONSOLE` | Co | Staging: `false`; Production: `true` | `false` / `true` |
| Email Certbot (SSL host) | Neu dung certbot tren VPS | `.env.production` | `admin@yourdomain.com` |
| URL hien thi tren GitLab (deploy job) | Khuyen nghi | [`.gitlab-ci.yml`](../.gitlab-ci.yml) trong job `deploy:staging` / `deploy:production` (`environment: url:`) | Sua `https://staging.yourdomain.com` → URL staging that |
| Tag GitLab Runner | Co (neu pipeline khong chay) | [`.gitlab-ci.yml`](../.gitlab-ci.yml) -- `tags: - docker` | Doi thanh tag runner that cua project (VD: `gitlab-org-docker`, `shell`, ...) |

**GitLab tu cung cap (khong can tu tao Variable):** `CI_REGISTRY`, `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD`, `CI_REGISTRY_IMAGE`, `CI_COMMIT_SHORT_SHA` -- pipeline dung de login registry va tag image.

---

### 0.2 GitLab -- Settings → CI/CD → Variables

Thay `<...>` bang gia tri that. Voi bien `VITE_*`, nen dung **Environment scope** = `staging` hoac `production` de moi truong khac nhau.

**Bien chung (khong scope, hoac scope `All`):**

| Key | Gia tri (mau dien) | Ghi chu |
|-----|-------------------|---------|
| `VPS_HOST` | `<VPS_IP>` | IP public hoac hostname SSH |
| `VPS_USER` | `<SSH_USER>` | User co quyen chay `docker` tren VPS |
| `SSH_PRIVATE_KEY` | `<PRIVATE_KEY_MULTILINE>` | Type: Variable; Masked + Protected. Noi dung private key (ca dong BEGIN/END) |

**Scope = `staging` (Environment: staging):**

| Key | Gia tri (mau dien) |
|-----|-------------------|
| `VITE_API_BASE_URL` | `https://staging.<DOMAIN>/api` |
| `VITE_SOCKET_URL` | `https://staging.<DOMAIN>` |
| `VITE_APP_API_URL` | `https://staging.<DOMAIN>/api` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_<...>` |
| `VITE_DROP_CONSOLE` | `false` |

**Scope = `production` (Environment: production):**

| Key | Gia tri (mau dien) |
|-----|-------------------|
| `VITE_API_BASE_URL` | `https://<DOMAIN>/api` |
| `VITE_SOCKET_URL` | `https://<DOMAIN>` |
| `VITE_APP_API_URL` | `https://<DOMAIN>/api` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_<...>` |
| `VITE_DROP_CONSOLE` | `true` |

Neu ten bien trung nhau giua staging va production, **bat buoc** dung Environment scope -- neu khong GitLab se lay 1 gia tri va build sai moi truong.

---

### 0.3 File trong repo (local / tham chieu)

| File | Can sua gi |
|------|------------|
| [`.env.staging`](../.env.staging) | `DOMAIN`, tat ca `VITE_*` khop staging; dong bo y voi GitLab scope staging |
| [`.env.production`](../.env.production) | `DOMAIN`, `VITE_*`, `CERTBOT_EMAIL` khop production |
| [`docker-compose.staging.yml`](../docker-compose.staging.yml) | Dong `image:` -- thay `your-group/your-project` bang path registry that, **hoac** chi dung bien `CI_REGISTRY_IMAGE` tren VPS |
| [`docker-compose.production.yml`](../docker-compose.production.yml) | Giong staging |

---

### 0.4 Tren VPS (`/opt/frontend` hoac shell truoc khi compose)

Dat bien de `docker compose pull` tim dung image (path project tren GitLab Registry):

```bash
# Thay bang path that: Deploy → Container Registry trong GitLab
export CI_REGISTRY_IMAGE=registry.gitlab.com/<group>/<project>
```

Co the them vao `~/.bashrc` hoac file `/opt/frontend/.env` (Docker Compose doc file `.env` cung thu muc neu co) **tren VPS** -- khong commit file nay vao git neu co secret.

---

### 0.5 GitLab Runner

- Pipeline dung `tags: - docker`. Runner gan cho project phai co **cung tag** `docker`.
- Neu runner chi co tag khac: sua [`.gitlab-ci.yml`](../.gitlab-ci.yml) -- tim tat ca `tags:` va doi cho khop.

---

### 0.6 Backend / DNS (khong nam trong file frontend nhung bat buoc de app chay dung)

| Kiem tra | Ghi chu |
|----------|---------|
| DNS | `A` / `AAAA` record: `<DOMAIN>`, `staging.<DOMAIN>` → IP VPS (neu dung subdomain) |
| CORS | Backend cho phep origin frontend staging + production |
| API / Socket | URL trong `VITE_*` trung voi noi backend that lang nghe |

---

### 0.7 Checklist nhanh truoc lan deploy dau

- [ ] `VPS_HOST`, `VPS_USER`, `SSH_PRIVATE_KEY` da set tren GitLab
- [ ] Du 5 bien `VITE_*` cho **staging** va **production** (scope dung)
- [ ] Tren VPS: `CI_REGISTRY_IMAGE` dung path registry; `docker login registry.gitlab.com` thanh cong
- [ ] File `docker-compose.*.yml` nam tai `/opt/frontend` tren VPS (scp hoac git pull)
- [ ] Runner co tag pipeline yeu cau
- [ ] `.env.staging` / `.env.production` da dien (build local / tai lieu), khop GitLab

---

## PHAN A: HIEU TONG QUAN

### A1. Kien truc tong the

```
May developer (Local)
  └── yarn dev                    ← Vite dev server, port 5173

GitLab CI/CD (Tu dong)
  └── push branch staging         ← build image → deploy staging
  └── push branch production      ← build image → deploy production

VPS (1 server)
  ├── frontend-staging            ← container, port 8080
  └── frontend-production         ← container, port 80
```

### A2. 3 moi truong

| Moi truong | Chay o dau | Port | Branch trigger | Console.log |
|------------|-----------|------|----------------|-------------|
| Local      | May dev   | 5173 | (khong deploy) | Co          |
| Staging    | VPS       | 8080 | `staging`      | Co (debug)  |
| Production | VPS       | 80   | `production`   | Khong       |

### A3. Flow deploy

```
1. Developer push code len branch staging (hoac production)
2. GitLab CI tu dong chay: lint → test → build Docker image → push image len registry
3. GitLab CI SSH vao VPS, pull image moi, restart container
4. Nginx trong container serve static files
5. User truy cap web
```

### A4. File nao lam gi

```
Dockerfile                    ← Cong thuc de tao Docker image
                                 (install deps → build → nginx serve)

nginx.conf                    ← Cau hinh Nginx ben trong container
                                 (SPA routing, cache, gzip, security)

docker-compose.staging.yml    ← "Cong thuc" chay container staging
                                 (port 8080, resource limits)

docker-compose.production.yml ← "Cong thuc" chay container production
                                 (port 80, resource limits)

.gitlab-ci.yml                ← Pipeline tu dong
                                 (lint → test → build → deploy)

.env.staging                  ← Bien moi truong staging (API URL, keys)
.env.production               ← Bien moi truong production
```

---

## PHAN B: SETUP VPS LAN DAU

> Chay tren VPS. SSH vao VPS truoc.

### B1. SSH vao VPS

```bash
ssh root@your-vps-ip
```

**Giai thich:** Ket noi vao VPS qua SSH. Thay `your-vps-ip` bang IP that cua VPS.

---

### B2. Update he thong

```bash
sudo apt update
```

**Giai thich:** Tai danh sach packages moi nhat tu server Ubuntu/Debian. Giong nhu "cap nhat danh muc phan mem".

```bash
sudo apt upgrade -y
```

**Giai thich:** Cai dat cac ban cap nhat cho tat ca packages da cai. `-y` la tu dong xac nhan "yes".

---

### B3. Cai Docker

```bash
curl -fsSL https://get.docker.com | sh
```

**Giai thich:**
- `curl` tai file tu internet
- `-fsSL` la cac flag: fail silently, show errors, follow redirects
- `https://get.docker.com` la script cai dat Docker chinh thuc
- `| sh` truyen output (script) vao shell de chay

**Ket qua:** Docker duoc cai dat (bao gom Docker Engine + Docker Compose v2).

---

### B4. Cho phep user chay Docker khong can sudo

```bash
sudo usermod -aG docker $USER
```

**Giai thich:**
- `usermod` thay doi thuoc tinh user
- `-aG docker` them user vao group "docker"
- `$USER` la username hien tai
- Sau lenh nay, ban chay docker khong can `sudo` truoc moi lenh

```bash
newgrp docker
```

**Giai thich:** Ap dung group moi ngay lap tuc (khong can logout/login lai).

---

### B5. Kiem tra Docker da cai thanh cong

```bash
docker --version
```

**Giai thich:** In ra version Docker. VD: `Docker version 27.x.x`. Neu thay version la OK.

```bash
docker compose version
```

**Giai thich:** Kiem tra Docker Compose v2 da san sang. VD: `Docker Compose version v2.x.x`.

---

### B6. Tao thu muc lam viec tren VPS

```bash
mkdir -p /opt/frontend
```

**Giai thich:**
- `mkdir` tao thu muc moi
- `-p` tao ca thu muc cha neu chua co
- `/opt/frontend` la noi chua cac file docker-compose tren VPS

```bash
cd /opt/frontend
```

**Giai thich:** Di chuyen vao thu muc vua tao.

---

### B7. Copy file docker-compose len VPS

> Chay lenh nay **tren may local** (khong phai tren VPS), mo terminal moi.

```bash
scp docker-compose.staging.yml root@your-vps-ip:/opt/frontend/
```

**Giai thich:**
- `scp` copy file qua SSH (Secure Copy)
- Copy file `docker-compose.staging.yml` tu may local len VPS tai duong dan `/opt/frontend/`

```bash
scp docker-compose.production.yml root@your-vps-ip:/opt/frontend/
```

**Giai thich:** Tuong tu, copy file compose cho production.

---

### B8. Login vao GitLab Container Registry (tren VPS)

> Quay lai terminal VPS.

Truoc tien, tao **Personal Access Token** tren GitLab:
1. Vao GitLab → Avatar (goc tren phai) → **Edit Profile** → **Access Tokens**
2. Tao token voi scope: `read_registry`
3. Copy token

Roi chay tren VPS:

```bash
docker login registry.gitlab.com
```

**Giai thich:**
- Login vao GitLab Container Registry de co quyen pull image
- Nhap username (GitLab username) va password (Access Token vua tao)
- Chi can login 1 lan, Docker luu credentials

---

### B9. (Optional) Cai Nginx tren host de lam reverse proxy + SSL

> Buoc nay CHI CAN neu ban muon dung domain voi HTTPS.
> Neu chi test bang IP:port thi bo qua.

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

**Giai thich:**
- `nginx` la web server/reverse proxy tren host (KHAC voi nginx trong Docker container)
- `certbot` va `python3-certbot-nginx` la tool tu dong lay SSL certificate tu Let's Encrypt (mien phi)

```bash
sudo nano /etc/nginx/sites-available/frontend
```

**Giai thich:** Mo text editor `nano` de tao file config Nginx. Paste noi dung sau:

```nginx
# === PRODUCTION ===
# Khi user truy cap yourdomain.com, Nginx chuyen request vao container port 80
server {
    server_name yourdomain.com;

    location / {
        # proxy_pass: chuyen request tu Nginx host vao Docker container
        # 127.0.0.1:80 la container production (map port 80)
        proxy_pass http://127.0.0.1:80;

        # Cac header duoi day giu thong tin goc cua request
        # De backend/app biet IP that cua user (khong phai IP cua Nginx)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# === STAGING ===
# Khi user truy cap staging.yourdomain.com, Nginx chuyen vao container port 8080
server {
    server_name staging.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Luu file (`Ctrl+O`, `Enter`, `Ctrl+X`), roi chay:

```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
```

**Giai thich:**
- `ln -s` tao symbolic link (shortcut)
- Nginx chi doc cac file trong `sites-enabled/`
- Link tu `sites-available/` sang `sites-enabled/` de bat config nay

```bash
sudo nginx -t
```

**Giai thich:** Test config Nginx co loi syntax khong. Neu thay "test is successful" la OK.

```bash
sudo systemctl reload nginx
```

**Giai thich:** Reload Nginx de ap dung config moi (khong downtime).

```bash
sudo certbot --nginx -d yourdomain.com -d staging.yourdomain.com
```

**Giai thich:**
- `certbot --nginx` tu dong lay SSL certificate va cau hinh Nginx
- `-d yourdomain.com -d staging.yourdomain.com` chi dinh domains can SSL
- Certbot se hoi email (de thong bao khi cert gan het han)
- Sau lenh nay, HTTPS tu dong hoat dong

---

## PHAN C: SETUP GITLAB CI/CD

> Phan nay lam tren **GitLab web UI** (khong phai terminal).

### C1. Tao SSH key cho CI/CD

> Chay tren **may local**.

```bash
ssh-keygen -t ed25519 -C "gitlab-ci-deploy" -f gitlab-ci-key
```

**Giai thich:**
- `ssh-keygen` tao cap key SSH (public + private)
- `-t ed25519` dung thuat toan ed25519 (nhanh, bao mat)
- `-C "gitlab-ci-deploy"` comment de nhan biet key nay dung cho gi
- `-f gitlab-ci-key` ten file output
- **Ket qua:** 2 file: `gitlab-ci-key` (private) va `gitlab-ci-key.pub` (public)

---

### C2. Copy public key len VPS

```bash
ssh-copy-id -i gitlab-ci-key.pub root@your-vps-ip
```

**Giai thich:**
- Copy public key len VPS
- Sau lenh nay, ai co private key tuong ung se SSH vao VPS duoc (khong can password)
- GitLab CI se dung private key de SSH vao VPS

---

### C3. Xem noi dung private key (de paste vao GitLab)

```bash
cat gitlab-ci-key
```

**Giai thich:** In noi dung private key ra terminal. Copy TOAN BO (tu `-----BEGIN` den `-----END`).

---

### C4. Them CI/CD Variables tren GitLab

Vao: **GitLab → Project → Settings → CI/CD → Variables → Expand → Add variable**

**Variables chung (khong scope):**

| Key | Value | Type | Protected | Masked |
|-----|-------|------|-----------|--------|
| `VPS_HOST` | IP cua VPS (VD: `103.xxx.xxx.xxx`) | Variable | Yes | No |
| `VPS_USER` | `root` (hoac username khac) | Variable | Yes | No |
| `SSH_PRIVATE_KEY` | Noi dung file `gitlab-ci-key` (private key) | Variable | Yes | Yes |

**Variables cho staging** (khi them, chon Environment scope = `staging`):

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://staging.yourdomain.com/api` |
| `VITE_SOCKET_URL` | `https://staging.yourdomain.com` |
| `VITE_APP_API_URL` | `https://staging.yourdomain.com/api` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_xxx` (test key cua Stripe) |
| `VITE_DROP_CONSOLE` | `false` |

**Variables cho production** (khi them, chon Environment scope = `production`):

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://yourdomain.com/api` |
| `VITE_SOCKET_URL` | `https://yourdomain.com` |
| `VITE_APP_API_URL` | `https://yourdomain.com/api` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_xxx` (live key cua Stripe) |
| `VITE_DROP_CONSOLE` | `true` |

**Giai thich environment scope:**
- GitLab cho phep cung 1 ten bien nhung gia tri khac nhau cho tung environment
- Khi job `build:staging` chay (co `environment: staging`), no doc bien voi scope `staging`
- Khi job `build:production` chay (co `environment: production`), no doc bien voi scope `production`

---

### C5. Tao branch staging va production tren GitLab

> Chay tren **may local**.

```bash
git checkout -b staging
```

**Giai thich:** Tao branch `staging` tu branch hien tai.

```bash
git push -u origin staging
```

**Giai thich:**
- Push branch `staging` len GitLab
- `-u origin staging` set upstream (lan sau chi can `git push`)

```bash
git checkout main
```

```bash
git checkout -b production
```

```bash
git push -u origin production
```

**Giai thich:** Tuong tu, tao va push branch `production`.

---

## PHAN D: DEPLOY LAN DAU (MANUAL)

> Lan dau deploy thu cong de hieu flow. Sau do CI/CD se tu dong lam.
> Chay tren **may local** (noi co source code).

### D1. Build Docker image staging (tren may local)

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://staging.yourdomain.com/api \
  --build-arg VITE_SOCKET_URL=https://staging.yourdomain.com \
  --build-arg VITE_APP_API_URL=https://staging.yourdomain.com/api \
  --build-arg VITE_STRIPE_PUBLIC_KEY=pk_test_xxx \
  --build-arg VITE_DROP_CONSOLE=false \
  -t registry.gitlab.com/your-group/your-project:staging-manual \
  .
```

**Giai thich tung dong:**
- `docker build` bat dau build image tu Dockerfile
- `\` xuong dong (de doc de hon, van la 1 lenh)
- `--build-arg VITE_API_BASE_URL=...` truyen bien moi truong vao buoc build.
  Vite doc cac bien `VITE_*` va nhung vao JS bundle. Moi moi truong truyen gia tri khac nhau.
- `-t registry.gitlab.com/your-group/your-project:staging-manual` dat ten (tag) cho image.
  Format: `registry/group/project:tag`. Thay bang thong tin GitLab thuc te cua ban.
- `.` la build context (thu muc hien tai, noi co Dockerfile)

**Ket qua:** Docker image duoc tao local voi tag `staging-manual`.

---

### D2. Push image len GitLab Registry

```bash
docker login registry.gitlab.com
```

**Giai thich:** Login vao GitLab Container Registry (nhap username + access token).

```bash
docker push registry.gitlab.com/your-group/your-project:staging-manual
```

**Giai thich:** Upload image len GitLab Registry. Sau lenh nay, VPS co the pull image nay.

---

### D3. Pull image va chay container tren VPS

> SSH vao VPS.

```bash
ssh root@your-vps-ip
```

```bash
cd /opt/frontend
```

**Giai thich:** Vao thu muc chua docker-compose files (da tao o buoc B6-B7).

```bash
export CI_REGISTRY_IMAGE=registry.gitlab.com/your-group/your-project
```

**Giai thich:**
- `export` tao bien moi truong trong terminal hien tai
- `CI_REGISTRY_IMAGE` la dia chi registry, duoc dung trong docker-compose file
- Thay bang dia chi thuc te cua project ban tren GitLab

```bash
export IMAGE_TAG=staging-manual
```

**Giai thich:** Set tag cua image se dung. Docker compose doc bien nay de biet pull image nao.

```bash
docker compose -f docker-compose.staging.yml pull
```

**Giai thich:**
- `docker compose` goi Docker Compose
- `-f docker-compose.staging.yml` chi dinh file compose (mac dinh la `docker-compose.yml`)
- `pull` tai image tu registry ve VPS

```bash
docker compose -f docker-compose.staging.yml up -d
```

**Giai thich:**
- `up` tao va start container theo dinh nghia trong compose file
- `-d` chay background (detached mode). Khong co `-d` thi terminal bi khoa.

---

### D4. Kiem tra container dang chay

```bash
docker ps
```

**Giai thich:**
- Liet ke tat ca container dang chay
- Ban se thay `frontend-staging` voi status `Up` va port `0.0.0.0:8080->80/tcp`

```bash
curl -I http://127.0.0.1:8080
```

**Giai thich:**
- `curl` gui HTTP request
- `-I` chi lay headers (khong lay body, nhanh hon)
- Neu thay `HTTP/1.1 200 OK` la staging dang chay OK

---

### D5. Lam tuong tu cho production

```bash
export IMAGE_TAG=prod-manual
```

> Quay lai may local, build image production:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://yourdomain.com/api \
  --build-arg VITE_SOCKET_URL=https://yourdomain.com \
  --build-arg VITE_APP_API_URL=https://yourdomain.com/api \
  --build-arg VITE_STRIPE_PUBLIC_KEY=pk_live_xxx \
  --build-arg VITE_DROP_CONSOLE=true \
  -t registry.gitlab.com/your-group/your-project:prod-manual \
  .
```

```bash
docker push registry.gitlab.com/your-group/your-project:prod-manual
```

> Tren VPS:

```bash
export IMAGE_TAG=prod-manual
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d
```

```bash
curl -I http://127.0.0.1:80
```

**Giai thich:** Tuong tu staging nhung dung production compose file va port 80.

---

## PHAN E: SAU KHI CI/CD HOAT DONG

> Khi da push code va `.gitlab-ci.yml` len GitLab, moi thu tu dong.

### E1. Deploy staging

```bash
git checkout staging
git merge main
git push origin staging
```

**Giai thich:**
- Merge code tu `main` vao `staging`
- Push len GitLab → CI/CD tu dong: lint → test → build image → SSH deploy len VPS
- Xem pipeline tai: GitLab → Project → CI/CD → Pipelines

### E2. Deploy production

```bash
git checkout production
git merge staging
git push origin production
```

**Giai thich:**
- Merge code da test tren staging vao `production`
- Push → CI/CD tu dong deploy len production
- **Luu y:** Chi merge vao production sau khi da test ky tren staging

### E3. Xem pipeline tren GitLab

Vao: **GitLab → Project → CI/CD → Pipelines**

- Xanh la: job thanh cong
- Do: job that bai (click vao xem log de biet loi gi)
- Xam: job chua chay / bi skip

---

## PHAN F: QUAN LY HANG NGAY

> Tat ca lenh duoi chay **tren VPS** (SSH vao truoc).

### F1. Xem container dang chay

```bash
docker ps
```

**Giai thich:** Liet ke tat ca container. Cot quan trong:
- `STATUS`: `Up 2 hours` (dang chay), `Exited` (da dung)
- `PORTS`: port mapping (VD: `0.0.0.0:8080->80/tcp`)
- `NAMES`: ten container (`frontend-staging`, `frontend-production`)

---

### F2. Xem log cua container

```bash
docker logs frontend-staging
```

**Giai thich:** In tat ca log cua container staging. Nginx access log + error log.

```bash
docker logs -f frontend-staging
```

**Giai thich:** `-f` la follow -- xem log real-time (nhu `tail -f`). Nhan `Ctrl+C` de thoat.

```bash
docker logs --tail 50 frontend-production
```

**Giai thich:** `--tail 50` chi xem 50 dong log cuoi cung.

---

### F3. Restart container

```bash
cd /opt/frontend
docker compose -f docker-compose.staging.yml restart
```

**Giai thich:** Restart container staging. Khong pull image moi, chi restart container hien tai.

---

### F4. Dung container

```bash
docker compose -f docker-compose.staging.yml down
```

**Giai thich:**
- `down` dung va xoa container (nhung khong xoa image)
- Dung khi muon dung staging tam thoi

---

### F5. Xem dung luong Docker

```bash
docker system df
```

**Giai thich:** Xem Docker dang chiem bao nhieu disk. Gom: images, containers, volumes, build cache.

---

### F6. Don dep Docker (giai phong disk)

```bash
docker image prune -f
```

**Giai thich:**
- `prune` xoa cac image khong con duoc su dung (dangling images)
- `-f` force, khong hoi xac nhan
- An toan: chi xoa image khong co container nao dang dung

```bash
docker system prune -f
```

**Giai thich:** Don dep tat ca: images, containers, networks khong dung. Manh hon `image prune`.

---

### F7. Xem tat ca image da pull

```bash
docker images
```

**Giai thich:** Liet ke tat ca Docker images tren VPS. Thay size, tag, ngay tao.

---

## PHAN G: ROLLBACK (QUAY LAI VERSION CU)

### G1. Tim image tag cu

```bash
docker images | grep frontend
```

**Giai thich:**
- Liet ke images va loc nhung image co ten chua "frontend"
- Tim tag cu muon quay lai (VD: `staging-abc1234`)

---

### G2. Rollback staging

```bash
cd /opt/frontend
export CI_REGISTRY_IMAGE=registry.gitlab.com/your-group/your-project
export IMAGE_TAG=staging-abc1234
```

**Giai thich:** Set image tag cu (thay `staging-abc1234` bang tag ban muon quay lai).

```bash
docker compose -f docker-compose.staging.yml up -d --force-recreate
```

**Giai thich:**
- `--force-recreate` buoc Docker tao lai container moi (du config khong doi)
- Container se chay voi image tag cu → web quay lai version cu

---

### G3. Rollback production

```bash
export IMAGE_TAG=prod-xyz5678
docker compose -f docker-compose.production.yml up -d --force-recreate
```

**Giai thich:** Tuong tu staging, thay bang production tag cu.

---

### G4. Rollback bang git (de CI/CD tu dong deploy lai)

```bash
git checkout staging
git revert HEAD
git push origin staging
```

**Giai thich:**
- `git revert HEAD` tao 1 commit moi undo commit cuoi cung
- Push len → CI/CD tu dong build va deploy version cu
- Day la cach an toan nhat (co git history ro rang)

---

## PHAN H: TROUBLESHOOTING

### H1. Container khong start

```bash
docker logs frontend-staging
```

**Giai thich:** Xem log de biet loi gi. Thuong gap:
- `nginx: [emerg] ...` → loi config nginx
- `Address already in use` → port 8080/80 da bi chiem

```bash
docker ps -a
```

**Giai thich:** `-a` liet ke CA container (ke ca da dung). Xem STATUS de biet container exit voi code nao.

---

### H2. Port da bi chiem

```bash
sudo lsof -i :8080
```

**Giai thich:**
- `lsof` liet ke processes dang dung port 8080
- Neu co process khac dang dung port nay, can dung no truoc

```bash
sudo kill -9 <PID>
```

**Giai thich:** Kill process dang chiem port. Thay `<PID>` bang process ID tu lenh tren.

---

### H3. Trang web 404 khi refresh

**Nguyen nhan:** Nginx khong co `try_files` → client-side route bi 404.

**Kiem tra:** Xem file `nginx.conf` da co dong nay chua:
```
try_files $uri $uri/ /index.html;
```

**Fix:** Neu khong co, them vao `nginx.conf`, build lai image, deploy lai.

---

### H4. Khong ket noi duoc API

```bash
docker exec frontend-staging printenv | grep VITE
```

**Giai thich:**
- `docker exec` chay lenh ben trong container
- `printenv` in tat ca bien moi truong
- `grep VITE` loc bien bat dau bang VITE
- **Luu y:** VITE_* duoc inject tai BUILD time, khong phai runtime.
  Nen `printenv` co the KHONG thay. Thay vao do, kiem tra trong browser DevTools → Network tab.

**Kiem tra khac:** Mo browser → F12 → Console tab → go `import.meta.env` hoac xem Network requests.

---

### H5. Docker build fail trong CI

Kiem tra GitLab pipeline log:

1. Vao **GitLab → CI/CD → Pipelines → Click vao pipeline do → Click vao job that bai**
2. Doc log tu duoi len de tim dong loi (thuong co mau do)

Loi thuong gap:
- `error: no matching manifest` → sai platform (ARM vs AMD64)
- `COPY failed` → file khong ton tai (kiem tra .dockerignore)
- `yarn install` fail → yarn.lock khong khop voi package.json

---

### H6. SSH deploy fail

```bash
ssh -v root@your-vps-ip
```

**Giai thich:** `-v` la verbose mode, in chi tiet qua trinh ket noi SSH. De debug loi.

Kiem tra:
- Public key da duoc them vao VPS: `cat ~/.ssh/authorized_keys` (tren VPS)
- GitLab CI variable `SSH_PRIVATE_KEY` da duoc set dung
- VPS firewall mo port 22: `sudo ufw status` (tren VPS)

---

### H7. Disk day tren VPS

```bash
df -h
```

**Giai thich:** Xem dung luong disk. `-h` la human-readable (hien thi GB/MB thay vi bytes).

```bash
docker system prune -a -f
```

**Giai thich:**
- `-a` xoa CA images khong dang duoc su dung (khong chi dangling)
- **Chua:** xoa nhieu, free disk nhanh
- **Canh bao:** lan deploy sau phai pull lai image tu dau

---

## SECURITY CHECKLIST

- [ ] Khong commit `.env` co secret vao git
- [ ] `VITE_*` la PUBLIC (trong JS bundle) -- khong dat secret key o day
- [ ] SSH key cho CI/CD duoc set la Protected + Masked tren GitLab
- [ ] VPS firewall chi mo port can thiet (22, 80, 443, 8080)
- [ ] Docker image dung pinned version (node:22-alpine, nginx:1.27-alpine)
- [ ] HTTPS da duoc bat (certbot)
- [ ] Container co restart policy `unless-stopped`
