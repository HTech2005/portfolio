import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './CV.css'

const skillGroups = [
  { title: 'Langages & Systèmes', skills: [{ name: 'C / C++', pct: 95 }, { name: 'Java', pct: 90 }, { name: 'VHDL', pct: 80 }] },
  { title: 'Web & Mobile', skills: [{ name: 'HTML / CSS / PHP', pct: 95 }, { name: 'Laravel / SpringBoot', pct: 75 }, { name: 'React / Angular', pct: 50 }, { name: 'React Native Expo', pct: 50 }] },
  { title: 'Données & Design', skills: [{ name: 'MySQL', pct: 90 }, { name: 'Figma / Blender', pct: 50 }] },
]

export default function CV() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    document.title = 'CV | Harold MIKPONHOUE'
    supabase.from('profile').select('*').single()
      .then(({ data }) => data && setProfile(data))
  }, [])

  const photo = profile?.cv_photo_url || profile?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face'
  const name = profile?.name || 'Harold MIKPONHOUE'
  const email = profile?.email || 'mikponhouelerichharold@gmail.com'
  const phone = profile?.phone || '+229 01 51 45 06 71'
  const location = profile?.location || 'Abomey-Calavi, Bénin'
  const linkedin = profile?.linkedin_url || 'https://www.linkedin.com/in/harold-mikponhoue-5b082b359/'

  return (
    <div className="cv-body">
      <div className="cv-container">
        <aside className="cv-sidebar">
          <div className="profile-section">
            <img src={photo} alt={name} className="profile-img" />
            <h1 className="cv-name">{name}</h1>
            <p className="cv-title">Développeur Full-Stack</p>
          </div>

          <div className="contact-info-cv">
            <div className="info-item"><i className="fas fa-envelope" /><span>{email}</span></div>
            <div className="info-item"><i className="fas fa-phone" /><span>{phone}</span></div>
            <div className="info-item"><i className="fas fa-map-marker-alt" /><span>{location}</span></div>
            <div className="info-item">
              <i className="fab fa-linkedin" />
              <a href={linkedin} target="_blank" rel="noreferrer">Profile LinkedIn</a>
            </div>
          </div>

          <div className="skills-section-cv">
            <h2 className="section-header-cv">Compétences</h2>
            {skillGroups.map(group => (
              <div className="skill-group" key={group.title}>
                <p className="skill-category-title">{group.title}</p>
                {group.skills.map(s => (
                  <div className="cv-skill-item" key={s.name}>
                    <div className="cv-skill-name"><span>{s.name}</span><span>{s.pct}%</span></div>
                    <div className="cv-skill-bar"><div className="cv-skill-progress" style={{ width: `${s.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div>
            <h2 className="section-header-cv">Langues</h2>
            <div className="info-item"><i className="fas fa-language" /><span>Français (Maternel)</span></div>
            <div className="info-item"><i className="fas fa-language" /><span>Anglais (Intermédiaire)</span></div>
          </div>
        </aside>

        <main className="cv-main">
          <section className="cv-section">
            <h2 className="section-header-cv">Profil Professionnel</h2>
            <p className="exp-desc">Élève ingénieur en Génie Informatique et Télécommunications, passionné par la tech et l'innovation. Spécialisé dans la conception de solutions robustes et modernes, de l'architecture backend aux interfaces utilisateur intuitives.</p>
          </section>

          <section className="cv-section">
            <h2 className="section-header-cv">Expérience</h2>
            <div className="experience-item">
              <div className="exp-date">2024 - Présent</div>
              <h3 className="exp-title">Développeur Full-Stack Freelance</h3>
              <p className="exp-company">Bénin</p>
              <p className="exp-desc">Conception et déploiement de plateformes web modernes (Laravel/React). Réalisations récentes : <strong>Avor</strong> (E-commerce & PWA) et <strong>FusionOffice</strong> (Gestion de documents).</p>
            </div>
            <div className="experience-item">
              <div className="exp-date">2023 - 2024</div>
              <h3 className="exp-title">Projets Académiques Majeurs</h3>
              <p className="exp-company">École Polytechnique d'Abomey-Calavi</p>
              <p className="exp-desc">Développement d'une application de gestion de bus (C++/WxWidgets) et d'une plateforme de tontines (React/Laravel).</p>
            </div>
          </section>

          <section className="cv-section">
            <h2 className="section-header-cv">Formation</h2>
            <div className="experience-item">
              <div className="exp-date">2021 - Présent</div>
              <h3 className="exp-title">Génie Informatique et Télécommunications</h3>
              <p className="exp-company">École Polytechnique d'Abomey-Calavi (EPAC)</p>
              <p className="exp-desc">Cycle d'ingénieur en cours.</p>
            </div>
          </section>
        </main>
      </div>

      <div className="cv-actions">
        <button className="print-btn" onClick={() => window.print()}>
          <i className="fas fa-print" /> Imprimer / PDF
        </button>
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left" /> Retour
        </Link>
      </div>
    </div>
  )
}
