# House of SÈRE Admin Panel

## Setup Instructions

### Prerequisites
1. **MongoDB**: Make sure MongoDB is installed and running on `mongodb://localhost:27017`
2. **Node.js**: Ensure Node.js and npm are installed

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Use the batch script (Windows)
```bash
start-admin.bat
```

#### Option 2: Manual start
1. Start the backend server:
   ```bash
   npm run server
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

### Access URLs
- **Frontend**: http://localhost:8080
- **Admin Login**: http://localhost:8080/admin/login
- **Admin Dashboard**: http://localhost:8080/admin/dashboard
- **Backend API**: http://localhost:8081

### Admin Credentials
- **Username**: admin
- **Password**: houseofsere2024

### Database
- **Database Name**: houseofsere
- **Connection**: mongodb://localhost:27017
- **Admin Collection**: admins (automatically created)

### Features
- ✅ Secure admin login with encrypted passwords
- ✅ JWT-based authentication
- ✅ Protected admin routes
- ✅ MongoDB integration
- ✅ Product management interface
- ✅ Category management
- ✅ Responsive design matching the provided mockups

### API Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify JWT token

### Security Features
- Passwords are hashed using bcrypt
- JWT tokens for session management
- Protected routes requiring authentication
- CORS enabled for frontend-backend communication