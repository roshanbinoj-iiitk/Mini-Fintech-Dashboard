# FinTrack - Personal Finance Tracker

A premium, production-quality Personal Finance Tracker built with Next.js 15, featuring modern UI/UX design, AI-powered insights, and beautiful data visualizations.

## Features

- **Premium Dashboard** - Real-time financial overview with animated stat cards and count-up animations
- **Transaction Management** - Full CRUD operations with Server Actions, filtering, and sorting
- **Spending Analytics** - Interactive charts with Recharts including pie charts and area charts
- **AI-Powered Insights** - Rule-based financial recommendations and health scoring
- **Beautiful UI** - Aceternity UI components with Aurora backgrounds, spotlight effects, and micro-interactions
- **Dark Mode** - Full theme support with next-themes
- **Responsive Design** - Optimized for mobile and desktop with floating navigation
- **MongoDB Backend** - Fast and flexible NoSQL database with Mongoose ORM

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Aceternity UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Database**: MongoDB Cloud
- **Forms**: React Hook Form + Zod validation
- **Theme**: next-themes

## Architecture

```text
User Interface (React Components)
         |
         v
   Server Actions (Next.js)
         |
         v
    Mongoose ORM
         |
         v
   MongoDB Database
```

## Database Schema

### Transaction Model (Mongoose)

```typescript
const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: String, required: true },
  note: { type: String },
}, { timestamps: true });
```

### Indexes

- `date` (descending) - Default sort for chronologically retrieving transactions

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd fintrack
npm install
```

### 2. Set Up MongoDB

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or run MongoDB locally
2. Create a database user and get your connection string
3. No manual migrations needed; Mongoose handles the schema automatically

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your-mongodb-connection-string
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Generate Demo Data

Visit the dashboard and click "Generate Demo Data" to populate the database with sample transactions for testing.

## Project Structure

```
app/
├── page.tsx                 # Landing page with hero
├── layout.tsx               # Root layout with providers
├── dashboard/page.tsx       # Main dashboard
├── transactions/page.tsx    # Transaction listing
├── add-transaction/page.tsx # Add/Edit transaction form
├── analytics/page.tsx       # Charts and visualizations
└── insights/page.tsx        # AI-powered recommendations

actions/
└── transaction-actions.ts   # Server Actions for CRUD

components/
├── aceternity/              # Aceternity UI components
├── dashboard/               # Dashboard-specific components
├── transactions/            # Transaction components
├── charts/                  # Recharts configurations
├── insights/                # Insights components
├── navigation/              # Navigation components
└── ui/                      # shadcn/ui components

models/
└── Transaction.ts           # Mongoose schema and model

lib/
├── mongodb.ts               # MongoDB connection utility
├── calculations.ts          # Financial calculations
├── insights.ts              # Insight generation
└── utils.ts                 # Utility functions

types/
└── transaction.ts          # TypeScript types
```

## Key Features Explained

### Dashboard

- **Stat Cards** - Animated count-up display with GlareCard effects
- **Recent Transactions** - Quick access to latest activity
- **Quick Stats** - Monthly comparisons and savings rate
- **Income vs Expense** - Visual progress bars

### Transactions

- **Advanced Filtering** - By type, category, search text
- **Sorting** - Latest/oldest, highest/lowest amount
- **Delete Confirmation** - Safe deletion with dialog
- **Edit Support** - Modify existing transactions

### Analytics

- **Spending Pie Chart** - Category distribution with colors
- **Monthly Trends** - Area chart for income vs expenses over time
- **Key Metrics** - Summary statistics with animations
- **Top Categories** - Progress bar visualizations

### Insights

- **Rule-Based Analysis** - Spending patterns, savings rate
- **Personalized Tips** - Contextual recommendations
- **Health Score** - Overall financial wellness indicator
- **Visual Cards** - Color-coded by insight type

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add `MONGODB_URI` to Environment Variables
4. Deploy

## Performance

- Server Components by default
- Dynamic imports for heavy charts
- Memoized calculations
- Optimized Framer Motion animations
- MongoDB connection pooling via Mongoose

## License

MIT
