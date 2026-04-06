import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './Footer.css'

export default function Footer() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('github_url, linkedin_url, twitter_url, instagram_url').single()
      .then(({ data }) => data && setProfile(data))
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="social-links">
          <a href={profile?.github_url || 'https://github.com/HTech2005'} target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub"><i className="fab fa-github" /></a>
          <a href={profile?.linkedin_url || '#'} target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn"><i className="fab fa-linkedin" /></a>
          <a href={profile?.twitter_url || '#'} className="social-link" aria-label="Twitter"><i className="fab fa-twitter" /></a>
          <a href={profile?.instagram_url || '#'} className="social-link" aria-label="Instagram"><i className="fab fa-instagram" /></a>
        </div>
        <p className="footer-text">© 2025 Harold MIKPONHOUE. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
