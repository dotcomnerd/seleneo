import React from 'react';
import { Github, Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it Works', href: '#how-it-works' },
      { label: 'FAQ', href: '#faq' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: 'mailto:tomenyuma@gmail.com' },
      { label: 'GitHub', href: 'https://github.com/nyumat' },
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl">Seleneo</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The one stop shop for digital product marketing.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/nyumat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:your-email@example.com"
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
          <p className='mt-4 md:mt-0 text-gray-600 dark:text-gray-400'>© {new Date().getFullYear()} Seleneo. All rights reserved.</p>
      </div>
    </footer>
  );
}