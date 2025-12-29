import { PropsWithChildren } from "react"
import { useStoreState } from "helpers/redux"

export const DarkMode: React.FC<PropsWithChildren> = ({ children }) => {
    const { darkMode } = useStoreState()

    return (
        <div className={`overflow-hidden flex flex-col flex-1 ${darkMode ? "dark" : ""}`}>
            {children}
        </div>
    )
}
