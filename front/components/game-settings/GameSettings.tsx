import { useStoreDispatch, useStoreState } from "helpers/redux"
import { getInitials, isPlayerNameValid } from "helpers/player"
import { canStartGame } from "helpers/undercover"
import { useEffect, useMemo, useState } from "react"
import { FiCheck, FiPlus, FiRefreshCw, FiSettings, FiX } from "react-icons/fi"
import { Undercovers } from "components/game-init/components/Undercovers"
import { MrWhiteToggle } from "components/game-init/components/MrWhiteToggle"

interface props {
    open: boolean
    onClose: () => void
}

export const GameSettings: React.FC<props> = ({ open, onClose }) => {
    const { players, undercovers, mrWhite } = useStoreState()
    const dispatch = useStoreDispatch()

    const [name, setName] = useState("")

    const isNameValid = useMemo(() => isPlayerNameValid(name, players), [name, players])

    const isValid = useMemo(
        () => canStartGame(players.length, undercovers, mrWhite),
        [players.length, undercovers, mrWhite],
    )

    const errorMessage = !isValid
        ? players.length < 3
            ? "At least 3 players are needed."
            : "Not enough civilians: add a player, remove an undercover or turn off Mr. White."
        : null

    const handleClose = () => {
        if (!isValid) {
            return
        }
        setName("")
        onClose()
    }

    useEffect(() => {
        if (!open) {
            return
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose()
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    })

    if (!open) {
        return null
    }

    const handleAddPlayer = () => {
        if (!isNameValid) {
            return
        }

        dispatch({
            type: "ADD_PLAYER",
            player: { name: name.trim(), score: 0 },
        })
        setName("")
    }

    const handleRestartRound = () => {
        if (!isValid) {
            return
        }

        dispatch({ type: "RESTART_ROUND" })
        handleClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 animate-fade-in"
            onClick={handleClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="game-settings-title"
                className="w-full sm:max-w-md max-h-[90dvh] flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-in-up sm:animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-center pt-2 sm:hidden">
                    <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>

                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <FiSettings className="text-lg text-brand dark:text-brand-light" />
                    <h2 id="game-settings-title" className="font-bold text-base flex-grow">
                        Game settings
                    </h2>
                    <button
                        className={`h-10 w-10 -mr-2 flex items-center justify-center rounded-full text-xl hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            !isValid ? "opacity-20 cursor-default" : ""
                        }`}
                        onClick={handleClose}
                        disabled={!isValid}
                        aria-label="Close settings"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-5">
                    <section className="flex flex-col gap-3">
                        <div className="flex items-baseline justify-between">
                            <h3 className="font-bold">Players</h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {players.length} player{players.length > 1 && "s"}
                            </span>
                        </div>

                        <form
                            className="flex gap-2"
                            onSubmit={e => {
                                e.preventDefault()
                                handleAddPlayer()
                            }}
                        >
                            <input
                                type="text"
                                autoComplete="off"
                                className="flex-grow min-w-0 border border-gray-200 rounded-full py-2 px-4 text-base outline-hidden dark:bg-gray-700 dark:border-gray-600"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="New player name"
                                aria-label="New player name"
                            />
                            <button
                                type="submit"
                                className={`h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-full bg-brand text-white text-xl ${
                                    !isNameValid ? "opacity-20 cursor-default" : ""
                                }`}
                                disabled={!isNameValid}
                                aria-label="Add player"
                            >
                                <FiPlus />
                            </button>
                        </form>

                        <ul className="flex flex-col gap-2">
                            {players.map(player => (
                                <li
                                    key={player.name}
                                    className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pl-3 pr-1 py-1"
                                >
                                    <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold">
                                        {getInitials(player.name)}
                                    </div>
                                    <div className="flex-grow min-w-0 truncate">
                                        {player.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                        {player.score} pts
                                    </div>
                                    <button
                                        className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        onClick={() =>
                                            dispatch({
                                                type: "DELETE_PLAYER",
                                                playerName: player.name,
                                            })
                                        }
                                        aria-label={`Remove ${player.name}`}
                                    >
                                        <FiX />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="flex flex-col gap-3">
                        <h3 className="font-bold">Roles</h3>
                        <div className="bg-brand rounded-xl px-4 py-3 flex flex-col gap-3">
                            <Undercovers />
                            <MrWhiteToggle />
                        </div>
                    </section>

                    {errorMessage && (
                        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-2">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Changes apply from the next round.
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <button
                            className={`flex-1 flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-gray-600 px-4 py-3 text-sm font-bold ${
                                !isValid ? "opacity-20 cursor-default" : ""
                            }`}
                            onClick={handleRestartRound}
                            disabled={!isValid}
                        >
                            <FiRefreshCw />
                            <span>Restart round now</span>
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center gap-2 rounded-full bg-brand text-white px-4 py-3 text-sm font-bold ${
                                !isValid ? "opacity-20 cursor-default" : ""
                            }`}
                            onClick={handleClose}
                            disabled={!isValid}
                        >
                            <FiCheck />
                            <span>Done</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
