import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Store, KeyRound, Building2 } from 'lucide-react'
import { cn } from '../lib/cn'

const NAV_ITEMS = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/stores', label: 'Stores', icon: Store },
  ],
  user: [
    { to: '/user/dashboard', label: 'Browse Stores', icon: Store },
    { to: '/update-password', label: 'Update Password', icon: KeyRound },
  ],
  owner: [
    { to: '/owner/dashboard', label: 'My Store', icon: Building2 },
    { to: '/update-password', label: 'Update Password', icon: KeyRound },
  ],
}

export default function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation()
  const items = NAV_ITEMS[role] || []

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-200 md:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-40 w-64 h-screen md:h-[calc(100vh-3.5rem)] bg-surface border-r border-border p-4',
          'transform transition-transform duration-300 ease-in-out overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0'
        )}
        style={{ top: 'var(--navbar-h, 3.5rem)' }}
      >
        <div className="mb-4 px-2">
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </h2>
        </div>

        <nav>
          <ul className="space-y-1">
            {items.map((item) => {
              const { to, label } = item
              const Icon = item.icon
              const active = location.pathname === to
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 flex-shrink-0', active ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
