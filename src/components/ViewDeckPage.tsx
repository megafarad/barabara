import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import type {Card, Deck} from "../data/model.ts";
import Layout from "./Layout.tsx";
import {dataStore} from "../data/localDataStore.ts";
import {CardsTable} from "./CardsTable.tsx";
import {CardModal} from "./CardModal.tsx";
import {ConfirmModal} from "./ConfirmModal.tsx";


export function ViewDeckPage() {
    const {deckId} = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState<Deck | undefined>(undefined);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [deckCards, setDeckCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateCardModal, setShowCreateCardModal] = useState(false);
    const [showEditCardModal, setShowEditCardModal] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<Card | undefined>(undefined);
    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<Card | undefined>(undefined);
    const [showDeleteDeckModal, setShowDeleteDeckModal] = useState(false);
    const TOTAL_CARDS_TO_DISPLAY = 10;

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            if (deckId) {
                const deck = await dataStore.getDeck(deckId);
                if (mounted) {
                    setDeck(deck);
                    const storedDeckCards = await dataStore.getCards(deckId);
                    setDeckCards(storedDeckCards);
                    setLoading(false);
                }
            }
        })();
        return () => {
            mounted = false;
        }
    }, [deckId]);

    const isLastPage = Math.ceil(deckCards.length / TOTAL_CARDS_TO_DISPLAY) === currentPageNumber;
    const isFirstPage = currentPageNumber === 1;

    const goToPreviousPage = () => {
        if (isFirstPage) return;
        setCurrentPageNumber((prev) => prev - 1);
    }

    const goToNextPage = () => {
        if (isLastPage) return;
        setCurrentPageNumber((prev) => prev + 1);
    }

    const start = (currentPageNumber - 1) * TOTAL_CARDS_TO_DISPLAY;
    const end = currentPageNumber * TOTAL_CARDS_TO_DISPLAY;
    const displayedCards = deckCards.slice(start, end);

    return (
        <Layout active={deck?.id} onNavigate={(href) => navigate(href)}>
            {deck?.id && (
                <>
                    <CardModal
                        mode='create'
                        deckId={deck.id}
                        open={showCreateCardModal}
                        onClose={() => setShowCreateCardModal(false)}
                        onCreated={(createdCard) => {
                            const goForward = displayedCards.length === TOTAL_CARDS_TO_DISPLAY;
                            setDeckCards((existingCards) => [...existingCards, createdCard]);
                            if (goForward) {
                                setCurrentPageNumber((prev) => prev + 1);
                            }
                        }}
                    />
                    <CardModal
                        mode='edit'
                        initial={cardToEdit}
                        deckId={deck.id}
                        open={showEditCardModal}
                        onClose={() => setShowEditCardModal(false)}
                        onUpdated={(updatedCard) => {
                            setDeckCards((existingCards) => {
                                return existingCards.map((existingCard) => {
                                    if (existingCard.id === updatedCard.id) return updatedCard;
                                    return existingCard
                                })
                            });
                            setCardToEdit(undefined);
                        }}
                    />
                    <ConfirmModal
                        open={showDeleteCardModal}
                        title='Delete Card'
                        message="Are you sure you want to delete this card?"
                        submitLabel="Delete"
                        isSubmittingLabel="Deleting..."
                        onClose={() => setShowDeleteCardModal(false)}
                        onConfirm={async () => {
                            if (cardToDelete) {
                                await dataStore.deleteCard(cardToDelete.id);
                                const goBack = isLastPage && displayedCards.length === 1
                                setDeckCards((existingCards) =>
                                    existingCards.filter(card => card.id !== cardToDelete.id));
                                setCardToDelete(undefined);
                                setShowDeleteCardModal(false);
                                if (goBack) {
                                    goToPreviousPage();
                                }
                            }
                        }
                        }/>
                    <ConfirmModal open={showDeleteDeckModal}
                                  title="Delete Deck"
                                  message="Are you sure you want to delete this deck?"
                                  submitLabel="Delete"
                                  isSubmittingLabel="Deleting..."
                                  onClose={() => setShowDeleteDeckModal(false)}
                                  onConfirm={async () => {
                                      if (deckId) {
                                          await dataStore.deleteDeck(deckId);
                                          setShowDeleteDeckModal(false);
                                          navigate('/')
                                      }
                                  }}/>
                </>
            )}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-xl font-semibold">{deck?.name}</h1>
                </div>
                {/* Loading skeleton */}

                {loading && (
                    <div className="mt-6 grid gap-4">
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"/>
                        ))}
                    </div>
                )}

                {!loading && deckCards.length === 0 && (
                    <div className="mt-6">
                        <p className="text-center text-slate-500">No cards in deck</p>
                    </div>
                )}

                {!loading && deckCards.length > 0 && (
                    <>
                        <div>
                            <select
                                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-2 text-sm"
                                onChange={(e) => setCurrentPageNumber(parseInt(e.target.value))}
                                value={currentPageNumber}>
                                {[...Array(Math.ceil(deckCards.length / TOTAL_CARDS_TO_DISPLAY))].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <CardsTable cards={displayedCards}
                                        onEdit={(card) => {
                                            setCardToEdit(card);
                                            setShowEditCardModal(true);
                                        }}
                                        onDelete={(card) => {
                                            setCardToDelete(card);
                                            setShowDeleteCardModal(true);
                                        }}/>
                        </div>
                        <div>
                            <button onClick={goToPreviousPage}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isFirstPage}> Previous
                            </button>
                            <button onClick={goToNextPage}
                                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLastPage}>Next
                            </button>
                        </div>
                    </>
                )}
                <div className="mt-6">
                    <button onClick={() => setShowCreateCardModal(true)}
                            className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 text-sm font-medium shadow-sm hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                        Create Card
                    </button>
                </div>
                <div className="mt-6">
                    <Link to={`/decks/${deck?.id}/study`}>
                        <button
                            className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 text-sm font-medium shadow-sm hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                            Study
                        </button>
                    </Link>
                </div>
                <div className="mt-6">
                    <button
                        onClick={() => setShowDeleteDeckModal(true)}
                        className="rounded-xl bg-red-500 text-white px-3 py-2 text-sm font-medium shadow-sm hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-red-400/50">
                        Delete Deck
                    </button>
                </div>
            </div>
        </Layout>
    )
}
