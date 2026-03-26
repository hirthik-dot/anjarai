# Anjaraipetti E-Commerce Platform

A full-stack eCommerce platform for homemade masala products built with:

- **Frontend (client)** — React + Vite + Tailwind CSS
- **Admin Panel (admin)** — React + Vite + Tailwind CSS
- **Backend (server)** — Node.js + Express + MongoDB + Cloudinary

## Project Structure

```
commerce/
├── client/      # Customer-facing React frontend
├── admin/       # Admin dashboard (React)
└── server/      # Express REST API + Socket.io
```

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/debugmode06/E-commerce.git
cd E-commerce
```

### 2. Setup the backend
```bash
cd server
cp .env.example .env     # Fill in your real credentials
npm install
node index.js
```

### 3. Setup the frontend
```bash
cd client
npm install
npm run dev
```

### 4. Setup the admin panel
```bash
cd admin
npm install
npm run dev
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:
- MongoDB Atlas URI
- JWT secret
- Cloudinary credentials
- Gmail App Password (for OTP emails)

## Features

- OTP-based email authentication
- Product management via Admin Panel
- Cloudinary image uploads
- Real-time Socket.io notifications
- Razorpay payment integration
