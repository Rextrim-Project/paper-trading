# Panduan Setup Server Ubuntu

Berikut prompt lengkap untuk deploy aplikasi AI Crypto Paper Trading di server Ubuntu 22.04/24.04:

---

## 1. Persiapan Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependency dasar
sudo apt install -y curl git ufw

# Setup firewall
sudo ufw allow 22/tcp
sudo ufw allow 3000/tcp
sudo ufw --force enable
```

---

## 2. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Tambahkan user ke grup docker
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install -y docker-compose
```

Logout dan login kembali untuk menerapkan perizinan docker.

---

## 3. Clone Repository & Setup Project

```bash
# Clone project
git clone <REPO_URL> ai-crypto-paper-trading
cd ai-crypto-paper-trading

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env jika perlu: nano .env
```

---

## 4. Jalankan Database Stack

```bash
# Start PostgreSQL dan Redis
docker-compose up -d postgres redis

# Cek status
docker-compose ps
```

---

## 5. Setup Database (jika menggunakan Prisma)

```bash
# Jalankan migrasi database
npx prisma migrate dev --name init

# Seed data awal
npx prisma db seed
```

---

## 6. Build Aplikasi

```bash
# Build Next.js
npm run build
```

---

## 7. Setup Systemd Service

Buat file `/etc/systemd/system/paper-trade.service`:

```ini
[Unit]
Description=AI Crypto Paper Trading App
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/ai-crypto-paper-trading
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Buat file `/etc/systemd/system/paper-trade-worker.service` untuk background worker:

```ini
[Unit]
Description=Paper Trading Background Worker
After=network.target paper-trade.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/ai-crypto-paper-trading
ExecStart=/usr/bin/npx tsx src/workers/worker.ts
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Aktifkan service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now paper-trade
sudo systemctl enable --now paper-trade-worker

# Cek status
sudo systemctl status paper-trade
sudo journalctl -u paper-trade -f
```

---

## 8. Akses Aplikasi

Buka browser:
```
http://<IP_SERVER>:3000
```

---

## 9. Opsional: Pasang Nginx Reverse Proxy

```bash
sudo apt install -y nginx

# Buat config /etc/nginx/sites-available/paper-trade
server {
    listen 80;
    server_name trading.domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

sudo ln -s /etc/nginx/sites-available/paper-trade /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
