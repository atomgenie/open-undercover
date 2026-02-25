import { useStoreDispatch } from "helpers/redux"
import { FiPlay } from "react-icons/fi"
import { InstallButton } from "components/header/InstallButton"

export const Starter: React.FC = () => {
    const dispatch = useStoreDispatch()

    return (
        <div className="container mx-auto flex-grow flex flex-col justify-center">
            <div className="flex justify-center gap-4">
                <button
                    className="bg-brand rounded-lg py-4 px-6 flex items-center gap-4 text-white uppercase text-lg font-bold shadow-sm animate-fade-in-up transition-transform hover:scale-105 active:scale-95"
                    onClick={() => {
                        dispatch({
                            type: "INIT",
                        })
                    }}
                >
                    <FiPlay />
                    <div>Start a game</div>
                </button>
                <InstallButton />
            </div>
        </div>
    )
}
