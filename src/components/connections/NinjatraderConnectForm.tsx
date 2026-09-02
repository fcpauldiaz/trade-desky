import { useForm } from '@tanstack/react-form'
<<<<<<< HEAD
import { Eye, EyeOff } from 'lucide-react'
=======
>>>>>>> b46fc26 (feat(connections): add prominent NinjaTrader Test connection button)
import { useEffect, useState } from 'react'
import FieldHelpDialog from '#/components/FieldHelpDialog'
import { optionalHttpsUrl } from '#/lib/connection-form-validators'
import { NINJATRADER_GUIDE_PATH } from '#/lib/guides'

export type NinjatraderConnectFormValues = {
  forwardUrl: string
  bridgeWebhookSecret: string
  accountLabel: string
}

<<<<<<< HEAD
type SaveOutcome = 'connected' | 'updated'
=======
type TestConnectionResult = {
  success: boolean
  message: string
}
>>>>>>> b46fc26 (feat(connections): add prominent NinjaTrader Test connection button)

type NinjatraderConnectFormProps = {
  connected: boolean
  initialForwardUrl: string
  initialAccountLabel: string
  onSubmit: (values: NinjatraderConnectFormValues) => Promise<{ forwardUrl: string }>
  onTestConnection?: () => Promise<TestConnectionResult>
  testDisabled?: boolean
  testDisabledReason?: string
  testLoading?: boolean
  testResult?: TestConnectionResult | null
}

export default function NinjatraderConnectForm({
  connected,
  initialForwardUrl,
  initialAccountLabel,
  onSubmit,
  onTestConnection,
  testDisabled = false,
  testDisabledReason,
  testLoading = false,
  testResult = null,
}: NinjatraderConnectFormProps) {
<<<<<<< HEAD
  const [secretVisible, setSecretVisible] = useState(false)
  const [saveOutcome, setSaveOutcome] = useState<SaveOutcome | null>(null)
=======
  const [justSaved, setJustSaved] = useState(false)
>>>>>>> b46fc26 (feat(connections): add prominent NinjaTrader Test connection button)

  const form = useForm({
    defaultValues: {
      forwardUrl: initialForwardUrl,
      bridgeWebhookSecret: '',
      accountLabel: initialAccountLabel,
    },
    onSubmit: async ({ value }) => {
      const wasConnected = connected
      const result = await onSubmit({
        forwardUrl: value.forwardUrl,
        bridgeWebhookSecret: value.bridgeWebhookSecret,
        accountLabel: value.accountLabel,
      })
      form.setFieldValue('forwardUrl', result.forwardUrl)
<<<<<<< HEAD
      setSaveOutcome(wasConnected ? 'updated' : 'connected')
=======
      form.setFieldValue('bridgeWebhookSecret', '')
      setJustSaved(true)
>>>>>>> b46fc26 (feat(connections): add prominent NinjaTrader Test connection button)
    },
  })

  useEffect(() => {
    form.setFieldValue('forwardUrl', initialForwardUrl)
    form.setFieldValue('accountLabel', initialAccountLabel)
  }, [form, initialAccountLabel, initialForwardUrl])

  const showTestConnection = connected && onTestConnection
  const testButtonDisabled = testDisabled || testLoading

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      className="space-y-3"
    >
<<<<<<< HEAD
      {saveOutcome && (
        <div className="feature-item space-y-2 p-3 text-sm">
          <p className="font-semibold">
            {saveOutcome === 'connected' ? 'NinjaTrader connected' : 'NinjaTrader settings saved'}
          </p>
          <p className="text-xs text-[var(--sea-ink-soft)]">Next steps:</p>
          <ol className="list-decimal space-y-1 pl-4 text-xs text-[var(--sea-ink-soft)]">
            <li>Confirm the local Trade Desky NinjaTrader Receiver EXE is running</li>
            <li>
              Confirm your ngrok/tunnel HTTPS URL ends with <code>/webhook</code> and matches Forward
              URL above
            </li>
            <li>
              In NinjaTrader 8, enable the Trade Desky add-on and start on <strong>Sim101</strong>
            </li>
            <li>
              Use <strong>Test</strong> on the NinjaTrader card above to send a smoke order
            </li>
          </ol>
          <p className="text-xs">
            <a href={NINJATRADER_GUIDE_PATH} className="underline">
              Full setup guide
            </a>
=======
      {justSaved && connected && (
        <div className="feature-item border-green-600 bg-green-50 p-3 text-sm">
          <p className="font-semibold text-green-900">NinjaTrader connection saved</p>
          <p className="mt-1 text-green-800">
            Click <strong>Test connection</strong> below to verify your bridge reaches NinjaTrader on
            Sim101 before routing live alerts.
>>>>>>> b46fc26 (feat(connections): add prominent NinjaTrader Test connection button)
          </p>
        </div>
      )}

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
            <div className="relative mt-1">
              <input
                type={secretVisible ? 'text' : 'password'}
                autoComplete="off"
                className="demo-input w-full pr-10"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Only if your local bridge requires it"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[var(--sea-ink-soft)] hover:text-[var(--ja-black)]"
                aria-label={secretVisible ? 'Hide secret' : 'Show secret'}
                onClick={() => setSecretVisible((visible) => !visible)}
              >
                {secretVisible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              </button>
            </div>
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

      <form.Subscribe
        selector={(state) => [state.isSubmitting, state.values.forwardUrl, state.canSubmit] as const}
      >
        {([isSubmitting, forwardUrl, canSubmit]) => (
          <button
            type="submit"
            disabled={!forwardUrl.trim() || !canSubmit || isSubmitting}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : connected ? 'Update NinjaTrader' : 'Connect NinjaTrader'}
          </button>
        )}
      </form.Subscribe>

      {showTestConnection && (
        <div className="space-y-2 border-t border-[var(--line)] pt-4">
          <button
            type="button"
            disabled={testButtonDisabled}
            onClick={() => void onTestConnection()}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {testLoading ? 'Testing…' : 'Test connection'}
          </button>
          {testDisabled && testDisabledReason && (
            <p className="text-xs text-[var(--sea-ink-soft)]">{testDisabledReason}</p>
          )}
          {testResult && (
            <p
              className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-600'}`}
              role="status"
            >
              {testResult.message}
            </p>
          )}
        </div>
      )}
    </form>
  )
}
