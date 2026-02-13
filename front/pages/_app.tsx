import "../styles/globals.css"

import { useEffect } from "react"
import Head from "next/head"
import { StoreProvider } from "helpers/redux/store"
import { Header } from "components/header/Header"
import { DarkMode } from "components/dark-mode"

const MyApp = ({ Component, pageProps }: any) => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js")
        }
    }, [])

    return (
        <>
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <link rel="apple-touch-icon" href="/apple-icon.png"></link>
                <meta name="theme-color" content="#6605cc" />
                <title>Open Undercover</title>
            </Head>
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
        </>
    )
}

export default MyApp
