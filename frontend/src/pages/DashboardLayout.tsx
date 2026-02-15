import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, ChevronRight, Users, Sun, Moon, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [guestHouseName, setGuestHouseName] = useState('')
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const fetchGuestHouse = async () => {
      const { data } = await supabase.from('guest_houses').select('gh_name').limit(1).single()
      if (data?.gh_name) setGuestHouseName(data.gh_name)
    }
    fetchGuestHouse()
  }, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const getBreadcrumb = () => {
    const path = location.pathname
    if (path.includes('settings')) {
      return [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Settings', path: '/dashboard/settings', active: true }
      ]
    }
    return [
      { label: 'Dashboard', path: '/dashboard', active: true }
    ]
  }

  const breadcrumbs = getBreadcrumb()

  return (
    <div style={styles.container}>
      <Sidebar 
        collapsed={isMobile ? true : sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <main style={{ 
        ...styles.main, 
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? '64px' : '200px'),
      }}>
        <div style={styles.topBarBg}>
          <span style={styles.topBarText}>{guestHouseName}</span>
          <div style={styles.topBarActions}>
            <button onClick={toggleTheme} style={styles.topBarBtn}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        
        <div style={styles.topBar}>
          <div style={styles.leftControls}>
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              style={{...styles.menuButton, display: isMobile ? 'flex' : 'none'}}
            >
              <Menu size={24} />
            </button>
            <nav style={styles.breadcrumb}>
              <Link to="/dashboard" style={styles.breadcrumbLink}>
                <Home size={14} />
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} style={styles.breadcrumbItem}>
                  <ChevronRight size={14} style={styles.chevron} />
                  {crumb.active ? (
                    <span style={styles.breadcrumbActive}>{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} style={styles.breadcrumbLink}>{crumb.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {!location.pathname.includes('settings') && (
          <div style={styles.header}>
            <div style={styles.iconBox}>
              <Users size={24} style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <div style={styles.titleRow}>
                <h1 style={styles.title}>Overview & Reviews</h1>
              </div>
              <p style={styles.subtitle}>Auto-updates in 2 min</p>
            </div>
          </div>
        )}

        <div style={{ padding: '0 16px' }}>
          <Outlet />
        </div>
      </main>
      {mobileMenuOpen && isMobile && (
        <div style={styles.overlay} onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--background)',
    display: 'flex',
  },
  main: {
    flex: 1,
    padding: 0,
    transition: 'margin-left 0.2s ease',
    width: '100%',
  },
  topBarBg: {
    backgroundColor: 'var(--primary)',
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarText: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 600,
  },
  topBarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  topBarBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px 12px 30px',
    marginTop: 0,
    flexWrap: 'wrap',
    gap: '8px',
  },
  leftControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingLeft: '30px',
  },
  menuButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'var(--background-secondary)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  breadcrumbItem: {
    display: 'flex',
    alignItems: 'center',
  },
  breadcrumbActive: {
    color: 'var(--primary)',
    fontWeight: 600,
  },
  chevron: {
    color: 'var(--text-muted)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  themeToggle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'var(--background-secondary)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  moreButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--background-secondary)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--background-tertiary)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginTop: '4px',
    fontStyle: 'italic',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
}
