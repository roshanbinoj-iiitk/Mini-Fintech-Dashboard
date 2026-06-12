'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { z } from 'zod';
import { getISTDateString } from '@/lib/utils';

const transactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  date: z.string(),
  note: z.string().max(500).optional(),
});

export async function getTransactions(params?: {
  search?: string;
  type?: string;
  category?: string;
  sortBy?: string;
}) {
  try {
    await connectToDatabase();
    
    let query: any = {};
    
    if (params?.search) {
      query.$or = [
        { category: { $regex: params.search, $options: 'i' } },
        { note: { $regex: params.search, $options: 'i' } }
      ];
    }
    
    if (params?.type && params.type !== 'all') {
      query.type = params.type;
    }
    
    if (params?.category && params.category !== 'all') {
      query.category = params.category;
    }

    let sortOption: any = { date: -1, createdAt: -1 };
    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'latest': sortOption = { date: -1, createdAt: -1 }; break;
        case 'oldest': sortOption = { date: 1, createdAt: 1 }; break;
        case 'highest': sortOption = { amount: -1, createdAt: -1 }; break;
        case 'lowest': sortOption = { amount: 1, createdAt: -1 }; break;
      }
    }

    const data = await Transaction.find(query).sort(sortOption).lean();

    // Map _id to id and sort out mongoose artifacts
    return data.map((doc: any) => {
      const { _id, __v, ...rest } = doc;
      return {
        id: _id.toString(),
        ...rest,
      };
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getPaginatedTransactions(params?: {
  search?: string;
  type?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  try {
    await connectToDatabase();
    
    let query: any = {};
    
    if (params?.search) {
      query.$or = [
        { category: { $regex: params.search, $options: 'i' } },
        { note: { $regex: params.search, $options: 'i' } }
      ];
    }
    
    if (params?.type && params.type !== 'all') {
      query.type = params.type;
    }
    
    if (params?.category && params.category !== 'all') {
      query.category = params.category;
    }

    if (params?.startDate || params?.endDate) {
      query.date = {};
      if (params.startDate) query.date.$gte = params.startDate;
      if (params.endDate) query.date.$lte = params.endDate;
    }

    let sortOption: any = { date: -1, createdAt: -1 };
    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'latest': sortOption = { date: -1, createdAt: -1 }; break;
        case 'oldest': sortOption = { date: 1, createdAt: 1 }; break;
        case 'highest': sortOption = { amount: -1, createdAt: -1 }; break;
        case 'lowest': sortOption = { amount: 1, createdAt: -1 }; break;
      }
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      Transaction.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      transactions: data.map((doc: any) => {
        const { _id, __v, ...rest } = doc;
        return {
          id: _id.toString(),
          ...rest,
        };
      }),
      totalPages,
      currentPage: page,
      totalCount
    };
  } catch (error) {
    console.error('Error fetching paginated transactions:', error);
    return {
      transactions: [],
      totalPages: 0,
      currentPage: 1,
      totalCount: 0
    };
  }
}

export async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Transaction.distinct('category');
    return categories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createTransaction(formData: FormData) {
  try {
    await connectToDatabase();

    const data = {
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category') as string,
      type: formData.get('type') as 'income' | 'expense',
      date: formData.get('date') as string,
      note: formData.get('note') as string || undefined,
    };

    const validated = transactionSchema.parse(data);

    const transaction = new Transaction({
      ...validated,
      amount: validated.amount,
    });
    
    await transaction.save();

    revalidatePath('/transactions');
    revalidatePath('/dashboard');
    revalidatePath('/analytics');
    revalidatePath('/insights');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.flatten().fieldErrors };
    }
    console.error('Error creating transaction:', error);
    return { success: false, error: 'Failed to create transaction' };
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  try {
    await connectToDatabase();

    const data = {
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category') as string,
      type: formData.get('type') as 'income' | 'expense',
      date: formData.get('date') as string,
      note: formData.get('note') as string || undefined,
    };

    const validated = transactionSchema.parse(data);

    await Transaction.findByIdAndUpdate(id, {
      ...validated,
      amount: validated.amount,
    });

    revalidatePath('/transactions');
    revalidatePath('/dashboard');
    revalidatePath('/analytics');
    revalidatePath('/insights');

    return { success: true };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { success: false, error: 'Failed to update transaction' };
  }
}

