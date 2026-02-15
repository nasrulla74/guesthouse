import { useState } from 'react'
import { Sun, Moon, Bell, Shield, User, Key } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(true)

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Settings</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Profile</h2>
        <div style={styles.card}>
          <div style={styles.row}>
            <User size={20} style={{ color: 'var(--text-muted)' }} />
            <div style={styles.field}>
              <span style={styles.label}>Email</span>
              <span style={styles.value}>{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Appearance</h2>
        <div style={styles.card}>
          <div style={styles.row}>
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            <div style={styles.field}>
              <span style={styles.label}>Theme</span>
              <span style={styles.value}>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
            <button onClick={toggleTheme} style={styles.toggleBtn}>
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Notifications</h2>
        <div style={styles.card}>
          <div style={styles.row}>
            <Bell size={20} style={{ color: 'var(--text-muted)' }} />
            <div style={styles.field}>
              <span style={styles.label}>Push Notifications</span>
              <span style={styles.value}>{notifications ? 'Enabled' : 'Disabled'}</span>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)} 
              style={styles.toggleBtn}
            >
              {notifications ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Security</h2>
        <div style={styles.card}>
          <div style={styles.row}>
            <Shield size={20} style={{ color: 'var(--text-muted)' }} />
            <div style={styles.field}>
              <span style={styles.label}>Two-Factor Authentication</span>
              <span style={styles.value}>Not enabled</span>
            </div>
            <button style={styles.toggleBtn}>Enable</button>
          </div>
          <div style={{ ...styles.row, borderTop: '1px solid var(--border)' }}>
            <Key size={20} style={{ color: 'var(--text-muted)' }} />
            <div style={styles.field}>
              <span style={styles.label}>Password</span>
              <span style={styles.value}>••••••••</span>
            </div>
            <button style={styles.toggleBtn}>Change</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '16px',
    maxWidth: '800px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '24px',
    color: 'var(--text-primary)',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  card: {
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  value: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  toggleBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--background-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
}
