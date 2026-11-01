import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { useEffect, useMemo, useState } from "react"
import { getRoleColor, getRoleLabel, VotePlayer } from "./VotePlayer"
import { MrWhiteGuess } from "./MrWhiteGuess"
import {
    getCivilsAlive,
    getUndercoverAlive,
    isCivilsWin,
    isUndercoversWin,
} from "helpers/undercover"
import confetti from "canvas-confetti"
import { FiArrowRight, FiX } from "react-icons/fi"
import { BottomBar } from "components/ui/BottomBar"
import { Avatar } from "components/ui/Avatar"

export const Vote: React.FC = () => {
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()

    const [selected, setSelected] = useState<string | null>(null)
    const [revealed, setRevealed] = useState<string | null>(null)

    // A new player opens the discussion after each vote, picked among living players
    const playerStart = useMemo(() => {
        const alive = roundState.players.filter(p => p.alive)
        const eligible = alive.filter(p => !p.isMrWhite)
        const pool = eligible.length > 0 ? eligible : alive
        return pool[Math.trunc(Math.random() * pool.length)]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roundState.voteNuber, roundState.players.length])

    const nbUndercoversAlive = useMemo(() => {
        return getUndercoverAlive(roundState.players)
    }, [roundState.players])

    const nbCivilsAlive = useMemo(() => {
        return getCivilsAlive(roundState.players)
    }, [roundState.players])

    const mrWhiteWin = roundState.mrWhiteGuessedCorrectly
    // Hold the verdict (and the confetti) until an ejected Mr. White has made a guess
    const isGuessing = roundState.mrWhiteGuessing !== null

    const isLoose = useMemo(() => {
        if (mrWhiteWin) return true
        return !isGuessing && isUndercoversWin(nbUndercoversAlive, nbCivilsAlive)
    }, [nbCivilsAlive, nbUndercoversAlive, mrWhiteWin, isGuessing])

    const isWin = useMemo(() => {
        return !mrWhiteWin && !isGuessing && isCivilsWin(nbUndercoversAlive)
    }, [nbUndercoversAlive, mrWhiteWin, isGuessing])

    const isOver = isWin || isLoose

    useEffect(() => {
        if (isWin) {
            confetti({
                particleCount: 180,
                spread: 90,
                origin: { y: 0.55 },
                colors: ["#7c3aed", "#facc15", "#34d399", "#f472b6", "#ffffff"],
            })
        } else if (isLoose) {
            const fire = (angle: number, origin: { x: number }) =>
                confetti({
                    particleCount: 60,
                    angle,
                    spread: 55,
                    origin: { ...origin, y: 0.6 },
                    colors: ["#f43f5e", "#fb923c", "#facc15", "#141414"],
                })
            fire(60, { x: 0 })
            fire(120, { x: 1 })
        }
    }, [isWin, isLoose])

    const selectedPlayer = roundState.players.find(p => p.name === selected && p.alive)
    const revealedPlayer = roundState.players.find(p => p.name === revealed)

    const handleEject = () => {
        if (!selectedPlayer || isOver) {
            return
        }

        roundDispatch({
            type: "INCR_VOTE_NB",
        })

        roundDispatch({
            type: "KILL_PLAYER",
            playerName: selectedPlayer.name,
        })

        // Mr. White gets the guess dialog instead of the reveal
        if (!selectedPlayer.isMrWhite) {
            setRevealed(selectedPlayer.name)
        }
        setSelected(null)
    }

    const outcome = mrWhiteWin
        ? { title: "Mr. White guessed it!", emoji: "👻", color: "bg-pop-yellow" }
        : isWin
          ? { title: "Civilians win!", emoji: "🎉", color: "bg-pop-mint" }
          : { title: "Undercovers win!", emoji: "😈", color: "bg-pop-pink" }

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <MrWhiteGuess />
            {revealedPlayer && !roundState.mrWhiteGuessing && (
                <div
                    className="fixed inset-0 z-40 bg-ink/60 flex items-center justify-center p-6 animate-fade-in"
                    onClick={() => setRevealed(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${revealedPlayer.name} was ${getRoleLabel(revealedPlayer)}`}
                >
                    <div className="pop-card bg-surface text-fg w-full max-w-xs p-6 flex flex-col items-center gap-3 text-center animate-pop-in">
                        <Avatar name={revealedPlayer.name} size="lg" dimmed />
                        <span className="text-lg font-bold">
                            {revealedPlayer.name} was…
                        </span>
                        <span
                            className={`${getRoleColor(revealedPlayer)} text-ink pop-border pop-shadow rounded-xl px-4 py-1 text-3xl font-extrabold uppercase tracking-tight animate-stamp`}
                            style={{ animationDelay: "0.25s" }}
                        >
                            {getRoleLabel(revealedPlayer)}
                        </span>
                        <span className="text-sm text-muted font-semibold mt-2">
                            Tap anywhere to continue
                        </span>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto">
                <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-extrabold tracking-tighter leading-none flex-grow">
                            Vote!
                        </h1>
                        <span className="pop-border bg-surface rounded-full px-3 py-1 text-sm font-extrabold">
                            🕵️ {nbUndercoversAlive} still hiding
                        </span>
                    </div>

                    {isOver ? (
                        <div
                            key="outcome"
                            className={`pop-card ${outcome.color} text-ink px-4 py-3 flex items-center gap-3 animate-pop-in`}
                        >
                            <span className="text-3xl">{outcome.emoji}</span>
                            <span className="text-xl font-extrabold">
                                {outcome.title}
                            </span>
                        </div>
                    ) : (
                        playerStart && (
                            <div
                                key={playerStart.name + roundState.voteNuber}
                                className="pop-card bg-pop-pink text-ink px-4 py-3 flex items-center gap-3 animate-slide-in-down"
                            >
                                <span className="text-2xl">🎤</span>
                                <span className="font-bold">
                                    <b className="font-extrabold">{playerStart.name}</b>{" "}
                                    starts describing their word
                                </span>
                            </div>
                        )
                    )}

                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {roundState.players.map(player => (
                            <VotePlayer
                                key={player.name}
                                player={player}
                                selected={player.name === selected}
                                disabled={isOver}
                                onSelect={() =>
                                    setSelected(
                                        player.name === selected ? null : player.name,
                                    )
                                }
                            />
                        ))}
                    </ul>
                </div>
            </div>

            <BottomBar>
                {isOver ? (
                    <button
                        className="pop-border pop-shadow pop-press w-full h-14 rounded-2xl bg-pop-purple text-white flex items-center justify-center gap-3 text-lg font-extrabold uppercase tracking-wide animate-pop-in"
                        onClick={() => roundDispatch({ type: "NEXT_STEP" })}
                    >
                        <span>See results</span>
                        <FiArrowRight strokeWidth={3} />
                    </button>
                ) : (
                    <button
                        className={`pop-border pop-shadow pop-press w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-lg font-extrabold uppercase tracking-wide ${
                            selectedPlayer ? "bg-pop-red text-ink" : "bg-surface text-fg"
                        }`}
                        disabled={!selectedPlayer}
                        onClick={handleEject}
                    >
                        {selectedPlayer ? (
                            <>
                                <FiX strokeWidth={3} />
                                <span className="truncate">
                                    Eject {selectedPlayer.name}
                                </span>
                            </>
                        ) : (
                            <span>Tap a player to vote</span>
                        )}
                    </button>
                )}
            </BottomBar>
        </div>
    )
}
