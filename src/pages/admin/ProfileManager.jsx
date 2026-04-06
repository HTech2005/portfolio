import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const empty = {
  name: '', title: '', bio1: '', bio2: '',
  photo_url: '', cv_photo_url: '',
  email: '', phone: '', location: '',
  github_url: '', linkedin_url: '', twitter_url: '', instagram_url: ''
}

function PhotoUploader({ label, value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `profile/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      onChange(data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="photo-upload-row">
        <input
          className="form-control"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... ou choisir un fichier →"
        />
        <button type="button" className="btn btn-outline upload-btn" onClick={() => inputRef.current.click()} disabled={uploading}>
          {uploading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-upload" />}
          {uploading ? 'Upload...' : 'Choisir'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {value && (
        <div className="photo-preview">
          <img src={value} alt="Aperçu" onError={e => e.target.style.display = 'none'} />
        </div>
      )}
    </div>
  )
}

export default function ProfileManager() {
  const [form, setForm] = useState(empty)
  const [profileId, setProfileId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) {
        // Remplace tous les null par '' pour éviter les inputs non contrôlés
        const clean = Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v ?? ''])
        )
        setForm(clean)
        setProfileId(data.id)
      }
    })
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const save = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null)
    const payload = { ...form, updated_at: new Date().toISOString() }
    delete payload.id
    let error
    if (profileId) {
      ({ error } = await supabase.from('profile').update(payload).eq('id', profileId))
    } else {
      const res = await supabase.from('profile').insert([payload]).select().single()
      error = res.error
      if (res.data) setProfileId(res.data.id)
    }
    setLoading(false)
    setStatus(error ? 'error' : 'success')
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2><i className="fas fa-user-circle" /> Profil</h2>
      </div>

      <form className="admin-form" onSubmit={save}>

        <h3>Identité</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nom complet</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Harold MIKPONHOUE" />
          </div>
          <div className="form-group">
            <label>Titre / Poste</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Développeur Full-Stack & UI/UX Designer" />
          </div>
        </div>

        <h3 style={{ marginTop: '10px' }}>Photos</h3>
        <div className="form-row">
          <PhotoUploader
            label="Photo de profil (section À propos)"
            value={form.photo_url}
            onChange={v => set('photo_url', v)}
          />
          <PhotoUploader
            label="Photo CV (laisser vide = même photo)"
            value={form.cv_photo_url}
            onChange={v => set('cv_photo_url', v)}
          />
        </div>

        <h3 style={{ marginTop: '10px' }}>Description (section À propos)</h3>
        <div className="form-group">
          <label>Paragraphe 1</label>
          <textarea className="form-control" value={form.bio1} onChange={e => set('bio1', e.target.value)} rows={3} />
        </div>
        <div className="form-group">
          <label>Paragraphe 2</label>
          <textarea className="form-control" value={form.bio2} onChange={e => set('bio2', e.target.value)} rows={3} />
        </div>

        <h3 style={{ marginTop: '10px' }}>Coordonnées</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input className="form-control" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>Localisation</label>
          <input className="form-control" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>

        <h3 style={{ marginTop: '10px' }}>Réseaux sociaux</h3>
        <div className="form-row">
          <div className="form-group">
            <label><i className="fab fa-github" /> GitHub</label>
            <input className="form-control" value={form.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
          </div>
          <div className="form-group">
            <label><i className="fab fa-linkedin" /> LinkedIn</label>
            <input className="form-control" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label><i className="fab fa-twitter" /> Twitter / X</label>
            <input className="form-control" value={form.twitter_url} onChange={e => set('twitter_url', e.target.value)} placeholder="https://x.com/..." />
          </div>
          <div className="form-group">
            <label><i className="fab fa-instagram" /> Instagram</label>
            <input className="form-control" value={form.instagram_url} onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
          </div>
        </div>

        {status === 'success' && <p className="form-feedback success">✅ Profil mis à jour avec succès !</p>}
        {status === 'error' && <p className="form-feedback error">❌ Une erreur est survenue.</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin" /> Enregistrement...</> : <><i className="fas fa-save" /> Enregistrer</>}
          </button>
        </div>
      </form>
    </div>
  )
}
