import { describe, expect, it } from 'vitest'

import {
  PRO_PRICE_USD,
  PRO_YEARLY_PRICE_USD,
  PRO_YEARLY_SAVINGS_PERCENT,
  PRO_YEARLY_SAVINGS_PILL,
  PRO_YEARLY_VS_MONTHLY_SAVINGS_USD,
} from '#/lib/site'

describe('yearly savings', () => {
  it('is the gap between twelve monthly charges and yearly Pro', () => {
    expect(PRO_YEARLY_VS_MONTHLY_SAVINGS_USD).toBe(
      Math.round((PRO_PRICE_USD * 12 - PRO_YEARLY_PRICE_USD) * 100) / 100,
    )
    expect(PRO_YEARLY_SAVINGS_PERCENT).toBe(
      Math.round((PRO_YEARLY_VS_MONTHLY_SAVINGS_USD / (PRO_PRICE_USD * 12)) * 100),
    )
    expect(PRO_YEARLY_SAVINGS_PILL).toBe(
      `Save $${Math.round(PRO_YEARLY_VS_MONTHLY_SAVINGS_USD)} · ${PRO_YEARLY_SAVINGS_PERCENT}%`,
    )
  })
})
