import { useStoreDispatch } from "helpers/redux"
import { FiX } from "react-icons/fi"
import { Player } from "types/player"
import { Avatar } from "components/ui/Avatar"

interface props {
    player: Player
}

/** Removable player chip shown on the setup screen */
export const PlayerCard: React.FC<props> = ({ player }) => {
    const dispatch = useStoreDispatch()

    return (
        <li className="pop-border pop-shadow-sm bg-surface rounded-full flex items-center gap-2 pl-1 pr-1 py-1 max-w-full animate-pop-in">
            <Avatar name={player.name} size="xs" />
            <span className="font-bold truncate min-w-0">{player.name}</span>
            <button
                className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-muted hover:text-fg hover:bg-surface-muted"
                onClick={() =>
                    dispatch({
                        type: "DELETE_PLAYER",
                        playerName: player.name,
                    })
                }
                aria-label={`Remove ${player.name}`}
            >
                <FiX />
            </button>
        </li>
    )
}
