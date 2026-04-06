import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const empty = { name: '', percentage: 50, category: 'Web & Mobile', order_index: 0 }
const categories = ['Langages & Systèmes', 'Web & Mobile', 'Données & Design']

export default function SkillsManager() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = () => supabase.from('skills').select('*').order('category').order('order_index').then(({ data }) => data && setSkills(data))
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault(); setLoading(true)
    const { id, created_at, ...payload } = form
    if (editing) await supabase.from('skills').update(payload).eq('id', editing)
    else await supabase.from('skills').insert([payload])
    setForm(empty); setEditing(null); setShowForm(false); setLoading(false); load()
  }

  const edit = (s) => {
    const clean = Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v ?? '']))
    setForm(clean); setEditing(s.id); setShowForm(true)
  }
  const remove = async (id) => { if (!confirm('Supprimer ?')) return; await supabase.from('skills').delete().eq('id', id); load() }
  const cancel = () => { setForm(empty); setEditing(null); setShowForm(false) }

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {})

  return (
    <div className="manager">
      <div className="manager-header">
        <h2><i className="fas fa-chart-bar" /> Compétences</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditing(null); setForm(empty) }}>
          <i className="fas fa-plus" /> Nouvelle compétence
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={save}>
          <h3>{editing ? 'Modifier' : 'Nouvelle compétence'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nom *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Catégorie *</label>
              <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pourcentage: {form.percentage}%</label>
              <input type="range" min="0" max="100" value={form.percentage} onChange={e => setForm({ ...form, percentage: +e.target.value })} className="range-input" />
            </div>
            <div className="form-group">
              <label>Ordre</label>
              <input type="number" className="form-control" value={form.order_index} onChange={e => setForm({ ...form, order_index: +e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement...' : editing ? 'Mettre à jour' : 'Créer'}</button>
            <button type="button" className="btn btn-outline" onClick={cancel}>Annuler</button>
          </div>
        </form>
      )}

      <div className="skills-admin-grid">
        {categories.map(cat => (
          <div key={cat} className="skill-category-block">
            <h3 className="skill-cat-title">{cat}</h3>
            {grouped[cat]?.map(s => (
              <div className="skill-admin-item" key={s.id}>
                <div className="skill-admin-info">
                  <span className="skill-admin-name">{s.name}</span>
                  <div className="skill-bar-admin">
                    <div className="skill-progress-admin" style={{ width: `${s.percentage}%` }} />
                  </div>
                  <span className="skill-pct">{s.percentage}%</span>
                </div>
                <div className="item-actions">
                  <button className="btn btn-outline" onClick={() => edit(s)}><i className="fas fa-edit" /></button>
                  <button className="btn btn-danger" onClick={() => remove(s.id)}><i className="fas fa-trash" /></button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
