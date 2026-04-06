import './Services.css'

const services = [
  { icon: 'fa-laptop-code', title: 'Développement Web', desc: "Création d'applications web modernes et responsives avec les dernières technologies comme React, Vue.js et Node.js." },
  { icon: 'fa-mobile-alt', title: 'Applications Mobile', desc: "Développement d'applications mobiles natives et cross-platform pour iOS et Android avec React Native et Flutter." },
  { icon: 'fa-paint-brush', title: 'UI/UX Design', desc: "Conception d'interfaces utilisateur intuitives et esthétiques avec un focus sur l'expérience utilisateur optimale." },
  { icon: 'fa-database', title: 'Backend & API', desc: "Développement d'architectures backend robustes et d'APIs RESTful avec des bases de données optimisées." },
  { icon: 'fa-rocket', title: 'Optimisation', desc: "Amélioration des performances, SEO et accessibilité pour une expérience utilisateur exceptionnelle." },
  { icon: 'fa-headset', title: 'Maintenance', desc: "Support technique continu, mises à jour de sécurité et évolutions fonctionnelles de vos projets." },
]

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <h2 className="section-title">Mes Services</h2>
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon"><i className={`fas ${s.icon}`} /></div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-description">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
