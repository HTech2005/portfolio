import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const empty = { title: '', description: '', category: 'web', image_url: '', live_url: '', github_url: '', technologies: '', featured: false, status: 'terminé', order_index: 0 }

export default function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = () => supabase.from('projects').select('*').order('order_index').then(({ data }) => data && setProjects(data))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, created_at, ...payload } = form
    payload.technologies = form.technologies.split(',').map(t => t.trim()).filter(Boolean)
    if (editing) await supabase.from('projects').update(payload).eq('id', editing)
    else await supabase.from('projects').insert([payload])
    setForm(empty); setEditing(null); setShowForm(false); setLoading(false); load()
  }

  const edit = (p) => {
    // Nettoie les null pour éviter les inputs non contrôlés
    const clean = Object.fromEntries(
      Object.entries(p).map(([k, v]) => [k, v ?? ''])
    )
    setForm({ ...clean, technologies: p.technologies?.join(', ') || '' })
    setEditing(p.id); setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return
    await supabase.from('projects').delete().eq('id', id); load()
  }

  const cancel = () => { setForm(empty); setEditing(null); setShowForm(false) }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2><i className="fas fa-folder" /> Projets</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(empty) }}>
          <i className="fas fa-plus" /> Nouveau projet
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={save}>
          <h3>{editing ? 'Modifier le projet' : 'Nouveau projet'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Titre *</label>
              <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Catégorie *</label>
              <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="design">Design</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>URL Image</label>
              <input className="form-control" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>URL Live</label>
              <input className="form-control" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>URL GitHub</label>
              <input className="form-control" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label>Technologies (séparées par virgule)</label>
              <input className="form-control" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, Supabase" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ordre d'affichage</label>
              <input type="number" className="form-control" value={form.order_index} onChange={e => setForm({ ...form, order_index: +e.target.value })} />
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="terminé">✅ Terminé</option>
                <option value="en cours">🚧 En cours</option>
              </select>
            </div>
          </div>
          <div className="form-group checkbox-group">
            <label><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Projet mis en avant</label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
            </button>
            <button type="button" className="btn btn-outline" onClick={cancel}>Annuler</button>
          </div>
        </form>
      )}

      <div className="items-list">
        {projects.map(p => (
          <div className="item-card" key={p.id}>
            {p.image_url && <img src={p.image_url} alt={p.title} className="item-thumb" />}
            <div className="item-info">
              <div className="item-title">{p.title} {p.featured && <span className="badge-featured">⭐ Featured</span>} <span className={`badge-status ${p.status === 'en cours' ? 'ongoing' : 'done'}`}>{p.status === 'en cours' ? '🚧 En cours' : '✅ Terminé'}</span></div>
              <div className="item-meta"><span className="tag">{p.category}</span> {p.technologies?.map(t => <span className="tech-tag" key={t}>{t}</span>)}</div>
              <p className="item-desc">{p.description}</p>
            </div>
            <div className="item-actions">
              <button className="btn btn-outline" onClick={() => edit(p)}><i className="fas fa-edit" /></button>
              <button className="btn btn-danger" onClick={() => remove(p.id)}><i className="fas fa-trash" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
