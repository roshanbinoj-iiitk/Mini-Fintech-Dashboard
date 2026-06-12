# FinTrack - Personal Finance Tracker

A premium, production-quality Personal Finance Tracker built with Next.js 15, featuring modern UI/UX design, AI-powered insights (via Groq), and beautiful data visualizations.

## Features

- **Premium Dashboard** - Real-time financial overview with animated stat cards and count-up animations
- **Transaction Management** - Full CRUD operations with Server Actions, filtering, sorting, and pagination
- **Bulk Operations & Export** - Multi-select transactions for bulk deletion and export data to CSV
- **Spending Analytics** - Interactive charts with Recharts including pie charts and area charts
- **AI-Powered Insights** - Strategic financial recommendations using the Groq API (Llama models)
- **Beautiful UI** - Aceternity UI components with Aurora backgrounds, spotlight effects, interactive branding watermarks, and micro-interactions
- **Optimized Performance** - Optimistic UI updates for instant feedback and efficient MongoDB aggregations
- **Dark Mode** - Full theme support with next-themes
- **Responsive Design** - Optimized for mobile and desktop with floating navigation
- **MongoDB Backend** - Fast and flexible NoSQL database with Mongoose ORM
- **IST Timezone Standard** - Consistent 'Asia/Kolkata' timezone handling across all operations

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Aceternity UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Database**: MongoDB Cloud + Mongoose ORM
- **AI**: Groq SDK (Llama models)
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

### 3. Setup AI Insights (Groq)

1. Sign up at [Groq Cloud](https://console.groq.com/)
2. Generate an API Key

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your-mongodb-connection-string
GROQ_API_KEY=your-groq-api-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Generate Demo Data

Visit the dashboard and click "Generate Demo Data" to populate the database with sample transactions for testing.

## Project Structure

```
app/
├── api/                     # API routes (including AI insights)
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

- **Bulk Management** - Multi-select and delete multiple transactions at once
- **CSV Export** - Download filtered transaction data as a CSV file
- **Advanced Filtering & Pagination** - By type, category, search text, with reliable pagination
- **Sorting** - Latest/oldest, highest/lowest amount
- **Optimistic UI** - Instant feedback on deletion actions
- **Edit Support** - Modify existing transactions

### Analytics

- **Spending Pie Chart** - Category distribution with flush segments and vibrant colors
- **Monthly Trends** - Area chart for income vs expenses over time
- **Key Metrics** - Summary statistics with animations
- **Top Categories** - Progress bar visualizations

### Insights

- **AI-Powered Analysis** - Strategic wealth management advice powered by Groq and Llama models
- **Real-time Generation** - On-demand financial insights based on your transaction history
- **Localized** - Output and recommendations formatted in Indian Rupees (₹)
- **Visual Cards** - Premium loading states and interactive UI

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
