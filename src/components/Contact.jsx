import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('email, phone, location').single()
      .then(({ data }) => data && setProfile(data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('messages').insert([form])
    if (error) { setStatus('error') }
    else { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }) }
    setTimeout(() => setStatus(null), 4000)
  }

  const infos = [
    { icon: 'fa-envelope', title: 'Email', value: profile?.email || 'mikponhouelerichharold@gmail.com' },
    { icon: 'fa-phone', title: 'Téléphone', value: profile?.phone || '+229 01 51 45 06 71' },
    { icon: 'fa-map-marker-alt', title: 'Localisation', value: profile?.location || 'Abomey-Calavi, Bénin' },
    { icon: 'fa-clock', title: 'Disponibilité', value: 'Lun - Sam, 9h - 19h' },
  ]

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Contactez-moi</h2>
        <div className="contact-content">
          <div className="contact-info">
            {infos.map(item => (
              <div className="contact-item" key={item.title}>
                <div className="contact-icon"><i className={`fas ${item.icon}`} /></div>
                <div className="contact-details"><h4>{item.title}</h4><p>{item.value}</p></div>
              </div>
            ))}
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom complet</label>
              <input className="form-control" placeholder="Votre nom et prénom" required
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" placeholder="votre@email.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Sujet</label>
              <input className="form-control" placeholder="Sujet de votre message"
                value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-control" placeholder="Votre message..." required
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            {status === 'success' && <p className="form-feedback success">✅ Message envoyé avec succès !</p>}
            {status === 'error' && <p className="form-feedback error">❌ Une erreur est survenue. Réessaie.</p>}
            <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
              {status === 'loading' ? <><i className="fas fa-spinner fa-spin" /> Envoi...</> : <><i className="fas fa-paper-plane" /> Envoyer le message</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
