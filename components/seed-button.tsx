'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { seedDatabase } from '@/actions/transaction-actions';

export function SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setMessage(null);
    try {
      const result = await seedDatabase();
      if (result.success) {
        setMessage(`Successfully added ${result.count} demo transactions!`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(result.message || result.error || 'Something went wrong');
      }
    } catch {
      setMessage('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        id="tour-seed-data"
        onClick={handleSeed}
        disabled={isSeeding}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-6 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent disabled:opacity-50"
      >
        {isSeeding ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Demo Data
          </>
        )}
      </motion.button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
