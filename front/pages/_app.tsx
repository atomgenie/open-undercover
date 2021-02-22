import "../styles/globals.scss"

import { StoreProvider } from "helpers/redux/store"
import { Header } from "components/header/Header"
import { DarkMode } from "components/dark-mode"

const MyApp = ({ Component, pageProps }: any) => {
    return (
        <StoreProvider>
            <DarkMode>
                <div className="overflow-hidden flex flex-col flex-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
                    <Header />
                    <div className="overflow-hidden flex flex-grow flex-col">
                        <Component {...pageProps} />
                    </div>
                </div>
            </DarkMode>
        </StoreProvider>
    )
}

export default MyApp
