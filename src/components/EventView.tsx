import { useState } from 'react'
import type { FaxingEvent, RankedContestant } from '../types'

interface Props {
  event: FaxingEvent
  isAdmin: boolean
  onBack: () => void
  onSave: (event: FaxingEvent) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const formatTime = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`
const formatDate = (date: number) => new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)

export default function EventView({ event, isAdmin, onBack, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState(event)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<'timeline' | 'list'>('timeline')
  const [newName, setNewName] = useState('')
  const [newGender, setNewGender] = useState<'male' | 'female'>('male')
  const [newMinutes, setNewMinutes] = useState('')
  const [newSeconds, setNewSeconds] = useState('')
  const [addError, setAddError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const update = (id: string, patch: Partial<RankedContestant>) => {
    setDraft(value => ({ ...value, contestants: value.contestants.map(contestant => contestant.id === id ? { ...contestant, ...patch } : contestant) }))
    setSavedMessage('')
  }

  const addAttendee = async (eventForm: React.FormEvent) => {
    eventForm.preventDefault()
    const name = newName.trim()
    const minutes = Number(newMinutes)
    const seconds = Number(newSeconds || 0)
    if (!name) return setAddError('Skriv et navn.')
    if (!Number.isInteger(minutes) || minutes < 0) return setAddError('Indtast hele minutter på 0 eller derover.')
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) return setAddError('Sekunder skal være mellem 0 og 59.')

    const attendee: RankedContestant = {
      id: crypto.randomUUID(),
      name,
      gender: newGender,
      finishedAt: draft.date,
      disqualified: false,
      title: null,
      elapsed: (minutes * 60 + seconds) * 1000,
    }
    const nextDraft = { ...draft, contestants: [...draft.contestants, attendee] }
    setDraft(nextDraft)
    setAddError('')
    setSaving(true)
    try {
      await onSave(nextDraft)
      setNewName('')
      setNewMinutes('')
      setNewSeconds('')
      setSavedMessage(`${name} er tilføjet og gemt.`)
    } catch {
      setAddError('Deltageren kunne ikke gemmes. Prøv igen.')
    } finally {
      setSaving(false)
    }
  }

  const save = async () => {
    setSaving(true)
    setSavedMessage('')
    try {
      await onSave(draft)
      setSavedMessage('Ændringerne er gemt i krøniken.')
    } catch {
      setSavedMessage('Ændringerne kunne ikke gemmes. Prøv igen.')
    } finally {
      setSaving(false)
    }
  }

  const sorted = [...draft.contestants].sort((a, b) => (a.finishedAt ? a.elapsed : Number.MAX_SAFE_INTEGER) - (b.finishedAt ? b.elapsed : Number.MAX_SAFE_INTEGER))

  return (
    <div className="event-view scroll-panel">
      <button className="back-link" onClick={onBack}>Tilbage til krøniken</button>
      <div className="event-view-heading">
        {isAdmin ? (
          <div className="admin-edit-form">
            <label>Eventnavn<input className="medieval-input" value={draft.name} onChange={eventInput => setDraft({ ...draft, name: eventInput.target.value })} /></label>
            <label>Dato<input className="medieval-input" type="date" value={new Date(draft.date).toISOString().slice(0, 10)} onChange={eventInput => setDraft({ ...draft, date: new Date(`${eventInput.target.value}T12:00:00`).getTime() })} /></label>
            <label className="check-label"><input type="checkbox" checked={draft.official} onChange={eventInput => setDraft({ ...draft, official: eventInput.target.checked })} /> Officiel Faxing</label>
          </div>
        ) : (
          <>
            <p className="event-date">{formatDate(event.date)} · {event.official ? 'Officiel ordenstvist' : 'Uofficiel samling'}</p>
            <h2 className="panel-title">{event.name}</h2>
          </>
        )}
      </div>
      <p className="panel-desc">{draft.contestants.length} deltagere i denne dyst.</p>

      {isAdmin && (
        <form className="admin-add-attendee" onSubmit={addAttendee}>
          <div className="admin-section-heading"><div><span className="eyebrow">Faxepave-værktøj</span><h3>Tilføj deltager</h3></div><span className="admin-section-hint">Gemmes direkte i krøniken</span></div>
          <div className="admin-add-fields">
            <label className="attendee-field attendee-name-field">Navn<input className="medieval-input" placeholder="Fx Anders Jensen" aria-label="Navn på ny deltager" value={newName} onChange={eventInput => setNewName(eventInput.target.value)} /></label>
            <label className="attendee-field">Køn<select className="medieval-input" aria-label="Køn på ny deltager" value={newGender} onChange={eventInput => setNewGender(eventInput.target.value as 'male' | 'female')}><option value="male">Mand</option><option value="female">Kvinde</option></select></label>
            <label className="attendee-field time-field">Minutter<input className="medieval-input" inputMode="numeric" placeholder="0" aria-label="Drikketid minutter" value={newMinutes} onChange={eventInput => setNewMinutes(eventInput.target.value)} /></label>
            <label className="attendee-field time-field">Sekunder<input className="medieval-input" inputMode="numeric" placeholder="00" aria-label="Drikketid sekunder" value={newSeconds} onChange={eventInput => setNewSeconds(eventInput.target.value)} /></label>
            <button className="medieval-btn attendee-add-btn" type="submit" disabled={saving}>Tilføj og gem</button>
          </div>
          <p className="attendee-help">Registrér den samlede drikketid. Sekunder skal være mellem 0 og 59.</p>
          {addError && <p className="form-error" role="alert">{addError}</p>}
        </form>
      )}

      <div className="result-toolbar"><span>Resultater</span><div className="view-toggle" role="group" aria-label="Vis resultater som"><button className={view === 'timeline' ? 'view-toggle-btn active' : 'view-toggle-btn'} onClick={() => setView('timeline')}>Tidslinje</button><button className={view === 'list' ? 'view-toggle-btn active' : 'view-toggle-btn'} onClick={() => setView('list')}>Liste</button></div></div>
      {view === 'timeline' ? <div className="results-timeline">{sorted.map((contestant, index) => <ResultRow key={contestant.id} contestant={contestant} index={index} isAdmin={isAdmin} onUpdate={update} />)}</div> : <div className="results-list">{sorted.map((contestant, index) => <ResultRow key={contestant.id} contestant={contestant} index={index} isAdmin={isAdmin} onUpdate={update} />)}</div>}
      {isAdmin && <div className="admin-actions"><button className="medieval-btn" onClick={save} disabled={saving}>{saving ? 'Gemmer…' : 'Gem alle ændringer'}</button>{savedMessage && <span className="save-message" role="status">{savedMessage}</span>}<button className="medieval-btn danger-btn" onClick={() => onDelete(draft.id)}>Slet Faxing</button></div>}
    </div>
  )
}

function ResultRow({ contestant: c, index, isAdmin, onUpdate }: { contestant: RankedContestant; index: number; isAdmin: boolean; onUpdate: (id: string, patch: Partial<RankedContestant>) => void }) {
  return <div className={`result-row ${c.title === 'Faxekonge' || c.title === 'Faxedronning' ? 'royal-result' : ''}`}><span className="result-rank">{index + 1}</span>{isAdmin ? <><input aria-label={`Navn på deltager ${index + 1}`} className="medieval-input admin-name-input" value={c.name} onChange={event => onUpdate(c.id, { name: event.target.value })} /><select aria-label={`Status for ${c.name}`} className="medieval-input admin-status" value={c.disqualified ? 'out' : c.finishedAt ? 'done' : 'active'} onChange={event => onUpdate(c.id, event.target.value === 'out' ? { disqualified: true, finishedAt: null } : event.target.value === 'done' ? { disqualified: false, finishedAt: c.finishedAt ?? Date.now() } : { disqualified: false, finishedAt: null })}><option value="done">Færdig</option><option value="active">Ikke færdig</option><option value="out">Hestemann</option></select></> : <span className="result-name">{c.name}</span>}<strong>{c.title === 'Hestemann' || c.disqualified ? 'Hestemann' : formatTime(c.elapsed)}</strong>{(c.title === 'Faxekonge' || c.title === 'Faxedronning') && <span className="royal-mark">{c.title}</span>}</div>
}
