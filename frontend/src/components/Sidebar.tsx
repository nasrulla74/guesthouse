import { useState } from 'react'
import { Home, Users, Calendar, CreditCard, Settings, LogOut, Star, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Guests', path: '/dashboard/guests' },
  { icon: Calendar, label: 'Bookings', path: '/dashboard/bookings' },
  { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  { icon: Star, label: 'Reviews', path: '/dashboard/reviews' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const userName = user?.email?.split('@')[0] || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <aside style={{ ...styles.sidebar, width: collapsed ? '80px' : '256px' }}>
      <div style={styles.header}>
        {!collapsed && <span style={styles.logoText}>GuestHouse</span>}
        <button onClick={onToggle} style={styles.collapseBtn}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div style={styles.bottom}>
        <div style={{ ...styles.userInfo, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={styles.avatar}>{userInitial}</div>
          {!collapsed && (
            <div style={styles.userDetails}>
              <span style={styles.userName}>{userName}</span>
              <span style={styles.userEmail}>{user?.email}</span>
            </div>
          )}
        </div>
        <button onClick={handleSignOut} style={{ ...styles.navItem, justifyContent: collapsed ? 'center' : 'flex-start' }} title={collapsed ? 'Sign Out' : undefined}>
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    height: '100vh',
    backgroundColor: '#1E1E1E',
    borderRight: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'width 0.2s ease',
    zIndex: 100,
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '60px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#006239',
  },
  collapseBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#888',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
  },
  navItemActive: {
    backgroundColor: '#006239',
    color: '#FAFAFA',
  },
  bottom: {
    padding: '16px 12px',
    borderTop: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#006239',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FAFAFA',
    fontSize: '16px',
    fontWeight: 600,
    flexShrink: 0,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FAFAFA',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '12px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
