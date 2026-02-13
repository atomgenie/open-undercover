import { useStoreDispatch, useStoreState } from "helpers/redux"
import { useMemo, useState } from "react"
import { FiArrowRight, FiPlus, FiUser } from "react-icons/fi"
import { PlayerCard } from "./components/PlayerCard"
import { MrWhiteToggle } from "./components/MrWhiteToggle"
import { Undercovers } from "./components/Undercovers"

export const GameInit: React.FC = () => {
    const state = useStoreState()
    const dispatch = useStoreDispatch()

    const [name, setName] = useState("")

    const isNameValid = useMemo((): boolean => {
        if (name === "") {
            return false
        }

        for (const player of state.players) {
            if (player.name === name) {
                return false
            }
        }

        return true
    }, [name, state.players])

    const handleAddPlayer = () => {
        if (!isNameValid) {
            return
        }

        dispatch({
            type: "ADD_PLAYER",
            player: { name, score: 0 },
        })

        setName("")
    }

    const canStart = useMemo(() => {
        const enemies = state.undercovers + (state.mrWhite ? 1 : 0)
        const civils = state.players.length - enemies
        return state.players.length >= 3 && civils > enemies
    }, [state.players.length, state.undercovers, state.mrWhite])

    const handleStart = () => {
        if (!canStart) {
            return
        }

        dispatch({
            type: "START",
        })
    }

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto flex-shrink">
                <div className="container mx-auto px-2">
                    <div className="flex gap-4 flex-wrap justify-center sm:justify-start py-8">
                        <div className="h-80 w-64 bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 rounded-md flex flex-col justify-center items-center px-4 py-4">
                            <form
                                className="flex flex-col gap-4 items-center"
                                onSubmit={e => {
                                    e.preventDefault()
                                    handleAddPlayer()
                                }}
                            >
                                <div className="w-28 h-28 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-4xl">
                                    <FiUser />
                                </div>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className="border w-full rounded-full py-2 px-4 text-sm outline-none dark:bg-gray-700 dark:border-gray-600"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Player name"
                                />
                                <button
                                    className={`flex items-center gap-2 py-2 px-4 rounded-full bg-gray-100 border dark:bg-gray-700 dark:border-gray-600 ${
                                        !isNameValid ? "opacity-20 cursor-default" : ""
                                    }`}
                                    disabled={!isNameValid}
                                    onClick={() => handleAddPlayer()}
                                    type="submit"
                                >
                                    <FiPlus className="text-2xl" />
                                    <div>Add one player</div>
                                </button>
                            </form>
                        </div>
                        {state.players.map(player => (
                            <PlayerCard key={player.name} player={player} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-shrink-0 bg-brand">
                <div className="container mx-auto flex items-center gap-4 px-2">
                    <div className="bg-brand-dark rounded-full my-3 px-6 py-2 text-sm flex-shrink-0">
                        <span className="font-bold text-white">
                            {state.players.length}
                        </span>{" "}
                        <span className="text-white text-opacity-75">
                            player
                            {state.players.length > 1 && "s"}
                        </span>
                    </div>
                    <div className="flex-grow flex-shrink hidden md:block"></div>
                    <Undercovers />
                    <MrWhiteToggle />
                    <button
                        className={`rounded-full bg-brand-dark my-3 px-8 py-2 flex text-white items-center gap-4 font-bold text-sm ${
                            !canStart ? "opacity-20" : ""
                        }`}
                        disabled={!canStart}
                        onClick={handleStart}
                    >
                        <div>Start</div>
                        <FiArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}
