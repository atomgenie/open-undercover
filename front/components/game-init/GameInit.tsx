import { useStoreDispatch, useStoreState } from "helpers/redux"
import { isPlayerNameValid } from "helpers/player"
import { canStartGame, getSetupError } from "helpers/undercover"
import { useMemo, useRef, useState } from "react"
import { FiPlay, FiPlus } from "react-icons/fi"
import { PlayerCard } from "./components/PlayerCard"
import { MrWhiteToggle } from "./components/MrWhiteToggle"
import { Undercovers } from "./components/Undercovers"
import { BottomBar } from "components/ui/BottomBar"
import { TeamSummary } from "./components/TeamSummary"

export const GameInit: React.FC = () => {
    const state = useStoreState()
    const dispatch = useStoreDispatch()
    const inputRef = useRef<HTMLInputElement>(null)

    const [name, setName] = useState("")

    const isNameValid = useMemo(
        () => isPlayerNameValid(name, state.players),
        [name, state.players],
    )

    const isDuplicate =
        name.trim() !== "" && state.players.some(player => player.name === name.trim())

    const handleAddPlayer = () => {
        if (!isNameValid) {
            return
        }

        dispatch({
            type: "ADD_PLAYER",
            player: { name: name.trim(), score: 0 },
        })

        setName("")
        // Keep the keyboard open so the next name can be typed right away
        inputRef.current?.focus()
    }

    const canStart = canStartGame(state.players.length, state.undercovers, state.mrWhite)
    const setupError = getSetupError(
        state.players.length,
        state.undercovers,
        state.mrWhite,
    )

    const handleStart = () => {
        if (!canStart) {
            return
        }

        dispatch({
            type: "START",
        })
    }

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto">
                <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-6 flex flex-col gap-5">
                    <h1 className="text-4xl font-extrabold tracking-tighter leading-none">
                        Who's{" "}
                        <span className="inline-block bg-pop-yellow text-ink px-1.5 rounded-lg -rotate-2">
                            in
                        </span>
                        ?
                    </h1>

                    <form
                        className="pop-card bg-surface flex items-center gap-2 p-1.5 pl-4 focus-within:-translate-y-0.5 transition-transform"
                        onSubmit={e => {
                            e.preventDefault()
                            handleAddPlayer()
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            autoComplete="off"
                            autoCapitalize="words"
                            enterKeyHint="done"
                            maxLength={24}
                            className="flex-grow min-w-0 bg-transparent text-base font-semibold outline-none placeholder:text-muted"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Add a player…"
                            aria-label="Player name"
                        />
                        <button
                            className="pop-border pop-press h-11 w-11 flex-shrink-0 rounded-xl bg-pop-mint text-ink flex items-center justify-center text-2xl"
                            disabled={!isNameValid}
                            type="submit"
                            aria-label="Add player"
                        >
                            <FiPlus strokeWidth={3} />
                        </button>
                    </form>
                    {isDuplicate && (
                        <p className="-mt-3 text-sm font-semibold text-pop-red animate-fade-in">
                            {name.trim()} is already playing.
                        </p>
                    )}

                    {state.players.length > 0 ? (
                        <ul className="flex flex-wrap gap-2.5">
                            {state.players.map(player => (
                                <PlayerCard key={player.name} player={player} />
                            ))}
                        </ul>
                    ) : (
                        <div className="pop-border border-dashed rounded-2xl px-4 py-6 text-center text-muted font-semibold">
                            No players yet. Add at least 3 to play.
                        </div>
                    )}

                    <section className="flex flex-col gap-3" aria-label="Roles">
                        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted">
                            Roles
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Undercovers />
                            <MrWhiteToggle />
                        </div>
                    </section>
                </div>
            </div>
            <BottomBar>
                {setupError ? (
                    <p className="text-center text-sm font-semibold text-muted">
                        {setupError}
                    </p>
                ) : (
                    <TeamSummary />
                )}
                <button
                    className="pop-border pop-shadow pop-press w-full h-14 rounded-2xl bg-pop-purple text-white flex items-center justify-center gap-3 text-lg font-extrabold uppercase tracking-wide"
                    disabled={!canStart}
                    onClick={handleStart}
                >
                    <span>Let's play</span>
                    <FiPlay className="fill-current" />
                </button>
            </BottomBar>
        </div>
    )
}
