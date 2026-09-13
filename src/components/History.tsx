import type { FaxingEvent } from '../types'

interface HistoryProps {
  events: FaxingEvent[]
  onOpen: (event: FaxingEvent) => void
  onCreate: () => void
}

const formatDate = (date: number) => new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)

export default function History({ events, onOpen, onCreate }: HistoryProps) {
  const official = events.filter(event => event.official).sort((a, b) => b.date - a.date)
  const other = events.filter(event => !event.official).sort((a, b) => b.date - a.date)
  return <div className="history-screen">
    <div className="history-heading"><div><h2 className="panel-title">Faxingens Krønike</h2><p className="panel-desc">Tidligere dyster, konger og dronninger samlet på ét sted.</p></div><button className="medieval-btn start-btn" onClick={onCreate}>+ Ny Faxing</button></div>
    <div className="timeline">
      <section className="timeline-column official-column"><h3 className="timeline-title">Officielle Faxinger</h3>{official.length === 0 ? <p className="timeline-empty">Ingen officielle begivenheder endnu.</p> : official.map(event => <EventCard key={event.id} event={event} onOpen={onOpen} />)}</section>
      <section className="timeline-column other-column"><h3 className="timeline-title">Andre Begivenheder</h3>{other.length === 0 ? <p className="timeline-empty">Ingen andre begivenheder endnu.</p> : other.map(event => <EventCard key={event.id} event={event} onOpen={onOpen} />)}</section>
    </div>
  </div>
}

function EventCard({ event, onOpen }: { event: FaxingEvent; onOpen: (event: FaxingEvent) => void }) {
  return <button className="event-card" onClick={() => onOpen(event)}><span className="event-date">{formatDate(event.date)}</span><strong>{event.name}</strong><span>{event.contestants.length} deltagere · Se resultater →</span></button>
}
