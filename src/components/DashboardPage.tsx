import Layout from "./Layout.tsx";
import { Link, useNavigate } from "react-router";
import { useDataStore } from "../context/DataContext.tsx";
import { useEffect, useState } from "react";
import { dataStore } from "../data/localDataStore.ts";
import { DateTime } from "luxon";
import type { Deck } from "../data/model.ts";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { decks } = useDataStore();
  const [theme] = useState("light");
  const isDark = theme === "dark";

  return (
    <Layout onNavigate={(href) => navigate(href)}>
      {/* Blurred Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "10s" }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
      </div>

      <div className="max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-20">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl mb-8 shadow-lg ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-zinc-900/10"
          }`}>
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs tracking-wider uppercase font-medium">Dashboard</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900">
            Your Library
          </h1>

          <p className={`text-lg sm:text-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            {decks.length === 0
              ? "Create your first collection and begin your learning journey."
              : `${decks.length} ${decks.length === 1 ? "collection" : "collections"} • Ready to master`}
          </p>
        </div>

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="py-32 text-center">
            <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-8 backdrop-blur-xl border shadow-2xl ${
              isDark ? "bg-white/5 border-white/10" : "bg-white/60 border-zinc-900/10"
            }`}>
              <svg className={`w-12 h-12 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>

            <h2 className="text-4xl font-light tracking-tight mb-4">
              No collections yet
            </h2>

            <p className={`text-base sm:text-lg max-w-md mx-auto mb-12 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}>
              Start building your knowledge base with beautiful flashcard collections
            </p>

            <Link to="/create-deck">
              <button className={`group px-10 py-4 rounded-full text-sm tracking-wide font-medium transition-all hover:scale-105 shadow-2xl ${
                isDark 
                  ? "bg-white text-zinc-900 hover:bg-zinc-100 shadow-white/20" 
                  : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/30"
              }`}>
                <span className="flex items-center gap-2">
                  Create First Collection
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        )}

        {/* Decks Grid */}
        {decks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

function DeckCard({ deck, isDark }: { deck: Deck; isDark: boolean }) {
  const [numberOfCardsToStudy, setNumberOfCardsToStudy] = useState(0);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
    dataStore.getCards(deck.id).then((cards) => {
      const due = cards.filter(
        (card) => DateTime.fromISO(card.nextReviewAt).diffNow("days").days <= 0
      );
      setNumberOfCardsToStudy(due.length);
      setTotalCards(cards.length);
    });
  }, [deck.id]);

  return (
    <Link to={`/decks/${deck.id}`}>
      <div className={`
        group rounded-3xl p-8 border backdrop-blur-2xl
        transition-all duration-500 hover:scale-[1.03] cursor-pointer
        shadow-xl hover:shadow-2xl
        ${isDark 
          ? "bg-white/5 border-white/10 hover:bg-white/10 shadow-white/5" 
          : "bg-white/70 border-zinc-900/10 hover:border-zinc-900/20 shadow-zinc-900/10"
        }
      `}>
        {/* Glossy Overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              numberOfCardsToStudy > 0 ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
            }`} />
            <span className={`text-xs tracking-wider uppercase font-medium ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              Collection
            </span>
          </div>

          {numberOfCardsToStudy > 0 && (
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold backdrop-blur-xl border shadow-lg ${
              isDark 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {numberOfCardsToStudy} due
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`relative text-2xl font-light tracking-tight mb-8 leading-snug transition-colors ${
          isDark ? "text-white group-hover:text-zinc-300" : "text-zinc-900 group-hover:text-zinc-700"
        }`}>
          {deck.name}
        </h3>

        {/* Meta */}
        <div className={`relative flex items-center justify-between text-xs tracking-wide pt-6 border-t ${
          isDark ? "text-zinc-500 border-white/5" : "text-zinc-400 border-zinc-900/5"
        }`}>
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {totalCards} {totalCards === 1 ? "card" : "cards"}
          </span>
          <span>
            {new Date(deck.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Actions */}
        <div className="relative mt-6 flex gap-3">
          {numberOfCardsToStudy > 0 && (
            <Link
              to={`/decks/${deck.id}/study`}
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button className={`w-full py-3.5 text-xs tracking-wide font-semibold rounded-xl transition-all hover:scale-105 shadow-lg ${
                isDark 
                  ? "bg-white text-zinc-900 hover:bg-zinc-100" 
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}>
                Study Now
              </button>
            </Link>
          )}

          <Link
            to={`/decks/${deck.id}`}
            className={numberOfCardsToStudy > 0 ? "flex-1" : "w-full"}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={`w-full py-3.5 text-xs tracking-wide font-semibold rounded-xl border backdrop-blur-xl transition-all hover:scale-105 ${
              isDark 
                ? "border-white/20 hover:bg-white/10" 
                : "border-zinc-900/10 hover:bg-zinc-900/5"
            }`}>
              View Cards
            </button>
          </Link>
        </div>
      </div>
    </Link>
  );
}