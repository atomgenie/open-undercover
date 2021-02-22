import { PlayerRound } from "types/player"

export enum ROUND_STEP {
    INITIALISATION,
    DISTRIBUTION,
    VOTE,
    CONCLUSION,
}

interface SetPlayersRound {
    type: "SET_PLAYERS_ROUND"
    players: PlayerRound[]
}

interface NextStepAction {
    type: "NEXT_STEP"
}

interface SetWords {
    type: "SET_WORDS"
    validWord: string
    undercoverWord: string
}

interface KillPlayer {
    type: "KILL_PLAYER"
    playerName: string
}

interface IncrementVoteNumber {
    type: "INCR_VOTE_NB"
}

interface Reset {
    type: "RESET"
}

interface SetScoreAdd {
    type: "SET_SCORE_ADDED"
}

export type ActionsRound =
    | SetPlayersRound
    | NextStepAction
    | SetWords
    | KillPlayer
    | IncrementVoteNumber
    | Reset
    | SetScoreAdd
