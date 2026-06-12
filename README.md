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
- **Supabase Backend** - PostgreSQL database with Row Level Security

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

```
User Interface (React Components)
         |
         v
   Server Actions (Next.js)
         |
         v
   Supabase Client
         |
         v
   PostgreSQL Database
```

## Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

- `date` (descending) - For chronological queries
- `type` - For filtering by income/expense
- `category` - For category-based analytics

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd fintrack
npm install
```

### 2. Set Up Supabase

1. Create a project at [Supabase](https://supabase.com)
2. The database table is already created via the migration
3. Get your project URL and anon key from Settings > API

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
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

lib/
├── supabase.ts              # Supabase client
├── supabase-server.ts       # Server-side Supabase client
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
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Environment Variables
4. Deploy

## Performance

- Server Components by default
- Dynamic imports for heavy charts
- Memoized calculations
- Optimized Framer Motion animations
- Supabase connection pooling

## License

MIT
