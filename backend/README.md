# House of SERE - Backend

This is the backend API server for the House of SERE e-commerce application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env` file and update if needed.

3. Seed admin user:
```bash
npm run seed:admin
```
or run `seed-admin.bat`

4. Start the server:
```bash
npm start
```

## API Endpoints

- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users (admin)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `POST /api/categories/bulk` - Create categories
- `GET /api/categories` - Get all categories
- `GET /api/settings` - Get settings
- `POST /api/settings` - Update settings

## Default Admin Credentials

- Username: admin
- Password: houseofsere2024

## Port

The server runs on port 8080 by default.