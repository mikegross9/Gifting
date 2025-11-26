# Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Railway (Easiest - Recommended)

Railway provides free hosting with PostgreSQL included!

**Steps:**

1. **Fork/Push to GitHub** (already done!)

2. **Go to Railway:** https://railway.app

3. **Click "New Project" → "Deploy from GitHub repo"**

4. **Select your repository**

5. **Railway will detect the app automatically**

6. **Add PostgreSQL:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set DATABASE_URL

7. **Set Environment Variables:**
   - Click on your service
   - Go to "Variables" tab
   - Add:
     - `JWT_SECRET`: Any random string (e.g., "my-super-secret-key-12345")
     - `ANTHROPIC_API_KEY`: Your Claude API key (optional)
     - `PORT`: 3001

8. **Deploy Backend:**
   - Railway will auto-deploy from your backend directory
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

9. **Deploy Frontend:**
   - Create a new service for frontend
   - Set `VITE_API_URL` to your backend URL from step 8
   - Deploy

10. **Done!** Your app is live! 🎉

---

### Option 2: Render (Also Free)

**Steps:**

1. **Go to Render:** https://render.com

2. **Create New → Blueprint**

3. **Connect your GitHub repository**

4. **Render will use the `render.yaml` file automatically**

5. **Set the ANTHROPIC_API_KEY** in the dashboard (optional)

6. **Deploy!**

The `render.yaml` file is already configured with:
- Backend web service
- Frontend static site
- PostgreSQL database

---

### Option 3: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Set framework preset to "Vite"
5. Set root directory to `frontend`
6. Add environment variable:
   - `VITE_API_URL`: Your backend URL from Railway
7. Deploy

**Backend on Railway:**
Follow Railway steps from Option 1

---

### Option 4: DigitalOcean App Platform

1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Detect components automatically
4. Add managed PostgreSQL database
5. Set environment variables
6. Deploy

---

### Option 5: Heroku

1. Install Heroku CLI
2. Create two apps:
   ```bash
   heroku create gift-planner-backend
   heroku create gift-planner-frontend
   ```
3. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:mini -a gift-planner-backend
   ```
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET="your-secret" -a gift-planner-backend
   heroku config:set ANTHROPIC_API_KEY="your-key" -a gift-planner-backend
   ```
5. Deploy backend:
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<random-secret-key>
ANTHROPIC_API_KEY=<your-anthropic-key>  # Optional
PORT=3001
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=<your-backend-url>
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and can reach backend
- [ ] Database migrations have run
- [ ] Can register a new user
- [ ] Can create a contact
- [ ] Dashboard loads without errors
- [ ] CORS is configured correctly

---

## Troubleshooting

**CORS errors:**
- Make sure backend CORS allows your frontend domain
- Check that VITE_API_URL is set correctly

**Database connection issues:**
- Verify DATABASE_URL is set
- Run `npx prisma migrate deploy` in production

**Build failures:**
- Check that all dependencies are in package.json
- Verify Node version is 18+

**API not responding:**
- Check that PORT environment variable is set
- Verify the health endpoint: `<backend-url>/health`

---

## Cost Estimates

**Free Tier Options:**
- Railway: $5/month free credit (plenty for testing)
- Render: Free tier available (spins down after inactivity)
- Vercel: Free for personal projects
- Supabase: Free tier with 500MB database

**Paid Options (Production):**
- Railway: ~$5-20/month
- Render: ~$7-25/month
- DigitalOcean: ~$12-25/month
- Heroku: ~$7-25/month

---

## Recommendations

**For Testing/Demo:**
- Use Railway (easiest setup, includes database)

**For Production:**
- Railway or Render (good balance of ease and features)
- Add Redis for caching
- Add monitoring (Sentry, LogRocket)
- Set up proper backups

**For Enterprise:**
- AWS/GCP/Azure with managed services
- Kubernetes for scaling
- Dedicated database instances
