import { useStoreDispatch, useStoreState } from "helpers/redux"
import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import {
    getCivilsAlive,
    getUndercoverAlive,
    isCivilsWin,
    isUndercoversWin,
} from "helpers/undercover"
import { useEffect, useMemo } from "react"
import { FiArrowRight } from "react-icons/fi"

const CIVIL_WIN_SURVIVOR = 30
const CIVIL_WIN_ELIMINATED = 10
const UNDERCOVER_WIN_SURVIVOR = 60
const UNDERCOVER_WIN_ELIMINATED = 20
const MR_WHITE_CORRECT_GUESS = 100

export const Conclusion: React.FC = () => {
    const state = useStoreState()
    const dispatcher = useStoreDispatch()
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()

    const civilsAlive = useMemo(() => {
        return getCivilsAlive(roundState.players)
    }, [roundState.players])

    const undercoversAlive = useMemo(() => {
        return getUndercoverAlive(roundState.players)
    }, [roundState.players])

    const civilsWins = useMemo(() => {
        return isCivilsWin(undercoversAlive)
    }, [undercoversAlive])

    const undercoverWins = useMemo(() => {
        return isUndercoversWin(undercoversAlive, civilsAlive)
    }, [undercoversAlive, civilsAlive])

    const evilWins = undercoverWins || roundState.mrWhiteGuessedCorrectly

    const roundScores = useMemo(() => {
        return roundState.players.map(player => {
            const isEvil = player.isUndercover || player.isMrWhite

            if (player.isMrWhite && roundState.mrWhiteGuessedCorrectly) {
                return { playerName: player.name, amount: MR_WHITE_CORRECT_GUESS, label: "Mr White!" }
            }

            if (isEvil) {
                if (!evilWins) return { playerName: player.name, amount: 0, label: "" }
                return {
                    playerName: player.name,
                    amount: player.alive ? UNDERCOVER_WIN_SURVIVOR : UNDERCOVER_WIN_ELIMINATED,
                    label: player.alive ? "survived" : "eliminated",
                }
            }

            if (!civilsWins) return { playerName: player.name, amount: 0, label: "" }
            return {
                playerName: player.name,
                amount: player.alive ? CIVIL_WIN_SURVIVOR : CIVIL_WIN_ELIMINATED,
                label: player.alive ? "survived" : "eliminated",
            }
        })
    }, [roundState.players, roundState.mrWhiteGuessedCorrectly, evilWins, civilsWins])

    useEffect(() => {
        if (roundState.scoreAdded) {
            return
        }

        roundDispatch({ type: "SET_SCORE_ADDED" })
        dispatcher({
            type: "ADD_SCORE",
            score: roundScores.map(({ playerName, amount }) => ({ playerName, amount })),
        })
    }, [roundState.scoreAdded, roundScores])

    const sortedPlayers = useMemo(() => {
        return [...state.players].sort((a, b) => b.score - a.score)
    }, [state.players])

    const outcomeLabel = roundState.mrWhiteGuessedCorrectly
        ? "Mr White guessed the word!"
        : civilsWins
          ? "Civils won!"
          : "Undercovers won!"

    const outcomeColor = civilsWins
        ? "bg-purple-600"
        : "bg-orange-500"

    return (
        <div className="flex-grow flex flex-col gap-2 py-4">
            <div>
                <div className="container mx-auto px-2 flex justify-end">
                    <button
                        className="flex items-center gap-4 rounded-full px-6 py-2 bg-brand text-white text-sm font-bold"
                        onClick={() => {
                            roundDispatch({
                                type: "NEXT_STEP",
                            })
                        }}
                    >
                        <div>Continue</div>
                        <FiArrowRight />
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-2 flex flex-col gap-4 mt-2">
                <div className={`${outcomeColor} text-white rounded-xl px-4 py-3 text-center`}>
                    <div className="text-lg font-bold">{outcomeLabel}</div>
                    <div className="text-sm opacity-90 mt-1">
                        <span className="font-medium">{roundState.validWord}</span>
                        <span className="mx-2">vs</span>
                        <span className="font-medium">{roundState.undercoverWord}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {sortedPlayers.map((player, index) => {
                        const rs = roundScores.find(s => s.playerName === player.name)
                        const gained = rs?.amount ?? 0
                        const label = rs?.label ?? ""

                        return (
                            <div
                                key={player.name}
                                className="flex items-center bg-white dark:bg-gray-800 rounded-md py-3 px-4 border border-gray-200 dark:border-gray-700 animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="w-7 text-sm font-bold text-gray-400 dark:text-gray-500 shrink-0">
                                    #{index + 1}
                                </div>
                                <div className="flex-grow font-medium">{player.name}</div>
                                <div className="flex items-center gap-3">
                                    {gained > 0 ? (
                                        <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                            +{gained} {label}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400 px-2 py-0.5">
                                            +0
                                        </span>
                                    )}
                                    <div className="text-sm font-bold w-16 text-right">{player.score} pts</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
