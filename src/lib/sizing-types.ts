export type SizingMode = 'alert_inferred' | 'fixed' | 'risk_percent'

export const TRADE_FILTER_PROMPT_MAX = 4000

export type UserSettings = {
  default_mode: string
  max_contracts: number
  allowed_tickers: string | null
  live_trading_enabled: boolean
  sizing_mode: SizingMode
  fixed_contracts: number
  risk_percent: number
  default_broker: string | null
  trade_filter_prompt: string | null
}

export type TestOrderResult = {
  success: boolean
  broker: string
  mode: string
  order_id: string | null
  simulated: boolean
  message: string
}
