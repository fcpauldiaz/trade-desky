import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import type { TradierEnvironment } from '#/lib/api-client'
import { requiredTrimmed } from '#/lib/connection-form-validators'

export type TradierTokenFormValues = {
  environment: TradierEnvironment
  accessToken: string
  accountId: string
}

type TradierTokenFormProps = {
  connected: boolean
  environment: TradierEnvironment
  onEnvironmentChange: (environment: TradierEnvironment) => void
  onSubmit: (values: TradierTokenFormValues) => Promise<void>
}

export default function TradierTokenForm({
  connected,
  environment,
  onEnvironmentChange,
  onSubmit,
}: TradierTokenFormProps) {
  const form = useForm({
    defaultValues: {
      environment,
      accessToken: '',
      accountId: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        environment: value.environment,
        accessToken: value.accessToken,
        accountId: value.accountId,
      })
      form.setFieldValue('accessToken', '')
      form.setFieldValue('accountId', '')
    },
  })

  useEffect(() => {
    form.setFieldValue('environment', environment)
  }, [environment, form])

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
        name="environment"
        listeners={{
          onChange: ({ value }) => {
            onEnvironmentChange(value)
          },
        }}
      >
        {(field) => (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Environment</legend>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="tradier-environment"
                checked={field.state.value === 'sandbox'}
                onChange={() => field.handleChange('sandbox')}
              />
              Paper (sandbox)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="tradier-environment"
                checked={field.state.value === 'live'}
                onChange={() => field.handleChange('live')}
              />
              Live (production)
            </label>
          </fieldset>
        )}
      </form.Field>

      <form.Field
        name="accessToken"
        validators={{
          onChange: ({ value }) => requiredTrimmed(value, 'Access token is required'),
          onSubmit: ({ value }) => requiredTrimmed(value, 'Access token is required'),
        }}
      >
        {(field) => (
          <label className="block text-sm">
            Access token
            <input
              type="password"
              autoComplete="off"
              className="demo-input mt-1 w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder={
                form.state.values.environment === 'sandbox'
                  ? 'Paste sandbox API token'
                  : 'Paste production API token'
              }
              required
            />
            {field.state.meta.errors.length > 0 && (
              <span className="mt-1 block text-xs text-red-600">{field.state.meta.errors[0]}</span>
            )}
          </label>
        )}
      </form.Field>

      <form.Field name="accountId">
        {(field) => (
          <label className="block text-sm">
            Account id <span className="text-[var(--sea-ink-soft)]">(optional)</span>
            <input
              type="text"
              autoComplete="off"
              className="demo-input mt-1 w-full"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Auto-detected from profile if empty"
            />
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.values.environment]}>
        {([canSubmit, isSubmitting, selectedEnvironment]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="rounded-full bg-[var(--lagoon-deep)] px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {isSubmitting
              ? 'Saving…'
              : connected
                ? `Switch to ${selectedEnvironment === 'sandbox' ? 'paper' : 'live'}`
                : 'Connect with API token'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
