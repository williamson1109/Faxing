import type { FaxingEvent, RankedContestant } from '../types'

interface ApiEvent { id: string; title: string; event_date: string; official: boolean; attendees: RankedContestant[] }
const adminHeaders = (password: string) => ({ 'Content-Type': 'application/json', 'X-Faxepave-Password': password })
function fromApiEvent(event: ApiEvent): FaxingEvent { return { id: event.id, name: event.title, date: new Date(event.event_date).getTime(), official: event.official, contestants: event.attendees } }
export async function loadEvents(): Promise<FaxingEvent[]> { const response = await fetch('/api/events'); if (!response.ok) throw new Error('Unable to load events'); return (await response.json() as ApiEvent[]).map(fromApiEvent) }
export async function saveEvent(event: FaxingEvent): Promise<FaxingEvent> { const response = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: event.id, title: event.name, eventDate: event.date, official: event.official, attendees: event.contestants }) }); if (!response.ok) { const details = await response.json().catch(() => null) as { error?: string } | null; throw new Error(details?.error || `Unable to save event (${response.status})`) } return fromApiEvent(await response.json() as ApiEvent) }
export async function updateEvent(event: FaxingEvent, password: string): Promise<FaxingEvent> { const response = await fetch(`/api/events?id=${encodeURIComponent(event.id)}`, { method: 'PUT', headers: adminHeaders(password), body: JSON.stringify({ title: event.name, eventDate: event.date, official: event.official, attendees: event.contestants }) }); if (!response.ok) throw new Error('Unable to update event'); return fromApiEvent(await response.json() as ApiEvent) }
export async function deleteEvent(id: string, password: string): Promise<void> { const response = await fetch(`/api/events/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'X-Faxepave-Password': password } }); if (!response.ok) throw new Error('Unable to delete event') }
export function getAdminHeaders(password: string) { return { 'X-Faxepave-Password': password } }
export type { RankedContestant }
