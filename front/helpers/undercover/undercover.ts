import { PlayerRound } from "types/player"

export const getUndercoverAlive = (players: PlayerRound[]) => {
    return players.reduce((prev, curr) => {
        if ((curr.isUndercover || curr.isMrWhite) && curr.alive) {
            return prev + 1
        }

        return prev
    }, 0)
}

export const getCivilsAlive = (players: PlayerRound[]) => {
    return players.reduce((prev, curr) => {
        if (!curr.isUndercover && !curr.isMrWhite && curr.alive) {
            return prev + 1
        }

        return prev
    }, 0)
}

export const isCivilsWin = (undercoverAlives: number): boolean => {
    return undercoverAlives === 0
}

export const isUndercoversWin = (
    undercoverAlives: number,
    civilsAlives: number,
): boolean => {
    return civilsAlives <= undercoverAlives
}

export const isEnd = (undercoverAlives: number, civilsAlives: number): boolean => {
    return (
        isCivilsWin(undercoverAlives) || isUndercoversWin(undercoverAlives, civilsAlives)
    )
}