export async function deleteTransaction(id: string) {
  try {
    await connectToDatabase();

    await Transaction.findByIdAndDelete(id);

    revalidatePath('/transactions');
    revalidatePath('/dashboard');
    revalidatePath('/analytics');
    revalidatePath('/insights');

    return { success: true };
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { success: false, error: 'Failed to delete transaction' };
  }
}

export async function seedDatabase() {
  try {
    await connectToDatabase();

    // Check if data already exists
    const count = await Transaction.countDocuments();

    if (count && count > 0) {
      return { success: false, message: 'Database already seeded' };
    }

    const nowStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const now = new Date(nowStr);
    const seedTransactions: Array<{
      amount: number;
      category: string;
      type: 'income' | 'expense';
      date: string;
      note: string;
    }> = [];

    const expenseCategories = [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Personal Care',
      'Office Expenses',
    ];

    const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Dividends', 'Bonus'];

    // Generate 6 months of data
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);

      // Add 2 income transactions per month
      for (let i = 0; i < 2; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

        seedTransactions.push({
          amount: Math.floor(Math.random() * 3000) + 2000,
          category: incomeCategories[Math.floor(Math.random() * incomeCategories.length)],
          type: 'income',
          date: getISTDateString(date),
          note: ['Monthly income', 'Project payment', 'Client work', 'Side hustle'][
            Math.floor(Math.random() * 4)
          ],
        });
      }

      // Add 8-15 expense transactions per month
      const numExpenses = Math.floor(Math.random() * 8) + 8;
      for (let i = 0; i < numExpenses; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];

        let amount: number;
        switch (category) {
          case 'Food & Dining':
            amount = Math.floor(Math.random() * 80) + 20;
            break;
          case 'Transportation':
            amount = Math.floor(Math.random() * 150) + 30;
            break;
          case 'Shopping':
            amount = Math.floor(Math.random() * 200) + 50;
            break;
          case 'Entertainment':
            amount = Math.floor(Math.random() * 100) + 15;
            break;
          case 'Bills & Utilities':
            amount = Math.floor(Math.random() * 200) + 100;
            break;
          case 'Healthcare':
            amount = Math.floor(Math.random() * 300) + 50;
            break;
          case 'Education':
            amount = Math.floor(Math.random() * 150) + 50;
            break;
          case 'Travel':
            amount = Math.floor(Math.random() * 500) + 100;
            break;
          default:
            amount = Math.floor(Math.random() * 100) + 25;
        }

        const notes: Record<string, string[]> = {
          'Food & Dining': ['Restaurant dinner', 'Grocery shopping', 'Coffee run', 'Takeout'],
          Transportation: ['Uber ride', 'Gas refill', 'Monthly pass', 'Parking fees'],
          Shopping: ['New clothes', 'Electronics', 'Home goods', 'Gifts'],
          Entertainment: ['Movie night', 'Concert tickets', 'Streaming sub', 'Gaming'],
          'Bills & Utilities': ['Electric bill', 'Water bill', 'Internet', 'Phone plan'],
          Healthcare: ['Doctor visit', 'Prescription', 'Gym membership', 'Vitamins'],
          Education: ['Online course', 'Books', 'Workshop', 'Certification'],
          Travel: ['Flight tickets', 'Hotel booking', 'Travel insurance', 'Activities'],
          'Personal Care': ['Haircut', 'Skincare', 'Spa day', 'Nails'],
          'Office Expenses': ['Software sub', 'Office supplies', 'Equipment', 'Networking'],
        };

        const categoryNotes = notes[category] || ['General expense'];

        seedTransactions.push({
          amount,
          category,
          type: 'expense',
          date: getISTDateString(date),
          note: categoryNotes[Math.floor(Math.random() * categoryNotes.length)],
        });
      }
    }

    await Transaction.insertMany(seedTransactions);

    revalidatePath('/transactions');
    revalidatePath('/dashboard');
    revalidatePath('/analytics');
    revalidatePath('/insights');

    return { success: true, count: seedTransactions.length };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: 'Failed to seed database' };
  }
}
