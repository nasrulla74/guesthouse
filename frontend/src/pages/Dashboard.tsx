import { useState } from 'react'
import { Home, ChevronRight, Star, MoreHorizontal, Users, Sun, Moon } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StatsCards from '../components/StatsCards'
import ReviewTable from '../components/ReviewTable'
import { useTheme } from '../context/ThemeContext'

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={styles.container}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main style={{ ...styles.main, marginLeft: sidebarCollapsed ? '80px' : '256px' }}>
        <div style={styles.topBar}>
          <nav style={styles.breadcrumb}>
            <Home size={14} style={styles.breadcrumbIcon} />
            <ChevronRight size={14} style={styles.chevron} />
            <span style={styles.breadcrumbText}>Manage Guests</span>
            <ChevronRight size={14} style={styles.chevron} />
            <span style={styles.breadcrumbActive}>Guests Reviews</span>
          </nav>
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
            <Users size={32} style={{ color: '#FAFAFA' }} />
          </div>
          <div>
            <div style={styles.titleRow}>
              <h1 style={styles.title}>Overview & Reviews</h1>
              <Star size={20} style={{ color: '#444', cursor: 'pointer' }} />
            </div>
            <p style={styles.subtitle}>Auto-updates in 2 min</p>
          </div>
        </div>

        <StatsCards />
        <ReviewTable />
      </main>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    display: 'flex',
  },
  main: {
    flex: 1,
    padding: '32px',
    transition: 'margin-left 0.2s ease',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#666',
  },
  breadcrumbIcon: {
    cursor: 'pointer',
    color: '#666',
  },
  breadcrumbText: {
    cursor: 'pointer',
    color: '#666',
  },
  breadcrumbActive: {
    color: '#006239',
    fontWeight: 700,
  },
  chevron: {
    color: '#444',
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
    backgroundColor: '#1E1E1E',
    border: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
    cursor: 'pointer',
  },
  moreButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#1E1E1E',
    border: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '40px',
  },
  iconBox: {
    width: '64px',
    height: '64px',
    backgroundColor: '#333',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#FAFAFA',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: '#666',
    fontWeight: 500,
    marginTop: '4px',
    fontStyle: 'italic',
  },
}
