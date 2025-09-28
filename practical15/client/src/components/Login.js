import React, { useState } from 'react';

export default function Login({ setProfile }) {
  const [name, setName] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Enter a name');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Login failed');
      setProfile({ name: data.name, login_time: data.login_time });
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 420, background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Name</label><br/>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{ width: '100%', padding: '8px', marginTop: 6, marginBottom: 12 }} />
        <div style={{ color: '#555', marginBottom: 12 }}>This demo stores your name and login time in a server-side session.</div>
        <button type="submit" style={{ padding: '8px 12px' }}>Login</button>
      </form>
    </div>
  );
}
