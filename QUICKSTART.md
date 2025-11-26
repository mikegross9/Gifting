# Quick Start Guide

## Local Development (Fastest Way to Try)

### Prerequisites
- Node.js 18+ installed
- No database setup needed (uses SQLite)

### Steps:

1. **Install dependencies:**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

2. **Set up the database:**
```bash
cd backend
# Copy the SQLite schema
cp prisma/schema.dev.prisma prisma/schema.prisma
# Generate Prisma client
npx prisma generate
# Create the database
npx prisma migrate dev --name init
cd ..
```

3. **Configure API Key (Optional for full features):**
Edit `backend/.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY="your-key-here"
```
*Note: The app will work without this, but gift recommendations and card generation will use fallback logic.*

4. **Start the application:**
```bash
# From the root directory
npm run dev
```

This will start:
- Backend API at http://localhost:3001
- Frontend at http://localhost:5173

5. **Open your browser:**
Navigate to http://localhost:5173

6. **Register a new account** and start adding contacts!

---

## Cloud Deployment Options

### Option 1: Railway (Recommended - All-in-one)

Railway can host the full stack with PostgreSQL included.

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway up
```

3. Add PostgreSQL:
```bash
railway add postgresql
```

4. Set environment variables in Railway dashboard:
- `JWT_SECRET`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL` (auto-set by Railway)

### Option 2: Render (Free tier available)

1. Create account at https://render.com
2. Connect your GitHub repository
3. Create a new Web Service for backend
4. Create a new Static Site for frontend
5. Create a PostgreSQL database
6. Set environment variables in dashboard

### Option 3: Vercel + Supabase

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Deploy

**Backend (Railway/Render/Heroku):**
1. Deploy backend separately
2. Use Supabase for PostgreSQL database

---

## Testing the Application

### Sample Workflow:

1. **Register** a new account
2. **Add a contact** - Click "Add Contact" and fill in:
   - Name: "Mom"
   - Relationship: Family
   - Birthday: Pick a date within the next 30 days
   - Preferences: "loves gardening, tea, mystery novels"
   - Budget: $50-$100

3. **View Dashboard** - You'll see upcoming events

4. **Wait for gift recommendation** - In production, the scheduler runs daily. For testing, you can:
   - Set the birthday to be within 7 days
   - Manually trigger the scheduler (see Backend API section)

5. **Approve gifts** - When gifts appear in "Pending Approvals", you can:
   - Approve and order
   - Modify the gift
   - Reject it

6. **Track delivery** - Go to Gifts page to see order status

---

## Troubleshooting

**Port already in use:**
```bash
# Change port in backend/.env
PORT=3002
```

**Prisma errors:**
```bash
cd backend
npx prisma generate
npx prisma migrate reset
```

**API key issues:**
The app works without the Anthropic API key - it uses fallback recommendations.

---

## For Production Deployment

1. Update `backend/prisma/schema.prisma` to use PostgreSQL
2. Set strong JWT_SECRET
3. Add real payment gateway integration
4. Set up email/SMS notifications
5. Configure production database
6. Add monitoring and logging
