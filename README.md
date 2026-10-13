# AI Crypto Paper Trading Platform

Platform paper trading otomatis untuk menguji rekomendasi AI CoinMarketCap secara objektif.

## Fitur Utama

- ✅ **Integrasi CoinMarketCap AI** dengan fallback mode DEMO
- ✅ **Trading otomatis** dengan aturan tetap: TP +20%, SL -10%, Timeout 24 jam
- ✅ **Background worker** untuk monitoring harga dan penutupan posisi otomatis
- ✅ **Dashboard analitik** dengan visualisasi performa
- ✅ **Riwayat transaksi** dan laporan harian
- ✅ **Mode Demo** untuk pengujian tanpa API key

## Tech Stack

- Next.js 15 + TypeScript
- PostgreSQL + Prisma ORM
- BullMQ + Redis (Background jobs)
- Tailwind CSS
- Recharts

## Quick Start

### 1. Jalankan database dengan Docker

```bash
docker-compose up -d postgres redis
```

### 2. Setup environment

```bash
cp .env.example .env
# Edit .env jika perlu
```

### 3. Jalankan migrasi database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Install dependencies

```bash
npm install
```

### 5. Jalankan worker background

```bash
node -e "require('./dist/workers/worker.js')"
# Atau untuk development:
npx tsx src/workers/worker.ts
```

### 6. Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

## Arsitektur

```
├── prisma/schema.prisma      # Database schema
├── src/lib/
│   ├── cmc/client.ts         # CMC API adapter + demo mode
│   ├── trading/engine.ts     # Logika perhitungan P&L
│   └── jobs/                 # Background job definitions
├── src/app/                  # Next.js UI + API routes
└── workers/worker.ts         # Process background worker
```

## Aturan Trading Default

| Parameter | Nilai |
|---|---|
| Modal per transaksi | Rp 1.000.000 |
| Take Profit | +20% |
| Stop Loss | -10% |
| Timeout posisi | 24 jam |
| Biaya transaksi | 0.1% |
| Slippage | 0.05% |

## Mode Demo

Aplikasi berjalan penuh dalam mode demo ketika tidak ada `CMC_API_KEY` yang dikonfigurasi. Mode demo menghasilkan rekomendasi dan harga secara realistis untuk pengujian.

Untuk menggunakan data asli dari CoinMarketCap, tambahkan API key ke file `.env`.

## Monitoring Otomatis

Worker background berjalan setiap 60 detik untuk:
1.  Memeriksa harga semua posisi terbuka
2.  Menutup posisi jika menyentuh TP atau SL
3.  Menutup posisi yang sudah melewati timeout 24 jam
4.  Menjalankan siklus rekomendasi harian

## Status Aplikasi

- **DEMO** - Aplikasi berjalan dengan data simulasi
- **LIVE** - Aplikasi menggunakan data asli dari CoinMarketCap API

Semua transaksi adalah simulasi paper trading. Tidak ada koneksi ke exchange sungguhan.
