# 🎮 Tippy.mn — Монголын стримерүүдэд зориулсан donation платформ

## Бүтэц

```
tippy/
├── backend/          # Node.js + Express + MongoDB
│   ├── server.js
│   ├── models/       # Mongoose schemas (User, Donation, Goal)
│   ├── routes/       # auth, donations, streamers, alerts
│   └── middleware/   # JWT auth
└── frontend/         # React + Vite
    └── src/
        ├── pages/    # Landing, Login, Register, Dashboard, Settings,
        │             # StreamerPage, AlertOverlay (OBS)
        ├── components/
        ├── store.js  # Zustand auth store
        └── api.js    # Axios instance
```

## Технологи

| Давхарга | Технологи |
|----------|-----------|
| Frontend | React 18, React Router 6, Zustand, Framer Motion, Recharts, Axios |
| Backend  | Node.js, Express, Mongoose, JWT, bcrypt, express-rate-limit |
| Database | MongoDB |
| Төлбөр   | QPay, SocialPay (webhook integration) |

## Эхлүүлэх

### 1. MongoDB ажиллуулах
```bash
mongod --dbpath /data/db
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # .env-г засах
npm run dev                 # localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL тохируулах
npm run dev                 # localhost:3000
```

## API endpoints

### Auth
| Method | URL | Тайлбар |
|--------|-----|---------|
| POST | /api/auth/register | Бүртгэл |
| POST | /api/auth/login | Нэвтрэх |
| GET  | /api/auth/me | Өөрийн мэдээлэл |
| PUT  | /api/auth/profile | Профайл засах |

### Donations
| Method | URL | Тайлбар |
|--------|-----|---------|
| POST | /api/donations | Donation үүсгэх |
| POST | /api/donations/confirm | Payment webhook |
| GET  | /api/donations/history | Түүх (auth) |
| GET  | /api/donations/stats | Статистик (auth) |

### Streamers
| Method | URL | Тайлбар |
|--------|-----|---------|
| GET | /api/streamers/:username | Нийтийн профайл |
| GET | /api/streamers | Топ жагсаалт |
| POST | /api/streamers/goal | Goal тавих (auth) |

### Alert (OBS)
| Method | URL | Тайлбар |
|--------|-----|---------|
| GET | /api/alerts/:username | OBS poll endpoint |

## OBS тохируулга

1. OBS → Sources → + → Browser
2. URL: `http://localhost:3000/alert/{username}`
3. Width: 800, Height: 300
4. Custom CSS: `body { background: transparent; }`

## QPay интеграци (production)

```js
// backend/routes/donations.js дотор
// Mock payment URL-г дараах кодоор солих:

const qpayResponse = await axios.post('https://merchant.qpay.mn/v2/invoice', {
  invoice_code: process.env.QPAY_MERCHANT_ID,
  sender_invoice_no: transactionId,
  invoice_receiver_code: 'terminal',
  invoice_description: `Tippy donation - ${senderName}`,
  amount: amount,
  callback_url: `${process.env.API_URL}/api/donations/confirm`,
}, {
  headers: { Authorization: `Bearer ${qpayToken}` }
});
```

## Deployment

```bash
# Backend (Railway / Render / VPS)
npm start

# Frontend (Vercel / Netlify)
npm run build    # dist/ хавтас үүснэ
```

---
Made with 💜 for Mongolian streamers
