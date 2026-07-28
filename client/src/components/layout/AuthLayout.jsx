import React from 'react'
import { Star, ShieldCheck, TrendingUp } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'

const HIGHLIGHTS = [
  { icon: Star, text: 'Discover and rate stores in your community' },
  { icon: TrendingUp, text: 'Track ratings trends as a store owner' },
  { icon: ShieldCheck, text: 'Simple, secure account management' },
]

export default function AuthLayout({ children, panelTitle, panelSubtitle }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <span className="font-bold text-sm">SR</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">StoreRatings</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold tracking-tight leading-tight">
            {panelTitle || 'Find and rate the best stores near you.'}
          </h2>
          <p className="mt-3 text-primary-foreground/80 text-[15px] leading-relaxed">
            {panelSubtitle || 'A single place to discover local stores, share honest ratings, and help owners improve.'}
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon
              return (
              <li key={item.text} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-primary-foreground/90">{item.text}</span>
              </li>
              )
            })}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/60">© {new Date().getFullYear()} StoreRatings. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center p-4 sm:p-8">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm animate-slide-up">{children}</div>
      </div>
    </div>
  )
}
