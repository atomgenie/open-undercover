import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { useEffect, useMemo } from "react"
import { VotePlayer } from "./VotePlayer"
import { MrWhiteGuess } from "./MrWhiteGuess"
import {
    getCivilsAlive,
    getUndercoverAlive,
    isCivilsWin,
    isUndercoversWin,
} from "helpers/undercover"
import confetti from "canvas-confetti"

export const Vote: React.FC = () => {
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()

    const playerStart = useMemo(() => {
        const eligible = roundState.players.filter(p => !p.isMrWhite)
        const pool = eligible.length > 0 ? eligible : roundState.players
        return pool[Math.trunc(Math.random() * pool.length)]
    }, [roundState.players])

    const nbUndercoversAlive = useMemo(() => {
        return getUndercoverAlive(roundState.players)
    }, [roundState.players])

    const nbCivilsAlive = useMemo(() => {
        return getCivilsAlive(roundState.players)
    }, [roundState.players])

    const mrWhiteWin = roundState.mrWhiteGuessedCorrectly

    const isLoose = useMemo(() => {
        return isUndercoversWin(nbUndercoversAlive, nbCivilsAlive) || mrWhiteWin
    }, [nbCivilsAlive, nbUndercoversAlive, mrWhiteWin])

    const isWin = useMemo(() => {
        return !mrWhiteWin && isCivilsWin(nbUndercoversAlive)
    }, [nbUndercoversAlive, mrWhiteWin])

    useEffect(() => {
        if (isWin) {
            confetti({
                particleCount: 180,
                spread: 90,
                origin: { y: 0.55 },
                colors: ["#6602cc", "#ecdbff", "#ffffff", "#a855f7"],
            })
        } else if (isLoose) {
            const fire = (angle: number, origin: { x: number }) =>
                confetti({
                    particleCount: 60,
                    angle,
                    spread: 55,
                    origin: { ...origin, y: 0.6 },
                    colors: ["#f97316", "#ef4444", "#fbbf24", "#ffffff"],
                })
            fire(60, { x: 0 })
            fire(120, { x: 1 })
        }
    }, [isWin, isLoose])

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <MrWhiteGuess />
            <div className="flex-shrink-0 bg-gray-200 dark:bg-black">
                <div className="container mx-auto px-2 text-sm py-2">
                    <b>{nbUndercoversAlive}</b> Undercover alive
                </div>
            </div>
            <div className="flex-grow flex-shrink overflow-y-auto">
                <div className="container mx-auto px-2 flex flex-col gap-6">
                    <div className="flex justify-center mt-6 sticky top-6">
                        <div
                            key={`${isWin}-${isLoose}`}
                            className="bg-white dark:bg-black rounded-full text-brand dark:text-white shadow-sm px-6 py-2 flex items-center gap-4 animate-slide-in-down"
                        >
                            {isLoose && (
                                <>
                                    <div>{mrWhiteWin ? "Mister White guessed the word!" : "Undercovers wins"}</div>
                                    <button
                                        className="rounded-full bg-brand text-white py-1 px-4"
                                        onClick={() => {
                                            roundDispatch({
                                                type: "NEXT_STEP",
                                            })
                                        }}
                                    >
                                        Continue
                                    </button>
                                </>
                            )}
                            {isWin && (
                                <>
                                    <div>Civils wins</div>
                                    <button
                                        className="rounded-full bg-brand text-white py-1 px-4"
                                        onClick={() => {
                                            roundDispatch({
                                                type: "NEXT_STEP",
                                            })
                                        }}
                                    >
                                        Continue
                                    </button>
                                </>
                            )}
                            {!isWin && !isLoose && (
                                <div>
                                    Player <b>{playerStart.name}</b> starts
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-6 mb-6">
                        {roundState.players.map(player => (
                            <VotePlayer player={player} key={player.name} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 bg-brand">
                <div className="container mx-auto px-2 text-center text-white">
                    <div className="my-3">
                        <b>Vote</b> for the undercover
                    </div>
                </div>
            </div>
        </div>
    )
}
