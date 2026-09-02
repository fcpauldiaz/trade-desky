import { createFileRoute, Link } from '@tanstack/react-router'

import LegalLayout from '#/components/legal/LegalLayout'
import { pageHead } from '#/lib/seo'
import { COMPANY_NAME, PRO_PRICE_LABEL, PRO_YEARLY_PRICE_LABEL, SUPPORT_EMAIL } from '#/lib/site'

export const Route = createFileRoute('/refund')({
  head: () =>
    pageHead({
      title: 'Refund policy',
      description: `How ${COMPANY_NAME} handles Trade Desky Pro cancellations and refunds. Reference rates ${PRO_PRICE_LABEL}/mo or ${PRO_YEARLY_PRICE_LABEL}/yr.`,
      path: '/refund',
    }),
  component: RefundPage,
})

function RefundPage() {
  return (
    <LegalLayout
      title="Refund policy"
      summary={`${COMPANY_NAME} sets when a Trade Desky subscription is refundable. Contact support to cancel or request a refund.`}
    >
      <h2>1. Price and cancel</h2>
      <p>
        Pro reference rates are {PRO_PRICE_LABEL} per month or {PRO_YEARLY_PRICE_LABEL} per year unless
        a different price was agreed for your account. Access is invite-only. To cancel or change
        access, email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the account
        address, or check status on <Link to="/billing">Billing</Link>.
      </p>

      <h2>2. Default: no prorated refund</h2>
      <p>
        If you cancel mid-cycle, we do not automatically refund the unused days. That is the default
        for monthly or yearly plans.
      </p>

      <h2>3. When we will refund</h2>
      <p>
        Email {SUPPORT_EMAIL} from the account email. We aim to respond within three business days.
        We will refund when:
      </p>
      <ul>
        <li>You were charged twice for the same period</li>
        <li>Payment completed but we cannot provision the account for a reason on our side</li>
        <li>
          We agree, case by case, that the product was unusable for a substantial part of the period
          because of an outage we caused
        </li>
      </ul>
      <p>
        We may decline refunds for change of mind, unused time after you have been able to use
        execution, trading losses, or alerts the parser did not understand. Trading outcomes are not
        a basis for a refund. See the <Link to="/risk">Risk Disclosure</Link>.
      </p>

      <h2>4. How to ask</h2>
      <p>
        Write to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the account email, the
        approximate charge date, and the reason. Do not send card numbers.
      </p>
    </LegalLayout>
  )
}
