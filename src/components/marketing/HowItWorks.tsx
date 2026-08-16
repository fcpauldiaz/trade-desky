import { Link } from '@tanstack/react-router'

import { DESKTOP_APP_NAME } from '#/lib/desktop-app'

const STEPS = [
  {
    step: '1',
    title: `Install ${DESKTOP_APP_NAME}`,
    description: 'Download the desktop app for macOS or Windows and grant notification permissions.',
  },
  {
    step: '2',
    title: 'Sign in with your account',
    description: 'Use the same email and password as the web platform. The app connects automatically.',
  },
  {
    step: '3',
    title: 'Alerts execute as trades',
    description: 'When an alert arrives, AI parses it and your broker places the order if validation passes.',
  },
]

export default function HowItWorks() {
  return (
    <section className="marketing-section marketing-section-muted">
      <div className="page-wrap px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <span className="section-badge">How it works</span>
          <h2 className="marketing-section-title">Three steps from alert to order</h2>
        </div>
        <div className="step-list">
          {STEPS.map((item) => (
            <article key={item.step} className="step-item">
              <span className="step-number">{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8">
          <Link to="/download" className="btn-primary">
            Download {DESKTOP_APP_NAME}
          </Link>
        </p>
      </div>
    </section>
  )
}
