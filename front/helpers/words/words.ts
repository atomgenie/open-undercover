import wordsI18n from "./words-i18n.json"

export type Language = "fr" | "en" | "es"

export const LANGUAGE_LABELS: Record<Language, string> = {
    fr: "FR",
    en: "EN",
    es: "ES",
}

export interface WordPair {
    fr: [string, string]
    en: [string, string]
    es: [string, string]
}

export const WORDS: WordPair[] = wordsI18n as WordPair[]
