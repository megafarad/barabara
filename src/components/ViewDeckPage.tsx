import {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import type {Card, Deck} from "../data/model.ts";
import Layout from "./Layout.tsx";
import {dataStore} from "../data/localDataStore.ts";
import {CardModal} from "./CardModal.tsx";
import {ConfirmModal} from "./ConfirmModal.tsx";
import {useDataStore} from "../context/DataContext.tsx";

export function ViewDeckPage() {
    const {deckId} = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState<Deck | undefined>(undefined);
    const {decks: allDecks, setDecks: setAllDecks} = useDataStore()
    const [isRenamingDeck, setIsRenamingDeck] = useState(false);
    const [deckNameDraft, setDeckNameDraft] = useState('');
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [deckCards, setDeckCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateCardModal, setShowCreateCardModal] = useState(false);
    const [showEditCardModal, setShowEditCardModal] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<Card | undefined>(undefined);
    const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<Card | undefined>(undefined);
    const [showDeleteDeckModal, setShowDeleteDeckModal] = useState(false);
    const deckNameInputRef = useRef<HTMLInputElement>(null);
    const TOTAL_CARDS_TO_DISPLAY = 12;

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

    useEffect(() => {
        if (!isRenamingDeck) return;
        const id = window.setTimeout(() => {
            deckNameInputRef.current?.focus();
            deckNameInputRef.current?.select();
        }, 0);
        return () => window.clearTimeout(id);
    }, [isRenamingDeck]);

    const beginRename = () => {
        if (!deck) return;
        setDeckNameDraft(deck.name);
        setIsRenamingDeck(true);
    };

    const cancelRename = () => {
        setIsRenamingDeck(false);
        setDeckNameDraft("");
    };

    const saveRename = async () => {
        if (!deck) return;

        const nextName = deckNameDraft.trim();
        if (nextName.length === 0) {
            cancelRename();
            return;
        }
        if (nextName === deck.name) {
            cancelRename();
            return;
        }

        // Call into your persistence layer.
        // You may need to add this method if it doesn't exist yet.
        await dataStore.upsertDeck({
            ...deck,
            name: nextName
        })

        setDeck((prev) => (prev ? {...prev, name: nextName} : prev));

        const allUpdatedDecks = allDecks.map(deckToUpdate => deckToUpdate.id === deck.id ? {...deckToUpdate, name: nextName} : deckToUpdate);
        setAllDecks(allUpdatedDecks);

        cancelRename();
    };


    const totalPages = Math.ceil(deckCards.length / TOTAL_CARDS_TO_DISPLAY);
    const isLastPage = totalPages === currentPageNumber;
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
            {/* Blurred Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
            </div>

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
                        }}
                    />
                    <ConfirmModal
                        open={showDeleteDeckModal}
                        title="Delete Collection"
                        message="Are you sure you want to delete this collection? All cards will be permanently removed."
                        submitLabel="Delete"
                        isSubmittingLabel="Deleting..."
                        onClose={() => setShowDeleteDeckModal(false)}
                        onConfirm={async () => {
                            if (deckId) {
                                await dataStore.deleteDeck(deckId);
                                setShowDeleteDeckModal(false);
                                navigate('/')
                            }
                        }}
                    />
                </>
            )}

            <div className="max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-xl mb-6 bg-white/60 border-zinc-900/10 shadow-lg">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span className="text-xs tracking-wider uppercase font-medium">Collection</span>
                            </div>
                            {!isRenamingDeck ? (
                                <div className="flex items-center gap-2">
                                    <h1
                                        className="text-4xl sm:text-5xl font-light tracking-tight cursor-text"
                                        onClick={beginRename}
                                    >
                                        {deck?.name}
                                    </h1>

                                    <button
                                        type="button"
                                        onClick={beginRename}
                                        aria-label="Rename deck"
                                        className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 transition"
                                        title="Rename"
                                    >
                                        {/* Pencil icon (inline SVG) */}
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path
                                                d="M12 20h9"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <input
                                    ref={deckNameInputRef}
                                    value={deckNameDraft}
                                    onChange={(e) => setDeckNameDraft(e.target.value)}
                                    onBlur={() => void saveRename()}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") void saveRename();
                                        if (e.key === "Escape") cancelRename();
                                    }}
                                    className="text-4xl sm:text-5xl font-light tracking-tight mb-3 w-full bg-transparent outline-none border-b border-zinc-900/20 focus:border-zinc-900/50"
                                    aria-label="Deck name"
                                />
                            )}
                            <p className="text-base text-zinc-600">{deckCards.length} {deckCards.length === 1 ? 'card' : 'cards'} • Ready to master</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to={`/decks/${deck?.id}/study`}>
                                <button className="group px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all hover:scale-105 shadow-xl flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Study Now</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </Link>
                            <button
                                onClick={() => setShowDeleteDeckModal(true)}
                                className="px-5 py-3 rounded-full border backdrop-blur-xl border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-all hover:scale-105"
                            >
                                Delete Collection
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setShowCreateCardModal(true)}
                        className="group px-6 py-3 rounded-full border-2 border-dashed border-zinc-900/20 backdrop-blur-xl bg-white/60 text-zinc-900 text-sm font-medium hover:border-zinc-900/40 hover:bg-white/80 transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Card
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl bg-white/60 border border-zinc-900/10 shadow-lg">
                            <button
                                onClick={goToPreviousPage}
                                disabled={isFirstPage}
                                className="p-2 rounded-xl hover:bg-zinc-900/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-sm text-zinc-600 font-medium px-2 tracking-wide">
                                {currentPageNumber} of {totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={isLastPage}
                                className="p-2 rounded-xl hover:bg-zinc-900/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({length: 8}).map((_, i) => (
                            <div key={i} className="h-52 rounded-3xl backdrop-blur-2xl bg-white/60 border border-zinc-900/10 animate-pulse shadow-xl"/>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && deckCards.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-28 h-28 rounded-3xl backdrop-blur-2xl bg-white/70 border border-zinc-900/10 flex items-center justify-center mb-8 shadow-2xl">
                            <svg className="w-14 h-14 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-light tracking-tight mb-3">No cards yet</h2>
                        <p className="text-base text-zinc-600 mb-12 text-center max-w-sm">
                            Start building your collection with beautiful flashcards
                        </p>
                        <button
                            onClick={() => setShowCreateCardModal(true)}
                            className="px-10 py-4 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all hover:scale-105 shadow-xl"
                        >
                            Create First Card
                        </button>
                    </div>
                )}

                {/* Cards Grid */}
                {!loading && deckCards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedCards.map((card) => (
                            <FlipCard
                                key={card.id}
                                card={card}
                                onEdit={() => {
                                    setCardToEdit(card);
                                    setShowEditCardModal(true);
                                }}
                                onDelete={() => {
                                    setCardToDelete(card);
                                    setShowDeleteCardModal(true);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

function FlipCard({card, onEdit, onDelete}: {card: Card, onEdit: () => void, onDelete: () => void}) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="group relative h-52 cursor-pointer perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Floating gradient orbs - faster */}
            <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none will-change-opacity">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl bg-blue-500/30" />
                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full blur-2xl bg-purple-500/30" />
            </div>

            <div
                className={`relative w-full h-full transition-transform duration-300 ease-out transform-style-3d will-change-transform ${
                    isFlipped ? "rotate-y-180" : ""
                }`}
            >
                {/* Front */}
                <div
                    className={`absolute inset-0 w-full h-full backface-hidden ${
                        isFlipped ? "pointer-events-none" : ""
                    }`}
                >
                    <div className="relative h-full rounded-3xl p-6 flex flex-col backdrop-blur-2xl bg-white/80 border border-zinc-900/10 shadow-xl transition-all duration-150 group-hover:scale-[1.02] group-hover:shadow-2xl overflow-hidden will-change-transform">
                        {/* Glossy overlay - instant */}
                        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/60 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-120 pointer-events-none will-change-opacity" />

                        {/* Shimmer - faster */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-200 will-change-transform" />
                        </div>

                        <div className="relative flex items-start justify-between mb-4 z-10">
                            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 backdrop-blur-xl shadow-lg">
                                Question
                            </span>

                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-50">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit();
                                    }}
                                    className="p-2 rounded-xl backdrop-blur-xl border border-zinc-900/10 hover:bg-zinc-900/5 transition-all duration-50 hover:scale-110 will-change-transform"
                                    title="Edit card"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="p-2 rounded-xl backdrop-blur-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all duration-50 hover:scale-110 will-change-transform"
                                    title="Delete card"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative flex-1 flex items-center justify-center px-2 z-10">
                            <p className="text-center text-base sm:text-lg font-light tracking-tight text-zinc-900 line-clamp-4 leading-relaxed">
                                <MDEditor.Markdown source={card.front} rehypePlugins={[rehypeSanitize]}/>
                            </p>
                        </div>

                        <div className="relative text-center text-[11px] tracking-wide text-zinc-400 mt-3 z-10 flex items-center justify-center gap-2">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Click to reveal
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div
                    className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${
                        !isFlipped ? "pointer-events-none" : ""
                    }`}
                >
                    <div className="relative h-full rounded-3xl p-6 flex flex-col backdrop-blur-2xl bg-white/80 border border-zinc-900/10 shadow-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl overflow-hidden">
                        {/* Glossy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/60 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Shimmer */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-300" />
                        </div>

                        <div className="relative flex items-start justify-between mb-4 z-10">
                            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 backdrop-blur-xl shadow-lg">
                                Answer
                            </span>

                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit();
                                    }}
                                    className="p-2 rounded-xl backdrop-blur-xl border border-zinc-900/10 hover:bg-zinc-900/5 transition-all hover:scale-110"
                                    title="Edit card"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="p-2 rounded-xl backdrop-blur-xl border border-red-200 text-red-600 hover:bg-red-50 transition-all hover:scale-110"
                                    title="Delete card"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="relative flex-1 flex items-center justify-center px-2 z-10">
                            <p className="text-center text-base sm:text-lg font-light tracking-tight text-zinc-900 line-clamp-4 leading-relaxed">
                                <MDEditor.Markdown source={card.back} rehypePlugins={[rehypeSanitize]}/>
                            </p>
                        </div>

                        <div className="relative text-center text-[11px] tracking-wide text-zinc-400 mt-3 z-10 flex items-center justify-center gap-2">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Click to flip back
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                /* Hardware acceleration for better performance */
                .will-change-transform {
                    will-change: transform;
                }
                .will-change-opacity {
                    will-change: opacity;
                }
            `}</style>
        </div>
    );
}
