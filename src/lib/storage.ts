import type { FaxingEvent, RankedContestant } from '../types'

interface ApiEvent {
  id: string
  title: string
  event_date: string
  official: boolean
  attendees: RankedContestant[]
}

function fromApiEvent(event: ApiEvent): FaxingEvent {
  return {
    id: event.id,
    name: event.title,
    date: new Date(event.event_date).getTime(),
    official: event.official,
    contestants: event.attendees,
  }
}

export async function loadEvents(): Promise<FaxingEvent[]> {
  const response = await fetch('/api/events')
  if (!response.ok) throw new Error('Unable to load events')
  const events = (await response.json()) as ApiEvent[]
  return events.map(fromApiEvent)
}

export async function saveEvent(event: FaxingEvent): Promise<FaxingEvent> {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: event.id,
      title: event.name,
      eventDate: event.date,
      official: event.official,
      attendees: event.contestants,
    }),
  })
  if (!response.ok) throw new Error('Unable to save event')
  return fromApiEvent((await response.json()) as ApiEvent)
}
