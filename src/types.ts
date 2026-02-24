export type Gender = 'male' | 'female'

export type Title =
  | 'Faxekonge'
  | 'Faxedronning'
  | 'Faxeridder'
  | 'Hestemann'

export type Screen = 'home' | 'arena'

/** A contestant as stored in state (no title yet) */
export interface Contestant {
  id: string
  name: string
  gender: Gender
  finishedAt: number | null
  disqualified: boolean
}

/** A contestant after ranking has been computed */
export interface RankedContestant extends Contestant {
  title: Title | null
  elapsed: number
}
