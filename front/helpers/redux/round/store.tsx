import { createContext, Dispatch, Reducer, useContext, useReducer } from "react"
import { PlayerRound } from "types/player"
import { ActionsRound, ROUND_STEP } from "./actions"
import { getCivilsAlive, getUndercoverAlive, isEnd } from "helpers/undercover"

export interface RoundState {
    roundStep: ROUND_STEP
    players: PlayerRound[]
    validWord: string
    undercoverWord: string
    voteNuber: number
    isEnd: boolean
    scoreAdded: boolean
}

const initalState: RoundState = {
    roundStep: ROUND_STEP.INITIALISATION,
    players: [],
    validWord: "",
    undercoverWord: "",
    voteNuber: 0,
    isEnd: false,
    scoreAdded: false,
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
    let newState: RoundState

    switch (action.type) {
        case "SET_PLAYERS_ROUND":
            newState = {
                ...state,
                players: action.players,
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
            }
            break
        case "KILL_PLAYER":
            if (!state.isEnd) {
                newState = {
                    ...state,
                    players: state.players.map(player => {
                        if (player.name !== action.playerName) {
                            return player
                        }

                        return {
                            ...player,
                            alive: false,
                        }
                    }),
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
    }

    if (newState.players.length > 0) {
        const civilsAlives = getCivilsAlive(newState.players)
        const undercoversAlives = getUndercoverAlive(newState.players)

        newState = {
            ...newState,
            isEnd: isEnd(undercoversAlives, civilsAlives),
        }
    }

    return newState
}

export const StoreRoundProvider: React.FC = ({ children }) => {
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
