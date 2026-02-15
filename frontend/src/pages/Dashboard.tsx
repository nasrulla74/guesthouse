import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button onClick={handleSignOut} style={styles.button}>
          Sign Out
        </button>
      </header>
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Welcome!</h2>
          <p style={styles.text}>Email: {user?.email}</p>
          <p style={styles.text}>User ID: {user?.id}</p>
          <p style={styles.text}>Signed up: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Sample Data</h3>
            <p style={styles.text}>No data yet</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Recent Activity</h3>
            <p style={styles.text}>No activity yet</p>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--background)',
  },
  header: {
    backgroundColor: '#1E1E1E',
    padding: 'calc(var(--spacing) * 2) calc(var(--spacing) * 4)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #333',
  },
  title: {
    margin: 0,
    color: 'var(--text-primary)',
    fontSize: '24px',
  },
  button: {
    padding: 'calc(var(--spacing) * 1) calc(var(--spacing) * 2)',
    borderRadius: 'var(--border-radius)',
    border: 'none',
    backgroundColor: 'var(--primary)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  main: {
    padding: 'calc(var(--spacing) * 4)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 'calc(var(--spacing) * 3)',
    borderRadius: 'var(--border-radius)',
  },
  cardTitle: {
    margin: '0 0 var(--spacing)',
    color: 'var(--text-primary)',
    fontSize: '16px',
    fontWeight: 600,
  },
  text: {
    color: '#888',
    margin: 'calc(var(--spacing) * 0.5) 0',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'calc(var(--spacing) * 2)',
    marginTop: 'calc(var(--spacing) * 2)',
  },
}
