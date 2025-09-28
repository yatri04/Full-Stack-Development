import React from 'react';
import ContactForm from './components/ContactForm';

export default function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 24 }}>
      <h1>My Portfolio</h1>
      <p>Welcome — use the contact form below to send me a message.</p>
      <ContactForm />
    </div>
  );
}
