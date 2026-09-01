import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import FieldHelpDialog from '#/components/FieldHelpDialog'
import { optionalHttpsUrl } from '#/lib/connection-form-validators'

export type NinjatraderConnectFormValues = {
  forwardUrl: string
  bridgeWebhookSecret: string
  accountLabel: string
}

type NinjatraderConnectFormProps = {
  connected: boolean
  initialForwardUrl: string
  initialAccountLabel: string
  onSubmit: (values: NinjatraderConnectFormValues) => Promise<{ forwardUrl: string }>
}

export default function NinjatraderConnectForm({
  connected,
  initialForwardUrl,
  initialAccountLabel,
  onSubmit,
}: NinjatraderConnectFormProps) {
  const form = useForm({
    defaultValues: {
      forwardUrl: initialForwardUrl,
      bridgeWebhookSecret: '',
      accountLabel: initialAccountLabel,
    },
    onSubmit: async ({ value }) => {
      const result = await onSubmit({
        forwardUrl: value.forwardUrl,
        bridgeWebhookSecret: value.bridgeWebhookSecret,
        accountLabel: value.accountLabel,
      })
      form.setFieldValue('forwardUrl', result.forwardUrl)
      form.setFieldValue('bridgeWebhookSecret', '')
    },
  })

  useEffect(() => {
    form.reset({
      forwardUrl: initialForwardUrl,
      bridgeWebhookSecret: '',
      accountLabel: initialAccountLabel,
    })
  }, [form, initialAccountLabel, initialForwardUrl])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      className="space-y-3"
    >
      <form.Field
        name="forwardUrl"
        validators={{
          onChange: ({ value }) => optionalHttpsUrl(value),
          onSubmit: ({ value }) => optionalHttpsUrl(value),
        }}
      >
        {(field) => (
          <label className="block text-sm">
            Forward URL
            <input
              type="url"
              autoComplete="off"
              className="demo-input mt-1 w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="https://….trycloudflare.com/webhook"
              required
            />
            {field.state.meta.errors.length > 0 && (
              <span className="mt-1 block text-xs text-red-600">{field.state.meta.errors[0]}</span>
            )}
            <FieldHelpDialog title="Forward URL">
              <p>
                Paste the public <strong>HTTPS</strong> URL of your local trade-desky-ninjatrader
                receiver — the address exposed by Cloudflare Tunnel, ngrok, or similar. It must end
                with <code>/webhook</code> and be reachable from Trade Desky cloud.
              </p>
              <p>
                This is <strong>not</strong> a download link or repository URL. Start on{' '}
                <strong>Sim101</strong> in NinjaTrader before testing live execution.
              </p>
            </FieldHelpDialog>
          </label>
        )}
      </form.Field>

      <form.Field name="bridgeWebhookSecret">
        {(field) => (
          <label className="block text-sm">
            Bridge webhook secret <span className="text-[var(--sea-ink-soft)]">(optional)</span>
            <input
              type="password"
              autoComplete="off"
              className="demo-input mt-1 w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Only if your local bridge requires it"
            />
          </label>
        )}
      </form.Field>

      <form.Field name="accountLabel">
        {(field) => (
          <label className="block text-sm">
            Account label <span className="text-[var(--sea-ink-soft)]">(optional)</span>
            <input
              type="text"
              autoComplete="off"
              className="demo-input mt-1 w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Note shown in Connections — account is chosen in NT"
            />
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting} className="btn-primary text-sm disabled:opacity-50">
            {isSubmitting ? 'Saving…' : connected ? 'Update NinjaTrader' : 'Connect NinjaTrader'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
