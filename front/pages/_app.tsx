import "../styles/globals.css"

import { useEffect } from "react"
import Head from "next/head"
import { StoreProvider } from "helpers/redux/store"
import { Header } from "components/header/Header"
import { DarkMode } from "components/dark-mode"
import { Seo } from "components/seo"

const MyApp = ({ Component, pageProps }: any) => {
    useEffect(() => {
        const isProd =
            process.env.NODE_ENV === "production" &&
            process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview"
        if (isProd && "serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js")
        }
    }, [])

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
                />
            </Head>
            <Seo />
            <StoreProvider>
                <DarkMode>
                    <div className="overflow-hidden flex flex-col flex-1 bg-paper text-fg font-display">
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
