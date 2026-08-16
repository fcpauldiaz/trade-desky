import { createFileRoute, Link } from '@tanstack/react-router'

import LegalLayout from '#/components/legal/LegalLayout'
import { pageHead } from '#/lib/seo'
import { COMPANY_NAME, CREEM_TERMS_URL, PRO_PRICE_LABEL, SUPPORT_EMAIL } from '#/lib/site'

export const Route = createFileRoute('/refund')({
  head: () =>
    pageHead({
      title: 'Refund policy',
      description: `Cancel Pro anytime. ${COMPANY_NAME} decides refund eligibility; Creem processes the payment. ${PRO_PRICE_LABEL}/mo.`,
      path: '/refund',
    }),
  component: RefundPage,
})

function RefundPage() {
  return (
    <LegalLayout
      title="Refund policy"
      summary={`${COMPANY_NAME} sets when a Trade Desky subscription is refundable. Creem, as merchant of record, processes charges and refunds on the payment.`}
    >
      <h2>1. Price and cancel</h2>
      <p>
        Pro is {PRO_PRICE_LABEL} per month unless a different price is shown at checkout. Cancel
        anytime: open <Link to="/billing">Billing</Link>, choose Manage subscription, and use the
        Creem customer portal. Cancellation stops the next renewal. Automated execution remains
        available until the current paid period ends, then it stops.
      </p>

      <h2>2. Default: no prorated refund</h2>
      <p>
        If you cancel mid-cycle, we do not automatically refund the unused days. That is the default
        for this monthly plan.
      </p>

      <h2>3. When we will refund</h2>
      <p>Email {SUPPORT_EMAIL} from the account email. We aim to respond within three business days. We will refund or instruct Creem to refund when:</p>
      <ul>
        <li>You were charged twice for the same period</li>
        <li>Checkout completed but we cannot provision the account for a reason on our side</li>
        <li>We agree, case by case, that the product was unusable for a substantial part of the period because of an outage we caused</li>
      </ul>
      <p>
        We may decline refunds for change of mind, unused time after you have been able to use
        execution, trading losses, or alerts the parser did not understand. Trading outcomes are not
        a basis for a refund. See the <Link to="/risk">Risk Disclosure</Link>.
      </p>

      <h2>4. Creem</h2>
      <p>
        Creem may refund a charge under its own{' '}
        <a href={CREEM_TERMS_URL} rel="noreferrer" target="_blank">
          buyer terms
        </a>{' '}
        (for example to reduce chargeback risk, or if we do not respond in time). Network card fees
        already paid on a captured charge are typically not returned to {COMPANY_NAME}. Chargebacks
        are handled by Creem; opening one after a refund is already in progress can delay the
        outcome.
      </p>

      <h2>5. How to ask</h2>
      <p>
        Write to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the account email, the
        approximate charge date, and the reason. Do not send card numbers.
      </p>
    </LegalLayout>
  )
}
