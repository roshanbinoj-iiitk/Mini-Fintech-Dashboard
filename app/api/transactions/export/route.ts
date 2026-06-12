import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy');

    let query: any = {};
    if (search) {
      query.$or = [
        { category: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } }
      ];
    }
    if (type && type !== 'all') {
      query.type = type;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    let sortOption: any = { date: -1, createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case 'latest': sortOption = { date: -1, createdAt: -1 }; break;
        case 'oldest': sortOption = { date: 1, createdAt: 1 }; break;
        case 'highest': sortOption = { amount: -1, createdAt: -1 }; break;
        case 'lowest': sortOption = { amount: 1, createdAt: -1 }; break;
      }
    }

    const data = await Transaction.find(query).sort(sortOption).lean();

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = data.map((t: any) => [
      t.date,
      t.type,
      t.category,
      t.amount,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(',')]
      .concat(rows.map(row => row.join(',')))
      .join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="transactions_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting transactions:', error);
    return new Response('Error exporting data', { status: 500 });
  }
}
