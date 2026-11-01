import { describe, expect, test } from "bun:test"

import { PlayerRound } from "types/player"
import {
    canStartGame,
    getCivilsAlive,
    getMaxUndercovers,
    getSetupError,
    getUndercoverAlive,
    isCivilsWin,
    isEnd,
    isUndercoversWin,
} from "./undercover"

const player = (overrides: Partial<PlayerRound>): PlayerRound => ({
    name: "P",
    isUndercover: false,
    isMrWhite: false,
    alive: true,
    eliminatedAtVote: null,
    ...overrides,
})

describe("alive counters", () => {
    const players = [
        player({ name: "civil" }),
        player({ name: "dead civil", alive: false }),
        player({ name: "undercover", isUndercover: true }),
        player({ name: "dead undercover", isUndercover: true, alive: false }),
        player({ name: "mr white", isMrWhite: true }),
    ]

    test("Mr. White counts as an undercover", () => {
        expect(getUndercoverAlive(players)).toBe(2)
    })

    test("only living civilians are counted", () => {
        expect(getCivilsAlive(players)).toBe(1)
    })
})

describe("win conditions", () => {
    test("civilians win when no undercover is alive", () => {
        expect(isCivilsWin(0)).toBe(true)
        expect(isCivilsWin(1)).toBe(false)
    })

    test("undercovers win once they match the civilians", () => {
        expect(isUndercoversWin(1, 1)).toBe(true)
        expect(isUndercoversWin(2, 1)).toBe(true)
        expect(isUndercoversWin(1, 2)).toBe(false)
    })

    test("the game ends on either win", () => {
        expect(isEnd(0, 3)).toBe(true)
        expect(isEnd(1, 1)).toBe(true)
        expect(isEnd(1, 3)).toBe(false)
    })
})

describe("game setup", () => {
    test("max undercovers keeps civilians in the majority", () => {
        expect(getMaxUndercovers(3, false)).toBe(1)
        expect(getMaxUndercovers(5, false)).toBe(2)
        expect(getMaxUndercovers(6, false)).toBe(2)
        expect(getMaxUndercovers(5, true)).toBe(1)
    })

    test("a game needs at least 3 players and a civilian majority", () => {
        expect(canStartGame(2, 1, false)).toBe(false)
        expect(canStartGame(3, 1, false)).toBe(true)
        expect(canStartGame(3, 1, true)).toBe(false)
        expect(canStartGame(4, 1, true)).toBe(false)
        expect(canStartGame(5, 1, true)).toBe(true)
    })

    test("setup errors explain what is missing", () => {
        expect(getSetupError(3, 1, false)).toBeNull()
        expect(getSetupError(1, 1, false)).toBe("Add 2 more players to start.")
        expect(getSetupError(2, 1, false)).toBe("Add 1 more player to start.")
        expect(getSetupError(4, 1, true)).toStartWith("Not enough civilians")
    })
})
