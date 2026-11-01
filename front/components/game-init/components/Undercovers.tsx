import { useStoreDispatch, useStoreState } from "helpers/redux"
import { getMaxUndercovers } from "helpers/undercover"
import { FiMinus, FiPlus } from "react-icons/fi"

const stepButtonClass =
    "pop-border pop-shadow-sm pop-press h-10 w-10 rounded-xl bg-surface text-fg flex items-center justify-center text-lg"

export const Undercovers: React.FC = () => {
    const { undercovers, players, mrWhite } = useStoreState()
    const dispatch = useStoreDispatch()

    const maxUndercovers = getMaxUndercovers(players.length, mrWhite)
    const canMinus = undercovers > 1
    const canPlus = undercovers < maxUndercovers

    const setAmount = (amount: number) => {
        dispatch({
            type: "SET_UNDERCOVERS",
            amount,
        })
    }

    return (
        <div className="pop-card bg-pop-pink text-ink p-3 flex flex-col gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider">
                Undercovers
            </span>
            <span
                key={undercovers}
                className="text-4xl font-extrabold leading-none animate-pop-in"
            >
                {undercovers}
            </span>
            <div className="flex gap-2 mt-auto">
                <button
                    className={stepButtonClass}
                    disabled={!canMinus}
                    onClick={() => canMinus && setAmount(undercovers - 1)}
                    aria-label="Remove one undercover"
                >
                    <FiMinus />
                </button>
                <button
                    className={stepButtonClass}
                    disabled={!canPlus}
                    onClick={() => canPlus && setAmount(undercovers + 1)}
                    aria-label="Add one undercover"
                >
                    <FiPlus />
                </button>
            </div>
        </div>
    )
}
