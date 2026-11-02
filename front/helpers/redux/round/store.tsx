import {
    createContext,
    Dispatch,
    PropsWithChildren,
    Reducer,
    useContext,
    useReducer,
} from "react"
import { PlayerRound } from "types/player"
import { ActionsRound, ROUND_STEP } from "./actions"
import { getCivilsAlive, getUndercoverAlive, isEnd } from "helpers/undercover"

export interface RoundState {
    roundStep: ROUND_STEP
    players: PlayerRound[]
    validWord: string
    undercoverWord: string
    wordPairIndex: number
    validWordIndex: 0 | 1
    voteNuber: number
    isEnd: boolean
    scoreAdded: boolean
    mrWhiteGuessing: string | null
    /** Mr. White found the civilians' word (earns the guess bonus) */
    mrWhiteGuessedCorrectly: boolean
    /** Mr. White's correct guess ended the round with a Mr. White win */
    mrWhiteWin: boolean
    /** Snapshot of the game setting, taken when the round starts */
    continueAfterMrWhiteGuess: boolean
}

const initalState: RoundState = {
    roundStep: ROUND_STEP.INITIALISATION,
    players: [],
    validWord: "",
    undercoverWord: "",
    wordPairIndex: 0,
    validWordIndex: 0,
    voteNuber: 0,
    isEnd: false,
    scoreAdded: false,
    mrWhiteGuessing: null,
    mrWhiteGuessedCorrectly: false,
    mrWhiteWin: false,
    continueAfterMrWhiteGuess: false,
}

const StoreRoundContext = createContext<{
    state: RoundState
    dispatcher: Dispatch<ActionsRound>
}>({
    state: initalState,
    dispatcher: () => {},
})

const getNextRoundStep = (step: ROUND_STEP): ROUND_STEP => {
    switch (step) {
        case ROUND_STEP.INITIALISATION:
            return ROUND_STEP.DISTRIBUTION
        case ROUND_STEP.DISTRIBUTION:
            return ROUND_STEP.VOTE
        case ROUND_STEP.VOTE:
            return ROUND_STEP.CONCLUSION
        case ROUND_STEP.CONCLUSION:
            return ROUND_STEP.INITIALISATION
    }
}

const reducer: Reducer<RoundState, ActionsRound> = (state, action) => {
    let newState: RoundState = state

    switch (action.type) {
        case "SET_PLAYERS_ROUND":
            newState = {
                ...state,
                players: action.players.map(p => ({ ...p, eliminatedAtVote: null })),
            }
            break
        case "NEXT_STEP":
            newState = {
                ...state,
                roundStep: getNextRoundStep(state.roundStep),
            }
            break
        case "SET_WORDS":
            newState = {
                ...state,
                undercoverWord: action.undercoverWord,
                validWord: action.validWord,
                wordPairIndex: action.wordPairIndex,
                validWordIndex: action.validWordIndex,
            }
            break
        case "SET_RULES":
            newState = {
                ...state,
                continueAfterMrWhiteGuess: action.continueAfterMrWhiteGuess,
            }
            break
        case "KILL_PLAYER":
            if (!state.isEnd) {
                const killedPlayer = state.players.find(p => p.name === action.playerName)
                const newPlayers = state.players.map(player => {
                    if (player.name !== action.playerName) {
                        return player
                    }

                    return {
                        ...player,
                        alive: false,
                        eliminatedAtVote: state.voteNuber,
                    }
                })
                newState = {
                    ...state,
                    players: newPlayers,
                    mrWhiteGuessing: killedPlayer?.isMrWhite ? killedPlayer.name : null,
                }
            } else {
                newState = state
            }
            break
        case "INCR_VOTE_NB":
            newState = {
                ...state,
                voteNuber: state.voteNuber + 1,
            }
            break
        case "RESET":
            newState = initalState
            break
        case "SET_SCORE_ADDED":
            newState = {
                ...state,
                scoreAdded: true,
            }
            break
        case "MW_GUESS_CORRECT":
            if (state.continueAfterMrWhiteGuess) {
                // Mr. White keeps the bonus, but the round goes on as usual
                newState = {
                    ...state,
                    mrWhiteGuessing: null,
                    mrWhiteGuessedCorrectly: true,
                }
                break
            }

            newState = {
                ...state,
                mrWhiteGuessing: null,
                mrWhiteGuessedCorrectly: true,
                mrWhiteWin: true,
                isEnd: true,
            }
            return newState
        case "MW_GUESS_WRONG":
            newState = {
                ...state,
                mrWhiteGuessing: null,
            }
            break
    }

    if (newState.players.length > 0 && !newState.mrWhiteGuessing) {
        const civilsAlives = getCivilsAlive(newState.players)
        const undercoversAlives = getUndercoverAlive(newState.players)

        newState = {
            ...newState,
            isEnd: isEnd(undercoversAlives, civilsAlives),
        }
    }

    return newState
}

export const StoreRoundProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initalState)

    return (
        <StoreRoundContext.Provider value={{ state, dispatcher: dispatch }}>
            {children}
        </StoreRoundContext.Provider>
    )
}

export const useRoundDispatcher = () => {
    const { dispatcher } = useContext(StoreRoundContext)
    return dispatcher
}

export const useRoundState = () => {
    const { state } = useContext(StoreRoundContext)
    return state
}
