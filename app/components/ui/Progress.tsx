type ProgressProps = {
  current: number
  total: number
}

export function Progress({ current, total }: ProgressProps) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full h-0.5 bg-gray-200">
      <div
        className="h-0.5 bg-accent transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
