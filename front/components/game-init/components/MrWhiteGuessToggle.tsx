import { useStoreDispatch, useStoreState } from "helpers/redux"

/** Variant rule: a correct Mr. White guess scores without ending the round */
export const MrWhiteGuessToggle: React.FC = () => {
    const { mrWhite, continueAfterMrWhiteGuess } = useStoreState()
    const dispatch = useStoreDispatch()

    if (!mrWhite) {
        return null
    }

    return (
        <button
            role="switch"
            aria-checked={continueAfterMrWhiteGuess}
            className="pop-card pop-press bg-surface text-fg p-3 flex items-center gap-3 text-left animate-fade-in"
            onClick={() => {
                dispatch({
                    type: "SET_CONTINUE_AFTER_MR_WHITE_GUESS",
                    enabled: !continueAfterMrWhiteGuess,
                })
            }}
        >
            <span className="flex-grow flex flex-col gap-0.5">
                <span className="font-extrabold">
                    Keep playing after Mr. White's guess
                </span>
                <span className="text-xs font-bold text-muted">
                    {continueAfterMrWhiteGuess
                        ? "A right guess scores bonus points, the round goes on. Revealed in the results."
                        : "A right guess ends the round: Mr. White wins."}
                </span>
            </span>
            <span
                aria-hidden="true"
                className={`pop-border flex-shrink-0 w-12 h-7 rounded-full p-0.5 flex transition-colors ${
                    continueAfterMrWhiteGuess
                        ? "bg-pop-yellow justify-end"
                        : "bg-surface-muted justify-start"
                }`}
            >
                <span className="h-full aspect-square rounded-full bg-ink dark:bg-fg" />
            </span>
        </button>
    )
}
