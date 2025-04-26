import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">Next-Lite Demo</h1>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      <main className="main">
        <section className="content">
          <h1 className="title">Contact Us</h1>

          {submitted ? (
            <div className="successMessage">
              <h2>Thank you for your message!</h2>
              <p>We'll get back to you as soon as possible.</p>
              <button
                className="button"
                onClick={() => {
                  setFormData({ name: '', email: '', message: '' });
                  setSubmitted(false);
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contactForm" onSubmit={handleSubmit}>
              <div className="formGroup">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="button">
                Send Message
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Built with Next-Lite Framework &copy; 2025</p>
      </footer>
    </div>
  );
}
