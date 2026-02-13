import { getInitials } from "helpers/player"
import { useStoreState } from "helpers/redux"
import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { useEffect, useMemo, useState } from "react"
import { FiArrowRight } from "react-icons/fi"
import { PlayerRound } from "types/player"

const STEPS_PER_PLAYER = 2

export const Distribution: React.FC = () => {
    const { players, undercovers, mrWhite } = useStoreState()
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()

    /** if 0: show the player 0 without his word. If 1, show the player 0 with his word
     *  if 2: show the player 1 without his word. If 3, show the player 1 with his card
     *  ...etc
     */
    const [showPlayer, setShowPlayer] = useState(0)

    const mrWhitePlayer: string | null = useMemo(() => {
        if (!mrWhite) return null
        const idx = Math.trunc(Math.random() * players.length)
        return players[idx].name
    }, [players, mrWhite])

    const undercoversRound: string[] = useMemo(() => {
        let allPlayers = players
            .map(player => player.name)
            .filter(name => name !== mrWhitePlayer)

        let selectedPlayers: string[] = []

        for (let i = 0; i < undercovers; i++) {
            if (allPlayers.length === 0) {
                break
            }

            const selected = Math.trunc(Math.random() * allPlayers.length)
            const seletedPlayerName = allPlayers[selected]
            selectedPlayers = [...selectedPlayers, seletedPlayerName]
            allPlayers = allPlayers.filter(player => player !== seletedPlayerName)
        }

        return selectedPlayers
    }, [players, undercovers, mrWhitePlayer])

    const playersWithWord = useMemo((): PlayerRound[] => {
        return players.map(player => {
            const isUndercover = undercoversRound.some(name => player.name === name)
            const isMrWhite = player.name === mrWhitePlayer
            return {
                alive: true,
                card: isMrWhite ? "" : isUndercover ? roundState.undercoverWord : roundState.validWord,
                isUndercover: isUndercover,
                isMrWhite: isMrWhite,
                name: player.name,
            }
        })
    }, [players, undercoversRound, mrWhitePlayer, roundState.undercoverWord, roundState.validWord])

    useEffect(() => {
        roundDispatch({
            type: "SET_PLAYERS_ROUND",
            players: playersWithWord,
        })
    }, [playersWithWord])

    const currentPlayer = useMemo(() => {
        if (roundState.players.length < Math.trunc(showPlayer / STEPS_PER_PLAYER)) {
            return undefined
        }

        return roundState.players[Math.trunc(showPlayer / STEPS_PER_PLAYER)]
    }, [roundState.players, showPlayer])

    const handleNext = () => {
        if (showPlayer >= roundState.players.length * STEPS_PER_PLAYER - 1) {
            roundDispatch({
                type: "NEXT_STEP",
            })
            return
        }

        setShowPlayer(showPlayer + 1)
    }

    if (!currentPlayer) {
        return (
            <div className="flex-grow flex items-center justify-center">Loading...</div>
        )
    }

    return (
        <div className="flex-grow">
            <div className="container mx-auto px-2">
                <div className="flex justify-center">
                    <div
                        className="px-4 py-8 bg-brand rounded-md my-4 shadow flex-grow max-w-sm flex flex-col items-center gap-4"
                        style={{ minHeight: 500 }}
                    >
                        {showPlayer % STEPS_PER_PLAYER === 0 && (
                            <>
                                <div className="bg-brand-dark text-white text-4xl h-28 w-28 rounded-full flex items-center justify-center font-bold">
                                    {getInitials(currentPlayer.name)}
                                </div>
                                <div className="text-center text-white text-2xl font-bold text-opacity-90">
                                    {currentPlayer.name}
                                </div>
                                <div className="text-white text-opacity-70 text-sm">
                                    Give this device to{" "}
                                    <b className="text-white">{currentPlayer.name}</b>
                                </div>
                                <div className="flex-grow"></div>
                                <button
                                    className="flex items-center text-white font-bold gap-4 bg-brand-dark rounded-full px-8 py-2 mt-8"
                                    onClick={handleNext}
                                >
                                    <div>Next</div>
                                    <FiArrowRight />
                                </button>
                            </>
                        )}
                        {showPlayer % STEPS_PER_PLAYER === 1 && (
                            <>
                                <div className="bg-brand-dark text-white text-4xl h-28 w-28 rounded-full flex items-center justify-center font-bold">
                                    {getInitials(currentPlayer.name)}
                                </div>
                                <div className="text-center text-white text-2xl font-bold text-opacity-90">
                                    {currentPlayer.name}
                                </div>
                                {currentPlayer.isMrWhite ? (
                                    <>
                                        <div className="text-white text-opacity-70 text-sm">
                                            You are
                                        </div>
                                        <div className="text-3xl text-white font-bold text-center mt-4">
                                            Mister White
                                        </div>
                                        <div className="text-white text-opacity-70 text-sm text-center">
                                            You have no word. Try to blend in!
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-white text-opacity-70 text-sm">
                                            This is your word
                                        </div>
                                        <div className="text-3xl text-white font-bold text-center mt-4">
                                            {currentPlayer.card}
                                        </div>
                                    </>
                                )}
                                <div className="flex-grow"></div>
                                <button
                                    className="flex items-center text-white font-bold gap-4 bg-brand-dark rounded-full px-8 py-2 mt-8"
                                    onClick={handleNext}
                                >
                                    <div>OK</div>
                                    <FiArrowRight />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
