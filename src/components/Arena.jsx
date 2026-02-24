import { useState } from 'react'
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

  const elapsedMs = now - contestStartTime
  const contestOver = elapsedMs >= durationMs

  const finished = rankedContestants.filter(c => c.finishedAt)
  const active = rankedContestants.filter(c => !c.finishedAt && !c.disqualified && !contestOver)
  const failed = rankedContestants.filter(c => c.disqualified || (!c.finishedAt && contestOver))

  return (
    <div className="arena-screen">
      <GlobalTimer
        elapsedMs={elapsedMs}
        durationMs={durationMs}
        contestOver={contestOver}
      />

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
