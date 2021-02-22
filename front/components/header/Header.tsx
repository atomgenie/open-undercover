import { useStoreState, GAME_STEPS, useStoreDispatch } from "helpers/redux"
import { FiSun, FiMoon, FiStar } from "react-icons/fi"

export const Header: React.FC = () => {
    const state = useStoreState()
    const dispatch = useStoreDispatch()

    const triggerDarkMode = () => {
        dispatch({
            type: "DARK_MODE",
        })
    }

    return (
        <div className="bg-white dark:bg-brand-dark flex-shrink-0 shado-sm">
            <div className="container mx-auto px-2 flex items-center py-3 gap-6">
                <div className="bg-brand text-white rounded-full px-4 py-2 font-bold flex items-center gap-2">
                    <FiStar />
                    <div className="text-sm">Open-Undercover</div>
                </div>
                <div className="flex-grow"></div>
                {state.gameStep === GAME_STEPS.EMPTY && (
                    <button
                        onClick={() => {
                            dispatch({
                                type: "INIT",
                            })
                        }}
                    >
                        Start a game
                    </button>
                )}
                {state.darkMode ? (
                    <button
                        className="flex items-center gap-2 opacity-60"
                        onClick={triggerDarkMode}
                    >
                        <FiSun />
                        <div>Light Mode</div>
                    </button>
                ) : (
                    <button
                        className="flex items-center gap-2 opacity-60"
                        onClick={triggerDarkMode}
                    >
                        <FiMoon />
                        <div>Dark Mode</div>
                    </button>
                )}
            </div>
        </div>
    )
}
