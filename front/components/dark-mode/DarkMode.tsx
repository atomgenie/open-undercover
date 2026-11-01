import { PropsWithChildren, useEffect } from "react"
import { useStoreState } from "helpers/redux"

export const DarkMode: React.FC<PropsWithChildren> = ({ children }) => {
    const { darkMode } = useStoreState()

    // Also flag the root element so the page background behind iOS overscroll matches
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode)
    }, [darkMode])

    return (
        <div className={`overflow-hidden flex flex-col flex-1 ${darkMode ? "dark" : ""}`}>
            {children}
        </div>
    )
}
