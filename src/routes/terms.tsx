import { createFileRoute, Link } from '@tanstack/react-router'

import LegalLayout from '#/components/legal/LegalLayout'
import { pageHead } from '#/lib/seo'
import {
  COMPANY_NAME,
  CREEM_TERMS_URL,
  LEGAL_REGION,
  PRODUCT_NAME,
  PRO_PRICE_LABEL,
  SITE_URL,
  SUPPORT_EMAIL,
} from '#/lib/site'

export const Route = createFileRoute('/terms')({
  head: () =>
    pageHead({
      title: 'Terms of Service',
      description: `Terms for using ${PRODUCT_NAME}: automated broker orders, Creem billing, acceptable use, and liability limits.`,
      path: '/terms',
    }),
  component: TermsPage,
})

function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      summary="These terms are a contract between you and us for use of the Trade Desky website, API, and desktop app."
    >
      <p>
        By creating an account, installing Notification Watcher, or paying for Pro, you agree to
        these Terms, the <Link to="/privacy">Privacy Policy</Link>, the{' '}
        <Link to="/refund">Refund Policy</Link>, and the <Link to="/risk">Risk Disclosure</Link>. If
        you do not agree, do not use the service.
      </p>
      <p>
        Card payments are sold by Creem as merchant of record. If these Terms conflict with{' '}
        <a href={CREEM_TERMS_URL} rel="noreferrer" target="_blank">
          Creem’s buyer terms
        </a>{' '}
        on a payment issue, Creem’s terms control that payment. This page is product documentation,
        not legal, tax, or investment advice.
      </p>

      <h2>1. Who we are</h2>
      <p>
        {COMPANY_NAME} operates {PRODUCT_NAME} at {SITE_URL}. Contact{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
      <p>
        We provide software. We are not a broker-dealer, introducing broker, commodity trading
        advisor, investment adviser, exchange, or bank. We do not hold your trading capital. Orders
        go to a brokerage account you open with Tradier or Charles Schwab (or another broker we may
        add later).
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be old enough to form a contract and to trade options in your own name at your
        broker. You must comply with your broker’s agreements and with securities laws that apply to
        you. The service is not offered where automated trading software or options trading is
        prohibited.
      </p>

      <h2>3. The service</h2>
      <p>
        {PRODUCT_NAME} captures notification text from a desktop app you install, sends that text to
        our ingest API while you are signed in, attempts to parse a trade intent (including with
        third-party AI), checks it against settings and option-chain data when available, and may
        submit an order through a connected broker API.
      </p>
      <p>
        Free accounts can sign in and explore the website. Automated execution requires an active Pro
        subscription, a connected broker, completed onboarding, and a running, signed-in desktop
        app. Features can change.
      </p>

      <h2>4. Accounts and security</h2>
      <p>
        You are responsible for the email, password, device, and broker tokens used with the
        service. Do not share logins. Notify us if you believe the account is compromised. We may
        refuse, suspend, or close accounts that look abusive, that violate these Terms, or that
        create operational or legal risk.
      </p>

      <h2>5. Automated orders and AI</h2>
      <p>You understand and accept that:</p>
      <ul>
        <li>Notification text can be incomplete, delayed, or not a trade at all.</li>
        <li>AI parsing can misread ticker, side, strike, expiry, size, or strategy.</li>
        <li>Option chains, quotes, and broker APIs can be stale, down, or reject the order.</li>
        <li>
          The desktop app does nothing while the computer is off, asleep, logged out, or without
          notification permission.
        </li>
        <li>
          Tradier sandbox/paper is not live Schwab or live Tradier. Enabling live trading can send
          real orders with real money.
        </li>
      </ul>
      <p>
        You are solely responsible for every order, fill, partial fill, reject, and loss in your
        brokerage account. Read the <Link to="/risk">Risk Disclosure</Link>.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You may not:</p>
      <ul>
        <li>Probe, scrape, or overload the API beyond normal product use</li>
        <li>Resell the service or share one subscription across unrelated traders</li>
        <li>Attempt to bypass billing, execution gates, or broker auth</li>
        <li>Use the product for market manipulation or other unlawful trading</li>
        <li>Upload malware or attempt to access another user’s data</li>
      </ul>

      <h2>7. Billing</h2>
      <p>
        Pro is {PRO_PRICE_LABEL} per month unless we post a different price before you pay. Creem
        charges your payment method, collects applicable tax, and issues receipts. Manage or cancel
        in the billing portal from <Link to="/billing">Billing</Link>. Cancellation stops the next
        renewal; access to automated execution lasts until the paid period ends unless we or Creem
        end it sooner. Details are in the <Link to="/refund">Refund Policy</Link>.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        We own {PRODUCT_NAME}, the website, and the desktop app. You keep your alert text, trade
        data, and reviews. You grant us a license to process that content to run the service and,
        for reviews you publish, to display them on the site.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW,{' '}
        {COMPANY_NAME} DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
        PURPOSE, AND NON-INFRINGEMENT. We do not warrant uninterrupted uptime, correct parses,
        fills at a particular price, or compatibility with every alert format or broker outage.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {COMPANY_NAME} is not liable for lost profits,
        trading losses, missed alerts, slippage, data loss, or indirect or consequential damages.
        Our total liability for claims arising out of the service is limited to the greater of (a)
        the amount you paid us for Pro in the three months before the claim or (b) fifty U.S.
        dollars. Some places do not allow these limits; in those places, our liability is limited to
        the fullest extent allowed.
      </p>

      <h2>11. Indemnity</h2>
      <p>
        You will defend and indemnify {COMPANY_NAME} against claims arising from your orders, your
        alert content, your broker account, or your misuse of the service, except to the extent a
        claim is caused by our willful misconduct.
      </p>

      <h2>12. Changes and termination</h2>
      <p>
        We may change these Terms by posting an updated date on this page. Material billing changes
        will apply from the next renewal unless the law requires otherwise. You may stop using the
        service and cancel Pro at any time. We may stop offering the product.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of {LEGAL_REGION}, excluding conflict-of-law rules,
        except where mandatory consumer law in your country says otherwise. Courts competent for{' '}
        {COMPANY_NAME} may hear disputes, without limiting any non-waivable right you have to sue in
        your home jurisdiction.
      </p>
    </LegalLayout>
  )
}
