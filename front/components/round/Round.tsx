import { ROUND_STEP, useRoundDispatcher, useRoundState } from "helpers/redux/round"
import { WORDS } from "helpers/words"
import { useEffect } from "react"
import { Vote } from "./components/Vote"

import { Distribution } from "./components/Distribution"
import { Conclusion } from "./components/Conclusion"

export const Round: React.FC = () => {
    const roundState = useRoundState()
    const roundDispatch = useRoundDispatcher()

    useEffect(() => {
        if (roundState.roundStep !== ROUND_STEP.INITIALISATION) {
            return
        }

        roundDispatch({
            type: "RESET",
        })

        const randPosition = Math.trunc(Math.random() * WORDS.length)
        const randUndercover = Math.trunc(Math.random() * 2) as 0 | 1

        const valid = WORDS[randPosition][randUndercover]
        const undercoverWord = WORDS[randPosition][1 - randUndercover]

        roundDispatch({
            type: "SET_WORDS",
            undercoverWord: undercoverWord,
            validWord: valid,
        })

        roundDispatch({ type: "NEXT_STEP" })
    }, [roundState.roundStep])

    switch (roundState.roundStep) {
        case ROUND_STEP.INITIALISATION:
            return <div>Loading...</div>
        case ROUND_STEP.DISTRIBUTION:
            return <Distribution />
        case ROUND_STEP.VOTE:
            return <Vote />
        case ROUND_STEP.CONCLUSION:
            return <Conclusion />
    }
}
