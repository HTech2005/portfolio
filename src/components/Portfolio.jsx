import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Portfolio.css'

const filters = [
  { key: 'all', label: 'Tous' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'desktop', label: 'Desktop' },
  { key: 'design', label: 'Design' },
]

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('projects').select('*').order('order_index')
      .then(({ data }) => data && setProjects(data))
  }, [])

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="portfolio" className="section portfolio">
      <div className="container">
        <h2 className="section-title">Projets</h2>
        <div className="portfolio-filters">
          {filters.map(f => (
            <button key={f.key} className={`filter-btn${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="portfolio-grid">
          {filtered.map(project => (
            <div className="portfolio-item" key={project.id}>
              <div className="portfolio-image">
                <img src={project.image_url} alt={project.title} />
                <div className="portfolio-overlay">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="portfolio-link">
                      <i className="fas fa-external-link-alt" />
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="portfolio-link">
                      <i className="fab fa-github" />
                    </a>
                  )}
                </div>
              </div>
              <div className="portfolio-info">
                <div className="portfolio-header">
                  <div className="portfolio-category">{project.category}</div>
                  {project.status === 'en cours' && (
                    <span className="status-badge ongoing">🚧 En cours</span>
                  )}
                </div>
                <h3 className="portfolio-title">{project.title}</h3>
                <p className="portfolio-description">{project.description}</p>
                <div className="portfolio-technologies">
                  {project.technologies?.map(t => <span className="tech-tag" key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
