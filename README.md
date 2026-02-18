# 🍔 ACEM-CMOS (College Cafeteria Management System)

A full-stack web application for managing college cafeteria orders, designed to streamline the food ordering process for students and administration.

![Project Status](https://img.shields.io/badge/status-live-success)
![Vercel](https://img.shields.io/badge/frontend-vercel-black)
![Railway](https://img.shields.io/badge/backend-railway-0b0d0e)

## 🚀 Live Demo

- **Frontend (Student/Admin Portal)**: [https://acem-cmos.vercel.app](https://acem-cmos.vercel.app)
- **Backend API**: [https://acemcmos-production.up.railway.app](https://acemcmos-production.up.railway.app)

## ✨ Features

### 👨‍🎓 Student Panel
- **Browse Menu**: View available food items with images and prices.
- **Cart Management**: Add items to cart and review orders.
- **Order Placement**: Place orders using "Cash on Delivery" or "Online Payment".
- **Order History**: Track status of past orders (Pending, Ready, Completed).

### 👨‍💼 Admin Panel
- **Manage Menu**: Add, update, or remove food items (including image URLs).
- **Order Management**: View incoming orders and update their status (e.g., mark as "Ready" or "Delivered").
- **Dashboard**: Overview of cafeteria operations.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios
- **Backend**: Spring Boot (Java), Spring Security, JWT Authentication, Hibernate/JPA
- **Database**: MySQL (Railway Cloud Database)
- **Deployment**: Vercel (Frontend), Railway (Backend & DB)

## ⚙️ Local Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- MySQL

### 1. Clone the Repository
```bash
git clone https://github.com/VADDEKOWSIKSAI/ACEM_CMOS.git
cd ACEM_CMOS
```

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Update `src/main/resources/application.properties` if you want to use a local DB (defaults to Railway DB).
3. Build and Run:
```bash
mvn clean install
mvn spring-boot:run
```
The backend will start at `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

## 📦 Deployment Configuration

### Environment Variables

**Backend (Railway Variables)**
- `JWT_SECRET`: (Secure 256-bit key)
- `JWT_EXPIRATION`: `86400000`
- `MYSQL_URL`: (Auto-configured by Railway)

**Frontend (Vercel Environment Variables)**
- `VITE_API_BASE_URL`: `https://acemcmos-production.up.railway.app/api`
- `VITE_IMAGE_BASE_URL`: `https://acemcmos-production.up.railway.app`

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---
Developed by **VADDE KOWSIK SAI**
