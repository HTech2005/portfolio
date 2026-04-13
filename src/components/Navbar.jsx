import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100)
      const sections = ['home', 'about', 'services', 'portfolio', 'parcours', 'contact']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) setActive(id)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">Harold.M</div>
        <ul className={`nav-menu${menuOpen ? ' active' : ''}`}>
          {['home', 'about', 'services', 'portfolio', 'parcours', 'contact'].map(id => (
            <li key={id}>
              <button className={`nav-link${active === id ? ' active' : ''}`} onClick={() => scrollTo(id)}>
                {id === 'home' ? 'Accueil' : id === 'about' ? 'À propos' : id === 'services' ? 'Services' : id === 'portfolio' ? 'Projets' : id === 'parcours' ? 'Parcours' : 'Contact'}
              </button>
            </li>
          ))}
        </ul>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
