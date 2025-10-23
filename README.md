# Gift Planning Application

An automated gift planning and delivery application that helps you never forget a birthday or special occasion again!

## Features

- **Contact Management**: Store family members, friends, and other important people with their birthdays
- **Holiday Tracking**: Automatic tracking of holidays like Mother's Day, Valentine's Day, etc.
- **AI-Powered Gift Recommendations**: Smart gift suggestions based on recipient preferences
- **Automated Card Writing**: AI-generated personalized greeting cards
- **Approval Workflow**: Review and approve gifts before they're sent
- **Auto-Send Fallback**: Gifts are automatically sent if not reviewed in time
- **Gift Ordering**: Integrated gift purchasing and delivery

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- React Query for state management

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication
- Node-cron for scheduling

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Gifting
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:

Create `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gift_planning"
JWT_SECRET="your-secret-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
PORT=3001
```

Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3001
```

4. Set up the database:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
cd ..
```

5. Start the development servers:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

## Project Structure

```
gift-planning-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
└── package.json
```

## How It Works

1. **Add Contacts**: Enter information about family members and friends, including their birthdays and preferences
2. **Set Preferences**: Configure how far in advance you want to be notified and approve gifts
3. **Automatic Scheduling**: The system monitors upcoming birthdays and holidays
4. **Gift Recommendations**: AI suggests appropriate gifts based on the recipient's profile
5. **Approval Window**: You receive notifications to approve or modify suggested gifts
6. **Auto-Send**: If you don't respond in time, the gift is automatically ordered and sent
7. **Card Generation**: Personalized greeting cards are automatically written using AI

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Gifts
- `GET /api/gifts` - Get all gifts
- `GET /api/gifts/pending` - Get pending approvals
- `POST /api/gifts/:id/approve` - Approve a gift
- `POST /api/gifts/:id/modify` - Modify a gift
- `POST /api/gifts/:id/reject` - Reject a gift

### Events
- `GET /api/events/upcoming` - Get upcoming events
- `POST /api/events` - Create custom event

## License

MIT
