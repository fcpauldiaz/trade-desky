type Props = {
  decision: string
}

export default function DecisionChip({ decision }: Props) {
  const kind = decision === 'take' || decision === 'skip' || decision === 'error' ? decision : 'skip'
  return <span className={`admin-decision admin-decision-${kind}`}>{decision}</span>
}
