function formatTime(ms) {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function GlobalTimer({ elapsedMs, durationMs, contestOver }) {
  const remainingMs = durationMs - elapsedMs
  const progressPct = Math.min((elapsedMs / durationMs) * 100, 100)

  const urgent = remainingMs < 5 * 60 * 1000 && !contestOver // last 5 min

  return (
    <div className={`global-timer ${contestOver ? 'timer-over' : ''} ${urgent ? 'timer-urgent' : ''}`}>
      <div className="timer-label">
        {contestOver ? '⚔ Contest Ended ⚔' : 'Time Remaining'}
      </div>
      <div className="timer-value">
        {contestOver ? 'FINISHED' : formatTime(remainingMs)}
      </div>
      <div className="timer-bar-track">
        <div
          className={`timer-bar-fill ${urgent ? 'fill-urgent' : ''} ${contestOver ? 'fill-done' : ''}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="timer-elapsed">Elapsed: {formatTime(elapsedMs)}</div>
    </div>
  )
}
