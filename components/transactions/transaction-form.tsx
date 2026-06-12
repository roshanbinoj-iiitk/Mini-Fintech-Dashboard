'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTransactions, createTransaction, updateTransaction } from '@/actions/transaction-actions';
import { categories } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardSpotlight } from '@/components/aceternity/card-spotlight';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Date is required'),
  note: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

export function TransactionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditing = !!editId;

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  useEffect(() => {
    if (isEditing && editId) {
      loadTransaction(editId);
    }
  }, [editId, isEditing]);

  const loadTransaction = async (id: string) => {
    try {
      const transactions = await getTransactions();
      const transaction = transactions.find((t) => t.id === id);
      if (transaction) {
        setValue('amount', transaction.amount);
        setValue('category', transaction.category);
        setValue('type', transaction.type as 'income' | 'expense');
        setValue('date', transaction.date);
        setValue('note', transaction.note || '');
        setType(transaction.type as 'income' | 'expense');
      }
    } catch {
      console.error('Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('category', data.category);
      formData.append('type', data.type);
      formData.append('date', data.date);
      if (data.note) formData.append('note', data.note);

      const result = isEditing && editId ? await updateTransaction(editId, formData) : await createTransaction(formData);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => router.push('/transactions'), 1500);
      } else {
        console.error(result.error);
      }
    } catch {
      console.error('Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = type === 'income' ? categories.income : categories.expense;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <CheckCircle className="h-16 w-16 text-emerald-400" />
        </motion.div>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Transaction Saved!</h2>
        <p className="text-muted-foreground">Redirecting to transactions...</p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/transactions" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Transactions
      </Link>

      <CardSpotlight className="rounded-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-sm">
          <h1 className="mb-6 text-2xl font-bold text-foreground">{isEditing ? 'Edit Transaction' : 'New Transaction'}</h1>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setValue('type', 'expense');
                  setValue('category', '');
                }}
                className={`rounded-xl border p-4 text-center transition-all ${
                  type === 'expense'
                    ? 'border-red-500/50 bg-red-500/10 text-red-400'
                    : 'border-border bg-muted text-muted-foreground hover:bg-zinc-700'
                }`}
              >
                <ArrowLeft className="mx-auto h-5 w-5 rotate-180" />
                <span className="mt-2 block text-sm font-medium">Expense</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setValue('type', 'income');
                  setValue('category', '');
                }}
                className={`rounded-xl border p-4 text-center transition-all ${
                  type === 'income'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-border bg-muted text-muted-foreground hover:bg-zinc-700'
                }`}
              >
                <ArrowLeft className="mx-auto h-5 w-5" />
                <span className="mt-2 block text-sm font-medium">Income</span>
              </button>
            </div>
            <input type="hidden" {...register('type')} />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">₹</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
                className="border-border bg-muted pl-8 text-lg text-foreground placeholder:text-muted-foreground"
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>}
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Category</label>
            <Select value={watch('category')} onValueChange={(value) => value && setValue('category', value)}>
              <SelectTrigger className="border-border bg-muted text-foreground">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-muted border-border">
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-foreground hover:bg-zinc-700">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>}
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Date</label>
            <Input type="date" {...register('date')} className="border-border bg-muted text-foreground" />
            {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>}
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Note (optional)</label>
            <Input {...register('note')} placeholder="Add a note..." className="border-border bg-muted text-foreground placeholder:text-muted-foreground" />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-6 text-lg font-medium ${
              type === 'income'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg hover:shadow-emerald-500/25'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              isEditing ? 'Update Transaction' : 'Add Transaction'
            )}
          </Button>
        </form>
      </CardSpotlight>
    </div>
  );
}
