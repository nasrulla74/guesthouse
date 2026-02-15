import { useState, useEffect } from 'react'
import { Home, Users, Calendar, CreditCard, Settings, LogOut, Star, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

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
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [guestHouseName, setGuestHouseName] = useState('GuestHouse')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    const fetchGuestHouse = async () => {
      const { data } = await supabase.from('guest_houses').select('gh_name, logo_url').limit(1).single()
      if (data?.gh_name) setGuestHouseName(data.gh_name)
      if (data?.logo_url) setLogoUrl(data.logo_url)
    }
    fetchGuestHouse()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const userName = user?.email?.split('@')[0] || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <aside style={{ 
      ...styles.sidebar, 
      width: isMobile ? '260px' : (collapsed ? '64px' : '200px'),
      transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
      left: isMobile ? 0 : undefined,
    }}>
      {isMobile && (
        <div style={styles.mobileHeader}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={styles.logoImage} />
          ) : (
            <span style={styles.logoText}>{guestHouseName}</span>
          )}
          <button onClick={onMobileClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>
      )}
      {!isMobile && (
        <div style={styles.header}>
          {logoUrl && !collapsed && (
            <img src={logoUrl} alt="Logo" style={styles.logoImage} />
          )}
          {!logoUrl && !collapsed && <span style={styles.logoText}>{guestHouseName}</span>}
          <button onClick={onToggle} style={styles.collapseBtn}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      )}
      
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onMobileClose : undefined}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              }}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <Icon size={18} />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div style={styles.bottom}>
        <div style={{ ...styles.userInfo, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}>
          <div style={styles.avatar}>{userInitial}</div>
          {(!collapsed || isMobile) && (
            <div style={styles.userDetails}>
              <span style={styles.userName}>{userName}</span>
              <span style={styles.userEmail}>{user?.email}</span>
            </div>
          )}
        </div>
        <button onClick={handleSignOut} style={{ ...styles.navItem, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }} title={collapsed && !isMobile ? 'Sign Out' : undefined}>
          <LogOut size={18} />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    height: '100vh',
    backgroundColor: 'var(--background-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'transform 0.3s ease, width 0.2s ease',
    zIndex: 100,
  },
  mobileHeader: {
    padding: '12px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '48px',
  },
  closeBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: '10px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '48px',
    gap: '6px',
  },
  logoText: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  logoImage: {
    height: '28px',
    width: 'auto',
    objectFit: 'contain',
  },
  logoCollapsed: {
    height: '24px',
    width: '24px',
    objectFit: 'contain',
    borderRadius: '4px',
  },
  collapseBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flex: 1,
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '4px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 500,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.15s',
  },
  navItemActive: {
    backgroundColor: 'var(--primary)',
    color: '#FAFAFA',
  },
  bottom: {
    padding: '8px 6px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FAFAFA',
    fontSize: '11px',
    fontWeight: 600,
    flexShrink: 0,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  userName: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}
