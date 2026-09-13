import type { Contestant, FaxingEvent, Screen } from '../types'

const KEY = 'faxing-state-v2'

export interface PersistedState {
  screen: Screen
  contestants: Contestant[]
  contestStartTime: number | null
  events: FaxingEvent[]
  activeEventId: string | null
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      screen: parsed.screen ?? 'home',
      contestants: parsed.contestants ?? [],
      contestStartTime: parsed.contestStartTime ?? null,
      events: parsed.events ?? [],
      activeEventId: parsed.activeEventId ?? null,
    }
  } catch { return null }
}

export function saveState(state: PersistedState): void {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage unavailable */ }
}

export function clearState(): void { localStorage.removeItem(KEY) }
