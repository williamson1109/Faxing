import { useState, useEffect, useCallback } from 'react'
import Registration from './components/Registration'
import Arena from './components/Arena'
import './App.css'

const CONTEST_DURATION_MS = 60 * 60 * 1000 // 1 hour

export default function App() {
  const [screen, setScreen] = useState('home') // 'home' | 'arena'
  const [contestants, setContestants] = useState([])
  const [contestStartTime, setContestStartTime] = useState(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(interval)
  }, [])

  const startContest = useCallback(() => {
    if (contestants.length === 0) return
    setContestStartTime(Date.now())
    setScreen('arena')
  }, [contestants])

  const addContestant = useCallback((name, gender) => {
    setContestants(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        gender, // 'male' | 'female'
        finishedAt: null,
        disqualified: false,
      },
    ])
  }, [])

  const removeContestant = useCallback((id) => {
    setContestants(prev => prev.filter(c => c.id !== id))
  }, [])

  const markFinished = useCallback((id) => {
    setContestants(prev =>
      prev.map(c =>
        c.id === id && !c.finishedAt && !c.disqualified
          ? { ...c, finishedAt: Date.now() }
          : c
      )
    )
  }, [])

  const markDisqualified = useCallback((id) => {
    setContestants(prev =>
      prev.map(c =>
        c.id === id ? { ...c, disqualified: true, finishedAt: null } : c
      )
    )
  }, [])

  const resetContest = useCallback(() => {
    setContestants([])
    setContestStartTime(null)
    setScreen('home')
  }, [])

  // Compute titles for all contestants
  const getRankedContestants = useCallback(() => {
    if (!contestStartTime) return contestants

    let faxekongeAwarded = false
    let faxedronningAwarded = false

    // Sort by finish time (finished first = better rank), then unfinished
    const sorted = [...contestants].sort((a, b) => {
      if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt
      if (a.finishedAt) return -1
      if (b.finishedAt) return 1
      return 0
    })

    return sorted.map(c => {
      let title = null
      const elapsed = (c.finishedAt || now) - contestStartTime
      const finished = !!c.finishedAt
      const outOfTime = !finished && elapsed >= CONTEST_DURATION_MS

      if (c.disqualified) {
        title = 'Hestemann'
      } else if (finished) {
        if (c.gender === 'male' && !faxekongeAwarded) {
          title = 'Faxekonge'
          faxekongeAwarded = true
        } else if (c.gender === 'female' && !faxedronningAwarded) {
          title = 'Faxedronning'
          faxedronningAwarded = true
        } else {
          title = 'Faxeridder'
        }
      } else if (outOfTime) {
        title = 'Hestemann'
      }

      return { ...c, title, elapsed: finished ? c.finishedAt - contestStartTime : elapsed }
    })
  }, [contestants, contestStartTime, now])

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-ornament left">⚔</div>
        <div className="header-center">
          <h1 className="app-title">Faxing</h1>
          <p className="app-subtitle">Faxe Bryggeri · Grundlagt 1901 · Danmark</p>
        </div>
        <div className="header-ornament right">⚔</div>
      </header>

      <main className="app-main">
        {screen === 'home' ? (
          <Registration
            contestants={contestants}
            onAdd={addContestant}
            onRemove={removeContestant}
            onStart={startContest}
          />
        ) : (
          <Arena
            rankedContestants={getRankedContestants()}
            contestStartTime={contestStartTime}
            now={now}
            durationMs={CONTEST_DURATION_MS}
            onFinish={markFinished}
            onDisqualify={markDisqualified}
            onReset={resetContest}
          />
        )}
      </main>

      <footer className="app-footer">
        <span>⚜ Drikk med Maadehold ⚜</span>
      </footer>
    </div>
  )
}
