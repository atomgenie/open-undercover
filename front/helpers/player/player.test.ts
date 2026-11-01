import { describe, expect, test } from "bun:test"

import { getAvatarColor, getInitials, isPlayerNameValid } from "./player"

describe("getInitials", () => {
    test("returns the uppercased first letter", () => {
        expect(getInitials("alice")).toBe("A")
    })

    test("falls back to ? for an empty name", () => {
        expect(getInitials("")).toBe("?")
    })
})

describe("isPlayerNameValid", () => {
    const players = [{ name: "Alice", score: 0 }]

    test("rejects blank names", () => {
        expect(isPlayerNameValid("   ", players)).toBe(false)
    })

    test("rejects duplicates, ignoring surrounding spaces", () => {
        expect(isPlayerNameValid(" Alice ", players)).toBe(false)
    })

    test("accepts a new name", () => {
        expect(isPlayerNameValid("Bob", players)).toBe(true)
    })
})

describe("getAvatarColor", () => {
    test("is stable for a given name", () => {
        expect(getAvatarColor("Alice")).toBe(getAvatarColor("Alice"))
    })

    test("gives every player at the table a distinct color", () => {
        const table = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const colors = new Set(table.map(name => getAvatarColor(name, table)))
        expect(colors.size).toBe(table.length)
    })
})
