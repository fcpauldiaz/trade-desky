import { Link } from '@tanstack/react-router'

export default function UpgradeBanner() {
  return (
    <div className="feature-item">
      <h3 className="mb-2 text-base font-black">Subscription required</h3>
      <p className="mb-4 text-sm text-[var(--ja-gray-600)]">
        An active Pro subscription is required for this feature.
      </p>
      <Link to="/onboarding" className="btn-primary btn-sm">
        Continue setup
      </Link>
    </div>
  )
}
