@echo off
echo Seeding admin credentials to MongoDB...
echo.
echo Database: houseofsere
echo Collection: admins
echo Username: admin
echo Password: houseofsere2024 (encrypted)
echo.
npm run seed:admin
echo.
pause