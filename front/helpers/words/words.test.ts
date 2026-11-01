import { describe, expect, test } from "bun:test"

import { LANGUAGE_LABELS, Language, WORDS } from "./words"

// Enforces the formatting rules from helpers/words/README.md ("The data format").
const LANGUAGES = Object.keys(LANGUAGE_LABELS) as Language[]

const describePair = (index: number) => `pair #${index} ${JSON.stringify(WORDS[index])}`

describe("word pairs", () => {
    test("the list is not empty", () => {
        expect(WORDS.length).toBeGreaterThan(0)
    })

    test("every pair has exactly two distinct, non-empty words in every language", () => {
        const problems: string[] = []

        WORDS.forEach((pair, index) => {
            const extraKeys = Object.keys(pair).filter(
                key => !LANGUAGES.includes(key as Language),
            )
            if (extraKeys.length > 0) {
                problems.push(`${describePair(index)}: unknown keys ${extraKeys}`)
            }

            for (const language of LANGUAGES) {
                const words = pair[language]
                if (!Array.isArray(words) || words.length !== 2) {
                    problems.push(`${describePair(index)}: "${language}" needs 2 words`)
                    continue
                }
                if (words.some(word => typeof word !== "string" || word.trim() === "")) {
                    problems.push(
                        `${describePair(index)}: "${language}" has an empty word`,
                    )
                }
                if (words[0].trim().toLowerCase() === words[1].trim().toLowerCase()) {
                    problems.push(`${describePair(index)}: "${language}" words are equal`)
                }
            }
        })

        expect(problems).toEqual([])
    })

    test("no pair is listed twice", () => {
        const seen = new Map<string, number>()
        const duplicates: string[] = []

        WORDS.forEach((pair, index) => {
            const key = [...pair.fr]
                .map(word => word.toLowerCase())
                .sort()
                .join(" / ")
            const previous = seen.get(key)
            if (previous !== undefined) {
                duplicates.push(`${key} (pairs #${previous} and #${index})`)
            }
            seen.set(key, index)
        })

        expect(duplicates).toEqual([])
    })

    test("pairs are sorted alphabetically by the first French word", () => {
        const unsorted: string[] = []

        for (let i = 1; i < WORDS.length; i++) {
            const previous = WORDS[i - 1].fr[0]
            const current = WORDS[i].fr[0]
            if (previous.localeCompare(current, "fr", { sensitivity: "base" }) > 0) {
                unsorted.push(`"${previous}" comes before "${current}" (pair #${i})`)
            }
        }

        expect(unsorted).toEqual([])
    })
})
