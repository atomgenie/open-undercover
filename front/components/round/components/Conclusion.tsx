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
import { Avatar } from "components/ui/Avatar"
import { BottomBar } from "components/ui/BottomBar"
import { getRoleColor, getRoleLabel } from "./VotePlayer"

const MEDALS = ["🥇", "🥈", "🥉"]

const CIVIL_CORRECT_ELIMINATION = 20 // per undercover correctly identified while alive
const CIVIL_WIN_ALIVE = 20 // alive when civils win
const CIVIL_WIN_ELIMINATED = 5 // eliminated but team still won

const UNDERCOVER_DECEPTION = 15 // per civil outlasted
const UNDERCOVER_WIN = 30 // team wins

const MR_WHITE_CORRECT_GUESS = 100 // guessed the word correctly

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
        winBonus =
            civil.eliminatedAtVote === null ? CIVIL_WIN_ALIVE : CIVIL_WIN_ELIMINATED
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

    const civilsAlive = useMemo(
        () => getCivilsAlive(roundState.players),
        [roundState.players],
    )
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
                return {
                    playerName: player.name,
                    deception,
                    winBonus,
                    amount: deception + winBonus,
                }
            }

            const { deduction, winBonus } = getCivilScore(player, evilPlayers, civilsWins)
            return {
                playerName: player.name,
                deception: deduction,
                winBonus,
                amount: deduction + winBonus,
            }
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

    const outcome = roundState.mrWhiteGuessedCorrectly
        ? { title: "Mr. White guessed it!", emoji: "👻", color: "bg-pop-yellow" }
        : civilsWins
          ? { title: "Civilians win!", emoji: "🎉", color: "bg-pop-mint" }
          : { title: "Undercovers win!", emoji: "😈", color: "bg-pop-pink" }

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto">
                <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-6 flex flex-col gap-5">
                    <div
                        className={`pop-card ${outcome.color} text-ink p-5 flex flex-col items-center gap-3 text-center animate-pop-in`}
                    >
                        <span className="text-5xl" aria-hidden="true">
                            {outcome.emoji}
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight leading-none">
                            {outcome.title}
                        </h1>
                        <div className="flex items-center justify-center gap-2 flex-wrap mt-1">
                            <span className="bg-surface text-fg pop-border rounded-xl px-3 py-1 font-extrabold -rotate-2">
                                {roundState.validWord}
                            </span>
                            <span className="text-sm font-extrabold uppercase">vs</span>
                            <span className="bg-surface text-fg pop-border rounded-xl px-3 py-1 font-extrabold rotate-2">
                                {roundState.undercoverWord}
                            </span>
                        </div>
                        <div className="text-xs font-bold opacity-75">
                            Civilians&apos; word · Undercovers&apos; word
                        </div>
                    </div>

                    <section className="flex flex-col gap-3" aria-label="Scoreboard">
                        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted">
                            Scoreboard
                        </h2>
                        <ol className="flex flex-col gap-2.5">
                            {sortedPlayers.map((player, index) => {
                                const rs = roundScores.find(
                                    s => s.playerName === player.name,
                                )
                                const gained = rs?.amount ?? 0
                                const deception = rs?.deception ?? 0
                                const winBonus = rs?.winBonus ?? 0

                                const roundPlayer = roundState.players.find(
                                    p => p.name === player.name,
                                )
                                const isEvil =
                                    roundPlayer?.isUndercover || roundPlayer?.isMrWhite
                                const isMrWhiteWin =
                                    roundPlayer?.isMrWhite &&
                                    roundState.mrWhiteGuessedCorrectly

                                const details = [
                                    isMrWhiteWin && "word guessed",
                                    !isMrWhiteWin &&
                                        deception > 0 &&
                                        (isEvil
                                            ? `${deception / UNDERCOVER_DECEPTION} fooled`
                                            : `${deception / CIVIL_CORRECT_ELIMINATION} caught`),
                                    !isMrWhiteWin && winBonus > 0 && "win bonus",
                                ].filter(Boolean)

                                return (
                                    <li
                                        key={player.name}
                                        className={`pop-card flex items-center gap-3 py-2.5 pl-2.5 pr-3 animate-fade-in-up ${
                                            index === 0
                                                ? "bg-pop-yellow text-ink"
                                                : "bg-surface"
                                        }`}
                                        style={{
                                            animationDelay: `${0.15 + index * 0.06}s`,
                                        }}
                                    >
                                        <span className="w-8 text-center text-xl font-extrabold flex-shrink-0">
                                            {MEDALS[index] ?? (
                                                <span className="text-base opacity-60">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </span>
                                        <Avatar name={player.name} size="sm" />
                                        <div className="flex-grow min-w-0">
                                            <div className="font-extrabold truncate">
                                                {player.name}
                                            </div>
                                            {(isEvil || details.length > 0) && (
                                                <div
                                                    className={`flex flex-wrap items-center gap-x-1.5 min-w-0 text-xs font-semibold ${
                                                        index === 0
                                                            ? "opacity-80"
                                                            : "text-muted"
                                                    }`}
                                                >
                                                    {roundPlayer && isEvil && (
                                                        <span
                                                            className={`${getRoleColor(roundPlayer)} text-ink border-2 border-ink rounded-md px-1 text-[10px] leading-4 font-extrabold uppercase tracking-wider flex-shrink-0`}
                                                        >
                                                            {getRoleLabel(roundPlayer)}
                                                        </span>
                                                    )}
                                                    <span>{details.join(" · ")}</span>
                                                </div>
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-extrabold rounded-full px-2 py-0.5 flex-shrink-0 border-2 ${
                                                gained > 0
                                                    ? "bg-pop-mint text-ink border-ink"
                                                    : "border-transparent opacity-50"
                                            }`}
                                        >
                                            +{gained}
                                        </span>
                                        <span className="w-14 text-right font-extrabold tabular-nums flex-shrink-0">
                                            {player.score}
                                            <span className="text-xs font-bold opacity-60">
                                                {" "}
                                                pts
                                            </span>
                                        </span>
                                    </li>
                                )
                            })}
                        </ol>
                    </section>
                </div>
            </div>
            <BottomBar>
                <button
                    className="pop-border pop-shadow pop-press w-full h-14 rounded-2xl bg-pop-purple text-white flex items-center justify-center gap-3 text-lg font-extrabold uppercase tracking-wide"
                    onClick={() => roundDispatch({ type: "NEXT_STEP" })}
                >
                    <span>Next round</span>
                    <FiArrowRight strokeWidth={3} />
                </button>
            </BottomBar>
        </div>
    )
}
