import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api-client'
import { useSession } from '#/lib/auth-client'
import type { Review } from '#/lib/review-types'
import ReviewForm from '#/components/reviews/ReviewForm'
import ReviewsList from '#/components/reviews/ReviewsList'
import UpgradeBanner from '#/components/UpgradeBanner'
import { pageHead } from '#/lib/seo'

export const Route = createFileRoute('/reviews')({
  head: () =>
    pageHead({
      title: 'Trade Desky reviews',
      description:
        'Read reviews from paying Trade Desky subscribers. Anyone can read them; only active customers can write one.',
      path: '/reviews',
    }),
  component: ReviewsPage,
})

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [myReview, setMyReview] = useState<Review | null>(null)
  const [canTrade, setCanTrade] = useState(false)
  const { data: session } = useSession()
  const loggedIn = Boolean(session?.user)

  async function refresh() {
    const list = await api.reviews()
    setReviews(list)
    if (loggedIn) {
      setMyReview(await api.myReview())
      const billing = await api.billing()
      setCanTrade(billing.can_process_trades)
    }
  }

  useEffect(() => {
    refresh().catch(() => {})
  }, [loggedIn])

  return (
    <main className="marketing-page page-wrap-wide space-y-8 px-4 py-10">
      <header className="marketing-page-header">
        <h1>Customer reviews</h1>
        <p>
          Real feedback from paying subscribers. Anyone can read reviews; only active customers can
          leave one.
        </p>
      </header>

      <section>
        <h2 className="marketing-section-title">What customers say</h2>
        <ReviewsList reviews={reviews} />
      </section>

      <section className="max-w-lg">
        {loggedIn && canTrade && <ReviewForm existing={myReview} onSaved={refresh} />}
        {loggedIn && !canTrade && <UpgradeBanner />}
        {!loggedIn && (
          <div className="feature-item">
            <p className="mb-3 text-sm text-[var(--muted-foreground)]">
              Active subscribers can leave a review.
            </p>
            <Link to="/login" className="font-semibold">
              Log in
            </Link>
            {' · '}
            <Link to="/signup" className="font-semibold">
              Sign up
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
