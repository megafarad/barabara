import {Modal} from "./Modal";
import {SubmitButton} from "./SubmitButton";
import {useState} from "react";

export interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    submitLabel?: string;
    isSubmittingLabel?: string;
    onConfirm: () => Promise<void>;
}

export function ConfirmModal({open, onClose, title, message, submitLabel, isSubmittingLabel,
                                 onConfirm}: ConfirmModalProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const doSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title ?? 'Confirm action'}
        >
            <div>
                <span className="block pb-4 text-sm text-slate-900 dark:text-slate-100">
                    {message}
                </span>
            </div>
            <div className="flex justify-between pt-4">
                <div>
                    <button
                        type="button"
                        onClick={() => onClose()}
                        className="text-sm, px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700">
                        Cancel
                    </button>
                </div>
                <div>
                    <SubmitButton isSubmitting={isSubmitting} text={submitLabel ?? 'Submit'}
                                  submittingText={isSubmittingLabel ?? 'Submitting...'} onClick={doSubmit}/>
                </div>

            </div>

        </Modal>)
}
