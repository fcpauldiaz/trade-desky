import { createFileRoute, Link } from '@tanstack/react-router'

import LegalLayout from '#/components/legal/LegalLayout'
import { pageHead } from '#/lib/seo'
import {
  COMPANY_NAME,
  CREEM_PRIVACY_URL,
  PRODUCT_NAME,
  SUPPORT_EMAIL,
} from '#/lib/site'

export const Route = createFileRoute('/privacy')({
  head: () =>
    pageHead({
      title: 'Privacy Policy',
      description: `How ${PRODUCT_NAME} collects and uses account data, broker tokens, alert text, cookies, and billing information.`,
      path: '/privacy',
    }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      summary="This policy explains what personal data we collect, why we process it, who we share it with, and how to ask for deletion or an export."
    >
      <p>
        {COMPANY_NAME} (“we”) provides {PRODUCT_NAME}. This policy covers the website, the
        Notification Watcher desktop app, and the receiver API. It does not cover Tradier, Schwab,
        Discord, or Creem’s own sites. Creem’s privacy notice is at{' '}
        <a href={CREEM_PRIVACY_URL} rel="noreferrer" target="_blank">
          creem.io/privacy
        </a>
        .
      </p>

      <h2>1. Data we collect</h2>
      <h3>Account</h3>
      <p>Name, email, password hash, and whether the email is verified. We do not store your password in plain text.</p>
      <h3>Session and device</h3>
      <p>
        Sign-in session cookie, IP address and user agent associated with the session, and a hashed
        device API key issued for the desktop app. The website also writes a local theme preference
        in the browser.
      </p>
      <h3>Broker connections</h3>
      <p>
        Broker name, connection status, account id, environment (paper/live where applicable), and
        encrypted OAuth or API credentials you provide for Tradier or Schwab.
      </p>
      <h3>Alerts, settings, and trades</h3>
      <p>
        Notification text the desktop app forwards while you are signed in; normalized parse output;
        sizing and risk settings; inbound alert records; and trade execution records (including
        broker responses we store to show history).
      </p>
      <h3>Billing</h3>
      <p>
        Subscription status, plan name, renewal/end dates, and Creem customer and subscription ids.
        We do not receive or store full card numbers. Creem processes the payment as merchant of
        record.
      </p>
      <h3>Reviews and support</h3>
      <p>
        Reviews you submit (rating, text, display name) and emails you send to {SUPPORT_EMAIL},
        including the address you write from.
      </p>

      <h2>2. How we use data</h2>
      <ul>
        <li>Create and authenticate your account</li>
        <li>Parse alerts and submit or skip broker orders according to your settings</li>
        <li>Show dashboards, connections, billing status, and published reviews</li>
        <li>Prevent abuse, debug failures, and meet legal requests we are required to honor</li>
        <li>Email you about the account, billing, or material product changes</li>
      </ul>
      <p>
        We do not sell personal data. We do not use advertising cookies or sell data to ad networks.
      </p>

      <h2>3. Alert text and AI</h2>
      <p>
        When the desktop app is signed in, notification bodies are sent to our ingest API and may be
        sent to a third-party AI inference provider to extract a structured order intent. Treat
        alert text as content we will process. Do not expect notification banners that contain
        passwords or unrelated secrets to stay only on your machine.
      </p>

      <h2>4. Processors and sharing</h2>
      <p>We share data only as needed to run the product:</p>
      <ul>
        <li>Infrastructure and database hosting (including Turso / libSQL and the server that runs the API)</li>
        <li>Creem, for checkout, tax invoices, subscription state, and customer portal</li>
        <li>Tradier and Charles Schwab, after you connect them, to authorize and place orders</li>
        <li>The AI inference provider configured for parsing</li>
        <li>Authorities if the law requires it</li>
      </ul>
      <p>
        Public reviews are visible to anyone on the website. Do not include account numbers in a
        review.
      </p>

      <h2>5. Location</h2>
      <p>
        We operate from {COMPANY_NAME} and store application data with providers that currently host
        in the United States. If you use the service from another country, you transfer data to the
        United States to receive it.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use a session cookie that is required to keep you signed in (HttpOnly session). Without
        it, the product cannot authenticate the browser. We do not use analytics pixels or
        advertising cookies. You can block cookies in the browser; you will be signed out.
      </p>

      <h2>7. Retention</h2>
      <p>
        We keep account, trade, and alert records while the account exists and for a reasonable
        period afterward if we need them for billing disputes, security, or law. You can disconnect
        a broker at any time from <Link to="/connections">Connections</Link>, which removes stored
        credentials for that broker. To delete the account or request an export, email{' '}
        {SUPPORT_EMAIL} from the registered address.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete, or export
        personal data, or to object to certain processing. Email {SUPPORT_EMAIL}. We may need to
        verify the account. We will not discriminate against you for exercising a privacy right the
        law gives you.
      </p>
      <p>
        If you are in the EEA or UK and we process data to perform the contract (providing the
        software you signed up for) or for legitimate interests (security and abuse prevention),
        those are the grounds we rely on. You may lodge a complaint with your local data authority.
      </p>

      <h2>9. Children</h2>
      <p>
        The service is for adults who can legally trade. We do not knowingly collect personal data
        from children. If you believe we have, email {SUPPORT_EMAIL} and we will delete it.
      </p>

      <h2>10. Security</h2>
      <p>
        Broker tokens are encrypted at rest. No method of transmission or storage is completely
        secure. You still control broker-side permissions and can revoke OAuth or rotate API tokens
        at the broker.
      </p>

      <h2>11. Changes</h2>
      <p>
        We will post updates on this page with a new “last updated” date. If we materially expand
        how we use personal data, we will also note it in the product or by email when practical.
      </p>
    </LegalLayout>
  )
}
