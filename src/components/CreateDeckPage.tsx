import Layout from "./Layout.tsx";
import {useNavigate} from "react-router";
import {v7 as uuidv7} from "uuid";
import CreateDeckForm from "./CreateDeckForm.tsx";
import type {CreateDeckInput} from "../schemas/createDeckInput.ts";
import {dataStore} from "../data/localDataStore.ts";

export function CreateDeckPage() {
    const navigate = useNavigate();

    const createDeck = async (input: CreateDeckInput) => {
        const createdDeck = await dataStore.upsertDeck({
            id: uuidv7(),
            ...input,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        navigate(`/decks/${createdDeck.id}`)
    }

    return (
        <Layout active="create" onNavigate={(href) => navigate(href)}>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Create Deck</h1>
            </div>
            <CreateDeckForm onSubmit={createDeck} submitLabel="Create Deck"/>
        </Layout>
    )
}
