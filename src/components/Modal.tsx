import React, {useEffect} from "react";

export function Modal({
                          open,
                          onClose,
                          title,
                          children,
                      }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!open) return;
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className="
                    relative z-10 w-full max-w-lg
                    max-h-[90vh]        /* don't exceed viewport */
                    rounded-2xl border border-slate-200 dark:border-slate-800
                    bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-xl
                    flex flex-col overflow-hidden
                "
            >
                {/* Header (fixed within dialog) */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-base font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                        aria-label="Close"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            aria-hidden
                        >
                            <path
                                d="M6 6l12 12M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body (scrollable when content is tall) */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {children}
                </div>

                {/* Optional footer area:
                    If you ever need actions outside the form, add another
                    border-t + px-6 py-3 section here.
                */}
            </div>
        </div>
    );
}
