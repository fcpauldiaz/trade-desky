import { HOME_FAQ } from '#/lib/json-ld'

export default function FaqSection({ faq = HOME_FAQ }: { faq?: typeof HOME_FAQ }) {
  return (
    <section className="marketing-section marketing-section-white">
      <div className="page-wrap px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <span className="section-badge section-badge-green">FAQ</span>
          <h2 className="marketing-section-title">Common questions</h2>
        </div>
        <div className="faq-list">
          {faq.map((item) => (
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
