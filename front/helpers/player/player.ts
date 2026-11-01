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

const AVATAR_COLORS = [
    "#c4b5fd",
    "#f9a8d4",
    "#6ee7b7",
    "#fde047",
    "#93c5fd",
    "#fdba74",
    "#a5f3fc",
    "#fca5a5",
    "#bef264",
    "#f0abfc",
]

const hashName = (name: string): number => {
    // FNV-1a: spreads similar names better than a simple multiplicative hash
    let hash = 0x811c9dc5
    for (let i = 0; i < name.length; i++) {
        hash ^= name.charCodeAt(i)
        hash = Math.imul(hash, 0x01000193)
    }

    return hash >>> 0
}

/**
 * Name-based pastel color so a player keeps the same avatar all game long.
 * When `players` is given, collisions are resolved in list order so that
 * everyone at the table gets a distinct color (up to the palette size).
 */
export const getAvatarColor = (name: string, players: string[] = []): string => {
    const order = players.includes(name) ? players : [...players, name]
    const taken = new Set<number>()

    for (const playerName of order) {
        if (taken.size === AVATAR_COLORS.length) {
            taken.clear()
        }

        let index = hashName(playerName) % AVATAR_COLORS.length
        while (taken.has(index)) {
            index = (index + 1) % AVATAR_COLORS.length
        }

        if (playerName === name) {
            return AVATAR_COLORS[index]
        }
        taken.add(index)
    }

    return AVATAR_COLORS[0]
}
