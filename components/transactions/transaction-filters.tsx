'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { categoryColors } from '@/types/transaction';
import { ArrowUpRight, ArrowDownLeft, Search, SlidersHorizontal, X, Calendar, CircleDot, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { deleteTransaction } from '@/actions/transaction-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TransactionFiltersProps {
  transactions: Transaction[];
}

type SortOption = 'latest' | 'oldest' | 'highest' | 'lowest';
type FilterType = 'all' | 'income' | 'expense';

export function TransactionFilters({ transactions }: TransactionFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(searchLower) ||
          (t.note && t.note.toLowerCase().includes(searchLower))
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    switch (sortBy) {
      case 'latest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        result.sort((a, b) => a.amount - b.amount);
        break;
    }

    return result;
  }, [transactions, search, typeFilter, categoryFilter, sortBy]);

  const allCategories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      router.refresh();
    } catch {
      console.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSortBy('latest');
  };

  const hasActiveFilters = search || typeFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-zinc-800',
              showFilters && 'border-cyan-500/50 text-cyan-400'
            )}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-40 bg-card/50 border-border text-muted-foreground hover:text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/add-transaction">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25">
              + Add New
            </Button>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card/50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as FilterType)}>
                  <SelectTrigger className="w-28 bg-muted border-border text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Category:</span>
                <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
                  <SelectTrigger className="w-44 bg-muted border-border text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                  <X className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Search: {search}
              <button onClick={() => setSearch('')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Type: {typeFilter}
              <button onClick={() => setTypeFilter('all')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {categoryFilter !== 'all' && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {categoryFilter}
              <button onClick={() => setCategoryFilter('all')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
      </p>

      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CircleDot className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No transactions match your filters</p>
          <Button variant="ghost" onClick={clearFilters} className="mt-2 text-cyan-400">
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((transaction, index) => {
              const isIncome = transaction.type === 'income';
              const color = categoryColors[transaction.category] || '#71717a';

              return (
                <motion.div
                  key={transaction.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="group relative flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-zinc-900/80"
                >
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full" style={{ backgroundColor: color }} />

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}20` }}>
                    {isIncome ? (
                      <ArrowDownLeft className="h-5 w-5" style={{ color }} />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" style={{ color }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{transaction.category}</p>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', isIncome ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400')}
                      >
                        {isIncome ? 'Income' : 'Expense'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(transaction.date)}
                      {transaction.note && (
                        <>
                          <span>-</span>
                          <span className="truncate max-w-48">{transaction.note}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold" style={{ color: isIncome ? '#10b981' : '#ef4444' }}>
                      {isIncome ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/add-transaction?id=${transaction.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteDialog({ open: true, id: transaction.id })}
                      className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, id: null })} className="text-muted-foreground">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
