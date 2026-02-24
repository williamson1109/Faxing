import type { RankedContestant, Title } from '../types'

interface TitleMeta {
  icon: string
  color: 'gold' | 'rose' | 'silver' | 'grey'
  label: string
}

const TITLE_META: Record<Title, TitleMeta> = {
  Faxekonge:    { icon: '👑', color: 'gold',   label: 'Faxekonge'    },
  Faxedronning: { icon: '👑', color: 'rose',   label: 'Faxedronning' },
  Faxeridder:   { icon: '⚔',  color: 'silver', label: 'Faxeridder'   },
  Hestemann:    { icon: '🐴', color: 'grey',   label: 'Hestemann'    },
}

interface BeerProgressProps {
  elapsedMs: number
  durationMs: number
}

function formatElapsed(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return '--:--'
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function BeerProgress({ elapsedMs, durationMs }: BeerProgressProps) {
  const pct = Math.min((elapsedMs / durationMs) * 100, 100)
  const urgent = pct > 80
  return (
    <div className="beer-progress-wrap">
      <div className="beer-track">
        <div
          className={`beer-fill ${urgent ? 'beer-urgent' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="beer-pct">{Math.floor(pct)}%</span>
    </div>
  )
}

interface ContestantCardProps {
  contestant: RankedContestant
  rank: number | null
  elapsedMs?: number
  durationMs?: number
  onFinish: (id: string) => void
  onDisqualify: (id: string) => void
}

export default function ContestantCard({
  contestant,
  rank,
  elapsedMs,
  durationMs,
  onFinish,
  onDisqualify,
}: ContestantCardProps) {
  const { id, name, gender, finishedAt, disqualified, title, elapsed } = contestant
  const meta = title ? TITLE_META[title] : null
  const isActive = !finishedAt && !disqualified && title === null

  return (
    <div className={`contestant-card ${meta ? `card-${meta.color}` : 'card-active'} ${disqualified ? 'card-disqualified' : ''}`}>
      {rank != null && (
        <div className="card-rank">#{rank}</div>
      )}

      <div className="card-top">
        <span className="card-gender">{gender === 'male' ? '♂' : '♀'}</span>
        <span className="card-name">{name}</span>
      </div>

      {meta && (
        <div className={`card-title title-${meta.color}`}>
          {meta.icon} {meta.label}
        </div>
      )}

      {finishedAt && (
        <div className="card-time">
          Fuldbragt i <strong>{formatElapsed(elapsed)}</strong>
        </div>
      )}

      {isActive && elapsedMs != null && durationMs != null && (
        <BeerProgress elapsedMs={elapsedMs} durationMs={durationMs} />
      )}

      {disqualified && (
        <div className="card-time shame-text">Fuldbragde det Ei</div>
      )}

      {!finishedAt && !disqualified && (
        <div className="card-actions">
          <button
            className="medieval-btn finish-btn"
            onClick={() => onFinish(id)}
          >
            🍺 Fuldbragt!
          </button>
          <button
            className="medieval-btn dnf-btn"
            onClick={() => onDisqualify(id)}
          >
            ✕ Gav Op
          </button>
        </div>
      )}
    </div>
  )
}
