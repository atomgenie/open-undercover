import { useStoreDispatch, useStoreState } from "helpers/redux"
import { useMemo } from "react"
import { FiMinus, FiPlus } from "react-icons/fi"

export const Undercovers: React.FC = () => {
    const { undercovers, players, mrWhite } = useStoreState()
    const dispatch = useStoreDispatch()

    const maxUndercovers = useMemo(
        () => Math.floor((players.length - 1) / 2) - (mrWhite ? 1 : 0),
        [players.length, mrWhite],
    )
    const canMinus = useMemo(() => undercovers > 1, [undercovers])
    const canPlus = useMemo(() => undercovers < maxUndercovers, [
        undercovers,
        maxUndercovers,
    ])

    return (
        <div className="flex items-center text-white gap-2">
            <div className="text-sm">
                <span>Undercovers: </span>
                <span className="font-bold">{undercovers}</span>
            </div>
            <button
                className={`rounded-full flex items-center justify-center bg-brand-light text-brand h-6 w-6 outline-none flex-shrink-0 ${
                    !canMinus ? "opacity-20 cursor-default" : ""
                }`}
                disabled={!canMinus}
                onClick={() => {
                    if (!canMinus) {
                        return
                    }

                    dispatch({
                        type: "SET_UNDERCOVERS",
                        amount: undercovers - 1,
                    })
                }}
            >
                <FiMinus />
            </button>
            <button
                className={`rounded-full flex items-center justify-center bg-brand-light text-brand h-6 w-6 outline-none flex-shrink-0 ${
                    !canPlus ? "opacity-20 cursor-default" : ""
                }`}
                disabled={!canPlus}
                onClick={() => {
                    if (!canPlus) {
                        return
                    }

                    dispatch({
                        type: "SET_UNDERCOVERS",
                        amount: undercovers + 1,
                    })
                }}
            >
                <FiPlus />
            </button>
        </div>
    )
}
