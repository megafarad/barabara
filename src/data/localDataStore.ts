import type {DataStore} from "./dataStore.ts";
import type {Card, Deck} from "./model.ts";
import {exampleData} from "./exampleData.ts";

export interface StoreType {
    decks: Deck[];
    cards: Card[];
}

export class LocalDataStore implements DataStore {

    private serializeAndStore(store: StoreType) {
        localStorage.setItem("flashcards", JSON.stringify(store));
    }

    private deserializeAndReturnStore(): StoreType {
        const store = localStorage.getItem("flashcards");
        if (!store) {
            localStorage.setItem("flashcards", JSON.stringify(exampleData));
            return exampleData;
        } else {
            return JSON.parse(store) as StoreType;
        }
    }

    async deleteCard(id: string): Promise<void> {
        const store = this.deserializeAndReturnStore();
        store.cards = store.cards.filter(card => card.id !== id);
        this.serializeAndStore(store);
    }

    async deleteDeck(id: string): Promise<void> {
        const store = this.deserializeAndReturnStore();
        store.decks = store.decks.filter(deck => deck.id !== id);
        store.cards = store.cards.filter(card => card.deckId !== id);
        this.serializeAndStore(store);
    }

    async getCard(id: string): Promise<Card | undefined> {
        const store = this.deserializeAndReturnStore();
        return store.cards.find(card => card.id === id);
    }

    async getCards(deckId: string): Promise<Card[]> {
        const store = this.deserializeAndReturnStore();
        return store.cards.filter(card => card.deckId === deckId)
    }

    async getDeck(id: string): Promise<Deck | undefined> {
        const store = this.deserializeAndReturnStore();
        return store.decks.find(deck => deck.id === id);
    }

    async getDecks(): Promise<Deck[]> {
        const store = this.deserializeAndReturnStore();
        return store.decks;
    }

    async upsertCard(card: Card): Promise<Card> {
        const store = this.deserializeAndReturnStore();
        const existingCardIdx = store.cards.findIndex(c => c.id === card.id);
        if (existingCardIdx >= 0) {
            store.cards[existingCardIdx] = card;
        } else {
            const deck = store.decks.find(d => d.id === card.deckId);
            if (!deck) {
                throw new Error(`Deck with id ${card.deckId} not found`);
            }
            store.cards.push(card);
        }
        this.serializeAndStore(store);
        return card;

    }

    async upsertDeck(deck: Deck): Promise<Deck> {
        const store = this.deserializeAndReturnStore();
        const existingDeckIdx = store.decks.findIndex(d => d.id === deck.id);
        if (existingDeckIdx >= 0) {
            store.decks[existingDeckIdx] = deck;
        } else {
            store.decks.push(deck);
        }
        this.serializeAndStore(store);
        return deck;
    }

    static create(): DataStore {
        return new LocalDataStore();
    }

}

export const dataStore = LocalDataStore.create();
