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

const UNDERCOVER_MAX_SCORE = 80
const CIVIL_MAX_SCORE = 20

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

    useEffect(() => {
        if (roundState.scoreAdded) {
            return
        }

        roundDispatch({
            type: "SET_SCORE_ADDED",
        })

        const scores: { playerName: string; amount: number }[] = roundState.players.map(
            player => {
                if (player.isUndercover) {
                    return {
                        playerName: player.name,
                        amount: undercoverWins ? UNDERCOVER_MAX_SCORE : 0,
                    }
                } else {
                    return {
                        playerName: player.name,
                        amount: civilsWins ? CIVIL_MAX_SCORE : 0,
                    }
                }
            },
        )

        dispatcher({
            type: "ADD_SCORE",
            score: scores,
        })
    }, [roundState.players, roundState.scoreAdded, undercoverWins, civilsWins])

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
            <div>
                <div className="flex flex-col gap-2 container mx-auto px-2 mt-4">
                    {state.players
                        .sort((playerA, playerB) => playerB.score - playerA.score)
                        .map(player => (
                            <div
                                key={player.name}
                                className="flex items-center bg-white dark:bg-gray-800 rounded-md py-4 px-4 border dark:border-gray-700"
                            >
                                <div>{player.name}</div>
                                <div className="flex-grow"></div>
                                <div>{player.score} pts</div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
