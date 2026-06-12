'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, PiggyBank, BarChart3, Shield } from 'lucide-react';
import { AuroraBackground } from '@/components/aceternity/aurora-background';
import { Spotlight } from '@/components/aceternity/spotlight';
import { GlareCard } from '@/components/aceternity/glare-card';
import { GridBackground } from '@/components/aceternity/grid-background';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description: 'Gain deep insights into your spending patterns with beautiful visualizations.',
    color: '#0891b2',
  },
  {
    icon: PiggyBank,
    title: 'Budget Tracking',
    description: 'Set budgets, track expenses, and watch your savings grow over time.',
    color: '#10b981',
  },
  {
    icon: BarChart3,
    title: 'AI Insights',
    description: 'Get personalized recommendations powered by intelligent analysis.',
    color: '#2563eb',
  },
  {
    icon: Shield,
    title: 'Secure Data',
    description: 'Your financial data is encrypted and protected at enterprise grade.',
    color: '#8b5cf6',
  },
];

export default function Home() {
  return (
    <AuroraBackground className="min-h-screen">
      <Spotlight className="-top-40 left-0 md:left-60" fill="#0891b2" />
      <Spotlight className="-top-40 right-0 md:right-60" fill="#2563eb" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 md:pt-40">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400"
          >
            <TrendingUp className="h-4 w-4" />
            Premium Finance Tracking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Take Control of Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Money
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Track expenses, monitor income, and uncover smarter financial habits with AI-powered insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-semibold text-foreground shadow-lg shadow-cyan-500/25 transition-shadow hover:shadow-xl hover:shadow-cyan-500/30"
              >
                Start Tracking
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
            <Link href="/transactions">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-8 py-4 text-base font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-accent"
              >
                View Demo
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <GlareCard className="h-full p-6" glareColor={feature.color}>
                <feature.icon className="mb-4 h-10 w-10 text-cyan-400" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </GlareCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-32"
        >
          <GridBackground className="rounded-3xl bg-card/50 p-8 md:p-12 lg:p-16">
            <div className="relative z-10">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                  Everything you need to{' '}
                  <span className="text-cyan-400">succeed</span>
                </h2>
                <p className="text-muted-foreground">Personal finance doesn&apos;t have to be complicated</p>
              </div>

              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[
                  { value: '100%', label: 'Clear Overview' },
                  { value: '24/7', label: 'Access Anywhere' },
                  { value: 'AI', label: 'Smart Insights' },
                  { value: 'SSL', label: 'Encrypted' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="mb-2 text-4xl font-bold text-foreground md:text-5xl">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </GridBackground>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
