import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;
  
  if (!db) {
    console.error('No DB connection');
    return;
  }
  
  const total = await db.collection('transactions').countDocuments();
  console.log('Total transactions:', total);
  
  const first5 = await db.collection('transactions').find().sort({ date: -1, createdAt: -1 }).limit(5).toArray();
  console.log('First 5 transactions:', first5.map(t => ({ date: t.date, createdAt: t.createdAt, amount: t.amount, note: t.note })));
  
  const last5 = await db.collection('transactions').find().sort({ date: -1, createdAt: -1 }).skip(Math.max(0, total - 5)).limit(5).toArray();
  console.log('Last 5 transactions:', last5.map(t => ({ date: t.date, createdAt: t.createdAt, amount: t.amount, note: t.note })));
  
  await mongoose.disconnect();
}
run().catch(console.error);
