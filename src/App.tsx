import { useState, useEffect, useCallback } from 'react'
import Registration from './components/Registration'
import Arena from './components/Arena'
import type { Contestant, RankedContestant, Screen, Title } from './types'
import './App.css'

const CONTEST_DURATION_MS = 60 * 60 * 1000 // 1 hour

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [contestants, setContestants] = useState<Contestant[]>([])
  const [contestStartTime, setContestStartTime] = useState<number | null>(null)
  const [now, setNow] = useState<number>(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(interval)
  }, [])

  const startContest = useCallback(() => {
    if (contestants.length === 0) return
    setContestStartTime(Date.now())
    setScreen('arena')
  }, [contestants])

  const addContestant = useCallback((name: string, gender: Contestant['gender']) => {
    setContestants(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        gender,
        finishedAt: null,
        disqualified: false,
      },
    ])
  }, [])

  const removeContestant = useCallback((id: string) => {
    setContestants(prev => prev.filter(c => c.id !== id))
  }, [])

  const markFinished = useCallback((id: string) => {
    setContestants(prev =>
      prev.map(c =>
        c.id === id && !c.finishedAt && !c.disqualified
          ? { ...c, finishedAt: Date.now() }
          : c
      )
    )
  }, [])

  const markDisqualified = useCallback((id: string) => {
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

  const getRankedContestants = useCallback((): RankedContestant[] => {
    if (!contestStartTime) {
      return contestants.map(c => ({ ...c, title: null, elapsed: 0 }))
    }

    let faxekongeAwarded = false
    let faxedronningAwarded = false

    const sorted = [...contestants].sort((a, b) => {
      if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt
      if (a.finishedAt) return -1
      if (b.finishedAt) return 1
      return 0
    })

    return sorted.map(c => {
      let title: Title | null = null
      const elapsed = (c.finishedAt ?? now) - contestStartTime
      const finished = c.finishedAt !== null
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

      return {
        ...c,
        title,
        elapsed: finished ? (c.finishedAt as number) - contestStartTime : elapsed,
      }
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
            contestStartTime={contestStartTime as number}
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
