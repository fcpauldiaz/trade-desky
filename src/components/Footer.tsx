import { Link } from '@tanstack/react-router'

import { showPricingForUser } from '#/lib/pricing-visibility'
import { SUPPORT_EMAIL } from '#/lib/site'
import { useCanProcessTrades } from '#/lib/use-can-process-trades'

export default function Footer() {
  const year = new Date().getFullYear()
  const { loggedIn, canProcessTrades } = useCanProcessTrades()
  const showPricing = showPricingForUser(loggedIn, canProcessTrades)

  return (
    <footer className="site-footer">
      <div className="page-wrap site-footer-inner px-4 sm:px-6 lg:px-8">
        <div className="site-footer-brand">
          <h2>Trade Desky</h2>
          <p>Notification alerts → AI parsing → broker execution. Not financial advice.</p>
          <p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
        <div className="site-footer-col">
          <h3>Product</h3>
          <ul>
            <li>
              <Link to="/download">Download</Link>
            </li>
            {showPricing ? (
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
            ) : null}
            <li>
              <Link to="/integrations">Integrations</Link>
            </li>
            <li>
              <Link to="/compare">Compare</Link>
            </li>
            <li>
              <Link to="/reviews">Reviews</Link>
            </li>
            <li>
              <Link to="/support">Support</Link>
            </li>
          </ul>
        </div>
        <div className="site-footer-col">
          <h3>Legal</h3>
          <ul>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/refund">Refunds</Link>
            </li>
            <li>
              <Link to="/risk">Risk</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="page-wrap site-footer-bottom px-4 sm:px-6 lg:px-8">
        &copy; {year} Trade Desky. Trading involves risk.
      </div>
    </footer>
  )
}
