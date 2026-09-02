import { useForm } from '@tanstack/react-form'
import CopyButton from '#/components/CopyButton'
import type { PairedDevice, UserDevice } from '#/lib/api-client'

export type NinjatraderDevicePairingProps = {
  devices: UserDevice[]
  pairedDevice: PairedDevice | null
  pairing: boolean
  revokingId: string | null
  onPair: (values: { name: string }) => Promise<void>
  onRevoke: (deviceId: string) => Promise<void>
}

function deviceLabel(device: UserDevice) {
  const trimmed = device.name.trim()
  return trimmed || `Device ${device.id.slice(0, 8)}`
}

function formatTimestamp(value: string | null) {
  if (!value) return 'Never'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

function agentConfigSnippet(paired: PairedDevice) {
  return JSON.stringify(
    {
      agent: {
        device_token: paired.device_token,
        ws_url: paired.ws_url,
      },
    },
    null,
    2,
  )
}

export default function NinjatraderDevicePairing({
  devices,
  pairedDevice,
  pairing,
  revokingId,
  onPair,
  onRevoke,
}: NinjatraderDevicePairingProps) {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await onPair({ name: value.name })
      form.reset()
    },
  })

  const activeDevices = devices.filter((device) => !device.revoked)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Pair Windows receiver</h3>
          <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
            Recommended path: pair your Windows receiver for outbound WebSocket delivery — no ngrok
            or tunnel required.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-wrap items-end gap-2"
        >
          <form.Field name="name">
            {(field) => (
              <label className="block min-w-[12rem] flex-1 text-sm">
                Device name <span className="text-[var(--sea-ink-soft)]">(optional)</span>
                <input
                  type="text"
                  autoComplete="off"
                  className="demo-input mt-1 w-full"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Office PC, Sim101 laptop, etc."
                />
              </label>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={pairing || !canSubmit || isSubmitting}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {pairing || isSubmitting ? 'Pairing…' : 'Pair Windows receiver'}
              </button>
            )}
          </form.Subscribe>
        </form>
      </div>

      {pairedDevice && (
        <div className="feature-item space-y-3 p-3 text-sm">
          <p className="font-semibold text-amber-800">
            Save this device token now — it is only shown once.
          </p>
          <ol className="list-decimal space-y-1 pl-4 text-xs text-[var(--sea-ink-soft)]">
            <li>Copy the device token and WebSocket URL below.</li>
            <li>
              Paste them into the receiver installer/setup or your{' '}
              <code className="text-xs">config.json</code> <code className="text-xs">agent</code>{' '}
              section.
            </li>
            <li>Start the Windows receiver — it connects outbound to Trade Desky.</li>
            <li>Use Test connection below once the device shows online.</li>
          </ol>

          <label className="block">
            Device token
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                readOnly
                className="demo-input flex-1 font-mono text-xs"
                value={pairedDevice.device_token}
              />
              <CopyButton value={pairedDevice.device_token} />
            </div>
          </label>

          <label className="block">
            WebSocket URL
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                readOnly
                className="demo-input flex-1 font-mono text-xs"
                value={pairedDevice.ws_url}
              />
              <CopyButton value={pairedDevice.ws_url} />
            </div>
            <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
              Append <code>?token=</code> plus your device token when connecting.
            </p>
          </label>

          <label className="block">
            Device ID
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                readOnly
                className="demo-input flex-1 font-mono text-xs"
                value={pairedDevice.device_id}
              />
              <CopyButton value={pairedDevice.device_id} />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-semibold">config.json agent section</span>
            <div className="mt-1 flex gap-2">
              <textarea
                readOnly
                rows={6}
                className="demo-input flex-1 font-mono text-xs"
                value={agentConfigSnippet(pairedDevice)}
              />
              <CopyButton value={agentConfigSnippet(pairedDevice)} />
            </div>
          </label>
        </div>
      )}

      {activeDevices.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Paired devices</h3>
          <ul className="space-y-2">
            {activeDevices.map((device) => (
              <li key={device.id} className="feature-item flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <div>
                  <p className="font-semibold">{deviceLabel(device)}</p>
                  <p className="text-xs text-[var(--sea-ink-soft)]">
                    <span
                      className={
                        device.online ? 'font-semibold text-green-700' : 'text-[var(--sea-ink-soft)]'
                      }
                    >
                      {device.online ? 'Online' : 'Offline'}
                    </span>
                    {' · '}
                    Last seen {formatTimestamp(device.last_seen_at)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={revokingId === device.id}
                  onClick={() => void onRevoke(device.id)}
                  className="rounded-full border px-3 py-1 text-xs disabled:opacity-50"
                >
                  {revokingId === device.id ? 'Revoking…' : 'Revoke'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
