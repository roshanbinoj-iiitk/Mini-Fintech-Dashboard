'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ArrowLeftRight, PieChart, Lightbulb, Plus, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/analytics', label: 'Analytics', icon: PieChart },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
];

export function FloatingNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          className={cn(
            'relative flex items-center gap-1 rounded-full px-2 py-2',
            'bg-zinc-900/80 backdrop-blur-xl border border-white/10',
            'shadow-2xl shadow-black/50 transition-all duration-300',
            scrolled && 'bg-zinc-900/95 border-white/20'
          )}
        >
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-transparent opacity-50 blur-xl" />

          <Link href="/" className="relative z-10 flex items-center gap-2 px-3">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 blur-sm" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="text-sm font-bold text-white">₹</span>
              </div>
            </div>
            <span className="font-semibold text-white">FinTrack</span>
          </Link>

          <div className="mx-2 h-6 w-px bg-white/10" />

          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{item.label}</span>
              </motion.div>
            </Link>
          ))}

          <div className="mx-2 h-6 w-px bg-white/10" />

          <Link href="/add-transaction">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium text-white shadow-lg shadow-cyan-500/25"
            >
              <Plus className="h-4 w-4" />
              Add
            </motion.button>
          </Link>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative z-10 ml-2 rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </motion.div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="fixed top-4 left-4 right-4 z-50 md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 blur-sm" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="text-sm font-bold text-white">₹</span>
              </div>
            </div>
            <span className="font-semibold text-white">FinTrack</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/add-transaction">
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-zinc-900 border-white/10">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors',
                          pathname === item.href
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </motion.div>
                    </Link>
                  ))}
                  <div className="h-px bg-white/10 my-4" />
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-5 w-5" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5" />
                        Dark Mode
                      </>
                    )}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
}
