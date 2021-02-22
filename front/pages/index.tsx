import { GAME_STEPS, useStoreState } from "helpers/redux"
import { Starter } from "components/starter/Starter"
import { GameInit } from "components/game-init/GameInit"
import { Round } from "components/round/Round"
import { StoreRoundProvider } from "helpers/redux/round/store"

const Home: React.FC = () => {
    const { gameStep } = useStoreState()

    switch (gameStep) {
        case GAME_STEPS.EMPTY:
            return <Starter />
        case GAME_STEPS.INIT:
            return <GameInit />
        case GAME_STEPS.STARTED:
            return (
                <StoreRoundProvider>
                    <Round />
                </StoreRoundProvider>
            )
    }
}

export default Home
