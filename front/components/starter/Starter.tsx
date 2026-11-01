import { useStoreDispatch } from "helpers/redux"
import { FiPlay } from "react-icons/fi"
import { InstallButton } from "components/header/InstallButton"
import { BottomBar } from "components/ui/BottomBar"

const STEPS = [
    {
        emoji: "🤫",
        title: "Get a secret word",
        text: "Everyone gets the same word… almost.",
    },
    { emoji: "🗣️", title: "Describe it", text: "One clue each. Don't give it away!" },
    {
        emoji: "🗳️",
        title: "Vote someone out",
        text: "Unmask the undercovers before it's too late.",
    },
]

const STEP_COLORS = ["bg-pop-yellow", "bg-pop-pink", "bg-pop-mint"]

export const Starter: React.FC = () => {
    const dispatch = useStoreDispatch()

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto">
                <div className="mx-auto w-full max-w-xl px-4 py-6 flex flex-col gap-8">
                    <div className="relative h-44 mt-2 animate-pop-in" aria-hidden="true">
                        <div className="pop-card absolute left-1/2 top-4 -translate-x-[92%] -rotate-8 w-40 h-32 bg-pop-pink flex items-center justify-start pl-3">
                            <span className="text-xl font-extrabold text-ink">
                                Croissant
                            </span>
                        </div>
                        <div className="pop-card absolute left-1/2 top-2 -translate-x-[8%] rotate-6 w-40 h-32 bg-pop-yellow flex items-center justify-center">
                            <span className="text-xl font-extrabold text-ink">
                                Brioche
                            </span>
                        </div>
                        <div className="pop-border pop-shadow-sm absolute left-1/2 bottom-0 -translate-x-1/2 bg-surface rounded-full h-16 w-16 flex items-center justify-center text-3xl animate-float">
                            🕵️
                        </div>
                    </div>

                    <div className="text-center flex flex-col gap-3 animate-fade-in-up">
                        <h1 className="text-5xl font-extrabold tracking-tighter leading-[0.95]">
                            Who's the{" "}
                            <span className="inline-block bg-pop-yellow text-ink px-2 rounded-xl pop-border -rotate-2">
                                spy
                            </span>
                            ?
                        </h1>
                        <p className="text-muted text-lg">
                            The party game of words, bluff and betrayal. One phone, 3+
                            friends.
                        </p>
                    </div>

                    <ol className="flex flex-col gap-3">
                        {STEPS.map((step, index) => (
                            <li
                                key={step.title}
                                className="pop-card bg-surface flex items-center gap-4 p-3 animate-fade-in-up"
                                style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                            >
                                <div
                                    className={`${STEP_COLORS[index]} pop-border rounded-xl h-12 w-12 flex-shrink-0 flex items-center justify-center text-2xl`}
                                >
                                    {step.emoji}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-extrabold">{step.title}</div>
                                    <div className="text-sm text-muted">{step.text}</div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            <BottomBar>
                <button
                    className="pop-border pop-shadow pop-press w-full h-14 rounded-2xl bg-pop-purple text-white flex items-center justify-center gap-3 text-lg font-extrabold uppercase tracking-wide"
                    onClick={() => {
                        dispatch({
                            type: "INIT",
                        })
                    }}
                >
                    <FiPlay className="fill-current" />
                    <span>Start a game</span>
                </button>
                <InstallButton />
            </BottomBar>
        </div>
    )
}
