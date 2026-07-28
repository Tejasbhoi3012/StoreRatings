import React, { useState } from 'react'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'

export default function DashboardLayout({ role, title, description, actions, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleSidebar={() => setIsSidebarOpen(o => !o)} />
      <div className="flex">
        <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {(title || actions) && (
              <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
                <div>
                  {title && <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>}
                  {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
