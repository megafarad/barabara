import {describe, it, expect, afterEach} from "vitest";
import {v7 as uuidv7} from 'uuid';
import {LocalDataStore} from "../src/data/localDataStore";
import {Card, Deck} from "../src/data/model";

describe('localDataStore', () => {

    afterEach(() => {
        localStorage.clear();
    })

    const testDeckId = uuidv7();
    const testDeck: Deck = {
        id: testDeckId,
        name: 'test deck',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const testCard: Card = {
        id: uuidv7(),
        deckId: testDeckId,
        front: 'front',
        back: 'back',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        streak: 0,
        intervalDays: 0,
        nextReviewAt: new Date().toISOString(),
    }

    it('should be able to store a deck', async () => {
        const dataStore = LocalDataStore.create();
        await dataStore.upsertDeck(testDeck);
        const storedDeck = await dataStore.getDeck(testDeckId);
        expect(storedDeck).toEqual(testDeck);
        const storedDecks = await dataStore.getDecks();
        expect(storedDecks).toEqual([testDeck]);
    });

    it('should be able to store a card', async () => {
        const dataStore = LocalDataStore.create();
        await dataStore.upsertDeck(testDeck);
        await dataStore.upsertCard(testCard);
        const storedCard = await dataStore.getCard(testCard.id);
        expect(storedCard).toEqual(testCard);
        const storedCards = await dataStore.getCards(testDeckId);
        expect(storedCards).toEqual([testCard]);
    });

    it('should be able to delete a deck', async () => {
        const dataStore = LocalDataStore.create();
        await dataStore.upsertDeck(testDeck);
        await dataStore.upsertCard(testCard);
        await dataStore.deleteDeck(testDeckId);
        const storedDeck = await dataStore.getDeck(testDeckId);
        expect(storedDeck).toBe(undefined);
        const storedCard = await dataStore.getCard(testCard.id);
        expect(storedCard).toBe(undefined);
    });

    it('should be able to delete a card', async () => {
        const dataStore = LocalDataStore.create();
        await dataStore.upsertDeck(testDeck);
        await dataStore.upsertCard(testCard);
        await dataStore.deleteCard(testCard.id);
        const storedCard = await dataStore.getCard(testCard.id);
        expect(storedCard).toBe(undefined);
    });

    it('should update an existing card', async () => {
        const dataStore = LocalDataStore.create();
        await dataStore.upsertDeck(testDeck);
        await dataStore.upsertCard(testCard);
        const updatedCard = {...testCard, back: 'new back'};
        await dataStore.upsertCard(updatedCard);
        const storedCard = await dataStore.getCard(testCard.id);
        expect(storedCard).toEqual(updatedCard);
    });

    it('should update an existing deck', async () => {
        const dataStore = LocalDataStore.create();
        await dataStore.upsertDeck(testDeck);
        const updatedDeck = {...testDeck, name: "new name"}
        await dataStore.upsertDeck(updatedDeck);
        const storedDeck = await dataStore.getDeck(testDeckId);
        expect(storedDeck).toEqual(updatedDeck);
    });

    it('should throw an error when trying to upsert a card with an unknown deck', async () => {
        const dataStore= LocalDataStore.create();
        await expect(dataStore.upsertCard(testCard)).rejects.toThrowError(`Deck with id ${testDeckId} not found`);
    })


})
