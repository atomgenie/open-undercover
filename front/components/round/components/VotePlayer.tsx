import { getInitials } from "helpers/player"
import { useRoundDispatcher } from "helpers/redux/round"
import { FiX } from "react-icons/fi"
import { PlayerRound } from "types/player"

interface props {
    player: PlayerRound
}

export const VotePlayer: React.FC<props> = ({ player }) => {
    const roundDispatcher = useRoundDispatcher()

    return (
        <div
            key={player.name}
            className="w-64 h-80 bg-gray-200 dark:bg-gray-800 rounded-md flex flex-col items-center gap-2 p-8"
        >
            <div className="bg-gray-300 dark:bg-gray-900 h-24 w-24 rounded-full flex items-center justify-center text-4xl font-bold">
                <div>{getInitials(player.name)}</div>
            </div>
            <div className="text-lg">{player.name}</div>
            <div className={`flex justify-center mt-4`}>
                {player.alive && (
                    <div className="text-center flex flex-col items-center">
                        <button
                            className="h-8 w-8 bg-gray-300 dark:bg-gray-900 rounded-full flex items-center justify-center text-xl"
                            onClick={() => {
                                if (!player.alive) {
                                    return
                                }

                                roundDispatcher({
                                    type: "INCR_VOTE_NB",
                                })

                                roundDispatcher({
                                    type: "KILL_PLAYER",
                                    playerName: player.name,
                                })
                            }}
                            disabled={!player.alive}
                        >
                            <FiX />
                        </button>
                        <div className="text-sm mt-1">Eject</div>
                    </div>
                )}
                {!player.alive && (
                    <div>
                        {player.name} was{" "}
                        <b className="text-brand dark:text-brand-light">
                            {player.isMrWhite
                                ? "Mister White"
                                : player.isUndercover
                                  ? "Undercover"
                                  : "a civil"}
                        </b>
                    </div>
                )}
            </div>
        </div>
    )
}
