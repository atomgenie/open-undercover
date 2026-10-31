import { useStoreState, GAME_STEPS, useStoreDispatch } from "helpers/redux"
import { FiSun, FiMoon, FiRefreshCw, FiSettings } from "react-icons/fi"
import Image from "next/image"
import { useState } from "react"
import { GameSettings } from "components/game-settings/GameSettings"

const headerButtonClass =
    "flex items-center justify-center gap-2 opacity-60 hover:opacity-100 min-h-10 min-w-10 px-2 rounded-full"

export const Header: React.FC = () => {
    const state = useStoreState()
    const dispatch = useStoreDispatch()
    const [settingsOpen, setSettingsOpen] = useState(false)

    const triggerDarkMode = () => {
        dispatch({
            type: "DARK_MODE",
        })
    }

    const resetGame = () => {
        if (confirm("Are you sure you want to restart the game?")) {
            dispatch({
                type: "CLEAR",
            })
        }
    }

    return (
        <div className="bg-white dark:bg-brand-dark flex-shrink-0 shadow-xs">
            <div className="container mx-auto px-2 flex items-center py-3 gap-1 sm:gap-4">
                <div className="bg-brand text-white rounded-full px-4 py-2 font-bold flex items-center gap-2 flex-shrink-0">
                    <Image
                        src="/icons/LogoWhite.png"
                        alt="Openundercover logo"
                        width={25}
                        height={25}
                    />
                    <div className="text-sm">Open-Undercover</div>
                </div>
                <div className="flex-grow flex-shrink"></div>
                {state.gameStep === GAME_STEPS.STARTED && (
                    <button
                        className={headerButtonClass}
                        onClick={() => setSettingsOpen(true)}
                        aria-label="Game settings"
                    >
                        <FiSettings />
                        <span className="hidden sm:inline">Settings</span>
                    </button>
                )}
                {state.gameStep !== GAME_STEPS.EMPTY && (
                    <button
                        className={headerButtonClass}
                        onClick={resetGame}
                        aria-label="Reset"
                    >
                        <FiRefreshCw />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                )}
                <button
                    className={headerButtonClass}
                    onClick={triggerDarkMode}
                    aria-label={state.darkMode ? "Light Mode" : "Dark Mode"}
                >
                    {state.darkMode ? <FiSun /> : <FiMoon />}
                    <span className="hidden sm:inline">
                        {state.darkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                </button>
            </div>
            <GameSettings
                open={settingsOpen && state.gameStep === GAME_STEPS.STARTED}
                onClose={() => setSettingsOpen(false)}
            />
        </div>
    )
}
