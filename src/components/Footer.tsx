import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="page-wrap site-footer-inner px-4 sm:px-6 lg:px-8">
        <div className="site-footer-brand">
          <h2>Trade Desky</h2>
          <p>Notification alerts → AI parsing → broker execution. Not financial advice.</p>
        </div>
        <div className="site-footer-col">
          <h3>Product</h3>
          <ul>
            <li>
              <Link to="/pricing">Pricing</Link>
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
          </ul>
        </div>
      </div>
      <div className="page-wrap site-footer-bottom px-4 sm:px-6 lg:px-8">
        &copy; {year} Trade Desky. Trading involves risk.
      </div>
    </footer>
  )
}
