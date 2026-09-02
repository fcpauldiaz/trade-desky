// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CreateWebhookForm from '#/components/connections/CreateWebhookForm'
import NinjatraderConnectForm from '#/components/connections/NinjatraderConnectForm'
import TradierTokenForm from '#/components/connections/TradierTokenForm'

afterEach(() => {
  cleanup()
})

describe('TradierTokenForm', () => {
  it('disables submit until access token is provided', async () => {
    render(
      <TradierTokenForm
        connected={false}
        environment="sandbox"
        onEnvironmentChange={() => {}}
        onSubmit={vi.fn(async () => {})}
      />,
    )

    const submit = screen.getByRole('button', { name: 'Connect with API token' }) as HTMLButtonElement
    expect(submit.disabled).toBe(true)

    fireEvent.change(screen.getByPlaceholderText('Paste sandbox API token'), {
      target: { value: 'sandbox-token-123' },
    })

    await waitFor(() => {
      expect(submit.disabled).toBe(false)
    })
  })
})

describe('NinjatraderConnectForm', () => {
  it('shows HTTPS validation error for non-https forward URLs', async () => {
    render(
      <NinjatraderConnectForm
        connected={false}
        initialForwardUrl=""
        initialAccountLabel=""
        onSubmit={vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))}
      />,
    )

    const input = screen.getByPlaceholderText('https://….trycloudflare.com/webhook')
    fireEvent.change(input, { target: { value: 'http://bad.example.com/webhook' } })
    fireEvent.blur(input)

    expect(await screen.findByText('Forward URL must use HTTPS')).toBeTruthy()

    fireEvent.change(input, { target: { value: 'https://tunnel.example.com/webhook' } })
    fireEvent.blur(input)

    await waitFor(() => {
      expect(screen.queryByText('Forward URL must use HTTPS')).toBeNull()
    })
  })

  it('keeps bridge secret after submit and shows success guidance', async () => {
    const onSubmit = vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))

    render(
      <NinjatraderConnectForm
        connected={false}
        initialForwardUrl=""
        initialAccountLabel=""
        onSubmit={onSubmit}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText('https://….trycloudflare.com/webhook'), {
      target: { value: 'https://tunnel.example.com/webhook' },
    })
    fireEvent.change(screen.getByPlaceholderText('Only if your local bridge requires it'), {
      target: { value: 'my-bridge-secret' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Connect NinjaTrader' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        forwardUrl: 'https://tunnel.example.com/webhook',
        bridgeWebhookSecret: 'my-bridge-secret',
        accountLabel: '',
      })
    })

    expect(await screen.findByText('NinjaTrader connected')).toBeTruthy()
    expect(screen.getByText(/Confirm the local Trade Desky NinjaTrader Receiver EXE is running/)).toBeTruthy()
    expect(screen.getByText(/send a smoke order/)).toBeTruthy()

    const secretInput = screen.getByPlaceholderText('Only if your local bridge requires it') as HTMLInputElement
    expect(secretInput.value).toBe('my-bridge-secret')
  })

  it('shows updated messaging when already connected', async () => {
    const onSubmit = vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))

    render(
      <NinjatraderConnectForm
        connected
        initialForwardUrl="https://tunnel.example.com/webhook"
        initialAccountLabel="Sim101"
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Update NinjaTrader' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
    })

    expect(await screen.findByText('NinjaTrader settings saved')).toBeTruthy()
  })

  it('toggles secret visibility with the eye button', () => {
    render(
      <NinjatraderConnectForm
        connected={false}
        initialForwardUrl=""
        initialAccountLabel=""
        onSubmit={vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))}
      />,
    )

    const secretInput = screen.getByPlaceholderText('Only if your local bridge requires it') as HTMLInputElement
    expect(secretInput.type).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: 'Show secret' }))
    expect(secretInput.type).toBe('text')

    fireEvent.click(screen.getByRole('button', { name: 'Hide secret' }))
    expect(secretInput.type).toBe('password')
  })
})

describe('CreateWebhookForm', () => {
  it('submits optional webhook name and clears the field', async () => {
    const onSubmit = vi.fn(async () => {})

    render(<CreateWebhookForm loading={false} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('TradingView, Discord bot, etc.'), {
      target: { value: 'TradingView alerts' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create webhook' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'TradingView alerts' })
    })

    expect((screen.getByPlaceholderText('TradingView, Discord bot, etc.') as HTMLInputElement).value).toBe('')
  })
})
