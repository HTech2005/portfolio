import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Timeline.css'

export default function Timeline() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('timeline').select('*').order('order_index')
      .then(({ data }) => data && setItems(data))
  }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  return (
    <section id="parcours" className="section parcours">
      <div className="container">
        <h2 className="section-title">Mon Parcours</h2>

        <div className="timeline-filters">
          {[
            { key: 'all', label: 'Tout', icon: 'fa-list' },
            { key: 'experience', label: 'Expériences', icon: 'fa-briefcase' },
            { key: 'formation', label: 'Formations', icon: 'fa-graduation-cap' },
          ].map(f => (
            <button key={f.key} className={`filter-btn${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
              <i className={`fas ${f.icon}`} /> {f.label}
            </button>
          ))}
        </div>

        <div className="timeline">
          {filtered.map((item, index) => (
            <div key={item.id} className={`timeline-item ${item.type} ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-dot">
                <i className={`fas ${item.type === 'experience' ? 'fa-briefcase' : 'fa-graduation-cap'}`} />
              </div>
              <div className="timeline-card">
                <div className="timeline-date">
                  <i className="fas fa-calendar-alt" />
                  {item.date_start} — {item.date_end}
                </div>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-org">
                  <i className="fas fa-building" /> {item.organization}
                  {item.location && <span> · <i className="fas fa-map-marker-alt" /> {item.location}</span>}
                </p>
                {item.description && <p className="timeline-desc">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
