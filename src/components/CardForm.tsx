import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitButton} from "./SubmitButton.tsx";
import {type CardInput, CardInputSchema} from "../schemas/cardInput.ts";

export interface CardFormProps {
    initial?: Partial<CardInput>;
    onSubmit: (input: CardInput) => Promise<void>;
    submittingText?: string;
    submitLabel?: string;
}

export default function CardForm({initial, onSubmit, submittingText = "Creating...", submitLabel = "Create Card"}: CardFormProps) {
    const {control, handleSubmit, formState: {isSubmitting}} =
        useForm<CardInput>({resolver: zodResolver(CardInputSchema)});

    const formSubmit = handleSubmit(onSubmit);

    return (
        <form onSubmit={formSubmit} className="space-y-4 pt-4">
            <div>
                <label htmlFor="front" className="block text-sm font-medium pb-4">
                    Front of Card
                </label>
                <div className='prose lg:prose-xl'>
                    <Controller
                        name='front'
                        control={control}
                        defaultValue={initial?.front}
                        render={({field: {onChange, value}}) => (
                            <MDEditor
                                id='front'
                                value={value}
                                onChange={onChange}
                                previewOptions={{
                                    rehypePlugins: [[rehypeSanitize]]
                                }}
                            />
                        )}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="back" className="block text-sm font-medium pb-4">
                    Back of Card
                </label>
                <div className="prose lg:prose-xl">
                    <Controller
                        name='back'
                        control={control}
                        defaultValue={initial?.back}
                        render={({field: {onChange, value}}) => (
                            <MDEditor
                                id='back'
                                value={value}
                                onChange={onChange}
                                previewOptions={{
                                    rehypePlugins: [[rehypeSanitize]]
                                }}
                            />
                        )}
                    />
                </div>
            </div>
            <div className="pt-4">
                <SubmitButton isSubmitting={isSubmitting} text={submitLabel} submittingText={submittingText}/>
            </div>
        </form>
    )
}
