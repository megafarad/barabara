export type DeckId = string;
export type CardId = string;

export interface Deck {
  id: DeckId;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: CardId;
  deckId: DeckId;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;

  streak: number;
  intervalDays: number;
  nextReviewAt: string;
}
