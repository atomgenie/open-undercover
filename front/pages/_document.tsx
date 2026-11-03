import { Head, Html, Main, NextScript } from "next/document"

// Rendered on the server only: the static `<html>` / `<head>` shared by every page.
// Per-page tags (title, description, Open Graph…) live in components/seo/Seo.tsx.
const Document = () => (
    <Html lang="en">
        <Head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/icons/icon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/icons/icon-16x16.png"
            />
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            <meta name="application-name" content="Open Undercover" />
            <meta name="apple-mobile-web-app-title" content="Open Undercover" />
            <meta name="theme-color" content="#7c3aed" />
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>
)

export default Document
