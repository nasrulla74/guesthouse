import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
    }, 10000)
    return () => clearTimeout(timeout)
  }, [loading])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background)',
    padding: '16px',
  },
  card: {
    backgroundColor: 'var(--background-secondary)',
    padding: '32px 24px',
    borderRadius: 'var(--border-radius)',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid var(--border)',
  },
  title: {
    margin: '0 0 24px',
    textAlign: 'center',
    color: 'var(--text-primary)',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing)',
  },
  input: {
    padding: '12px 16px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
    fontSize: '12px',
    backgroundColor: 'var(--background-tertiary)',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
  },
  button: {
    padding: '12px 16px',
    borderRadius: 'var(--border-radius)',
    border: 'none',
    backgroundColor: 'var(--primary)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    marginTop: 'var(--spacing)',
    width: '100%',
  },
  error: {
    color: '#FF6B6B',
    marginBottom: 'var(--spacing)',
    padding: 'var(--spacing)',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 'var(--border-radius)',
    fontSize: '14px',
  },
  link: {
    marginTop: '16px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
}
