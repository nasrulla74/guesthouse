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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    color: '#333',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  main: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    margin: '0 0 1rem',
    color: '#333',
  },
  text: {
    color: '#666',
    margin: '0.5rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
}
