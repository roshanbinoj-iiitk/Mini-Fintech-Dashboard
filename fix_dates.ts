import connectToDatabase from './lib/mongodb';
import Transaction from './models/Transaction';
import mongoose from 'mongoose';

async function run() {
  await connectToDatabase();
  console.log('Connected to MongoDB');
  
  const transactions = await Transaction.find().lean();
  let updated = 0;
  for (const t of transactions) {
    if (t.date instanceof Date) {
      // Convert to IST YYYY-MM-DD
      const dateObj = new Date(t.date);
      const str = new Intl.DateTimeFormat('en-CA', { 
        timeZone: 'Asia/Kolkata', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }).format(dateObj);
      
      await mongoose.connection.db?.collection('transactions').updateOne(
        { _id: t._id },
        { $set: { date: str } }
      );
      updated++;
    }
  }
  
  console.log('Updated', updated, 'transactions');
  process.exit(0);
}
run().catch(console.error);
