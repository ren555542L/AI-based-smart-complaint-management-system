# 🤖 AI-Based Smart Complaint Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) application for managing civic complaints with **AI-powered analysis** using OpenRouter. Built with modern technologies including Tailwind CSS, JWT authentication, and RESTful APIs.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with bcrypt password hashing
- 📋 **Complaint Management** — Full CRUD for civic complaints
- 🤖 **AI Analysis** — OpenRouter AI analyzes complaints for priority, department, summary & response
- 🔍 **Search & Filter** — Search by location, filter by category and status
- 📊 **Dashboard** — Real-time statistics with animated stat cards
- 🎨 **Modern UI** — Dark glassmorphism design with Tailwind CSS & animations
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- 🔒 **Protected Routes** — Auth middleware on all sensitive endpoints
- ☁️ **Deploy-Ready** — Instructions for Render + MongoDB Atlas

---

## 🛠 Tech Stack

| Layer      | Technology                         |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v3   |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT + bcryptjs                    |
| AI         | OpenRouter API (GPT / configurable) |
| Deployment | Render (Backend + Frontend)       |

---

## 📁 Folder Structure

```
AIFSD_ESE/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Signup, login, getMe
│   │   ├── complaintController.js # CRUD, search, filter, stats
│   │   └── aiController.js        # OpenRouter AI analysis
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + adminOnly
│   │   └── errorHandler.js        # Global error + 404 handler
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt
│   │   └── Complaint.js           # Complaint schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── complaintRoutes.js     # /api/complaints/*
│   │   └── aiRoutes.js            # /api/ai/*
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js             # Axios instance + API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ComplaintCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── AIAnalysisResult.jsx
│   │   │   └── DashboardCards.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state & actions
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ComplaintForm.jsx
│   │   │   ├── ComplaintList.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx                # Routes + protected routes
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind + global styles
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)
- OpenRouter account & API key (https://openrouter.ai)

---

### 1. Clone / Open the project

```bash
cd AIFSD_ESE
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env from example
copy .env.example .env
# (Linux/Mac: cp .env.example .env)

# Edit .env with your values (see below)
# Start dev server
npm run dev
```

**Backend `.env` values:**

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/complaint_db
JWT_SECRET=your_very_long_secret_key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
OPENROUTER_MODEL=openai/gpt-3.5-turbo
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# (Optional) Create .env for production
copy .env.example .env

# Start dev server
npm run dev
```

The frontend runs on **http://localhost:5173** and proxies API requests to **http://localhost:5000**.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint          | Access | Description          |
|--------|-------------------|--------|----------------------|
| POST   | /api/auth/signup  | Public | Register new user    |
| POST   | /api/auth/login   | Public | Login & get JWT      |
| GET    | /api/auth/me      | Protected | Get current user  |

### Complaints

| Method | Endpoint                            | Access    | Description             |
|--------|-------------------------------------|-----------|-------------------------|
| POST   | /api/complaints                     | Protected | Submit complaint        |
| GET    | /api/complaints                     | Protected | Get all complaints      |
| GET    | /api/complaints/:id                 | Protected | Get one complaint       |
| PUT    | /api/complaints/:id                 | Protected | Update complaint        |
| DELETE | /api/complaints/:id                 | Protected | Delete complaint        |
| GET    | /api/complaints/search?location=    | Protected | Search by location      |
| GET    | /api/complaints/category/:category  | Protected | Filter by category      |
| GET    | /api/complaints/stats               | Protected | Dashboard statistics    |

### AI

| Method | Endpoint         | Access    | Description            |
|--------|------------------|-----------|------------------------|
| POST   | /api/ai/analyze  | Protected | AI complaint analysis  |

---

## 🧪 Postman Testing Guide

### Setup
1. Base URL: `http://localhost:5000`
2. After login, copy the `token` from the response
3. Add header: `Authorization: Bearer <your_token>`

---

### 1. Signup
**POST** `/api/auth/signup`
```json
{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "password": "password123"
}
```
**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. Login
**POST** `/api/auth/login`
```json
{
  "email": "rahul@gmail.com",
  "password": "password123"
}
```
**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "...",
    "name": "Rahul Kumar",
    "email": "rahul@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. Submit Complaint
