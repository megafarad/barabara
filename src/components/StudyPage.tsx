import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import type { Card } from "../data/model.ts";
import { dataStore } from "../data/localDataStore.ts";
import { DateTime } from "luxon";
import Layout from "./Layout.tsx";

export type StudyPagePhase = "front" | "back";

export function StudyPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [studyCards, setStudyCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [phase, setPhase] = useState<StudyPagePhase>("front");
  const [isFlipping, setIsFlipping] = useState(false);
  const [theme] = useState("light");
  const isDark = theme === "dark";

  const getCardsDueForReview = useCallback(async () => {
    if (!deckId) return [];
    const cards = await dataStore.getCards(deckId);
    return cards.filter(
      (card) => DateTime.fromISO(card.nextReviewAt).diffNow("days").days <= 0
    );
  }, [deckId]);

  useEffect(() => {
    getCardsDueForReview().then(setStudyCards);
  }, [getCardsDueForReview]);

  useEffect(() => {
    if (currentCardIndex >= studyCards.length) {
      getCardsDueForReview().then((redo) => {
        if (redo.length > 0) {
          setStudyCards(redo);
          setCurrentCardIndex(0);
          setPhase("front");
        }
      });
    }
  }, [currentCardIndex, getCardsDueForReview, studyCards.length]);

  const currentCard = studyCards[currentCardIndex];
  const progress = studyCards.length > 0 ? (currentCardIndex / studyCards.length) * 100 : 0;

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setPhase("back");
      setIsFlipping(false);
    }, 160);
  };

  const iForgotIt = async () => {
    await dataStore.upsertCard({
      ...currentCard,
      streak: 0,
      intervalDays: 0,
      nextReviewAt: DateTime.now().toISO(),
    });
    setPhase("front");
    setCurrentCardIndex((p) => p + 1);
  };

  const iKnewIt = async () => {
    const streak = currentCard.streak + 1;
    const intervalDays = streak === 1 ? 1 : streak === 2 ? 3 : Math.min(streak * 2, 60);

    await dataStore.upsertCard({
      ...currentCard,
      streak,
      intervalDays,
      nextReviewAt: DateTime.now().plus({ days: intervalDays }).toISO(),
    });
    setPhase("front");
    setCurrentCardIndex((p) => p + 1);
  };

  return (
    <Layout active={deckId} onNavigate={(href) => navigate(href)}>
      {/* Animated Blurred Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "10s" }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl mb-8 shadow-lg ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-zinc-900/10"
          }`}>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs tracking-wider uppercase font-medium">Focus Mode</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
            Study Session
          </h1>
          <p className={`text-base sm:text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            One card at a time. Stay present, stay focused.
          </p>
        </div>

        {/* Empty State - All Done */}
        {!currentCard && (
          <div className="py-32 text-center">
            <div className={`w-28 h-28 rounded-3xl mx-auto flex items-center justify-center mb-8 backdrop-blur-2xl border shadow-2xl ${
              isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
            }`}>
              <svg className="w-14 h-14 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-4xl font-light tracking-tight mb-4">
              Perfect Session
            </h2>
            <p className={`text-lg max-w-sm mx-auto mb-12 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              All cards reviewed. Your knowledge is growing stronger.
            </p>

            <button
              onClick={() => navigate(`/decks/${deckId}`)}
              className={`px-10 py-4 rounded-full text-sm tracking-wide font-medium transition-all hover:scale-105 shadow-xl ${
                isDark 
                  ? "bg-white text-zinc-900 hover:bg-zinc-100" 
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              Back to Collection
            </button>
          </div>
        )}

        {currentCard && (
          <div className="space-y-6">
            {/* Progress Card */}
            <div className={`rounded-2xl border backdrop-blur-2xl p-6 shadow-xl ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/70 border-zinc-900/10"
            }`}>
              <div className="flex justify-between text-xs tracking-wide mb-4">
                <span className={isDark ? "text-zinc-400" : "text-zinc-600"}>
                  Progress
                </span>
                <span className="font-semibold">
                  {currentCardIndex + 1} of {studyCards.length}
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden backdrop-blur-xl ${
                isDark ? "bg-white/10" : "bg-zinc-900/10"
              }`}>
                <div
                  className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className={`text-xs mt-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                {Math.round(progress)}% complete
              </p>
            </div>

            {/* Main Card - Glossy Finish */}
            <div className={`
              relative rounded-3xl border backdrop-blur-2xl p-12
              min-h-[360px] max-h-[420px] overflow-y-auto
              flex flex-col justify-between
              transition-all duration-300 shadow-2xl
              ${isDark 
                ? "bg-white/5 border-white/10" 
                : "bg-white/80 border-zinc-900/10"
              }
              ${isFlipping ? "scale-[0.97] opacity-60" : "scale-100"}
            `}>
              {/* Glossy Overlay Effect */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />

              {phase === "front" && (
                <>
                  <div className="relative">
                    <span className={`text-xs tracking-wider uppercase font-medium ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                      Question
                    </span>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center py-8">
                    <p className="prose lg:prose-xl text-xl sm:text-2xl lg:text-3xl font-light tracking-tight text-center leading-relaxed">
                      <MDEditor.Markdown source={currentCard.front} rehypePlugins={[rehypeSanitize]}/>
                    </p>
                  </div>

                  <button
                    onClick={handleFlip}
                    className={`relative mt-8 w-full py-4 rounded-xl text-sm tracking-wide font-semibold transition-all hover:scale-105 shadow-xl ${
                      isDark 
                        ? "bg-white text-zinc-900 hover:bg-zinc-100" 
                        : "bg-zinc-900 text-white hover:bg-zinc-800"
                    }`}
                  >
                    Reveal Answer
                  </button>
                </>
              )}

              {phase === "back" && (
                <>
                  <div className="relative">
                    <span className={`text-xs tracking-wider uppercase font-medium ${
                      isDark ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                      Answer
                    </span>
                  </div>

                  <div className="relative flex-1 flex items-center justify-center py-8">
                    <p className="prose lg:prose-xl text-xl sm:text-2xl lg:text-3xl font-light tracking-tight text-center leading-relaxed">
                      <MDEditor.Markdown source={currentCard.back} rehypePlugins={[rehypeSanitize]}/>
                    </p>
                  </div>

                  <div className="relative grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={iForgotIt}
                      className={`
                        py-4 rounded-xl text-sm tracking-wide font-semibold
                        border backdrop-blur-xl transition-all hover:scale-105 shadow-lg
                        ${isDark
                          ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                          : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        }
                      `}
                    >
                      Forgot
                    </button>
                    <button
                      onClick={iKnewIt}
                      className={`
                        py-4 rounded-xl text-sm tracking-wide font-semibold
                        transition-all hover:scale-105 shadow-lg
                        ${isDark
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }
                      `}
                    >
                      Got It
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Tips Card */}
            <div className={`rounded-2xl border backdrop-blur-2xl p-6 shadow-xl ${
              isDark 
                ? "bg-amber-500/5 border-amber-500/20" 
                : "bg-amber-50 border-amber-200"
            }`}>
              <div className="flex items-start gap-4">
                <svg className={`w-5 h-5 shrink-0 mt-0.5 ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    isDark ? "text-amber-300" : "text-amber-900"
                  }`}>
                    Pro Tip
                  </p>
                  <p className={`text-sm ${
                    isDark ? "text-amber-400/80" : "text-amber-700"
                  }`}>
                    Be honest with yourself — accurate self-assessment builds stronger long-term memory
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
