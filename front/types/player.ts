export interface Player {
    name: string
    score: number
}

export interface PlayerRound {
    name: string
    card: string
    isUndercover: boolean
    alive: boolean
}
