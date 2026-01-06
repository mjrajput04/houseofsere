@echo off
echo Starting House of SERE - Full Stack Application
echo.
echo This will start both frontend and backend servers:
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:8081
echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd /d D:\houseofsere\backend && npm start"
timeout /t 3 /nobreak > nul
echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "cd /d D:\houseofsere\houseofsere-main && npm run dev"
echo.
echo Both servers are starting...
echo.
echo URLs:
echo - Frontend: http://localhost:8081
echo - Backend API: http://localhost:8080/api
echo - Admin Login: http://localhost:8081/admin/login
echo - Admin Dashboard: http://localhost:8081/admin/dashboard
echo.
echo Default Admin Credentials:
echo Username: admin
echo Password: houseofsere2024
echo.
pause