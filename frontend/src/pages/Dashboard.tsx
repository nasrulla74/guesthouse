import { useState } from 'react'
import { Home, ChevronRight, Star, MoreHorizontal, Users, Sun, Moon, Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StatsCards from '../components/StatsCards'
import ReviewTable from '../components/ReviewTable'
import { useTheme } from '../context/ThemeContext'

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

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
        marginLeft: isMobile ? 0 : (sidebarCollapsed ? '80px' : '256px'),
        padding: isMobile ? '16px' : '32px',
      }}>
        <div style={styles.topBar}>
          <div style={styles.leftControls}>
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              style={{...styles.menuButton, display: isMobile ? 'flex' : 'none'}}
            >
              <Menu size={24} />
            </button>
            <nav style={styles.breadcrumb}>
              <Home size={14} style={styles.breadcrumbIcon} />
              <ChevronRight size={14} style={styles.chevron} />
              <span style={styles.breadcrumbText}>Manage Guests</span>
              <ChevronRight size={14} style={styles.chevron} />
              <span style={styles.breadcrumbActive}>Guests Reviews</span>
            </nav>
          </div>
          <div style={styles.actions}>
            <button onClick={toggleTheme} style={styles.themeToggle}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button style={styles.moreButton}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        <div style={styles.header}>
          <div style={styles.iconBox}>
            <Users size={isMobile ? 24 : 32} style={{ color: 'var(--text-primary)' }} />
          </div>
          <div>
            <div style={styles.titleRow}>
              <h1 style={{...styles.title, fontSize: isMobile ? '18px' : '24px'}}>Overview & Reviews</h1>
              <Star size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            </div>
            <p style={styles.subtitle}>Auto-updates in 2 min</p>
          </div>
        </div>

        <StatsCards />
        <ReviewTable />
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
    padding: '32px',
    transition: 'margin-left 0.2s ease, padding 0.2s ease',
    width: '100%',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  leftControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-muted)',
    flexWrap: 'wrap',
  },
  breadcrumbIcon: {
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
  breadcrumbText: {
    cursor: 'pointer',
    color: 'var(--text-muted)',
  },
  breadcrumbActive: {
    color: 'var(--primary)',
    fontWeight: 700,
  },
  chevron: {
    color: 'var(--border)',
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
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  iconBox: {
    width: '64px',
    height: '64px',
    backgroundColor: 'var(--background-tertiary)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '24px',
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
