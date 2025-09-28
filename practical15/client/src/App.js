import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // On mount, check current session
    fetch('http://localhost:5000/api/profile', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(()=> setProfile(null));
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>MERN Library Portal (Demo)</h1>
      {profile ? (
        <Profile profile={profile} setProfile={setProfile} />
      ) : (
        <Login setProfile={setProfile} />
      )}
    </div>
  );
}

export default App;
