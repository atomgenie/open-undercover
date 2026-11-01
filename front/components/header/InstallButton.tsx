import { useEffect, useState } from "react"
import { FiDownload } from "react-icons/fi"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export const InstallButton: React.FC = () => {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            setPromptEvent(e as BeforeInstallPromptEvent)
        }

        window.addEventListener("beforeinstallprompt", handler)

        const installedHandler = () => setPromptEvent(null)
        window.addEventListener("appinstalled", installedHandler)

        return () => {
            window.removeEventListener("beforeinstallprompt", handler)
            window.removeEventListener("appinstalled", installedHandler)
        }
    }, [])

    if (!promptEvent) return null

    const handleInstall = async () => {
        await promptEvent.prompt()
        const { outcome } = await promptEvent.userChoice
        if (outcome === "accepted") {
            setPromptEvent(null)
        }
    }

    return (
        <button
            className="pop-border pop-shadow-sm pop-press w-full h-12 rounded-2xl bg-surface flex items-center justify-center gap-3 font-bold animate-fade-in-up"
            onClick={handleInstall}
            aria-label="Install app"
        >
            <FiDownload />
            <span>Install the app</span>
        </button>
    )
}
