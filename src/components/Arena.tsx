import { useState, useMemo } from 'react'
import ContestantCard from './ContestantCard'
import GlobalTimer from './GlobalTimer'
import type { RankedContestant } from '../types'

interface ArenaProps {
  rankedContestants: RankedContestant[]
  contestStartTime: number
  now: number
  durationMs: number
  onFinish: (id: string) => void
  onDisqualify: (id: string) => void
  onReset: () => void
}

export default function Arena({
  rankedContestants,
  contestStartTime,
  now,
  durationMs,
  onFinish,
  onDisqualify,
  onReset,
}: ArenaProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [search, setSearch] = useState('')

  const elapsedMs = now - contestStartTime
  const contestOver = elapsedMs >= durationMs

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rankedContestants
    return rankedContestants.filter(c => c.name.toLowerCase().includes(q))
  }, [rankedContestants, search])

  const finished = filtered.filter(c => c.finishedAt)
  const active   = filtered.filter(c => !c.finishedAt && !c.disqualified && !contestOver)
  const failed   = filtered.filter(c => c.disqualified || (!c.finishedAt && contestOver))

  const totalCount    = rankedContestants.length
  const filteredCount = filtered.length
  const isSearching   = search.trim().length > 0

  return (
    <div className="arena-screen">
      <GlobalTimer
        elapsedMs={elapsedMs}
        durationMs={durationMs}
        contestOver={contestOver}
      />

      {totalCount >= 5 && (
        <div className="search-bar-wrap">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Søk efter en Kriger..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {isSearching && (
              <button className="search-clear" onClick={() => setSearch('')} title="Rydd Søk">
                ✕
              </button>
            )}
          </div>
          {isSearching && (
            <p className="search-results-hint">
              {filteredCount === 0
                ? 'Ingen Krigere funnet.'
                : `Viser ${filteredCount} af ${totalCount} Krigere`}
            </p>
          )}
        </div>
      )}

      {isSearching && filteredCount === 0 && (
        <div className="no-results">
          <p>⚔ Ingen Kriger ved dette Navn hath indtaget Arenaen.</p>
        </div>
      )}

      {finished.length > 0 && (
        <section className="arena-section">
          <h2 className="section-title glory">⚔ Ærens Hal ⚔</h2>
          <div className="cards-grid">
            {finished.map((c, i) => (
              <ContestantCard
                key={c.id}
                contestant={c}
                rank={i + 1}
                onFinish={onFinish}
                onDisqualify={onDisqualify}
              />
            ))}
          </div>
        </section>
      )}

      {active.length > 0 && (
        <section className="arena-section">
          <h2 className="section-title active-title">⏳ Drikker Endnu ⏳</h2>
          <div className="cards-grid">
            {active.map(c => (
              <ContestantCard
                key={c.id}
                contestant={c}
                rank={null}
                elapsedMs={elapsedMs}
                durationMs={durationMs}
                onFinish={onFinish}
                onDisqualify={onDisqualify}
              />
            ))}
          </div>
        </section>
      )}

      {failed.length > 0 && (
        <section className="arena-section">
          <h2 className="section-title shame">🐴 Hestemann 🐴</h2>
          <div className="cards-grid">
            {failed.map(c => (
              <ContestantCard
                key={c.id}
                contestant={c}
                rank={null}
                onFinish={onFinish}
                onDisqualify={onDisqualify}
              />
            ))}
          </div>
        </section>
      )}

      <div className="arena-footer">
        {!showResetConfirm ? (
          <button
            className="medieval-btn reset-btn"
            onClick={() => setShowResetConfirm(true)}
          >
            ↩ Ny Turnering
          </button>
        ) : (
          <div className="confirm-reset">
            <p>Er I visse? Alt Fremgang vil gaa tabt.</p>
            <div className="confirm-btns">
              <button className="medieval-btn danger-btn" onClick={onReset}>
                Ja visselig, nullstill!
              </button>
              <button
                className="medieval-btn"
                onClick={() => setShowResetConfirm(false)}
              >
                Nei, Fortsett
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
