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
            className="border-2 border-brand text-brand rounded-lg py-4 px-6 flex items-center gap-4 uppercase text-lg font-bold shadow-sm animate-fade-in-up transition-transform hover:scale-105 active:scale-95"
            onClick={handleInstall}
            aria-label="Install app"
        >
            <FiDownload />
            <div>Install</div>
        </button>
    )
}
