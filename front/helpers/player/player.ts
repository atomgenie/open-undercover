import { Player } from "types/player"

export const getInitials = (name: string): string => {
    if (name.length === 0) {
        return "?"
    }

    return name[0].toUpperCase()
}

export const isPlayerNameValid = (name: string, players: Player[]): boolean => {
    const trimmed = name.trim()
    if (trimmed === "") {
        return false
    }

    return !players.some(player => player.name === trimmed)
}
