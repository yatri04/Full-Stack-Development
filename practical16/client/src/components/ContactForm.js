import React, { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim()) return setStatus({ type: 'error', text: 'Name is required' });
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRe.test(String(email).toLowerCase())) return setStatus({ type: 'error', text: 'Valid email is required' });
    if (!message.trim()) return setStatus({ type: 'error', text: 'Message is required' });

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Failed to send message' });
      } else {
        setStatus({ type: 'success', text: data.message || 'Message sent' });
        setName(''); setEmail(''); setMessage('');
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, background: '#fff', padding: 18, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2>Contact Me</h2>
      {status && (
        <div style={{ marginBottom: 12, color: status.type === 'success' ? 'green' : 'red' }}>{status.text}</div>
      )}
      <form onSubmit={submit}>
        <label>Name</label><br/>
        <input value={name} onChange={e=>setName(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Email</label><br/>
        <input value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Message</label><br/>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} style={{ width: '100%', padding: 8, minHeight: 120, marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Sending...' : 'Submit'}</button>
      </form>
    </div>
  );
}
