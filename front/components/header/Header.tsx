import { useStoreState, GAME_STEPS, useStoreDispatch } from "helpers/redux"
import { FiSun, FiMoon, FiRefreshCw, FiSettings } from "react-icons/fi"
import Image from "next/image"
import { useState } from "react"
import { GameSettings } from "components/game-settings/GameSettings"
import { ConfirmDialog } from "components/ui/ConfirmDialog"

const headerButtonClass =
    "pop-border pop-shadow-sm pop-press h-11 min-w-11 px-3 rounded-xl bg-surface text-fg flex items-center justify-center gap-2 text-lg"

export const Header: React.FC = () => {
    const state = useStoreState()
    const dispatch = useStoreDispatch()
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [resetOpen, setResetOpen] = useState(false)

    const triggerDarkMode = () => {
        dispatch({
            type: "DARK_MODE",
        })
    }

    const resetGame = () => {
        setResetOpen(false)
        dispatch({
            type: "CLEAR",
        })
    }

    return (
        <header className="flex-shrink-0 pt-[env(safe-area-inset-top)]">
            <div className="mx-auto w-full max-w-xl px-4 pt-3 pb-1 flex items-center gap-2">
                <div className="pop-border pop-shadow-sm bg-pop-purple text-white rounded-xl pl-1.5 pr-3 py-1 flex items-center gap-1.5 -rotate-2 flex-shrink-0">
                    <Image src="/icons/LogoWhite.png" alt="" width={24} height={24} />
                    <span className="font-extrabold tracking-tight uppercase text-[15px]">
                        Undercover
                    </span>
                </div>
                <div className="flex-grow" />
                {state.gameStep === GAME_STEPS.STARTED && (
                    <button
                        className={headerButtonClass}
                        onClick={() => setSettingsOpen(true)}
                        aria-label="Game settings"
                    >
                        <FiSettings />
                        <span className="hidden sm:inline text-sm font-bold">
                            Settings
                        </span>
                    </button>
                )}
                {state.gameStep !== GAME_STEPS.EMPTY && (
                    <button
                        className={headerButtonClass}
                        onClick={() => setResetOpen(true)}
                        aria-label="Reset game"
                    >
                        <FiRefreshCw />
                        <span className="hidden sm:inline text-sm font-bold">Reset</span>
                    </button>
                )}
                <button
                    className={headerButtonClass}
                    onClick={triggerDarkMode}
                    aria-label={state.darkMode ? "Light mode" : "Dark mode"}
                >
                    {state.darkMode ? <FiSun /> : <FiMoon />}
                </button>
            </div>
            <GameSettings
                open={settingsOpen && state.gameStep === GAME_STEPS.STARTED}
                onClose={() => setSettingsOpen(false)}
            />
            <ConfirmDialog
                open={resetOpen}
                title="Restart the game?"
                message="All players and scores will be cleared."
                confirmLabel="Yes, restart"
                cancelLabel="Keep playing"
                onConfirm={resetGame}
                onCancel={() => setResetOpen(false)}
            />
        </header>
    )
}
