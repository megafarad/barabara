import {type CreateDeckInput, CreateDeckInputSchema} from "../schemas/createDeckInput.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitButton} from "./SubmitButton.tsx";

export interface CreateDeckFormProps {
    onSubmit: (input: CreateDeckInput) => Promise<void>;
    submitLabel?: string;
}

export default function CreateDeckForm({onSubmit, submitLabel = "Create Deck"}: CreateDeckFormProps) {
    const {handleSubmit, register, formState: {isSubmitting}} =
        useForm<CreateDeckInput>({resolver: zodResolver(CreateDeckInputSchema)});

    const formSubmit = handleSubmit(onSubmit);

    return (
        <form onSubmit={formSubmit} className="space-y-4 pt-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium pb-4">
                    Deck Name
                </label>
                <input
                    type='text'
                    {...register('name')}
                    className="border rounded px-2 py-1 w-full"
                />
            </div>
            <div className="pt-4">
                <SubmitButton isSubmitting={isSubmitting} text={submitLabel} submittingText="Creating..."/>
            </div>
        </form>
    )
}
