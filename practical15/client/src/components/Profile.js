import React from 'react';

export default function Profile({ profile, setProfile }) {

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Logout failed');
      setProfile(null);
    } catch (err) {
      alert('Logout failed');
    }
  };

  return (
    <div style={{ maxWidth: 640, background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <h2>Welcome, {profile.name}!</h2>
      <p><strong>Login time (UTC):</strong> {profile.login_time}</p>
      <p style={{ color: '#555' }}>This session is stored on the server. Click logout to destroy it.</p>
      <button onClick={logout} style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6 }}>Logout</button>
    </div>
  );
}
