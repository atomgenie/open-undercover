import { useStoreDispatch, useStoreState } from "helpers/redux"

export const MrWhiteToggle: React.FC = () => {
    const { mrWhite } = useStoreState()
    const dispatch = useStoreDispatch()

    return (
        <div className="flex items-center text-white gap-2">
            <div className="text-sm">
                <span>Mr. White: </span>
            </div>
            <button
                className={`rounded-full px-4 py-1 text-sm font-bold ${
                    mrWhite
                        ? "bg-white text-brand"
                        : "bg-brand-light text-brand"
                }`}
                onClick={() => {
                    dispatch({
                        type: "SET_MR_WHITE",
                        enabled: !mrWhite,
                    })
                }}
            >
                {mrWhite ? "ON" : "OFF"}
            </button>
        </div>
    )
}
