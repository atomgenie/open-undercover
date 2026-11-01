import { getAvatarColor, getInitials } from "helpers/player"
import { useStoreState } from "helpers/redux"
import { useMemo } from "react"

const SIZES = {
    xs: "h-7 w-7 text-xs border-2",
    sm: "h-9 w-9 text-sm border-2",
    md: "h-12 w-12 text-lg border-[2.5px]",
    lg: "h-20 w-20 text-3xl border-[2.5px]",
    xl: "h-28 w-28 text-5xl border-[3px]",
}

interface props {
    name: string
    size?: keyof typeof SIZES
    dimmed?: boolean
    className?: string
}

export const Avatar: React.FC<props> = ({
    name,
    size = "md",
    dimmed,
    className = "",
}) => {
    const { players } = useStoreState()
    const color = useMemo(
        () =>
            getAvatarColor(
                name,
                players.map(player => player.name),
            ),
        [name, players],
    )

    return (
        <div
            aria-hidden="true"
            className={`${SIZES[size]} flex-shrink-0 rounded-full border-ink text-ink font-extrabold flex items-center justify-center select-none ${
                dimmed ? "grayscale opacity-70" : ""
            } ${className}`}
            style={{ backgroundColor: color }}
        >
            {getInitials(name)}
        </div>
    )
}
