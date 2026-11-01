import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { Language, WORDS } from "helpers/words"
import { useState } from "react"

export const MrWhiteGuess: React.FC = () => {
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()
    const [guess, setGuess] = useState("")

    if (!roundState.mrWhiteGuessing) {
        return null
    }

    const handleSubmit = () => {
        const trimmed = guess.trim().toLowerCase()
        if (!trimmed) return

        const pair = WORDS[roundState.wordPairIndex]
        const langs: Language[] = ["fr", "en", "es"]
        const isCorrect = langs.some(
            lang => trimmed === pair[lang][roundState.validWordIndex].toLowerCase(),
        )

        if (isCorrect) {
            roundDispatch({ type: "MW_GUESS_CORRECT" })
        } else {
            roundDispatch({ type: "MW_GUESS_WRONG" })
        }
    }

    return (
        <div className="fixed inset-0 bg-ink/70 flex items-end sm:items-center justify-center z-50 animate-fade-in p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="mr-white-title"
                className="pop-card bg-pop-yellow text-ink w-full max-w-sm p-5 flex flex-col items-center gap-4 text-center animate-pop-in"
            >
                <span className="text-5xl animate-float" aria-hidden="true">
                    👻
                </span>
                <div className="flex flex-col gap-1">
                    <h2
                        id="mr-white-title"
                        className="text-3xl font-extrabold tracking-tight"
                    >
                        Busted, {roundState.mrWhiteGuessing}!
                    </h2>
                    <p className="font-semibold">
                        You were Mr. White. Guess the civilians' word to steal the win.
                    </p>
                </div>
                <form
                    className="w-full flex flex-col gap-3"
                    onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    <input
                        type="text"
                        autoComplete="off"
                        autoCapitalize="none"
                        enterKeyHint="go"
                        className="pop-border bg-surface text-fg w-full rounded-2xl h-13 px-4 text-lg font-bold text-center outline-none placeholder:text-muted placeholder:font-semibold"
                        value={guess}
                        onChange={e => setGuess(e.target.value)}
                        placeholder="Your guess…"
                        aria-label="Your guess"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="pop-border pop-shadow pop-press w-full h-13 rounded-2xl bg-pop-purple text-white font-extrabold uppercase tracking-wide"
                        disabled={!guess.trim()}
                    >
                        Submit guess
                    </button>
                </form>
            </div>
        </div>
    )
}
