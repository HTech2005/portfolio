import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import './About.css'

export default function About() {
  const [skills, setSkills] = useState([])
  const [profile, setProfile] = useState(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    supabase.from('skills').select('*').order('category').order('order_index')
      .then(({ data }) => data && setSkills(data))
    supabase.from('profile').select('*').single()
      .then(({ data }) => data && setProfile(data))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-progress').forEach(bar => {
            bar.style.width = bar.dataset.width + '%'
          })
        }
      })
    }, { threshold: 0.3 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [skills])

  return (
    <section id="about" className="section about" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">À propos de moi</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>Passionné par l'innovation et le monde de la tech</h3>
            <p>{profile?.bio1 || 'Élève ingénieur en Génie Informatique et Télécommunications, je suis passionné par la tech et animé par le désir constant d\'explorer les innovations qui façonnent le monde numérique de demain.'}</p>
            <p>{profile?.bio2 || 'Mon parcours me permet de combiner expertise technique et créativité pour concevoir des solutions modernes, efficaces et adaptées aux besoins réels.'}</p>
            <div className="skills">
              {skills.map(skill => (
                <div className="skill-item" key={skill.id}>
                  <div className="skill-name">
                    <span>{skill.name}</span>
                    <span>{skill.percentage}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" data-width={skill.percentage} style={{ width: 0 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-image">
            <img
              src={profile?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face'}
              alt={profile?.name || 'Harold MIKPONHOUE'}
            />
            <div className="floating-card card-1"><i className="fas fa-code" style={{ fontSize: '1.5rem' }} /></div>
            <div className="floating-card card-2"><i className="fas fa-lightbulb" style={{ fontSize: '1.5rem' }} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
