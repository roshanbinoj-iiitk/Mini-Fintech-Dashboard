const mongoose = require('mongoose');
const { Schema } = mongoose;
const dotenv = require('dotenv');
dotenv.config({ path: '/home/roshanbinoj/mini-fintech-dashboard/.env' });

const TransactionSchema = new Schema({}, { strict: false });
const Transaction = mongoose.model('Transaction', TransactionSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const tx = await Transaction.findOne();
  console.log('Sample date:', tx.date, 'Type:', typeof tx.date);
  process.exit(0);
}
check();
