import { Player } from "types/player"

interface CleanAction {
    type: "CLEAR"
}

interface InitAction {
    type: "INIT"
}

interface StartAction {
    type: "START"
}

interface SetPlayersAction {
    type: "SET_PLAYERS"
    players: Player[]
}

interface TriggerDarkMode {
    type: "DARK_MODE"
}

interface AddPlayer {
    type: "ADD_PLAYER"
    player: Player
}

interface DeletePlayer {
    type: "DELETE_PLAYER"
    playerName: string
}

interface SetUndercovers {
    type: "SET_UNDERCOVERS"
    amount: number
}

interface AddScore {
    type: "ADD_SCORE"
    score: { playerName: string; amount: number }[]
}

export type Actions =
    | CleanAction
    | InitAction
    | StartAction
    | SetPlayersAction
    | TriggerDarkMode
    | AddPlayer
    | DeletePlayer
    | SetUndercovers
    | AddScore
