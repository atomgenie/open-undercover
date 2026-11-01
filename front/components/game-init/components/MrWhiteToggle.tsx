import { useStoreDispatch, useStoreState } from "helpers/redux"

export const MrWhiteToggle: React.FC = () => {
    const { mrWhite } = useStoreState()
    const dispatch = useStoreDispatch()

    return (
        <button
            role="switch"
            aria-checked={mrWhite}
            className={`pop-card pop-press p-3 flex flex-col gap-2 text-left ${
                mrWhite ? "bg-pop-yellow text-ink" : "bg-surface text-fg"
            }`}
            onClick={() => {
                dispatch({
                    type: "SET_MR_WHITE",
                    enabled: !mrWhite,
                })
            }}
        >
            <span className="text-xs font-extrabold uppercase tracking-wider">
                Mr. White
            </span>
            <span
                key={String(mrWhite)}
                className="text-4xl font-extrabold leading-none animate-pop-in"
            >
                {mrWhite ? "ON" : "OFF"}
            </span>
            <span className={`text-xs font-bold mt-auto ${mrWhite ? "" : "text-muted"}`}>
                No word at all. Pure bluff!
            </span>
        </button>
    )
}
