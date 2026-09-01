import { useForm } from '@tanstack/react-form'

export type CreateWebhookFormValues = {
  name: string
}

type CreateWebhookFormProps = {
  loading: boolean
  onSubmit: (values: CreateWebhookFormValues) => Promise<void>
}

export default function CreateWebhookForm({ loading, onSubmit }: CreateWebhookFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ name: value.name })
      form.reset()
    },
  })

  return (
    <div className="flex flex-wrap items-end gap-2">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        className="flex flex-1 flex-wrap items-end gap-2"
      >
        <form.Field name="name">
          {(field) => (
            <label className="block flex-1 text-sm">
              Name <span className="text-[var(--sea-ink-soft)]">(optional)</span>
              <input
                type="text"
                className="demo-input mt-1 w-full"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="TradingView, Discord bot, etc."
              />
            </label>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={loading || !canSubmit || isSubmitting}
              className="btn-secondary text-sm"
            >
              {loading || isSubmitting ? 'Creating…' : 'Create webhook'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
