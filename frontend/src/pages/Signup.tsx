import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign Up</h1>
        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>
            Check your email for the confirmation link!
          </div>
        )}
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
            minLength={6}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
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
    padding: 'var(--spacing)',
  },
  card: {
    backgroundColor: 'var(--background-secondary)',
    padding: 'calc(var(--spacing) * 4)',
    borderRadius: 'var(--border-radius)',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid var(--border)',
  },
  title: {
    margin: '0 0 calc(var(--spacing) * 3)',
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
    padding: 'calc(var(--spacing) * 1.5)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
    fontSize: '12px',
    backgroundColor: 'var(--background-tertiary)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  button: {
    padding: 'calc(var(--spacing) * 1.5)',
    borderRadius: 'var(--border-radius)',
    border: 'none',
    backgroundColor: 'var(--primary)',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    marginTop: 'var(--spacing)',
  },
  error: {
    color: '#FF6B6B',
    marginBottom: 'var(--spacing)',
    padding: 'var(--spacing)',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 'var(--border-radius)',
  },
  success: {
    color: '#4CAF50',
    marginBottom: 'var(--spacing)',
    padding: 'var(--spacing)',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 'var(--border-radius)',
  },
  link: {
    marginTop: 'calc(var(--spacing) * 2)',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
}
