import React from 'react';

export default function AboutPage() {
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
          <h1 className="title">About Next-Lite</h1>

          <div className="textContent">
            <p>
              Next-Lite is a lightweight, high-performance alternative to Next.js built with esbuild.
              It features file-based routing, HMR, CSS Modules, and TypeScript support out of the box,
              all while maintaining a minimal footprint and blazing-fast build times.
            </p>

            <h2>Why Next-Lite?</h2>
            <p>
              While Next.js is a powerful framework, it can sometimes be overkill for simpler projects.
              Next-Lite aims to provide the core features developers love about Next.js, but with a smaller
              bundle size and faster development experience.
            </p>

            <h2>Key Differences</h2>
            <ul className="list">
              <li>Uses esbuild instead of webpack for significantly faster builds</li>
              <li>Smaller bundle size and fewer dependencies</li>
              <li>Simplified API that focuses on the most commonly used features</li>
              <li>Optimized for development speed and simplicity</li>
            </ul>

            <h2>Project Status</h2>
            <p>
              Next-Lite is currently in early development. While it's stable enough for small to medium-sized
              projects, it may not have all the features needed for large-scale applications. We're actively
              working on expanding its capabilities while maintaining its lightweight nature.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built with Next-Lite Framework &copy; 2025</p>
      </footer>
    </div>
  );
}
