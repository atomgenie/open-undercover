import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { useMemo } from "react"
import { VotePlayer } from "./VotePlayer"
import {
    getCivilsAlive,
    getUndercoverAlive,
    isCivilsWin,
    isUndercoversWin,
} from "helpers/undercover"

export const Vote: React.FC = () => {
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()

    const rndIndex = useMemo(() => {
        return Math.trunc(Math.random() * roundState.players.length)
    }, [roundState.players.length])

    const playerStart = useMemo(() => {
        return roundState.players[rndIndex]
    }, [roundState.players, rndIndex])

    const nbUndercoversAlive = useMemo(() => {
        return getUndercoverAlive(roundState.players)
    }, [roundState.players])

    const nbCivilsAlive = useMemo(() => {
        return getCivilsAlive(roundState.players)
    }, [roundState.players])

    const isLoose = useMemo(() => {
        return isUndercoversWin(nbUndercoversAlive, nbCivilsAlive)
    }, [nbCivilsAlive, nbUndercoversAlive])

    const isWin = useMemo(() => {
        return isCivilsWin(nbUndercoversAlive)
    }, [nbUndercoversAlive])

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-gray-200 dark:bg-black">
                <div className="container mx-auto px-2 text-sm py-2">
                    <b>{nbUndercoversAlive}</b> Undercover alive
                </div>
            </div>
            <div className="flex-grow flex-shrink overflow-y-auto">
                <div className="container mx-auto px-2 flex flex-col gap-6">
                    <div className="flex justify-center mt-6 sticky top-6">
                        <div className="bg-white dark:bg-black rounded-full text-brand dark:text-white shadow px-6 py-2 flex items-center gap-4">
                            {isLoose && (
                                <>
                                    <div>Undercovers wins</div>
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
