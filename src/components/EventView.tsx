import type { FaxingEvent } from '../types'

interface EventViewProps { event: FaxingEvent; onBack: () => void }
const formatTime = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`
const formatDate = (date: number) => new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)

export default function EventView({ event, onBack }: EventViewProps) {
  return <div className="event-view scroll-panel"><button className="back-link" onClick={onBack}>← Tilbage til krøniken</button><p className="event-date">{formatDate(event.date)} · {event.official ? 'Officiel Faxing' : 'Anden begivenhed'}</p><h2 className="panel-title">{event.name}</h2><p className="panel-desc">{event.contestants.length} deltagere gennemførte denne dyst.</p><div className="results-list">{event.contestants.map((contestant, index) => <div className={`result-row ${contestant.title === 'Faxekonge' || contestant.title === 'Faxedronning' ? 'royal-result' : ''}`} key={contestant.id}><span className="result-rank">{index + 1}</span><span className="result-name">{contestant.name}{contestant.title && <small>{contestant.title === 'Faxekonge' || contestant.title === 'Faxedronning' ? ` · ${contestant.title}` : ''}</small>}</span><strong>{contestant.title === 'Hestemann' ? 'Hestemann' : formatTime(contestant.elapsed)}</strong></div>)}</div></div>
}
