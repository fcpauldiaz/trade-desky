// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CreateWebhookForm from '#/components/connections/CreateWebhookForm'
import NinjatraderConnectForm from '#/components/connections/NinjatraderConnectForm'
import NinjatraderDevicePairing from '#/components/connections/NinjatraderDevicePairing'
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
    expect(screen.getByText(/Confirm the local Trade Desky NinjaTrader Receiver is running/)).toBeTruthy()
    expect(screen.getByText(/Test connection/)).toBeTruthy()
    expect(screen.getByText(/send a Sim101 smoke order/)).toBeTruthy()

    const secretInput = screen.getByPlaceholderText('Only if your local bridge requires it') as HTMLInputElement
    expect(secretInput.value).toBe('my-bridge-secret')
  })

  it('hydrates forward URL when initialForwardUrl arrives after mount', async () => {
    const onSubmit = vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))

    const { rerender } = render(
      <NinjatraderConnectForm
        connected
        initialForwardUrl=""
        initialAccountLabel="Sim101"
        onSubmit={onSubmit}
      />,
    )

    const input = screen.getByPlaceholderText('https://….trycloudflare.com/webhook') as HTMLInputElement
    expect(input.value).toBe('')

    rerender(
      <NinjatraderConnectForm
        connected
        initialForwardUrl="https://tunnel.example.com/webhook"
        initialAccountLabel="Sim101"
        onSubmit={onSubmit}
      />,
    )

    await waitFor(() => {
      expect(input.value).toBe('https://tunnel.example.com/webhook')
    })
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

  it('shows Test connection when connected and saves before testing', async () => {
    const callOrder: string[] = []
    const onSubmit = vi.fn(async () => {
      callOrder.push('submit')
      return { forwardUrl: 'https://tunnel.example.com/webhook' }
    })
    const onTestConnection = vi.fn(async () => {
      callOrder.push('test')
      return {
        success: true,
        message: 'Connection verified with simulated order',
      }
    })

    function Wrapper() {
      const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
      return (
        <NinjatraderConnectForm
          connected
          initialForwardUrl="https://tunnel.example.com/webhook"
          initialAccountLabel="Sim101"
          onSubmit={onSubmit}
          onTestConnection={async () => {
            const result = await onTestConnection()
            setTestResult(result)
            return result
          }}
          testResult={testResult}
        />
      )
    }

    render(<Wrapper />)

    const testButton = screen.getByRole('button', { name: 'Test connection' })
    expect(testButton).toBeTruthy()
    expect(testButton.className).toContain('btn-secondary')

    const updateButton = screen.getByRole('button', { name: 'Update NinjaTrader' })
    expect(
      updateButton.compareDocumentPosition(testButton) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    fireEvent.click(testButton)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onTestConnection).toHaveBeenCalledTimes(1)
    })

    expect(callOrder).toEqual(['submit', 'test'])
    expect(await screen.findByText('Connection verified with simulated order')).toBeTruthy()
  })

  it('saves changed forward URL before testing', async () => {
    const callOrder: string[] = []
    const onSubmit = vi.fn(async (values) => {
      callOrder.push('submit')
      return { forwardUrl: values.forwardUrl }
    })
    const onTestConnection = vi.fn(async () => {
      callOrder.push('test')
      return { success: true, message: 'ok' }
    })

    render(
      <NinjatraderConnectForm
        connected
        initialForwardUrl="https://old.example.com/webhook"
        initialAccountLabel="Sim101"
        onSubmit={onSubmit}
        onTestConnection={onTestConnection}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText('https://….trycloudflare.com/webhook'), {
      target: { value: 'https://new.example.com/webhook' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        forwardUrl: 'https://new.example.com/webhook',
        bridgeWebhookSecret: '',
        accountLabel: 'Sim101',
      })
      expect(onTestConnection).toHaveBeenCalledTimes(1)
    })

    expect(callOrder).toEqual(['submit', 'test'])
  })

  it('disables Test connection when forward URL is empty and no online device', () => {
    render(
      <NinjatraderConnectForm
        connected
        initialForwardUrl=""
        initialAccountLabel=""
        onSubmit={vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))}
        onTestConnection={vi.fn(async () => ({ success: true, message: 'ok' }))}
        showTestConnection
      />,
    )

    const testButton = screen.getByRole('button', { name: 'Test connection' }) as HTMLButtonElement
    expect(testButton.disabled).toBe(true)
    expect(
      screen.getByText('Pair a Windows receiver or enter a Forward URL to test your connection.'),
    ).toBeTruthy()
  })

  it('allows Test connection without forward URL when an online device is paired', () => {
    render(
      <NinjatraderConnectForm
        connected
        initialForwardUrl=""
        initialAccountLabel=""
        hasOnlineDevice
        onSubmit={vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))}
        onTestConnection={vi.fn(async () => ({ success: true, message: 'ok' }))}
        showTestConnection
      />,
    )

    const testButton = screen.getByRole('button', { name: 'Test connection' }) as HTMLButtonElement
    expect(testButton.disabled).toBe(false)
  })

  it('hides Test connection when not connected', () => {
    const onTestConnection = vi.fn(async () => ({ success: true, message: 'ok' }))

    render(
      <NinjatraderConnectForm
        connected={false}
        initialForwardUrl=""
        initialAccountLabel=""
        onSubmit={vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))}
        onTestConnection={onTestConnection}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Test connection' })).toBeNull()
  })

  it('shows disabled reason when test is disabled', () => {
    render(
      <NinjatraderConnectForm
        connected
        initialForwardUrl="https://tunnel.example.com/webhook"
        initialAccountLabel=""
        onSubmit={vi.fn(async () => ({ forwardUrl: 'https://tunnel.example.com/webhook' }))}
        onTestConnection={vi.fn(async () => ({ success: true, message: 'ok' }))}
        testDisabled
        testDisabledReason="An active subscription is required to test broker connections."
      />,
    )

    const testButton = screen.getByRole('button', { name: 'Test connection' }) as HTMLButtonElement
    expect(testButton.disabled).toBe(true)
    expect(screen.getByText('An active subscription is required to test broker connections.')).toBeTruthy()
  })
})

