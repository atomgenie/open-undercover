import { getInitials } from "helpers/player"
import { useStoreDispatch } from "helpers/redux"
import { FiX } from "react-icons/fi"
import { Player } from "types/player"

interface props {
    player: Player
}

export const PlayerCard: React.FC<props> = ({ player }) => {
    const dispatch = useStoreDispatch()

    return (
        <div className="h-80 w-64 bg-gray-200 dark:bg-gray-900 border dark:border-gray-700 rounded-md flex flex-col justify-center items-center p-4 relative">
            <div className="text-center flex flex-col items-center gap-4">
                <div className="h-24 w-24 bg-gray-300 dark:bg-gray-800 rounded-full flex items-center justify-center text-4xl font-bold">
                    {getInitials(player.name)}
                </div>
                <div>{player.name}</div>
            </div>
            <button
                className="absolute top-2 right-2 flex items-center justify-center text-2xl"
                onClick={() =>
                    dispatch({
                        type: "DELETE_PLAYER",
                        playerName: player.name,
                    })
                }
            >
                <FiX />
            </button>
        </div>
    )
}
