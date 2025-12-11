export interface SubmitButtonProps {
    isSubmitting: boolean;
    text: string;
    submittingText: string;
    onClick?: () => Promise<void>
}

export const SubmitButton = ({isSubmitting, text, submittingText, onClick}: SubmitButtonProps) => {
    return (
        <button
            className="relative w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-400/50 hover:translate-y-[1px]"
            disabled={isSubmitting}
            onClick={onClick}
        >
            {isSubmitting && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-4 w-4 items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </span>
            )}

            {isSubmitting ? submittingText : text}
        </button>
    )
}
