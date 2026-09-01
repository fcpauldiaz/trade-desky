import { BROKER_LOGOS } from '#/lib/brokers'

type BrokerLogosProps = {
  className?: string
}

export default function BrokerLogos({ className }: BrokerLogosProps) {
  return (
    <div className={className ?? 'broker-logos-row'} aria-label="Supported brokers">
      {BROKER_LOGOS.map((broker) => (
        <div key={broker.slug} className={`broker-logo-item broker-logo-item--${broker.slug}`}>
          <img
            src={broker.src}
            alt={broker.alt}
            className={`broker-logo-image broker-logo-image--${broker.slug}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  )
}
