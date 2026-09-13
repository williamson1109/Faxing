import { useState, useEffect, useCallback } from 'react'
import Registration from './components/Registration'
import Arena from './components/Arena'
import History from './components/History'
import EventView from './components/EventView'
import type { Contestant, RankedContestant, Screen, Title, FaxingEvent } from './types'
import { loadState, saveState } from './lib/storage'
import './App.css'

const CONTEST_DURATION_MS = 60 * 60 * 1000

export default function App() {
  const restored = loadState()
  const [screen, setScreen] = useState<Screen>(restored?.screen ?? 'home')
  const [contestants, setContestants] = useState<Contestant[]>(restored?.contestants ?? [])
  const [contestStartTime, setContestStartTime] = useState<number | null>(restored?.contestStartTime ?? null)
  const [events, setEvents] = useState<FaxingEvent[]>(restored?.events ?? [])
  const [activeEventId, setActiveEventId] = useState<string | null>(restored?.activeEventId ?? null)
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const interval = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(interval) }, [])
  useEffect(() => { saveState({ screen, contestants, contestStartTime, events, activeEventId }) }, [screen, contestants, contestStartTime, events, activeEventId])

  const startContest = useCallback((name: string, official: boolean, password?: string) => { if (!contestants.length) return; setEvents(prev => prev); setContestStartTime(Date.now()); setScreen('arena'); setActiveEventId(`${name}|${official}|${password ?? ''}`) }, [contestants])
  const addContestant = useCallback((name: string, gender: Contestant['gender']) => setContestants(prev => [...prev, { id: crypto.randomUUID(), name, gender, finishedAt: null, disqualified: false }]), [])
  const removeContestant = useCallback((id: string) => setContestants(prev => prev.filter(c => c.id !== id)), [])
  const markFinished = useCallback((id: string) => setContestants(prev => prev.map(c => c.id === id && !c.finishedAt && !c.disqualified ? { ...c, finishedAt: Date.now() } : c)), [])
  const markDisqualified = useCallback((id: string) => setContestants(prev => prev.map(c => c.id === id ? { ...c, disqualified: true, finishedAt: null } : c)), [])
  const getRankedContestants = useCallback((): RankedContestant[] => { if (!contestStartTime) return contestants.map(c => ({ ...c, title: null, elapsed: 0 })); let king = false, queen = false; return [...contestants].sort((a, b) => (a.finishedAt && b.finishedAt ? a.finishedAt - b.finishedAt : a.finishedAt ? -1 : b.finishedAt ? 1 : 0)).map(c => { const elapsed = (c.finishedAt ?? now) - contestStartTime; let title: Title | null = null; if (c.disqualified || (!c.finishedAt && elapsed >= CONTEST_DURATION_MS)) title = 'Hestemann'; else if (c.finishedAt && c.gender === 'male' && !king) { title = 'Faxekonge'; king = true } else if (c.finishedAt && c.gender === 'female' && !queen) { title = 'Faxedronning'; queen = true } else if (c.finishedAt) title = 'Faxeridder'; return { ...c, title, elapsed: c.finishedAt ? c.finishedAt - contestStartTime : elapsed } }) }, [contestants, contestStartTime, now])
  const finishEvent = useCallback(() => { if (!activeEventId || !contestStartTime) return; const [name, official, password] = activeEventId.split('|'); setEvents(prev => [...prev, { id: crypto.randomUUID(), name, official: official === 'true', password: password || undefined, date: contestStartTime, contestants: getRankedContestants() }]); setContestants([]); setContestStartTime(null); setActiveEventId(null); setScreen('history') }, [activeEventId, contestStartTime, getRankedContestants])
  const activeEvent = events.find(event => event.id === activeEventId)

  return <div className="app-root"><header className="app-header"><div className="header-ornament left">⚔</div><div className="header-center"><h1 className="app-title">Faxing</h1><p className="app-subtitle">Faxe Bryggeri · Grundlagt 1901 · Danmark</p></div><div className="header-ornament right">⚔</div></header><main className="app-main">{screen === 'home' && <Registration contestants={contestants} onAdd={addContestant} onRemove={removeContestant} onStart={startContest} onHistory={() => setScreen('history')} />}{screen === 'history' && <History events={events} onOpen={event => { setActiveEventId(event.id); setScreen('event') }} onCreate={() => setScreen('home')} />}{screen === 'event' && activeEvent && <EventView event={activeEvent} onBack={() => setScreen('history')} />}{screen === 'arena' && <Arena rankedContestants={getRankedContestants()} contestStartTime={contestStartTime as number} now={now} durationMs={CONTEST_DURATION_MS} onFinish={markFinished} onDisqualify={markDisqualified} onReset={finishEvent} />}</main><footer className="app-footer"><span>⚜ Drikk med Maadehold ⚜</span></footer></div>
}
