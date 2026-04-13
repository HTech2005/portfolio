import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import Timeline from '../components/Timeline'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import './Home.css'

export default function Home() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    document.title = 'Harold MIKPONHOUE | Développeur Full-Stack & UI/UX Designer'
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="preloader" id="preloader">
        <div className="loader" />
      </div>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Timeline />
      <Contact />
      <Footer />
      <a href="#home" className={`scroll-top${showTop ? ' show' : ''}`} onClick={e => { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) }}>
        <i className="fas fa-chevron-up" />
      </a>
    </>
  )
}
