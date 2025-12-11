import {useNavigate, useParams} from "react-router";
import {useCallback, useEffect, useState} from "react";
import type {Card} from "../data/model.ts";
import {dataStore} from "../data/localDataStore.ts";
import {DateTime} from "luxon";
import Layout from "./Layout.tsx";

export type StudyPagePhase = 'front' | 'back';

export function StudyPage() {
    const {deckId} = useParams();
    const navigate = useNavigate();
    const [studyCards, setStudyCards] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [phase, setPhase] = useState<StudyPagePhase>('front');

    const getCardsDueForReview = useCallback(async () => {
            if (deckId) {
                const cards = await dataStore.getCards(deckId);
                return cards.filter(card => {
                    return DateTime.fromISO(card.nextReviewAt).diffNow('days').days <= 0;
                });
            } else {
                return [];
            }
        }, [deckId]
    )

    useEffect(() => {
        getCardsDueForReview().then(setStudyCards);
    }, [getCardsDueForReview]);

    useEffect(() => {
        if (currentCardIndex >= studyCards.length) {
            getCardsDueForReview().then((redoCards) => {
                if (redoCards.length > 0) {
                    setStudyCards(redoCards);
                    setCurrentCardIndex(0);
                    setPhase('front');
                }
            })
        }
    }, [currentCardIndex, getCardsDueForReview, studyCards.length]);


    const currentCard = studyCards[currentCardIndex];

    const iForgotIt = async () => {
        const updatedCard = {...currentCard, streak: 0, intervalDays: 0, nextReviewAt: DateTime.now().toISO()};
        await dataStore.upsertCard(updatedCard);
        setPhase('front');
        setCurrentCardIndex((prev) => prev + 1);
    }

    const iKnewIt = async () => {
        const streak = currentCard.streak + 1;
        const intervalDays = streak === 1 ? 1 : streak === 2 ? 3 : Math.min(currentCard.streak * 2, 60);
        const updatedCard = {
            ...currentCard, streak, intervalDays,
            nextReviewAt: DateTime.now().plus({days: intervalDays}).toISO()
        };
        await dataStore.upsertCard(updatedCard);
        setPhase('front');
        setCurrentCardIndex((prev) => prev + 1);
    }

    const renderPhase = (phase: StudyPagePhase) => {
        switch (phase) {
            case "front": {
                return (
                    <div>
                        <h1 className="text-xl font-semibold">Front</h1>
                        <p className="mt-4">{currentCard?.front}</p>
                        <button onClick={() => setPhase('back')}
                                className="mt-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 text-sm font-semibold shadow-sm hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                            Show Answer
                        </button>
                    </div>)
            }
            case "back": {
                return (
                    <div>
                        <h1 className="text-xl font-semibold">Back</h1>
                        <p className="mt-4">{currentCard?.back}</p>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <button onClick={iKnewIt}
                                        className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 text-sm font-semibold shadow-sm hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-slate-400/50">
                                    I knew it!
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={iForgotIt}
                                        className="rounded-xl bg-red-500 text-white px-3 py-2 text-sm font-semibold shadow-sm hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-red-400/50">
                                    I forgot it
                                </button>
                            </div>
                        </div>
                    </div>

                )
            }
        }
    }

    return (
        <Layout active={deckId} onNavigate={(href) => navigate(href)}>
            {!currentCard && (
                <div className="mt-6">
                    <p className="text-center text-slate-500">No cards due for review! :-)</p>
                </div>
            )}
            {currentCard && (
                <div className="flex flex-col gap-6">
                    {renderPhase(phase)}
                    <div>
                        <p className="text-center text-slate-500">Card {currentCardIndex + 1} of {studyCards.length} to study</p>
                    </div>
                </div>
            )}
        </Layout>
    )
}
