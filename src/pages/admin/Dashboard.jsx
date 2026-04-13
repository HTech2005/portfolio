import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import ProjectsManager from './ProjectsManager'
import SkillsManager from './SkillsManager'
import MessagesManager from './MessagesManager'
import ProfileManager from './ProfileManager'
import TimelineManager from './TimelineManager'
import './Admin.css'

const tabs = [
  { key: 'profile', label: 'Profil', icon: 'fa-user-circle' },
  { key: 'projects', label: 'Projets', icon: 'fa-folder' },
  { key: 'skills', label: 'Compétences', icon: 'fa-chart-bar' },
  { key: 'timeline', label: 'Parcours', icon: 'fa-road' },
  { key: 'messages', label: 'Messages', icon: 'fa-envelope' },
]

export default function Dashboard() {
  const [tab, setTab] = useState('profile')
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    supabase.from('messages').select('id', { count: 'exact' }).eq('is_read', false)
      .then(({ count }) => setUnread(count || 0))
  }, [tab])

  const logout = async () => { await supabase.auth.signOut() }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">Harold.M</div>
        <p className="admin-subtitle">Backoffice</p>
        <nav className="admin-nav">
          {tabs.map(t => (
            <button key={t.key} className={`admin-nav-item${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
              <i className={`fas ${t.icon}`} />
              <span>{t.label}</span>
              {t.key === 'messages' && unread > 0 && <span className="badge">{unread}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-footer-nav">
          <a href="/" target="_blank" className="admin-nav-item">
            <i className="fas fa-eye" /><span>Voir le site</span>
          </a>
          <button className="admin-nav-item logout" onClick={logout}>
            <i className="fas fa-sign-out-alt" /><span>Déconnexion</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {tab === 'profile' && <ProfileManager />}
        {tab === 'projects' && <ProjectsManager />}
        {tab === 'skills' && <SkillsManager />}
        {tab === 'timeline' && <TimelineManager />}
        {tab === 'messages' && <MessagesManager />}
      </main>
    </div>
  )
}
