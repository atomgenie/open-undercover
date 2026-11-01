import { PropsWithChildren } from "react"

/** Sticky action area in the thumb zone, respecting the iOS home indicator */
export const BottomBar: React.FC<PropsWithChildren<{ className?: string }>> = ({
    children,
    className = "",
}) => (
    <div className="flex-shrink-0 bg-paper pt-3">
        <div
            className={`mx-auto w-full max-w-xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-3 ${className}`}
        >
            {children}
        </div>
    </div>
)
