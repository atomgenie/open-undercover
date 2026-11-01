import { useStoreDispatch, useStoreState } from "helpers/redux"
import { useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { Language, LANGUAGE_LABELS, WORDS } from "helpers/words"
import { useEffect, useMemo, useRef, useState } from "react"
import { FiCheck, FiEye } from "react-icons/fi"
import { Avatar } from "components/ui/Avatar"
import { BottomBar } from "components/ui/BottomBar"
import { PlayerRound } from "types/player"

const STEPS_PER_PLAYER = 2

export const Distribution: React.FC = () => {
    const { players, undercovers, mrWhite } = useStoreState()
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()
    const storeDispatch = useStoreDispatch()

    /** if 0: show the player 0 without his word. If 1, show the player 0 with his word
     *  if 2: show the player 1 without his word. If 3, show the player 1 with his word
     *  ...etc
     */
    const [showPlayer, setShowPlayer] = useState(0)

    // Capture the player list once at mount so language changes don't re-randomize roles.
    const initialPlayers = useRef(players)

    // Compute role assignments once at mount — must not re-run when language changes.
    const [[mrWhitePlayer, undercoversRound]] = useState<[string | null, string[]]>(
        () => {
            const pool = initialPlayers.current
            const mw = mrWhite ? pool[Math.trunc(Math.random() * pool.length)].name : null

            let remaining = pool.map(p => p.name).filter(n => n !== mw)
            let selected: string[] = []

            for (let i = 0; i < undercovers; i++) {
                if (remaining.length === 0) break
                const idx = Math.trunc(Math.random() * remaining.length)
                const name = remaining[idx]
                selected = [...selected, name]
                remaining = remaining.filter(p => p !== name)
            }

            return [mw, selected]
        },
    )

    const playersWithWord = useMemo((): PlayerRound[] => {
        return initialPlayers.current.map(player => {
            const isUndercover = undercoversRound.some(name => player.name === name)
            const isMrWhite = player.name === mrWhitePlayer
            return {
                alive: true,
                eliminatedAtVote: null,
                isUndercover: isUndercover,
                isMrWhite: isMrWhite,
                name: player.name,
            }
        })
    }, [undercoversRound, mrWhitePlayer, roundState.undercoverWord, roundState.validWord])

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

    const currentPlayerGlobal = useMemo(() => {
        if (!currentPlayer) return undefined
        return players.find(p => p.name === currentPlayer.name)
    }, [currentPlayer, players])

    const currentLanguage: Language = currentPlayerGlobal?.language ?? "fr"

    const getWordInLanguage = (lang: Language): string => {
        if (!currentPlayer || currentPlayer.isMrWhite) return ""
        const pair = WORDS[roundState.wordPairIndex]
        const idx = currentPlayer.isUndercover
            ? 1 - roundState.validWordIndex
            : roundState.validWordIndex
        return pair[lang][idx]
    }

    const handleLanguageChange = (lang: Language) => {
        if (!currentPlayer) return
        storeDispatch({
            type: "SET_PLAYER_LANGUAGE",
            playerName: currentPlayer.name,
            language: lang,
        })
    }

    const handleNext = () => {
        if (showPlayer >= roundState.players.length * STEPS_PER_PLAYER - 1) {
            roundDispatch({
                type: "NEXT_STEP",
            })
            return
        }

        setShowPlayer(showPlayer + 1)
    }

    const handleHide = () => {
        if (showPlayer % STEPS_PER_PLAYER === 1) {
            setShowPlayer(showPlayer - 1)
        }
    }

    if (!currentPlayer) {
        return (
            <div className="flex-grow flex items-center justify-center text-muted font-bold">
                Shuffling roles…
            </div>
        )
    }

    const playerIndex = Math.trunc(showPlayer / STEPS_PER_PLAYER)
    const isFlipped = showPlayer % STEPS_PER_PLAYER === 1
    const isLastPlayer = playerIndex === roundState.players.length - 1

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto flex flex-col">
                <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-2 flex-grow flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-ink text-paper dark:bg-fg dark:text-ink rounded-full px-3 py-0.5 text-sm font-extrabold flex-shrink-0">
                            {playerIndex + 1} / {roundState.players.length}
                        </span>
                        <div className="flex-grow flex gap-1" aria-hidden="true">
                            {roundState.players.map((player, index) => (
                                <div
                                    key={player.name}
                                    className={`h-2 flex-1 rounded-full border-2 border-ink transition-colors ${
                                        index < playerIndex
                                            ? "bg-pop-mint"
                                            : index === playerIndex
                                              ? "bg-pop-yellow"
                                              : "bg-surface"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        key={playerIndex}
                        className={`flip-card flex-grow min-h-[24rem] animate-pop-in ${
                            isFlipped ? "is-flipped" : ""
                        }`}
                    >
                        <div className="flip-card-inner">
                            <button
                                className="flip-card-face pop-card bg-surface text-fg flex flex-col items-center justify-center gap-4 p-6 text-center w-full"
                                onClick={handleNext}
                                aria-label={`Reveal ${currentPlayer.name}'s word`}
                                tabIndex={isFlipped ? -1 : 0}
                                aria-hidden={isFlipped}
                            >
                                <span className="text-xs font-extrabold uppercase tracking-widest text-muted">
                                    Pass the phone to
                                </span>
                                <Avatar
                                    name={currentPlayer.name}
                                    size="xl"
                                    className="pop-shadow"
                                />
                                <span className="text-4xl font-extrabold tracking-tight break-words max-w-full">
                                    {currentPlayer.name}
                                </span>
                                <span className="text-muted font-semibold">
                                    Make sure nobody else is looking 👀
                                </span>
                                <span className="mt-4 bg-pop-yellow text-ink border-2 border-ink rounded-full px-4 py-1.5 font-extrabold text-sm animate-wiggle">
                                    Tap to flip the card
                                </span>
                            </button>

                            <div
                                className="flip-card-face flip-card-back pop-card bg-pop-yellow text-ink flex flex-col items-center justify-center gap-5 p-6 text-center cursor-pointer"
                                onClick={handleHide}
                                aria-hidden={!isFlipped}
                            >
                                {isFlipped && currentPlayer.isMrWhite && (
                                    <>
                                        <span className="text-xs font-extrabold uppercase tracking-widest">
                                            {currentPlayer.name}, you are
                                        </span>
                                        <span className="bg-surface text-fg pop-border pop-shadow rounded-2xl px-5 py-2 text-4xl font-extrabold tracking-tight rotate-2">
                                            Mr. White
                                        </span>
                                        <span className="font-bold max-w-64">
                                            You have no word. Listen closely and blend in!
                                        </span>
                                    </>
                                )}
                                {isFlipped && !currentPlayer.isMrWhite && (
                                    <>
                                        <span className="text-xs font-extrabold uppercase tracking-widest">
                                            {currentPlayer.name}, your secret word
                                        </span>
                                        <span className="bg-surface text-fg pop-border pop-shadow rounded-2xl px-5 py-2 text-4xl font-extrabold tracking-tight rotate-2 break-words max-w-full">
                                            {getWordInLanguage(currentLanguage)}
                                        </span>
                                        <div
                                            className="flex gap-2"
                                            role="group"
                                            aria-label="Word language"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {(["fr", "en", "es"] as Language[]).map(
                                                lang => (
                                                    <button
                                                        key={lang}
                                                        className={`h-9 min-w-12 px-3 rounded-full border-2 border-ink text-sm font-extrabold pop-press ${
                                                            currentLanguage === lang
                                                                ? "bg-ink text-pop-yellow"
                                                                : "bg-surface text-fg"
                                                        }`}
                                                        aria-pressed={
                                                            currentLanguage === lang
                                                        }
                                                        onClick={() =>
                                                            handleLanguageChange(lang)
                                                        }
                                                    >
                                                        {LANGUAGE_LABELS[lang]}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </>
                                )}
                                <span className="text-sm font-bold opacity-70">
                                    Tap the card to hide it
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar>
                <button
                    className={`pop-border pop-shadow pop-press w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-lg font-extrabold uppercase tracking-wide ${
                        isFlipped ? "bg-pop-mint text-ink" : "bg-pop-purple text-white"
                    }`}
                    onClick={handleNext}
                >
                    {!isFlipped && (
                        <>
                            <FiEye />
                            <span>Show my word</span>
                        </>
                    )}
                    {isFlipped && (
                        <>
                            <FiCheck strokeWidth={3} />
                            <span>
                                {isLastPlayer ? "Got it, let's vote" : "Got it, next"}
                            </span>
                        </>
                    )}
                </button>
            </BottomBar>
        </div>
    )
}
