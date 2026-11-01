import { useStoreState } from "helpers/redux"

/** Live breakdown of the teams for the current setup */
export const TeamSummary: React.FC = () => {
    const { players, undercovers, mrWhite } = useStoreState()
    const civilians = players.length - undercovers - (mrWhite ? 1 : 0)

    const chips = [
        {
            label: `${civilians} civilian${civilians > 1 ? "s" : ""}`,
            color: "bg-pop-mint",
        },
        {
            label: `${undercovers} undercover${undercovers > 1 ? "s" : ""}`,
            color: "bg-pop-pink",
        },
        ...(mrWhite ? [{ label: "1 Mr. White", color: "bg-pop-yellow" }] : []),
    ]

    return (
        <div
            className="flex flex-wrap justify-center gap-2"
            aria-label="Team composition"
        >
            {chips.map(chip => (
                <span
                    key={chip.label}
                    className={`${chip.color} text-ink border-2 border-ink rounded-full px-2.5 py-0.5 text-xs font-extrabold`}
                >
                    {chip.label}
                </span>
            ))}
        </div>
    )
}
