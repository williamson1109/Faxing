import { useState, useMemo } from 'react'
import ContestantCard from './ContestantCard'
import GlobalTimer from './GlobalTimer'

export default function Arena({
  rankedContestants,
  contestStartTime,
  now,
  durationMs,
  onFinish,
  onDisqualify,
  onReset,
}) {
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

      {/* Search bar — only shown when there are enough contestants to warrant it */}
      {totalCount >= 5 && (
        <div className="search-bar-wrap">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search for a warrior..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {isSearching && (
              <button className="search-clear" onClick={() => setSearch('')} title="Clear search">
                ✕
              </button>
            )}
          </div>
          {isSearching && (
            <p className="search-results-hint">
              {filteredCount === 0
                ? 'No warriors found.'
                : `Showing ${filteredCount} of ${totalCount} warriors`}
            </p>
          )}
        </div>
      )}

      {/* No results state */}
      {isSearching && filteredCount === 0 && (
        <div className="no-results">
          <p>⚔ No warrior by that name has entered the arena.</p>
        </div>
      )}

      {/* Leaderboard - Finished */}
      {finished.length > 0 && (
        <section className="arena-section">
          <h2 className="section-title glory">⚔ Hall of Glory ⚔</h2>
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

      {/* Active */}
      {active.length > 0 && (
        <section className="arena-section">
          <h2 className="section-title active-title">⏳ Still Drinking ⏳</h2>
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

      {/* Failed */}
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
            ↩ New Contest
          </button>
        ) : (
          <div className="confirm-reset">
            <p>Art thou certain? All progress shall be lost.</p>
            <div className="confirm-btns">
              <button className="medieval-btn danger-btn" onClick={onReset}>
                Aye, reset!
              </button>
              <button
                className="medieval-btn"
                onClick={() => setShowResetConfirm(false)}
              >
                Nay, continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