describe('NinjatraderDevicePairing', () => {
  it('submits optional device name when pairing', async () => {
    const onPair = vi.fn(async () => {})

    render(
      <NinjatraderDevicePairing
        devices={[]}
        pairedDevice={null}
        pairing={false}
        revokingId={null}
        onPair={onPair}
        onRevoke={vi.fn(async () => {})}
        onCopy={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText('Office PC, Sim101 laptop, etc.'), {
      target: { value: 'Sim101 laptop' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Pair Windows receiver' }))

    await waitFor(() => {
      expect(onPair).toHaveBeenCalledWith({ name: 'Sim101 laptop' })
    })
  })

  it('shows one-time pairing credentials and config snippet', () => {
    render(
      <NinjatraderDevicePairing
        devices={[]}
        pairedDevice={{
          device_id: 'dev_123',
          device_token: 'ntd_secret_token',
          ws_url: 'wss://api.example.com/v1/devices/ws',
          name: 'Office PC',
        }}
        pairing={false}
        revokingId={null}
        onPair={vi.fn(async () => {})}
        onRevoke={vi.fn(async () => {})}
        onCopy={vi.fn()}
      />,
    )

    expect(screen.getByText(/Save this device token now/)).toBeTruthy()
    expect(screen.getByDisplayValue('ntd_secret_token')).toBeTruthy()
    expect(screen.getByDisplayValue('wss://api.example.com/v1/devices/ws')).toBeTruthy()
    expect(screen.getByDisplayValue('dev_123')).toBeTruthy()
    expect(screen.getByDisplayValue(/"device_token": "ntd_secret_token"/)).toBeTruthy()
  })

  it('lists paired devices with online status and revoke action', async () => {
    const onRevoke = vi.fn(async () => {})

    render(
      <NinjatraderDevicePairing
        devices={[
          {
            id: 'dev_1',
            name: 'Office PC',
            online: true,
            last_seen_at: '2026-09-02T12:00:00.000Z',
            created_at: '2026-09-01T12:00:00.000Z',
            revoked: false,
          },
        ]}
        pairedDevice={null}
        pairing={false}
        revokingId={null}
        onPair={vi.fn(async () => {})}
        onRevoke={onRevoke}
        onCopy={vi.fn()}
      />,
    )

    expect(screen.getByText('Office PC')).toBeTruthy()
    expect(screen.getByText('Online')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }))

    await waitFor(() => {
      expect(onRevoke).toHaveBeenCalledWith('dev_1')
    })
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
