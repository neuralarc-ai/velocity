'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import MainPanel from '@/components/main-panel'
import Sidebar from '@/components/sidebar'
import { PanelRight } from 'lucide-react'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById('sidebar')
        const toggle = document.getElementById('sidebarToggle')
        if (sidebar && toggle && !sidebar.contains(e.target as Node) && !toggle.contains(e.target as Node)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [sidebarOpen, isMobile])

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <div className="layout">
            <button
              className={`sidebar-toggle ${sidebarOpen ? 'hidden' : ''}`}
              id="sidebarToggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle sidebar"
            >
              <PanelRight />
            </button>

            <MainPanel />

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

