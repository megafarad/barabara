import type {Card} from "../data/model.ts";
import {Modal} from "./Modal.tsx";
import CardForm from "./CardForm.tsx";
import {dataStore} from "../data/localDataStore.ts";
import {v7 as uuidv7} from "uuid";

export type CardModalMode = 'create' | 'edit';

export interface CardModalProps {
    mode: CardModalMode;
    initial?: Card;
    open: boolean;
    deckId: string;
    onClose: () => void;
    onCreated?: (card: Card) => void;
    onUpdated?: (card: Card) => void;
}

export function CardModal({mode, initial, open, onClose, deckId, onCreated, onUpdated}: CardModalProps) {
    const title = mode === 'create' ? 'Create Card' : 'Edit Card';
    const submitLabel = mode === 'create' ? 'Create Card' : 'Update Card';

    return (
        <Modal open={open} onClose={onClose} title={title}>
            <CardForm
                initial={initial}
                submitLabel={submitLabel}
                onSubmit={async (input) => {
                    if (mode === 'edit' && initial) {
                        const updatedCard = await dataStore.upsertCard({...initial, ...input,
                            updatedAt: new Date().toISOString()});
                        onUpdated?.(updatedCard);
                        onClose();
                    } else {
                        const createdCard = await dataStore.upsertCard({
                            id: uuidv7(),
                            deckId,
                            front: input.front,
                            back: input.back,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            streak: 0,
                            intervalDays: 0,
                            nextReviewAt: new Date().toISOString(),
                        });
                        onCreated?.(createdCard);
                        onClose();
                    }
                }}
            />
        </Modal>
    )
}
