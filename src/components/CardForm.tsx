import {type CardInput, CardInputSchema} from "../schemas/cardInput.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitButton} from "./SubmitButton.tsx";

export interface CardFormProps {
    initial?: Partial<CardInput>;
    onSubmit: (input: CardInput) => Promise<void>;
    submittingText?: string;
    submitLabel?: string;
}

export default function CardForm({initial, onSubmit, submittingText = "Creating...", submitLabel = "Create Card"}: CardFormProps) {
    const {handleSubmit, register, formState: {isSubmitting}} =
        useForm<CardInput>({resolver: zodResolver(CardInputSchema)});

    const formSubmit = handleSubmit(onSubmit);

    return (
        <form onSubmit={formSubmit} className="space-y-4 pt-4">
            <div>
                <label htmlFor="front" className="block text-sm font-medium pb-4">
                    Front of Card
                </label>
                <textarea
                    rows={4}
                    defaultValue={initial?.front}
                    className="border rounded px-2 py-1 w-full"
                    {...register('front')}
                />
            </div>
            <div>
                <label htmlFor="back" className="block text-sm font-medium pb-4">
                    Back of Card
                </label>
                <textarea
                    rows={4}
                    defaultValue={initial?.back}
                    className="border rounded px-2 py-1 w-full"
                    {...register('back')}
                />

            </div>
            <div className="pt-4">
                <SubmitButton isSubmitting={isSubmitting} text={submitLabel} submittingText={submittingText}/>
            </div>
        </form>
    )
}
