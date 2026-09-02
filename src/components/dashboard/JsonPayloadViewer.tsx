import { useMemo, useState } from 'react'
import { isExpandable, jsonNodeLabel, parsePayload } from '#/lib/payload-display'

type JsonNodeProps = {
  name?: string
  value: unknown
  depth: number
}

function JsonNode({ name, value, depth }: JsonNodeProps) {
  const expandable = isExpandable(value)
  const [open, setOpen] = useState(depth < 1)

  if (!expandable) {
    return (
      <div className="json-node-row" style={{ paddingLeft: `${depth * 14}px` }}>
        {name ? <span className="json-node-key">{name}: </span> : null}
        <span className="json-node-value">{jsonNodeLabel(value)}</span>
      </div>
    )
  }

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value as Record<string, unknown>)

  return (
    <div>
      <button
        type="button"
        className="json-node-toggle"
        style={{ paddingLeft: `${depth * 14}px` }}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="json-node-caret">{open ? '▾' : '▸'}</span>
        {name ? <span className="json-node-key">{name}: </span> : null}
        <span className="json-node-meta">{jsonNodeLabel(value)}</span>
      </button>
      {open
        ? entries.map(([childName, childValue]) => (
            <JsonNode key={`${name ?? 'root'}-${childName}`} name={childName} value={childValue} depth={depth + 1} />
          ))
        : null}
    </div>
  )
}

type JsonPayloadViewerProps = {
  raw: string
}

export default function JsonPayloadViewer({ raw }: JsonPayloadViewerProps) {
  const parsed = useMemo(() => parsePayload(raw), [raw])
  const [mode, setMode] = useState<'tree' | 'pretty'>('tree')

  if (parsed.kind === 'text') {
    return (
      <div className="json-payload-viewer">
        <p className="json-payload-note">Request body is not valid JSON.</p>
        <pre className="json-payload-pre">{parsed.value || '(empty)'}</pre>
      </div>
    )
  }

  return (
    <div className="json-payload-viewer">
      <div className="json-payload-toolbar">
        <span className="json-payload-note">Request body</span>
        <div className="json-payload-mode">
          <button
            type="button"
            className={mode === 'tree' ? 'json-payload-mode-btn is-active' : 'json-payload-mode-btn'}
            onClick={() => setMode('tree')}
          >
            Tree
          </button>
          <button
            type="button"
            className={mode === 'pretty' ? 'json-payload-mode-btn is-active' : 'json-payload-mode-btn'}
            onClick={() => setMode('pretty')}
          >
            Pretty
          </button>
        </div>
      </div>
      {mode === 'tree' ? (
        <div className="json-payload-tree">
          <JsonNode value={parsed.value} depth={0} />
        </div>
      ) : (
        <pre className="json-payload-pre">{parsed.pretty}</pre>
      )}
    </div>
  )
}
