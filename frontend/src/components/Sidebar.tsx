import { Home, Users, Calendar, CreditCard, Settings, LogOut, Star } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Guests', path: '/dashboard/guests' },
  { icon: Calendar, label: 'Bookings', path: '/dashboard/bookings' },
  { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
  { icon: Star, label: 'Reviews', path: '/dashboard/reviews' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoText}>GuestHouse</span>
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
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={styles.bottom}>
        <button style={styles.navItem}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '256px',
    height: '100vh',
    backgroundColor: '#1E1E1E',
    borderRight: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
  },
  logo: {
    padding: '24px',
    borderBottom: '1px solid #333',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#006239',
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
  },
}
