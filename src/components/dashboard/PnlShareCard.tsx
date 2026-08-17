import type { CSSProperties } from 'react'
import { PRODUCT_NAME } from '#/lib/site'
import {
  dayKeyFor,
  formatDayLabel,
  formatMonthLabel,
  heatmapMaxAbs,
  monthGrid,
  pnlHeatColor,
} from '#/lib/pnl-calendar'
import { formatSignedUsd } from '#/lib/share-pnl'

export const PNL_SHARE_CARD_SIZE = 1080

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

const cardStyle: CSSProperties = {
  width: PNL_SHARE_CARD_SIZE,
  height: PNL_SHARE_CARD_SIZE,
  boxSizing: 'border-box',
  background: '#ffffff',
  color: '#000000',
  border: '8px solid #000000',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  padding: 56,
}

type MonthProps = {
  variant: 'month'
  month: string
  dailyPnl: Record<string, number>
  monthPnl: number
  winRate: number
  filledTrades: number
}

type DayProps = {
  variant: 'day'
  day: string
  dayPnl: number
  tradeCount: number
  wins: number
  losses: number
}

export type PnlShareCardProps = MonthProps | DayProps

function BrandMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>{PRODUCT_NAME}</span>
      <span
        style={{
          width: 56,
          height: 16,
          background: '#facc15',
          border: '3px solid #000000',
          boxShadow: '4px 4px 0 #000000',
        }}
      />
    </div>
  )
}

function PnlValue({ amount }: { amount: number }) {
  const color = amount > 0 ? '#166534' : amount < 0 ? '#b91c1c' : '#000000'
  return (
    <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', color }}>
      {formatSignedUsd(amount)}
    </div>
  )
}

function Disclaimer() {
  return (
    <div style={{ marginTop: 'auto', fontSize: 18, fontWeight: 600, color: '#4b5563' }}>
      Not financial advice.
    </div>
  )
}

function MonthHeatmap({ month, dailyPnl }: { month: string; dailyPnl: Record<string, number> }) {
  const cells = monthGrid(month)
  const maxAbs = heatmapMaxAbs(dailyPnl)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
      {WEEKDAYS.map((label, index) => (
        <div
          key={`${label}-${index}`}
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 800,
            color: '#4b5563',
          }}
        >
          {label}
        </div>
      ))}
      {cells.map((day, index) => {
        if (!day) return <div key={`empty-${index}`} />
        const key = dayKeyFor(month, day)
        const pnl = dailyPnl[key]
        return (
          <div
            key={key}
            style={{
              background: pnlHeatColor(pnl, maxAbs),
              border: '3px solid #000000',
              minHeight: 72,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 800 }}>{day}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>
              {pnl === undefined ? '—' : formatSignedUsd(Math.round(pnl)).replace(/\.00$/, '')}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function PnlShareCard(props: PnlShareCardProps) {
  if (props.variant === 'day') {
    return (
      <div style={cardStyle}>
        <BrandMark />
        <div style={{ marginTop: 48, fontSize: 32, fontWeight: 800, color: '#4b5563' }}>
          {formatDayLabel(props.day)}
        </div>
        <div style={{ marginTop: 24 }}>
          <PnlValue amount={props.dayPnl} />
        </div>
        <div style={{ marginTop: 40, fontSize: 36, fontWeight: 800 }}>
          {props.tradeCount} {props.tradeCount === 1 ? 'trade' : 'trades'} · {props.wins}W / {props.losses}L
        </div>
        <Disclaimer />
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <BrandMark />
      <div style={{ marginTop: 28, fontSize: 32, fontWeight: 800, color: '#4b5563' }}>
        {formatMonthLabel(props.month)}
      </div>
      <div style={{ marginTop: 12, marginBottom: 28 }}>
        <PnlValue amount={props.monthPnl} />
      </div>
      <MonthHeatmap month={props.month} dailyPnl={props.dailyPnl} />
      <div style={{ marginTop: 28, fontSize: 28, fontWeight: 800 }}>
        {props.winRate.toFixed(0)}% win · {props.filledTrades} filled
      </div>
      <Disclaimer />
    </div>
  )
}
