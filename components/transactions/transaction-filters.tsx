'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { categoryColors } from '@/types/transaction';
import { ArrowUpRight, ArrowDownLeft, Search, SlidersHorizontal, X, Calendar, CircleDot, Trash2, Edit, Loader2, ChevronLeft, ChevronRight, Download, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { deleteTransaction, deleteManyTransactions } from '@/actions/transaction-actions';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

interface TransactionFiltersProps {
  transactions: Transaction[];
  categories: string[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

type SortOption = 'latest' | 'oldest' | 'highest' | 'lowest';
type FilterType = 'all' | 'income' | 'expense';

export function TransactionFilters({ transactions, categories, totalPages, currentPage, totalCount }: TransactionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchParam = searchParams.get('search') || '';
  const typeFilter = (searchParams.get('type') || 'all') as FilterType;
  const categoryFilter = searchParams.get('category') || 'all';
  const sortBy = (searchParams.get('sortBy') || 'latest') as SortOption;
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const [localSearch, setLocalSearch] = useState(searchParam);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  
  // Optimistic State
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  
  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  // Clear selections when transactions change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [transactions]);

  const updateFilters = useCallback((name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    if (name !== 'page') {
      params.delete('page');
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchParam) {
        updateFilters('search', localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, searchParam, updateFilters]);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    const idToDelete = deleteDialog.id;
    
    // Optimistic Update
    setDeletedIds(prev => new Set(prev).add(idToDelete));
    setDeleteDialog({ open: false, id: null });
    
    try {
      const result = await deleteTransaction(idToDelete);
      if (!result?.success) {
        setDeletedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(idToDelete);
          return newSet;
        });
      }
    } catch {
      setDeletedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(idToDelete);
        return newSet;
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);
    
    // Optimistic Update
    setDeletedIds(prev => {
      const newSet = new Set(prev);
      idsToDelete.forEach(id => newSet.add(id));
      return newSet;
    });
    setSelectedIds(new Set());
    
    try {
      const result = await deleteManyTransactions(idsToDelete);
      if (!result?.success) {
        setDeletedIds(prev => {
          const newSet = new Set(prev);
          idsToDelete.forEach(id => newSet.delete(id));
          return newSet;
        });
      }
    } catch {
      setDeletedIds(prev => {
        const newSet = new Set(prev);
        idsToDelete.forEach(id => newSet.delete(id));
        return newSet;
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const clearFilters = () => {
    setLocalSearch('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const handleExport = () => {
    window.open(`/api/transactions/export?${searchParams.toString()}`, '_blank');
  };

  const displayedTransactions = transactions.filter(t => !deletedIds.has(t.id));
  const hasActiveFilters = searchParam || typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate;

  const toggleSelectAll = () => {
    if (selectedIds.size === displayedTransactions.length && displayedTransactions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedTransactions.map(t => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6 relative">
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 bg-card/50 border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80',
              showFilters && 'border-cyan-500/50 text-cyan-400'
            )}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Button
            id="tour-export-btn"
            variant="outline"
            onClick={handleExport}
            className="border-border bg-card/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          <Select value={sortBy} onValueChange={(v) => updateFilters('sortBy', v)}>
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
                <Select value={typeFilter} onValueChange={(v) => updateFilters('type', v)}>
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
                <Select value={categoryFilter} onValueChange={(v) => v && updateFilters('category', v)}>
                  <SelectTrigger className="w-44 bg-muted border-border text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-muted border-border">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">From:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => updateFilters('startDate', e.target.value)}
                  className="w-auto bg-muted border-border text-muted-foreground [color-scheme:dark]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">To:</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => updateFilters('endDate', e.target.value)}
                  className="w-auto bg-muted border-border text-muted-foreground [color-scheme:dark]"
                />
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

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchParam && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Search: {searchParam}
              <button onClick={() => updateFilters('search', '')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Type: {typeFilter}
              <button onClick={() => updateFilters('type', 'all')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {categoryFilter !== 'all' && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {categoryFilter}
              <button onClick={() => updateFilters('category', 'all')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {startDate && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              From: {startDate}
              <button onClick={() => updateFilters('startDate', '')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {endDate && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              To: {endDate}
              <button onClick={() => updateFilters('endDate', '')} className="ml-2 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Bulk Actions Header */}
      <div id="tour-bulk-actions" className="flex items-center justify-between bg-card/30 p-2 rounded-xl border border-border/50">
        <div className="flex items-center gap-3 px-2">
          <button 
            onClick={toggleSelectAll}
            className="text-muted-foreground hover:text-cyan-400 transition-colors"
            disabled={displayedTransactions.length === 0}
          >
            {selectedIds.size > 0 && selectedIds.size === displayedTransactions.length ? (
              <CheckSquare className="h-5 w-5 text-cyan-400" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            {selectedIds.size > 0 
              ? `${selectedIds.size} selected` 
              : `${totalCount - deletedIds.size} transaction${totalCount - deletedIds.size !== 1 ? 's' : ''} found`}
          </span>
        </div>
        
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                className="h-8 bg-red-600/90 hover:bg-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {displayedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CircleDot className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No transactions found</p>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="mt-2 text-cyan-400">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div id="tour-transactions-list" className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayedTransactions.map((transaction, index) => {
              const isIncome = transaction.type === 'income';
              const color = categoryColors[transaction.category] || '#71717a';
              const isSelected = selectedIds.has(transaction.id);

              return (
                <motion.div
                  key={transaction.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-2xl border bg-card/50 p-4 backdrop-blur-sm transition-all",
                    isSelected ? "border-cyan-500/50 bg-cyan-950/20" : "border-border/50 hover:border-border hover:bg-secondary/50"
                  )}
                >
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full" style={{ backgroundColor: color }} />

                  <button 
                    onClick={() => toggleSelect(transaction.id)}
                    className="flex items-center justify-center h-6 w-6 text-muted-foreground hover:text-cyan-400 transition-colors shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-cyan-400" />
                    ) : (
                      <Square className="h-5 w-5 opacity-50 group-hover:opacity-100" />
                    )}
                  </button>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}20` }}>
                    {isIncome ? (
                      <ArrowDownLeft className="h-5 w-5" style={{ color }} />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" style={{ color }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-medium text-foreground truncate">{transaction.category}</p>
                      <Badge
                        variant="outline"
                        className={cn('text-xs shrink-0 hidden sm:inline-flex', isIncome ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400')}
                      >
                        {isIncome ? 'Income' : 'Expense'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span className="shrink-0">{formatDate(transaction.date)}</span>
                      </div>
                      {transaction.note && (
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="shrink-0 hidden sm:inline">-</span>
                          <span className="truncate max-w-[120px] sm:max-w-48 text-muted-foreground/80">{transaction.note}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-lg font-semibold" style={{ color: isIncome ? '#10b981' : '#ef4444' }}>
                      {isIncome ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="sm:hidden mt-1">
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] px-1 py-0 h-4', isIncome ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400')}
                      >
                        {isIncome ? 'Income' : 'Expense'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-border/50 gap-4">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * 10 + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * 10, totalCount)}</span> of <span className="font-medium text-foreground">{totalCount}</span> entries
          </p>
          
          <div className="flex items-center gap-1 order-1 sm:order-2 bg-card/30 p-1 rounded-xl border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => updateFilters('page', String(currentPage - 1))}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center px-2 hidden sm:flex">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 1) {
                  if (p === 2 || p === totalPages - 1) {
                    return <span key={p} className="text-muted-foreground px-2 text-sm tracking-widest">...</span>;
                  }
                  return null;
                }
                return (
                  <Button
                    key={p}
                    variant={p === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => updateFilters('page', String(p))}
                    className={cn(
                      "h-8 w-8 p-0 rounded-lg text-sm transition-all",
                      p === currentPage 
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>
            
            <div className="flex items-center px-3 sm:hidden text-sm font-medium">
              {currentPage} / {totalPages}
            </div>

            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => updateFilters('page', String(currentPage + 1))}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
            <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
