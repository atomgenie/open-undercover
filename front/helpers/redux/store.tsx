import { createContext, Dispatch, Reducer, useContext, useReducer } from "react"

import { Player } from "types/player"
import { Actions } from "./actions"

export enum GAME_STEPS {
    EMPTY,
    INIT,
    STARTED,
}

export interface State {
    players: Player[]
    gameRound: number
    gameStep: GAME_STEPS
    darkMode: boolean
    undercovers: number
}

const initialState: State = {
    players: [],
    gameRound: 0,
    gameStep: GAME_STEPS.EMPTY,
    darkMode: false,
    undercovers: 1,
}

const StoreContext = createContext<{
    state: State
    dispatch: Dispatch<Actions>
}>({ state: initialState, dispatch: () => {} })

const reducer: Reducer<State, Actions> = (state, action) => {
    switch (action.type) {
        case "CLEAR":
            return initialState
        case "INIT":
            return {
                ...state,
                gameStep: GAME_STEPS.INIT,
            }
        case "START":
            return {
                ...state,
                gameStep: GAME_STEPS.STARTED,
            }
        case "SET_PLAYERS":
            return {
                ...state,
                players: action.players,
            }
        case "DARK_MODE":
            return {
                ...state,
                darkMode: !state.darkMode,
            }
        case "ADD_PLAYER":
            return {
                ...state,
                players: [...state.players, action.player],
            }
        case "DELETE_PLAYER":
            return {
                ...state,
                players: state.players.filter(
                    player => player.name !== action.playerName,
                ),
            }
        case "SET_UNDERCOVERS":
            if (action.amount < 1 || action.amount > state.players.length) {
                return state
            }

            return {
                ...state,
                undercovers: action.amount,
            }
        case "ADD_SCORE":
            return {
                ...state,
                players: state.players.map(player => {
                    const score = action.score.find(
                        score => score.playerName === player.name,
                    )

                    if (!score) {
                        return player
                    }

                    return {
                        ...player,
                        score: player.score + score.amount,
                    }
                }),
            }
    }
}

export const StoreProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <StoreContext.Provider value={{ state: state, dispatch: dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStoreDispatch = () => {
    const { dispatch } = useContext(StoreContext)
    return dispatch
}

export const useStoreState = () => {
    const { state } = useContext(StoreContext)
    return state
}
