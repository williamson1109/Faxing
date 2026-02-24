import type { Contestant, Screen } from '../types'

const KEY = 'faxing-state-v1'

export interface PersistedState {
  screen: Screen
  contestants: Contestant[]
  contestStartTime: number | null
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Ignore write errors (private mode, storage full, etc.)
  }
}

export function clearState(): void {
  localStorage.removeItem(KEY)
}
