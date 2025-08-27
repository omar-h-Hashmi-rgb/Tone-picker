# Deployment Guide

## Local Development Commands

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Mistral AI API key

### Setup & Local Development

1. **Clone and install dependencies**:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

2. **Environment Setup**:
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your Mistral API key
# MISTRAL_API_KEY=your_mistral_api_key_here
# PORT=3001
```

3. **Run Locally** (Two terminals needed):

**Terminal 1 - Backend Server**:
```bash
cd server
npm start
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend Development**:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

4. **Other Local Commands**:
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Backend development with auto-restart (if you add nodemon)
cd server
npm run dev
```

---

## Frontend Deployment (Vercel)

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
# From project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: tone-picker-frontend (or your choice)
# - Directory: ./ (current directory)
# - Override settings? No
```

3. **Set Environment Variables** (if needed for frontend):
```bash
vercel env add VITE_API_URL
# Enter: https://your-backend-url.onrender.com/api
```

### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables if needed:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
6. Click "Deploy"

### Update API URL for Production

After backend deployment, update the API service:

```typescript
// src/services/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com/api'
  : 'http://localhost:3001/api';
```

---

## Backend Deployment (Render)

### Method 1: Render Dashboard (Recommended)

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tone-picker-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Environment Variables**:
   - `MISTRAL_API_KEY`: Your Mistral AI API key
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)

6. Click "Create Web Service"

### Method 2: Render CLI

1. **Install Render CLI**:
```bash
npm install -g @render/cli
```

2. **Login**:
```bash
render login
```

3. **Deploy**:
```bash
cd server
render deploy
```

### Method 3: Using render.yaml (Infrastructure as Code)

The `render.yaml` file is already configured. Just:

1. Push your code to GitHub
2. In Render dashboard, create "New +" → "Blueprint"
3. Connect repository and select the `render.yaml` file
4. Set the `MISTRAL_API_KEY` secret in Render dashboard

---

## Environment Variables Setup

### Frontend (.env for local development)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env for local development)
```env
MISTRAL_API_KEY=your_mistral_api_key_here
PORT=3001
NODE_ENV=development
```

### Production Environment Variables

**Vercel (Frontend)**:
- `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

**Render (Backend)**:
- `MISTRAL_API_KEY`: Your Mistral AI API key
- `NODE_ENV`: `production`
- `PORT`: `10000`

---

## Post-Deployment Steps

1. **Test the deployed frontend**: Visit your Vercel URL
2. **Test the backend**: Visit `https://your-backend-url.onrender.com/api/health`
3. **Update CORS settings** if needed in `server/index.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

4. **Update frontend API URL** in production build

---

## Troubleshooting

### Common Issues

**Frontend not connecting to backend**:
- Check API URL in browser network tab
- Verify backend is running and accessible
- Check CORS configuration

**Backend deployment fails**:
- Verify all environment variables are set
- Check build logs in Render dashboard
- Ensure `package.json` has correct start script

**API key issues**:
- Verify Mistral API key is valid and has credits
- Check environment variable name matches exactly
- Restart services after adding environment variables

### Useful Commands for Debugging

```bash
# Check if backend is accessible
curl https://your-backend-url.onrender.com/api/health

# Test local backend
curl http://localhost:3001/api/health

# Check frontend build
npm run build && npm run preview
```

---

## Scaling & Optimization

### Performance Tips
- Enable caching in backend (already implemented)
- Use CDN for static assets (Vercel handles this)
- Monitor API usage and costs
- Implement request rate limiting (already implemented)

### Monitoring
- Use Vercel Analytics for frontend metrics
- Monitor Render service logs for backend issues
- Set up alerts for API failures

---

## Support

If you encounter issues:
1. Check the service logs in respective dashboards
2. Verify all environment variables are correctly set
3. Test API endpoints individually
4. Check network connectivity and CORS settings