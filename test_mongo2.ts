import connectToDatabase from './lib/mongodb';
import Transaction from './models/Transaction';

async function run() {
  await connectToDatabase();
  console.log('Connected to MongoDB');
  
  const total = await Transaction.countDocuments();
  console.log('Total transactions:', total);
  
  const first5 = await Transaction.find().sort({ date: -1, createdAt: -1 }).limit(5).lean();
  console.log('First 5:', first5.map((t: any) => ({ id: t._id, date: t.date, createdAt: t.createdAt, amount: t.amount, note: t.note })));
  
  const last5 = await Transaction.find().sort({ date: -1, createdAt: -1 }).skip(Math.max(0, total - 5)).limit(5).lean();
  console.log('Last 5:', last5.map((t: any) => ({ id: t._id, date: t.date, createdAt: t.createdAt, amount: t.amount, note: t.note })));
  
  process.exit(0);
}
run().catch(console.error);
