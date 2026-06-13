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
import { PlayerRound } from "types/player"

const CIVIL_CORRECT_ELIMINATION = 20   // per undercover correctly identified while alive
const CIVIL_WIN_ALIVE = 20             // alive when civils win
const CIVIL_WIN_ELIMINATED = 5         // eliminated but team still won

const UNDERCOVER_DECEPTION = 15        // per civil outlasted
const UNDERCOVER_WIN = 30              // team wins

const MR_WHITE_CORRECT_GUESS = 100     // guessed the word correctly

const getCivilScore = (
    civil: PlayerRound,
    evilPlayers: PlayerRound[],
    civilsWin: boolean,
): { deduction: number; winBonus: number } => {
    const eliminatedEvil = evilPlayers.filter(e => e.eliminatedAtVote !== null)

    const deduction = eliminatedEvil.reduce((pts, evil) => {
        const civilWasAlive =
            civil.eliminatedAtVote === null ||
            civil.eliminatedAtVote > evil.eliminatedAtVote!
        return civilWasAlive ? pts + CIVIL_CORRECT_ELIMINATION : pts
    }, 0)

    let winBonus = 0
    if (civilsWin) {
        winBonus = civil.eliminatedAtVote === null ? CIVIL_WIN_ALIVE : CIVIL_WIN_ELIMINATED
    }

    return { deduction, winBonus }
}

const getEvilScore = (
    evil: PlayerRound,
    civilPlayers: PlayerRound[],
    evilWins: boolean,
    mrWhiteGuessedCorrectly: boolean,
): { deception: number; winBonus: number } => {
    if (evil.isMrWhite && mrWhiteGuessedCorrectly) {
        return { deception: 0, winBonus: MR_WHITE_CORRECT_GUESS }
    }

    const deception = civilPlayers.reduce((pts, civil) => {
        if (civil.eliminatedAtVote === null) return pts
        const evilWasAlive =
            evil.eliminatedAtVote === null ||
            evil.eliminatedAtVote > civil.eliminatedAtVote!
        return evilWasAlive ? pts + UNDERCOVER_DECEPTION : pts
    }, 0)

    const winBonus = evilWins ? UNDERCOVER_WIN : 0

    return { deception, winBonus }
}

export const Conclusion: React.FC = () => {
    const state = useStoreState()
    const dispatcher = useStoreDispatch()
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()

    const civilsAlive = useMemo(() => getCivilsAlive(roundState.players), [roundState.players])
    const undercoversAlive = useMemo(
        () => getUndercoverAlive(roundState.players),
        [roundState.players],
    )

    const civilsWins = useMemo(() => isCivilsWin(undercoversAlive), [undercoversAlive])
    const undercoverWins = useMemo(
        () => isUndercoversWin(undercoversAlive, civilsAlive),
        [undercoversAlive, civilsAlive],
    )
    const evilWins = undercoverWins || roundState.mrWhiteGuessedCorrectly

    const civilPlayers = useMemo(
        () => roundState.players.filter(p => !p.isUndercover && !p.isMrWhite),
        [roundState.players],
    )
    const evilPlayers = useMemo(
        () => roundState.players.filter(p => p.isUndercover || p.isMrWhite),
        [roundState.players],
    )

    const roundScores = useMemo(() => {
        return roundState.players.map(player => {
            const isEvil = player.isUndercover || player.isMrWhite

            if (isEvil) {
                const { deception, winBonus } = getEvilScore(
                    player,
                    civilPlayers,
                    evilWins,
                    roundState.mrWhiteGuessedCorrectly,
                )
                return { playerName: player.name, deception, winBonus, amount: deception + winBonus }
            }

            const { deduction, winBonus } = getCivilScore(player, evilPlayers, civilsWins)
            return { playerName: player.name, deception: deduction, winBonus, amount: deduction + winBonus }
        })
    }, [
        roundState.players,
        roundState.mrWhiteGuessedCorrectly,
        evilWins,
        civilsWins,
        civilPlayers,
        evilPlayers,
    ])

    useEffect(() => {
        if (roundState.scoreAdded) return

        roundDispatch({ type: "SET_SCORE_ADDED" })
        dispatcher({
            type: "ADD_SCORE",
            score: roundScores.map(({ playerName, amount }) => ({ playerName, amount })),
        })
    }, [roundState.scoreAdded, roundScores])

    const sortedPlayers = useMemo(
        () => [...state.players].sort((a, b) => b.score - a.score),
        [state.players],
    )

    const outcomeLabel = roundState.mrWhiteGuessedCorrectly
        ? "Mr White guessed the word!"
        : civilsWins
          ? "Civils won!"
          : "Undercovers won!"

    const outcomeColor = civilsWins ? "bg-purple-600" : "bg-orange-500"

    return (
        <div className="flex-grow flex flex-col gap-2 py-4">
            <div>
                <div className="container mx-auto px-2 flex justify-end">
                    <button
                        className="flex items-center gap-4 rounded-full px-6 py-2 bg-brand text-white text-sm font-bold"
                        onClick={() => roundDispatch({ type: "NEXT_STEP" })}
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
                        const deception = rs?.deception ?? 0
                        const winBonus = rs?.winBonus ?? 0

                        const roundPlayer = roundState.players.find(
                            p => p.name === player.name,
                        )
                        const isEvil = roundPlayer?.isUndercover || roundPlayer?.isMrWhite
                        const isMrWhiteWin =
                            roundPlayer?.isMrWhite && roundState.mrWhiteGuessedCorrectly

                        return (
                            <div
                                key={player.name}
                                className="flex items-center bg-white dark:bg-gray-800 rounded-md py-3 px-4 border border-gray-200 dark:border-gray-700 animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="w-7 text-sm font-bold text-gray-400 dark:text-gray-500 shrink-0">
                                    #{index + 1}
                                </div>
                                <div className="flex-grow">
                                    <div className="font-medium">{player.name}</div>
                                    {gained > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {isMrWhiteWin && "word guessed"}
                                            {!isMrWhiteWin && deception > 0 && (
                                                <span>
                                                    {isEvil
                                                        ? `${deception / UNDERCOVER_DECEPTION} fooled`
                                                        : `${deception / CIVIL_CORRECT_ELIMINATION} caught`}
                                                </span>
                                            )}
                                            {!isMrWhiteWin && deception > 0 && winBonus > 0 && (
                                                <span className="mx-1">·</span>
                                            )}
                                            {!isMrWhiteWin && winBonus > 0 && <span>win bonus</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {gained > 0 ? (
                                        <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                            +{gained}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400 px-2 py-0.5">
                                            +0
                                        </span>
                                    )}
                                    <div className="text-sm font-bold w-16 text-right">
                                        {player.score} pts
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
