import React, { useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);

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
        <section className="hero">
          <h1 className="title">
            Welcome to <span className="highlight">Next-Lite</span>
          </h1>

          <p className="description">
            A lightweight, high-performance alternative to Next.js
          </p>

          <div className="counter">
            <h2>Interactive Counter</h2>
            <p>Count: {count}</p>
            <div className="buttonGroup">
              <button
                className="button"
                onClick={() => setCount(count - 1)}
              >
                Decrease
              </button>
              <button
                className="button"
                onClick={() => setCount(count + 1)}
              >
                Increase
              </button>
            </div>
          </div>
        </section>

        <section className="features">
          <h2>Framework Features</h2>
          <div className="grid">
            <div className="card">
              <h3>Fast Builds</h3>
              <p>Blazing-fast build times with esbuild.</p>
            </div>

            <div className="card">
              <h3>File-based Routing</h3>
              <p>Simple and intuitive routing based on your file structure.</p>
            </div>

            <div className="card">
              <h3>CSS Modules</h3>
              <p>Built-in support for CSS Modules.</p>
            </div>

            <div className="card">
              <h3>TypeScript</h3>
              <p>First-class TypeScript support out of the box.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built with Next-Lite Framework &copy; 2025</p>
      </footer>
    </div>
  );
}
