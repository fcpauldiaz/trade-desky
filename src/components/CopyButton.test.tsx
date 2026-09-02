// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CopyButton from '#/components/CopyButton'
import * as copyTextModule from '#/lib/copy-text'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('CopyButton', () => {
  it('shows Copied feedback after a successful copy', async () => {
    vi.spyOn(copyTextModule, 'copyText').mockResolvedValue(true)

    render(<CopyButton value="secret-token" />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    expect(await screen.findByRole('button', { name: 'Copied' })).toBeTruthy()
    expect(copyTextModule.copyText).toHaveBeenCalledWith('secret-token')
  })

  it('shows Failed feedback when copy fails', async () => {
    vi.spyOn(copyTextModule, 'copyText').mockResolvedValue(false)

    render(<CopyButton value="secret-token" />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

    expect(await screen.findByRole('button', { name: 'Failed' })).toBeTruthy()
  })

  it('resets to the default label after feedback', async () => {
    vi.spyOn(copyTextModule, 'copyText').mockResolvedValue(true)

    render(<CopyButton value="secret-token" label="Copy URL" />)

    fireEvent.click(screen.getByRole('button', { name: 'Copy URL' }))
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeTruthy()

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: 'Copy URL' })).toBeTruthy()
      },
      { timeout: 2500 },
    )
  })
})
