import { useStoreDispatch } from "helpers/redux"
import { FiPlay } from "react-icons/fi"

export const Starter: React.FC = () => {
    const dispatch = useStoreDispatch()

    return (
        <div className="container mx-auto flex-grow flex flex-col justify-center">
            <div className="flex justify-center">
                <button className="bg-brand rounded-lg py-4 px-6 flex items-center gap-4 text-white uppercase text-lg font-bold shadow-sm">
                    <FiPlay />
                    <div
                        onClick={() => {
                            dispatch({
                                type: "INIT",
                            })
                        }}
                    >
                        Start a game
                    </div>
                </button>
            </div>
        </div>
    )
}
