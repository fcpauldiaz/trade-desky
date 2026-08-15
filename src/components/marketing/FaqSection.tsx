const FAQ = [
  {
    q: 'Why use Trade Desky instead of copying alerts manually?',
    a: 'The desktop app captures notifications as they arrive, AI parses the trade intent, and your broker can execute before you finish switching apps.',
  },
  {
    q: 'Do I need to configure a webhook URL?',
    a: 'No. Sign in on macOS or Windows with the same account as the web app. The desktop client connects to our ingest endpoint automatically.',
  },
  {
    q: 'Which brokers are supported?',
    a: 'Tradier and Schwab today. Connect from the Connections page, complete onboarding, then run paper or live trades from your dashboard.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Manage billing from your account. When a subscription lapses, automated execution stops until you resubscribe.',
  },
] as const

export default function FaqSection() {
  return (
    <section className="marketing-section marketing-section-white">
      <div className="page-wrap px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <span className="section-badge section-badge-green">FAQ</span>
          <h2 className="marketing-section-title">Common questions</h2>
        </div>
        <div className="faq-list">
          {FAQ.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
