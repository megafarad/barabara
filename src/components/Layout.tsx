import React, { useEffect, useState } from "react";
import { useDataStore } from "../context/DataContext.tsx";
import { dataStore } from "../data/localDataStore.ts";

export interface Link {
  key: string;
  label: string;
  href: string;
}

export default function Layout({
  children,
  active,
  onNavigate,
}: {
  children: React.ReactNode;
  active?: string;
  onNavigate?: (href: string, key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { decks, setDecks } = useDataStore();

  const deckLinks: Link[] = decks.map((deck) => ({
    key: deck.id,
    label: deck.name,
    href: `/decks/${deck.id}`,
  }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      const decks = await dataStore.getDecks();
      if (mounted) setDecks(decks);
    })();
    return () => {
      mounted = false;
    };
  }, [setDecks]);

  function handleNavClick(e: React.MouseEvent, href: string, key: string) {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href, key);
      setOpen(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-zinc-900/5 transition-all duration-300">
        <div className="h-20 px-8 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-zinc-900/5 transition-colors"
              onClick={() => setOpen((s) => !s)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <a
              href="/home"
              onClick={(e) => handleNavClick(e, "/home", "home")}
              className="text-xl font-light tracking-[0.2em] hover:opacity-70 transition-opacity"
            >
              BARABARA
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={(e) => handleNavClick(e, "/", "dashboard")}
              className="text-sm px-4 py-2 rounded-full tracking-wide text-zinc-600 hover:text-zinc-900 hover:bg-zinc-900/5 transition-all"
            >
              Dashboard
            </a>

            <a
              href="/create-deck"
              onClick={(e) => handleNavClick(e, "/create-deck", "create")}
              className="text-sm px-5 py-2 rounded-full tracking-wide font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-all hover:scale-105"
            >
              New Deck
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className={`
          ${open ? "block" : "hidden"} md:block
          w-64 shrink-0 border-r bg-indigo-50 border-zinc-900/5
        `}>
          <nav className="p-8">
            <p className="mb-6 text-xs tracking-wider uppercase font-medium text-zinc-400">
              Collections
            </p>

            <ul className="space-y-1">
              {deckLinks.length === 0 && (
                <li className="text-sm py-3 px-4 text-zinc-400">
                  No decks yet
                </li>
              )}

              {deckLinks.map((item) => {
                const isActive = active === item.key;
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href, item.key)}
                      className={`
                        block px-4 py-3 rounded-xl text-sm tracking-wide transition-all
                        ${isActive
                          ? "bg-zinc-900 text-white font-medium"
                          : "text-zinc-600 hover:bg-indigo-100 hover:text-zinc-900"
                        }
                      `}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-12 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}