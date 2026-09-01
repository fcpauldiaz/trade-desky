import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api-client'
import type { Review } from '#/lib/review-types'
import ReviewCard from '#/components/reviews/ReviewCard'
import Hero from '#/components/marketing/Hero'
import FeaturesSection from '#/components/marketing/FeaturesSection'
import HowItWorks from '#/components/marketing/HowItWorks'
import FaqSection from '#/components/marketing/FaqSection'
import FinalCta from '#/components/marketing/FinalCta'
import JsonLd from '#/components/JsonLd'
import { faqPageJsonLd, HOME_FAQ, organizationJsonLd, softwareApplicationJsonLd } from '#/lib/json-ld'
import { pageHead } from '#/lib/seo'

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      title: 'Trade Desky — automate Discord alerts to Tradier, Schwab, and NinjaTrader',
      description:
        'Capture Discord-style notification alerts on your desktop, parse them with AI, and send orders to Tradier, Schwab, or NinjaTrader futures via the local bridge.',
      path: '/',
    }),
  component: HomePage,
})

function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    api.reviews(3).then(setReviews).catch(() => {})
  }, [])

  return (
    <main className="marketing-page">
      <JsonLd data={[organizationJsonLd(), softwareApplicationJsonLd(), faqPageJsonLd(HOME_FAQ)]} />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <section className="marketing-section marketing-section-white">
        <div className="page-wrap px-4 sm:px-6 lg:px-8">
          <div className="section-head">
            <span className="section-badge section-badge-yellow">Reviews</span>
            <h2 className="marketing-section-title">Customer reviews</h2>
          </div>
          {reviews.length ? (
            <ul className="review-link-list">
              {reviews.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} compact />
                </li>
              ))}
            </ul>
          ) : (
            <p className="marketing-empty">Reviews from paying customers will appear here.</p>
          )}
          <p className="marketing-section-link">
            <Link to="/reviews">See all reviews →</Link>
          </p>
        </div>
      </section>
      <FaqSection />
      <FinalCta />
    </main>
  )
}
