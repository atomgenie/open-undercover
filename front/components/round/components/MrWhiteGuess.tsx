import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { useState } from "react"

export const MrWhiteGuess: React.FC = () => {
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()
    const [guess, setGuess] = useState("")

    if (!roundState.mrWhiteGuessing) {
        return null
    }

    const handleSubmit = () => {
        const trimmed = guess.trim()
        if (!trimmed) return

        const isCorrect =
            trimmed.toLowerCase() === roundState.validWord.toLowerCase()

        if (isCorrect) {
            roundDispatch({ type: "MW_GUESS_CORRECT" })
        } else {
            roundDispatch({ type: "MW_GUESS_WRONG" })
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4">
                <div className="text-2xl font-bold text-center">
                    Mister White
                </div>
                <div className="text-center text-gray-600 dark:text-gray-300">
                    <b>{roundState.mrWhiteGuessing}</b> was Mister White!
                </div>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    You have one chance to guess the civilian word.
                </div>
                <form
                    className="w-full flex flex-col gap-4"
                    onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    <input
                        type="text"
                        autoComplete="off"
                        className="border w-full rounded-full py-2 px-4 text-sm outline-none dark:bg-gray-700 dark:border-gray-600"
                        value={guess}
                        onChange={e => setGuess(e.target.value)}
                        placeholder="Enter your guess..."
                        autoFocus
                    />
                    <button
                        type="submit"
                        className={`w-full rounded-full bg-brand text-white py-2 px-4 font-bold ${
                            !guess.trim() ? "opacity-40 cursor-default" : ""
                        }`}
                        disabled={!guess.trim()}
                    >
                        Submit guess
                    </button>
                </form>
            </div>
        </div>
    )
}
