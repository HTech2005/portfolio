import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MessagesManager() {
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)

  const load = () => supabase.from('messages').select('*').order('created_at', { ascending: false }).then(({ data }) => data && setMessages(data))
  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Supprimer ce message ?')) return
    await supabase.from('messages').delete().eq('id', id)
    if (selected?.id === id) setSelected(null)
    load()
  }

  const open = (msg) => {
    setSelected(msg)
    if (!msg.is_read) markRead(msg.id)
  }

  return (
    <div className="manager">
      <div className="manager-header">
        <h2><i className="fas fa-envelope" /> Messages</h2>
        <span className="msg-count">{messages.filter(m => !m.is_read).length} non lu(s)</span>
      </div>

      <div className="messages-layout">
        <div className="messages-list">
          {messages.length === 0 && <p className="empty-state">Aucun message pour l'instant.</p>}
          {messages.map(msg => (
            <div key={msg.id} className={`message-item${!msg.is_read ? ' unread' : ''}${selected?.id === msg.id ? ' active' : ''}`} onClick={() => open(msg)}>
              <div className="msg-header">
                <span className="msg-name">{msg.name}</span>
                <span className="msg-date">{new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="msg-subject">{msg.subject || '(sans sujet)'}</div>
              <div className="msg-preview">{(msg.message || '').substring(0, 80)}...</div>
            </div>
          ))}
        </div>

        <div className="message-detail">
          {selected ? (
            <>
              <div className="detail-header">
                <div>
                  <h3>{selected.name}</h3>
                  <p className="detail-email">{selected.email}</p>
                  <p className="detail-date">{new Date(selected.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <button className="btn btn-danger" onClick={() => remove(selected.id)}><i className="fas fa-trash" /></button>
              </div>
              {selected.subject && <div className="detail-subject">Sujet : {selected.subject}</div>}
              <div className="detail-body">{selected.message}</div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`} className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                <i className="fas fa-reply" /> Répondre
              </a>
            </>
          ) : (
            <div className="empty-state"><i className="fas fa-envelope-open" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '15px' }} /><p>Sélectionnez un message</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
