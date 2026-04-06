import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import './Admin.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  // Déjà connecté → redirect direct
  if (!authLoading && user) return <Navigate to="/admin" replace />

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/admin')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">Harold.M</div>
        <h2>Backoffice</h2>
        <p className="login-sub">Connectez-vous pour gérer votre portfolio</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@email.com" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <p className="form-feedback error">{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Connexion...</> : <><i className="fas fa-sign-in-alt" /> Se connecter</>}
          </button>
        </form>
      </div>
    </div>
  )
}
