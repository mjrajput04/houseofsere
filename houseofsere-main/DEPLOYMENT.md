# Separate Frontend & Backend Deployment

## Project Structure
```
houseofsere-main/
├── backend/           # Backend API (Node.js + Express)
├── src/              # Frontend (React + Vite)
├── package.json      # Frontend dependencies
└── backend/package.json # Backend dependencies
```

## Local Development

### Backend (Port 8080)
```bash
cd backend
npm install
npm run dev
```

### Frontend (Port 5173)
```bash
# In root directory
npm install
npm run dev
```

## Production Deployment

### Backend Deployment Options:

#### 1. Vercel (Recommended)
```bash
cd backend
vercel
# Set environment variables in Vercel dashboard
```

#### 2. Railway
```bash
cd backend
railway login
railway init
railway up
```

#### 3. Heroku
```bash
cd backend
heroku create your-backend-app
git subtree push --prefix=backend heroku main
```

### Frontend Deployment Options:

#### 1. Vercel (Recommended)
```bash
# In root directory
vercel
# Set VITE_API_URL to your backend URL
```

#### 2. Netlify
```bash
# In root directory
npm run build
# Upload dist/ folder to Netlify
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
PORT=8080
```

### Frontend (.env.local)
```
VITE_API_URL=https://your-backend-url.com
```

## URLs After Deployment
- Frontend: https://your-frontend.vercel.app
- Backend API: https://your-backend.vercel.app
- Admin: https://your-frontend.vercel.app/admin/login