import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const empty = { type: 'experience', title: '', organization: '', location: '', date_start: '', date_end: 'Présent', description: '', order_index: 0 }

export default function TimelineManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = () => supabase.from('timeline').select('*').order('order_index')
    .then(({ data }) => data && setItems(data))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, created_at, ...payload } = form
    if (editing) await supabase.from('timeline').update(payload).eq('id', editing)
    else await supabase.from('timeline').insert([payload])
    setForm(empty); setEditing(null); setShowForm(false); setLoading(false); load()
  }

  const edit = (item) => {
    const clean = Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v ?? '']))
    setForm(clean); setEditing(item.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id) => {
    if (!confirm('Supprimer cet élément ?')) return
    await supabase.from('timeline').delete().eq('id', id); load()
  }

  const cancel = () => { setForm(empty); setEditing(null); setShowForm(false) }

  const experiences = items.filter(i => i.type === 'experience')
  const formations = items.filter(i => i.type === 'formation')

  return (
    <div className="manager">
      <div className="manager-header">
        <h2><i className="fas fa-road" /> Parcours</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(empty) }}>
          <i className="fas fa-plus" /> Ajouter
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={save}>
          <h3>{editing ? 'Modifier' : 'Nouvel élément'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="experience">💼 Expérience</option>
                <option value="formation">🎓 Formation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ordre d'affichage</label>
              <input type="number" className="form-control" value={form.order_index} onChange={e => setForm({ ...form, order_index: +e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Titre *</label>
            <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Ex: Développeur Full-Stack Freelance" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Organisation *</label>
              <input className="form-control" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} required placeholder="Ex: EPAC, Nom entreprise..." />
            </div>
            <div className="form-group">
              <label>Lieu</label>
              <input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ex: Cotonou, Bénin" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date début *</label>
              <input className="form-control" value={form.date_start} onChange={e => setForm({ ...form, date_start: e.target.value })} required placeholder="Ex: 2021, Jan 2023..." />
            </div>
            <div className="form-group">
              <label>Date fin</label>
              <input className="form-control" value={form.date_end} onChange={e => setForm({ ...form, date_end: e.target.value })} placeholder="Présent" />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}
            </button>
            <button type="button" className="btn btn-outline" onClick={cancel}>Annuler</button>
          </div>
        </form>
      )}

      {[{ label: '💼 Expériences', data: experiences }, { label: '🎓 Formations', data: formations }].map(group => (
        <div key={group.label} style={{ marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1rem' }}>{group.label}</h3>
          <div className="items-list">
            {group.data.length === 0 && <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Aucun élément.</p>}
            {group.data.map(item => (
              <div className="item-card" key={item.id}>
                <div className="item-info">
                  <div className="item-title">{item.title}</div>
                  <div className="item-meta">
                    <span className="tag">{item.organization}</span>
                    {item.location && <span className="tag">{item.location}</span>}
                    <span className="tag">{item.date_start} — {item.date_end}</span>
                  </div>
                  {item.description && <p className="item-desc">{item.description}</p>}
                </div>
                <div className="item-actions">
                  <button className="btn btn-outline" onClick={() => edit(item)}><i className="fas fa-edit" /></button>
                  <button className="btn btn-danger" onClick={() => remove(item.id)}><i className="fas fa-trash" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
