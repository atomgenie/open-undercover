import { PlayerRound } from "types/player"
import { Avatar } from "components/ui/Avatar"

interface props {
    player: PlayerRound
    selected: boolean
    disabled: boolean
    onSelect: () => void
}

export const getRoleLabel = (player: PlayerRound) =>
    player.isMrWhite ? "Mr. White" : player.isUndercover ? "Undercover" : "Civilian"

export const getRoleColor = (player: PlayerRound) =>
    player.isMrWhite
        ? "bg-pop-yellow"
        : player.isUndercover
          ? "bg-pop-red"
          : "bg-pop-mint"

export const VotePlayer: React.FC<props> = ({ player, selected, disabled, onSelect }) => {
    if (!player.alive) {
        return (
            <li className="pop-border rounded-[1.125rem] bg-surface-muted p-3 flex flex-col items-center gap-2 rotate-1 min-h-36 justify-center">
                <Avatar name={player.name} size="md" dimmed />
                <span className="font-extrabold text-muted line-through truncate max-w-full">
                    {player.name}
                </span>
                <span
                    className={`${getRoleColor(player)} text-ink border-2 border-ink rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider animate-stamp`}
                >
                    {getRoleLabel(player)}
                </span>
            </li>
        )
    }

    return (
        <li>
            <button
                className={`pop-card pop-press w-full p-3 flex flex-col items-center gap-2 min-h-36 justify-center transition-transform ${
                    selected
                        ? "bg-pop-yellow text-ink -translate-y-1 -rotate-1"
                        : "bg-surface text-fg"
                }`}
                onClick={onSelect}
                disabled={disabled}
                aria-pressed={selected}
            >
                <Avatar name={player.name} size="md" />
                <span className="font-extrabold truncate max-w-full">{player.name}</span>
                <span className={`text-xs font-bold ${selected ? "" : "text-muted"}`}>
                    {selected ? "Selected" : "Tap to vote"}
                </span>
            </button>
        </li>
    )
}
