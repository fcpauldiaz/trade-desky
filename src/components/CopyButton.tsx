import { useEffect, useRef, useState } from 'react'
import { copyText } from '#/lib/copy-text'

type CopyButtonProps = {
  value: string
  label?: string
  className?: string
}

const RESET_MS = 1800

export default function CopyButton({ value, label = 'Copy', className = '' }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const resetTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  async function handleClick() {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
    }

    const ok = await copyText(value)
    setState(ok ? 'copied' : 'failed')
    resetTimerRef.current = window.setTimeout(() => {
      setState('idle')
      resetTimerRef.current = null
    }, RESET_MS)
  }

  const stateClass =
    state === 'copied' ? 'copy-btn--copied' : state === 'failed' ? 'copy-btn--failed' : ''

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      className={`copy-btn rounded-full border px-3 py-1 text-xs ${stateClass} ${className}`.trim()}
      aria-live="polite"
    >
      {state === 'copied' ? (
        <>
          <svg
            aria-hidden="true"
            className="copy-btn-icon"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8.5L6.5 12L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : state === 'failed' ? (
        'Failed'
      ) : (
        label
      )}
    </button>
  )
}
