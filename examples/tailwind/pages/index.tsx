import React from 'react';
import { Link } from '../router';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-900">Next-Lite with Tailwind CSS</h1>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h2>
            <p className="text-gray-600 mb-4">
              Next-Lite is a lightweight alternative to Next.js, focusing on speed and simplicity.
            </p>
            <Link href="/docs" className="text-primary-600 hover:text-primary-700">
              Read the docs →
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
            <ul className="space-y-2 text-gray-600 mb-4">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                File-based routing
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Server-side rendering
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Static site generation
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                API routes
              </li>
            </ul>
            <Link href="/features" className="text-primary-600 hover:text-primary-700">
              View all features →
            </Link>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tailwind CSS</h2>
            <p className="text-gray-600 mb-4">
              This example demonstrates how to integrate Tailwind CSS with Next-Lite.
            </p>
            <div className="flex space-x-4">
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">More Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Redux Integration</h3>
              <p className="text-gray-600 mb-4">
                Learn how to integrate Redux with Next-Lite for state management.
              </p>
              <Link href="/examples/redux" className="text-primary-600 hover:text-primary-700">
                View example →
              </Link>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">GraphQL Integration</h3>
              <p className="text-gray-600 mb-4">
                Learn how to integrate GraphQL with Next-Lite for data fetching.
              </p>
              <Link href="/examples/graphql" className="text-primary-600 hover:text-primary-700">
                View example →
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200">
        <div className="container py-6">
          <p className="text-center text-gray-500">
            Powered by Next-Lite
          </p>
        </div>
      </footer>
    </div>
  );
}
