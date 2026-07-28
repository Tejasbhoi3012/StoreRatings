import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ui/ThemeToggle'
import Avatar from './ui/Avatar'
import Badge from './ui/Badge'

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 h-14 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
              className="md:hidden -ml-1 p-2 rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">SR</span>
            </div>
            <span className="font-semibold text-[15px] text-foreground tracking-tight hidden sm:block">
              StoreRatings
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 rounded-lg pl-1.5 pr-2 py-1.5 hover:bg-surface-hover transition-colors"
                aria-expanded={menuOpen}
              >
                <Avatar name={user.name} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-foreground max-w-[10rem] truncate">
                  {user.name}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-lg animate-scale-in origin-top-right overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                    <Badge variant="primary" className="mt-2 capitalize">{user.role}</Badge>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-error hover:bg-error-bg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg text-sm font-medium transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
