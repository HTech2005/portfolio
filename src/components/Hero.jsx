import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './Hero.css'

export default function Hero() {
  const canvasRef = useRef(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('name, title').single()
      .then(({ data }) => data && setProfile(data))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    const mouse = { x: 0, y: 0 }

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })

    for (let i = 0; i < 100; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, size: Math.random() * 3 + 1 })
    }

    let animId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(102,126,234,0.3)'; ctx.fill()
        const dx = mouse.x - p.x, dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(102,126,234,${1 - dist / 100})`; ctx.stroke()
        }
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="hero">
      <canvas ref={canvasRef} className="particles" />
      <div className="hero-content">
        <h1 className="hero-title">{profile?.name || 'Harold MIKPONHOUE'}</h1>
        <h2 className="hero-subtitle">{profile?.title || 'Développeur Full-Stack & UI/UX Designer'}</h2>
        <p className="hero-description">Je crée des expériences numériques exceptionnelles qui allient design moderne et technologie de pointe.</p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => scrollTo('portfolio')}>
            <i className="fas fa-eye" /> Voir mes projets
          </button>
          <button className="btn btn-outline" onClick={() => scrollTo('contact')}>
            <i className="fas fa-envelope" /> Me contacter
          </button>
          <Link to="/cv" className="btn btn-cv">
            <i className="fas fa-file-alt" /> CV Interactif
          </Link>
        </div>
      </div>
      <div className="scroll-indicator" onClick={() => scrollTo('about')}>
        <i className="fas fa-chevron-down" />
      </div>
    </section>
  )
}
