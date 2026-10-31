import {
    createContext,
    Dispatch,
    PropsWithChildren,
    Reducer,
    useContext,
    useEffect,
    useReducer,
    useRef,
} from "react"

import { Player } from "types/player"
import { getMaxUndercovers } from "helpers/undercover"
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
    mrWhite: boolean
    roundId: number
}

const initialState: State = {
    players: [],
    gameRound: 0,
    gameStep: GAME_STEPS.EMPTY,
    darkMode: false,
    undercovers: 1,
    mrWhite: false,
    roundId: 0,
}

const StoreContext = createContext<{
    state: State
    dispatch: Dispatch<Actions>
}>({ state: initialState, dispatch: () => {} })

const reducer: Reducer<State, Actions> = (state, action) => {
    switch (action.type) {
        case "HYDRATE":
            return { ...initialState, ...action.state }
        case "CLEAR":
            return {
                ...initialState,
                darkMode: state.darkMode,
            }
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
        case "DELETE_PLAYER": {
            const players = state.players.filter(
                player => player.name !== action.playerName,
            )
            const max = getMaxUndercovers(players.length, state.mrWhite)
            return {
                ...state,
                players,
                undercovers: Math.min(state.undercovers, Math.max(1, max)),
            }
        }
        case "RESTART_ROUND":
            return {
                ...state,
                roundId: state.roundId + 1,
            }
        case "SET_UNDERCOVERS": {
            const maxUndercovers = getMaxUndercovers(state.players.length, state.mrWhite)
            if (action.amount < 1 || action.amount > maxUndercovers) {
                return state
            }

            return {
                ...state,
                undercovers: action.amount,
            }
        }
        case "SET_MR_WHITE": {
            const max = getMaxUndercovers(state.players.length, action.enabled)
            const newUndercovers = Math.min(state.undercovers, Math.max(1, max))
            return {
                ...state,
                mrWhite: action.enabled,
                undercovers: newUndercovers,
            }
        }
        case "SET_PLAYER_LANGUAGE":
            return {
                ...state,
                players: state.players.map(player =>
                    player.name === action.playerName
                        ? { ...player, language: action.language }
                        : player,
                ),
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

export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const isFirstRender = useRef(true)

    useEffect(() => {
        const saved = localStorage.getItem("OPEN_UNDERCOVER_STATE")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                const now = new Date().getTime()
                if (now - parsed.timestamp < 24 * 60 * 60 * 1000) {
                    dispatch({ type: "HYDRATE", state: parsed.state })
                } else {
                    localStorage.removeItem("OPEN_UNDERCOVER_STATE")
                }
            } catch (e) {
                console.error("Failed to load state", e)
            }
        }
    }, [])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const saveData = {
            state,
            timestamp: new Date().getTime(),
        }
        localStorage.setItem("OPEN_UNDERCOVER_STATE", JSON.stringify(saveData))
    }, [state])

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