**POST** `/api/complaints`
*Header:* `Authorization: Bearer <token>`
```json
{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "title": "Water Leakage Issue",
  "description": "Water pipeline damaged near market area causing road flooding.",
  "category": "Water Supply",
  "location": "Ghaziabad"
}
```
**Expected Response (201):**
```json
{
  "success": true,
  "message": "Complaint submitted successfully",
  "data": {
    "_id": "...",
    "name": "Rahul Kumar",
    "status": "Pending",
    "createdAt": "2026-05-19T..."
  }
}
```

---

### 4. Get All Complaints
**GET** `/api/complaints`
*Header:* `Authorization: Bearer <token>`

**Expected Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 5,
  "data": [...]
}
```

---

### 5. Update Complaint Status
**PUT** `/api/complaints/:id`
*Header:* `Authorization: Bearer <token>`
```json
{
  "status": "In Progress"
}
```
**Expected Response (200):**
```json
{
  "success": true,
  "message": "Complaint updated successfully",
  "data": { "status": "In Progress", ... }
}
```

---

### 6. Search by Location
**GET** `/api/complaints/search?location=Ghaziabad`
*Header:* `Authorization: Bearer <token>`

**Expected Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

---

### 7. AI Analyze Complaint
**POST** `/api/ai/analyze`
*Header:* `Authorization: Bearer <token>`
```json
{
  "title": "Water Leakage Issue",
  "description": "Water pipeline damaged near market area causing road flooding.",
  "category": "Water Supply",
  "location": "Ghaziabad"
}
```
**Expected Response (200):**
```json
{
  "success": true,
  "message": "AI analysis completed successfully",
  "data": {
    "priority": "High",
    "department": "Water",
    "summary": "A damaged water pipeline near the market in Ghaziabad is causing significant flooding.",
    "responseMessage": "Dear Rahul Kumar, we have received your complaint regarding the water pipeline issue in Ghaziabad. Our Water Department team will assess and resolve this on priority. Thank you for reporting.",
    "model": "openai/gpt-3.5-turbo"
  }
}
```

---

## ☁️ Deployment on Render

### Step 1: MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create database user and get connection URI
3. Whitelist all IPs: `0.0.0.0/0` (for Render)

### Step 2: Deploy Backend on Render
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo → select `backend` root directory
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variables:
   ```
   MONGO_URI          = mongodb+srv://...
   JWT_SECRET         = your_secret
   OPENROUTER_API_KEY = sk-or-v1-...
   OPENROUTER_MODEL   = openai/gpt-3.5-turbo
   FRONTEND_URL       = https://your-frontend.onrender.com
   NODE_ENV           = production
   ```
6. Deploy → Copy the backend URL (e.g., `https://ai-complaint-api.onrender.com`)

### Step 3: Deploy Frontend on Render
1. New Static Site → Connect GitHub repo → select `frontend` root
2. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Add Environment Variable:
   ```
   VITE_API_URL = https://ai-complaint-api.onrender.com/api
   ```
4. Deploy!

---

## 🔑 .env.example

### Backend (`backend/.env.example`)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/complaint_db
JWT_SECRET=your_super_secret_jwt_key_here
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-3.5-turbo
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env.example`)
```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

> ⚠️ **Never commit `.env` files. API keys must stay in backend only.**

---

## 📸 Screenshots

| Page | Screenshot |
|------|------------|
| Dashboard | <img width="1907" height="940" alt="image" src="https://github.com/user-attachments/assets/6776233f-6fdf-40d2-a042-b48c6f5c4fab" />
 |
| Complaint List | <img width="1914" height="932" alt="image" src="https://github.com/user-attachments/assets/d44799ea-dd63-4564-ae40-55168e3e9841" />
 |
| Submit Complaint | <img width="1902" height="935" alt="image" src="https://github.com/user-attachments/assets/2c66be7a-7776-4d8b-8ad7-1096bbd4b64b" />
 |
| AI Analysis | <img width="689" height="836" alt="image" src="https://github.com/user-attachments/assets/3e578bf5-80b0-4936-8297-5649b73e46e7" />
 |
| Login | <img width="1901" height="932" alt="image" src="https://github.com/user-attachments/assets/e3e4ba67-e267-41b0-b5f3-300eacace445" />
 |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use and modify.

---

> Built with ❤️ using MERN Stack + AI
