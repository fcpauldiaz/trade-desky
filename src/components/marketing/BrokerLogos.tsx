import { BROKER_LOGOS } from '#/lib/brokers'

type BrokerLogosProps = {
  className?: string
}

export default function BrokerLogos({ className }: BrokerLogosProps) {
  return (
    <div className={className ?? 'broker-logos-row'} aria-label="Supported brokers">
      {BROKER_LOGOS.map((broker) => (
        <div key={broker.name} className="broker-logo-item">
          <img src={broker.src} alt={broker.name} width={160} height={40} loading="lazy" />
        </div>
      ))}
    </div>
  )
}
