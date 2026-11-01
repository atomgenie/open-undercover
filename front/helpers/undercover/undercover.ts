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

export const getMaxUndercovers = (playerCount: number, mrWhite: boolean): number => {
    return Math.floor((playerCount - 1) / 2) - (mrWhite ? 1 : 0)
}

export const canStartGame = (
    playerCount: number,
    undercovers: number,
    mrWhite: boolean,
): boolean => {
    const enemies = undercovers + (mrWhite ? 1 : 0)
    const civils = playerCount - enemies
    return playerCount >= 3 && civils > enemies
}

/** Human readable reason why the current setup can't be played, or null if it can */
export const getSetupError = (
    playerCount: number,
    undercovers: number,
    mrWhite: boolean,
): string | null => {
    if (canStartGame(playerCount, undercovers, mrWhite)) {
        return null
    }

    if (playerCount < 3) {
        const missing = 3 - playerCount
        return `Add ${missing} more player${missing > 1 ? "s" : ""} to start.`
    }

    return "Not enough civilians: add a player, remove an undercover or turn off Mr. White."
}
