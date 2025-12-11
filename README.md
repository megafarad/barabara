# BaraBara

A small, single-user, browser-based flashcard app with a clean UI, basic spaced review, and localStorage persistence.

The goal of this project is **not** to be a full Anki/Quizlet replacement, but to explore what a minimal, modern, open-source flashcard experience could feel like – something you can self-host as static files and hack on easily.

---

## Why?

There are a lot of great flashcard apps out there, but they all seem to be either proprietary or too complex:

- Anki is too complex for my taste
- Quizlet is full of ads and tracking
- Evernote is too heavyweight for my taste

I wanted something that is simple and without ads or tracking.

---


## Features

Current prototype scope:

- 🗂 **Decks**
    - Create, rename, delete decks
    - See card counts per deck
    - Select an active deck from the sidebar

- 📝 **Cards**
    - Per-deck cards with front / back text

- 📆 **Simple spaced repetition**
    - Each card tracks `streak`, `intervalDays`, and `nextReviewAt`
    - Study mode shows cards that are “due” first
    - “I knew it” / “I forgot” buttons update the schedule with a very simple SRS algorithm

- 💾 **Local-only data**
    - All data is stored in `localStorage` in the browser as JSON
    - No backend, no tracking, no accounts

- 🧱 **Simple, hackable stack**
    - React + TypeScript
    - Vite for bundling/dev server
    - (Optional) Tailwind or inline styles for UI

---

## Non-goals (for this prototype)

Deliberately **out of scope** for this version:

- No user accounts or authentication
- No multi-user or organization features
- No server or database
- No sync between devices
- No imports/exports (Anki / Quizlet) yet
- No fancy card types (images, cloze deletions, LaTeX, etc.)
- No analytics or tracking
- No theming system beyond basic styling

This is intentionally a **small, local-first toy** that could grow into something more – but doesn’t need to.

---

## Tech stack

- [React](https://react.dev/) (with hooks)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (for dev server + build)
- Browser `localStorage` for persistence

You can run and deploy this as a static site; there is no backend component.

---

## Data model

Internally, the app uses a simple TypeScript model:

```ts
type DeckId = string;
type CardId = string;

interface Deck {
  id: DeckId;
  name: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

interface Card {
  id: CardId;
  deckId: DeckId;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;

  streak: number;        // times in a row the user got it right
  intervalDays: number;  // current interval length in days
  nextReviewAt: string;  // ISO timestamp for when the card is due
}

````

The entire state is serialized into `localStorage` under a single key (for example):

```txt
flashcards:v1
```

---

## Getting started

### Prerequisites

* Node.js (recommended: LTS)
* npm, pnpm, or yarn (examples below use `npm`)

### Install

```bash
git clone https://github.com/megafarad/barabara.git
cd barabara
npm install
```

### Run the dev server

```bash
npm run dev
```

Then open the URL Vite prints (typically [http://localhost:5173](http://localhost:5173)).

Changes to source files will hot-reload in the browser.

---

## Building for production

To create a production build:

```bash
npm run build
```

This will produce static assets in the `dist/` directory.

You can serve `dist/` with any static file server, for example:

```bash
npm install -g serve
serve dist
```

Or drop it behind nginx, Netlify, Vercel, GitHub Pages, etc.

---

## Deployment

Because everything is static, deployment is very flexible. A few options:

* **Netlify / Vercel**

    * Connect your GitHub repo
    * Build command: `npm run build`
    * Publish directory: `dist`

* **GitHub Pages**

    * Build locally (`npm run build`)
    * Push the `dist` contents to the `gh-pages` branch
    * Or use an action to do this automatically

* **Custom server**

    * Copy the `dist` directory to your server
    * Serve with nginx, Caddy, or any static file server

---

## Roadmap / Future ideas

This prototype intentionally keeps scope small, but there are plenty of directions it *could* grow:

* Card editor:

    * Richer editing (markdown, images, code blocks)
    * Tags, search, filters
* Study:

    * More advanced SRS (e.g., FSRS-style algorithm)
    * Session stats and streaks
* Data:

    * Import/export (CSV, Anki, Quizlet decks)
* Multi-user:

    * Accounts, classes/cohorts, instructor decks
    * Self-hosted mode for schools/organizations
* Federation / sharing:

    * Public decks people can subscribe to
    * (Long-term crazy idea) ActivityPub support for publishing decks across instances

There’s no promise that any of this gets implemented – this list is here to sketch possible directions, not define a full product roadmap.

---

## License

MIT. See [`LICENSE`](./LICENSE) for details.

