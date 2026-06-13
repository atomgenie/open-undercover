import { Language } from "helpers/words"

export interface Player {
    name: string
    score: number
    language?: Language
}

export interface PlayerRound {
    name: string
    isUndercover: boolean
    isMrWhite: boolean
    alive: boolean
    eliminatedAtVote: number | null
}
