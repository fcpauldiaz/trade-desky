import { type ReactNode, useId, useRef } from 'react'

type FieldHelpDialogProps = {
  title: string
  children: ReactNode
  triggerLabel?: string
}

export default function FieldHelpDialog({
  title,
  children,
  triggerLabel = 'What goes here?',
}: FieldHelpDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  function open() {
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  return (
    <>
      <button type="button" className="field-help-trigger" onClick={open} aria-haspopup="dialog">
        <span className="field-help-trigger-icon" aria-hidden="true">
          ?
        </span>
        {triggerLabel}
      </button>
      <dialog ref={dialogRef} className="field-help-dialog" aria-labelledby={titleId}>
        <div className="field-help-dialog-inner">
          <header className="field-help-dialog-header">
            <h2 id={titleId} className="field-help-dialog-title">
              {title}
            </h2>
            <button type="button" className="field-help-close" onClick={close} aria-label="Close">
              ×
            </button>
          </header>
          <div className="field-help-dialog-body">{children}</div>
          <footer className="field-help-dialog-footer">
            <button type="button" className="btn-primary btn-sm" onClick={close}>
              Got it
            </button>
          </footer>
        </div>
      </dialog>
    </>
  )
}
