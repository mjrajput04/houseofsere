# House of SERE - Frontend

This is the frontend application for House of SERE e-commerce platform, built with React, TypeScript, and Vite.

## Project Structure

This project is now separated into:
- **Frontend**: `D:\houseofsere\houseofsere-main` (this folder)
- **Backend**: `D:\houseofsere\backend`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:8081

## Backend Dependency

Make sure the backend server is running on http://localhost:8080 before starting the frontend.

You can start the backend by:
1. Navigate to `D:\houseofsere\backend`
2. Run `npm install` (first time only)
3. Run `npm start`

Or use the convenience scripts:
- `start-frontend.bat` - Start only frontend
- `D:\houseofsere\start-full-app.bat` - Start both frontend and backend

## URLs

- Frontend: http://localhost:8081
- Backend API: http://localhost:8080/api
- Admin Login: http://localhost:8081/admin/login
- Admin Dashboard: http://localhost:8081/admin/dashboard

## Default Admin Credentials

- Username: admin
- Password: houseofsere2024

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- React Query
- Framer Motion
