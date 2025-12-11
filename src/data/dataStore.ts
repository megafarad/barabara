import type {Card, Deck} from "./model.ts";

export interface DataStore {
    upsertDeck(deck: Deck): Promise<Deck>;

    getDeck(id: string): Promise<Deck | undefined>;

    getDecks(): Promise<Deck[]>;

    deleteDeck(id: string): Promise<void>;

    upsertCard(card: Card): Promise<Card>;

    getCard(id: string): Promise<Card | undefined>;

    getCards(deckId: string): Promise<Card[]>;

    deleteCard(id: string): Promise<void>;
}
