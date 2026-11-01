import { useStoreDispatch, useStoreState } from "helpers/redux"
import { isPlayerNameValid } from "helpers/player"
import { canStartGame, getSetupError } from "helpers/undercover"
import { useEffect, useMemo, useState } from "react"
import {
    FiCheck,
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiRefreshCw,
    FiSettings,
    FiX,
} from "react-icons/fi"
import { Undercovers } from "components/game-init/components/Undercovers"
import { MrWhiteToggle } from "components/game-init/components/MrWhiteToggle"
import { Avatar } from "components/ui/Avatar"

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

    const errorMessage = getSetupError(players.length, undercovers, mrWhite)

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

    const iconButtonClass =
        "h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl text-xl text-muted hover:bg-surface-muted hover:text-fg disabled:opacity-25 disabled:hover:bg-transparent"

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 animate-fade-in sm:p-4"
            onClick={handleClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="game-settings-title"
                className="w-full sm:max-w-md max-h-[90dvh] flex flex-col bg-paper text-fg border-ink border-t-[2.5px] sm:border-[2.5px] rounded-t-3xl sm:rounded-3xl sm:pop-shadow animate-slide-in-up sm:animate-pop-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-center pt-2 sm:hidden" aria-hidden="true">
                    <div className="h-1.5 w-12 rounded-full bg-ink/30 dark:bg-fg/30" />
                </div>

                <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                    <div className="pop-border bg-pop-purple text-white h-9 w-9 rounded-xl flex items-center justify-center -rotate-6">
                        <FiSettings />
                    </div>
                    <h2
                        id="game-settings-title"
                        className="text-2xl font-extrabold tracking-tight flex-grow"
                    >
                        Game settings
                    </h2>
                    <button
                        className="pop-border pop-shadow-sm pop-press h-10 w-10 flex items-center justify-center rounded-xl bg-surface text-xl"
                        onClick={handleClose}
                        disabled={!isValid}
                        aria-label="Close settings"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-4 py-3 flex flex-col gap-5">
                    <section className="flex flex-col gap-3">
                        <div className="flex items-baseline justify-between">
                            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">
                                Players
                            </h3>
                            <span className="text-xs font-bold text-muted">
                                {players.length} player{players.length > 1 && "s"}
                            </span>
                        </div>

                        <form
                            className="pop-card bg-surface flex items-center gap-2 p-1.5 pl-4"
                            onSubmit={e => {
                                e.preventDefault()
                                handleAddPlayer()
                            }}
                        >
                            <input
                                type="text"
                                autoComplete="off"
                                autoCapitalize="words"
                                enterKeyHint="done"
                                maxLength={24}
                                className="flex-grow min-w-0 bg-transparent text-base font-semibold outline-none placeholder:text-muted"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="New player name"
                                aria-label="New player name"
                            />
                            <button
                                type="submit"
                                className="pop-border pop-press h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-pop-mint text-ink text-xl"
                                disabled={!isNameValid}
                                aria-label="Add player"
                            >
                                <FiPlus strokeWidth={3} />
                            </button>
                        </form>

                        {players.length > 1 && (
                            <p className="text-xs font-semibold text-muted">
                                Players reveal their word and are listed in this order.
                            </p>
                        )}

                        <ul className="flex flex-col gap-2">
                            {players.map((player, index) => (
                                <li
                                    key={player.name}
                                    className="pop-border bg-surface rounded-2xl flex items-center gap-2 p-1"
                                >
                                    <div className="flex flex-col flex-shrink-0">
                                        <button
                                            className={`${iconButtonClass} !h-6 !w-9 !text-lg`}
                                            onClick={() =>
                                                dispatch({
                                                    type: "MOVE_PLAYER",
                                                    playerName: player.name,
                                                    offset: -1,
                                                })
                                            }
                                            disabled={index === 0}
                                            aria-label={`Move ${player.name} up`}
                                        >
                                            <FiChevronUp />
                                        </button>
                                        <button
                                            className={`${iconButtonClass} !h-6 !w-9 !text-lg`}
                                            onClick={() =>
                                                dispatch({
                                                    type: "MOVE_PLAYER",
                                                    playerName: player.name,
                                                    offset: 1,
                                                })
                                            }
                                            disabled={index === players.length - 1}
                                            aria-label={`Move ${player.name} down`}
                                        >
                                            <FiChevronDown />
                                        </button>
                                    </div>
                                    <Avatar name={player.name} size="sm" />
                                    <div className="flex-grow min-w-0 truncate font-bold">
                                        {player.name}
                                    </div>
                                    <div className="text-xs font-bold text-muted flex-shrink-0 tabular-nums">
                                        {player.score} pts
                                    </div>
                                    <button
                                        className={iconButtonClass}
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
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted">
                            Roles
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Undercovers />
                            <MrWhiteToggle />
                        </div>
                    </section>

                    {errorMessage && (
                        <div
                            role="alert"
                            className="pop-border bg-pop-red text-ink rounded-xl px-3 py-2 text-sm font-bold"
                        >
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="border-t-2 border-ink/15 dark:border-fg/15 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-3">
                    <p className="text-xs font-semibold text-center text-muted">
                        Changes apply from the next round.
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                        <button
                            className="pop-border pop-shadow-sm pop-press w-full sm:flex-1 h-12 flex-shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-surface font-bold"
                            onClick={handleRestartRound}
                            disabled={!isValid}
                        >
                            <FiRefreshCw />
                            <span>Restart round now</span>
                        </button>
                        <button
                            className="pop-border pop-shadow pop-press w-full sm:flex-1 h-12 flex-shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-pop-purple text-white font-extrabold uppercase tracking-wide"
                            onClick={handleClose}
                            disabled={!isValid}
                        >
                            <FiCheck strokeWidth={3} />
                            <span>Done</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
