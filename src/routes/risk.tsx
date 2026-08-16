import { createFileRoute, Link } from '@tanstack/react-router'

import LegalLayout from '#/components/legal/LegalLayout'
import { pageHead } from '#/lib/seo'
import { PRODUCT_NAME } from '#/lib/site'

export const Route = createFileRoute('/risk')({
  head: () =>
    pageHead({
      title: 'Risk disclosure',
      description: `${PRODUCT_NAME} can place live option orders from parsed alerts. This disclosure describes trading, automation, and AI risks. It is not financial advice.`,
      path: '/risk',
    }),
  component: RiskPage,
})

function RiskPage() {
  return (
    <LegalLayout
      title="Risk disclosure"
      summary="Trade Desky is software that can send live option orders. You can lose money, including more than you expect on options. This is not a recommendation to trade."
    >
      <p>
        This disclosure is part of the <Link to="/terms">Terms of Service</Link>. If you enable live
        trading, you confirm you have read it.
      </p>

      <h2>1. Not advice, not a broker</h2>
      <p>
        Nothing on the site, in the app, or in a parsed alert is investment, tax, or legal advice.
        We do not manage your account. Your broker’s customer agreement still applies. Past results
        on the dashboard are not a prediction.
      </p>

      <h2>2. Options trading</h2>
      <p>
        Options can expire worthless. Prices move quickly. Spreads, assignment, early exercise, and
        corporate actions can produce losses larger than the debit you thought you risked, depending
        on the structure and your account settings at the broker. You should only trade with money
        you can afford to lose.
      </p>

      <h2>3. Automation and speed</h2>
      <p>
        The product exists to shorten the time between a notification and an order. Faster is not
        safer. An automated order can hit the market before you reread the alert. If you are not
        willing to accept a wrong-size or wrong-contract order, keep live trading off and use paper
        (Tradier sandbox) or disconnect the broker.
      </p>

      <h2>4. Alerts and AI</h2>
      <p>
        Discord-style alerts are informal. Authors make mistakes. Our parser can make different
        mistakes. Chain validation reduces some errors; it does not eliminate them. We may skip an
        alert or send an order you did not intend.
      </p>

      <h2>5. Technology failures</h2>
      <p>
        Missed trades and unexpected trades can both happen when the desktop app is closed, the
        network drops, the broker API errors, quotes are stale, or our servers are down. We do not
        guarantee that every banner becomes a fill or that a fill is the “right” trade.
      </p>

      <h2>6. Your controls</h2>
      <p>
        Use allowed tickers, contract caps, paper vs live, and broker disconnect. You can revoke
        broker access at Tradier or Schwab. Those controls are the primary way to limit what the
        software can do. They are not a guarantee against loss.
      </p>
    </LegalLayout>
  )
}
