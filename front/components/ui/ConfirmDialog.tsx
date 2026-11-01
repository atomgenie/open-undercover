import { useEffect } from "react"

interface props {
    open: boolean
    title: string
    message?: string
    confirmLabel: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmDialog: React.FC<props> = ({
    open,
    title,
    message,
    confirmLabel,
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}) => {
    useEffect(() => {
        if (!open) {
            return
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onCancel()
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [open, onCancel])

    if (!open) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 animate-fade-in p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            onClick={onCancel}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                className="pop-card bg-surface w-full max-w-sm p-5 flex flex-col gap-4 text-fg animate-pop-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col gap-1">
                    <h2
                        id="confirm-title"
                        className="text-2xl font-extrabold tracking-tight"
                    >
                        {title}
                    </h2>
                    {message && <p className="text-muted">{message}</p>}
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        className="pop-border pop-shadow pop-press rounded-2xl bg-pop-red text-ink h-13 font-extrabold uppercase tracking-wide"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        className="pop-border pop-shadow-sm pop-press rounded-2xl bg-surface h-12 font-bold"
                        onClick={onCancel}
                        autoFocus
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
