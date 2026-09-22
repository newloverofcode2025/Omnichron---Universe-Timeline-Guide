# 🌌 OmniChron — Universal Transmedia Timeline & Narrative Guide

> **A generational upgrade to timeline tracking for fanbases across all major universes.**  
> Moving beyond static checklists to an interactive, multi-dimensional narrative guide.

---

## 📖 Table of Contents
1. [Why OmniChron? (Beyond Chronologeek)](#why-omnichron-beyond-chronologeek)
2. [Key Differentiators & Architecture](#key-differentiators--architecture)
   - [A. Multi-Path Journey Engine](#a-multi-path-journey-engine)
   - [B. Interactive Directed Acyclic Graph (DAG)](#b-interactive-directed-acyclic-graph-dag)
   - [C. Dynamic Adaptive Spoiler Shield](#c-dynamic-adaptive-spoiler-shield)
   - [D. Transmedia Availability & Formats](#d-transmedia-availability--formats)
   - [E. Binge Calculator & Schedule Planner](#e-binge-calculator--schedule-planner)
   - [F. Community Canon Consensus & Citation Proposals](#f-community-canon-consensus--citation-proposals)
   - [G. Automated Metadata Ingestion Pipeline](#g-automated-metadata-ingestion-pipeline)
3. [Pilot Universe Implementations](#pilot-universe-implementations)
   - [Star Wars (Canon & Legends)](#star-wars-canon--legends)
   - [The Witcher (Books, CDPR Games & Comics)](#the-witcher-books-cdpr-games--comics)
   - [Cyberpunk (TTRPG, Edgerunners & 2077)](#cyberpunk-ttrpg-edgerunners--2077)
   - [The Legend of Zelda (The 3-Way Branching Split)](#the-legend-of-zelda-the-3-way-branching-split)
4. [Tech Stack](#tech-stack)
5. [Getting Started](#getting-started)
6. [Offline-First Data & Backup](#offline-first-data--backup)

---

## 🌟 Why OmniChron? (Beyond Chronologeek)

[Chronologeek](https://chronologeek.app/) proved that fans love minimalist, offline-first progress tracking across books, comics, and films without forced account creation. However, hand-curated solo projects suffer from three fundamental bottlenecks:

1. **The Solo-Curator Bottleneck**: One person cannot read, watch, play, and verify hundreds of books, games, and shows across dozens of franchises.
2. **Static Single-Track Chronology**: Pure in-universe chronology is frequently the *worst* way to experience a franchise (e.g., watching Star Wars prequels first spoils the Vader twist; starting Narnia with *The Magician’s Nephew* ruins the wonder of the Wardrobe).
3. **Linear List Limitations**: Real fictional universes are not straight lines—they are branching trees, multiverse splits, and concurrent webs.

**OmniChron** solves these structural problems with graph theory, community consensus mechanics, transmedia API pipelines, and adaptive spoiler protection.

---

## ⚡ Key Differentiators & Architecture

### A. Multi-Path Journey Engine
Fans can instantly switch between narrative perspectives with one click:
- **Curated / Essential Order ("No-Filler Track")**: The ideal recommended newcomer/re-watcher path that filters filler episodes and non-essential side quests (e.g. Machete Order, Clone Wars Essential Arcs).
- **In-Universe Chronology**: Strict canonical timeline placement using in-universe calendars (BBY/ABY in Star Wars, 1270s in The Witcher, 2070s in Cyberpunk).
- **Release Order**: The historical public release sequence as original fans experienced it.
- **Character Arcs**: Single-hero journeys across books, animated series, and games (e.g., *Ahsoka Tano*, *Ciri of Cintra*, *David Martinez*, *The Hero of Time*).

### B. Interactive Directed Acyclic Graph (DAG)
Universes are modeled as Directed Acyclic Graphs powered by `@xyflow/react` and `dagre`:
- **Branching Splits**: Visualize timeline divergences (e.g., Zelda’s 3-way split at *Ocarina of Time*, Star Wars *Canon vs. Legends* split).
- **Narrative Dependencies**: View prerequisite connections (*"Node B requires Node A"*).
- **Dual Orientation**: Switch between horizontal (Left-to-Right) and vertical (Top-to-Bottom) views.
- **Live State Synchronization**: Checkboxes on nodes update progress and dependencies in real-time.

### C. Dynamic Adaptive Spoiler Shield
- **Milestone-Aware Concealment**: Automatically evaluates your furthest completed milestone in the active journey.
- **Dynamic Masking**: Blurs plot synopses, key revelations, character fates, and faction allegiances for works past your current progress.
- **Controlled Peek**: A 12-second temporary inspection or permanent unveil with safety warnings.
- **Dossier Unlock Engine**: Character biographies progressively unlock in stages (e.g., Ahsoka as Padawan → Order 66 Survivor → Fulcrum Master) only when milestone media is marked completed.

### D. Transmedia Availability & Formats
- Filter by media format: **Movies**, **TV Series**, **Video Games**, **Books**, **Comics**, and **Audio Dramas**.
- Direct streaming & storefront links (Disney+, Netflix, Steam, GOG, Nintendo Switch, Audible, Kindle, Open Library).
- Duration and page counts with real-time aggregations.

### E. Binge Calculator & Schedule Planner
- Set a target date (e.g. upcoming release premiere or custom calendar deadline).
- Calculates remaining media count, runtime hours, and reading pages.
- Delivers a personalized weekly/daily pacing plan (*"Watch 3.2 hours and read 45 pages per week to catch up before December"*).
- **100% Offline-First Guest Mode**: Zero login required; stored in `localStorage` with full JSON Export and Import capabilities.

### F. Community Canon Consensus & Citation Proposals
Solves the single-curator bottleneck by treating timeline ordering like open-source software:
- Fans and lore stewards can submit revision proposals with **exact canonical citations** (*e.g., "Star Wars Timelines page 142", "CDPR QA Interview 1275 Epilogue"*).
- Community upvote/downvote mechanics calculate a real-time consensus score (% approval).
- Classified into *Consensus Approved*, *Under Review*, or *Controversial Split*.

### G. Automated Metadata Ingestion Pipeline
Unifies data across four leading entertainment APIs into a single normalized schema:
- **TMDB API**: Film and television release dates, durations, and overviews.
- **IGDB (Twitch) API**: Video game gameplay lengths, platforms, and release metadata.
- **ComicVine API**: Graphic novels, issues, and story arc groupings.
- **Open Library API**: Fantasy novels, page counts, and publication history.
- Built-in interactive workbench to inspect normalized mappings and inject new nodes into active timelines.

---

## 🌌 Pilot Universe Implementations

### Star Wars (Canon & Legends)
- **Eras**: The High Republic, Fall of the Jedi & Clone Wars, Imperial Reign & Rebellion, The New Republic & Mandoverse, Rise of the First Order, and Legends Expanded Universe.
- **Key Arcs**: Ahsoka Tano journey, Anakin/Darth Vader tragedy, Din Djarin & Grogu.
- **Legends Integration**: *Knights of the Old Republic (3956 BBY)*, *Heir to the Empire (9 ABY)*.

### The Witcher (Sapkowski Books + CDPR Games)
- **Canonical Spine**: Andrzej Sapkowski’s short stories (*The Last Wish*, *Sword of Destiny*) leading seamlessly into the five-novel saga (*Blood of Elves* through *The Lady of the Lake*), continuing into CD Projekt RED’s trilogy (*The Witcher 1*, *2*, *3: Wild Hunt*) and the definitive *Blood and Wine* epilogue (1275).
- **Character Tracks**: Ciri's dimension-hopping saga and Geralt's journey.

### Cyberpunk (2013 - 2077)
- **Spans**: Mike Pondsmith's tabletop RPG lore (*The Fall of Arasaka Tower, 2023*), the Time of the Red, Studio Trigger’s *Cyberpunk: Edgerunners (2076)*, and CDPR’s *Cyberpunk 2077* & *Phantom Liberty (2077)*.
- **Character Tracks**: David Martinez and Johnny Silverhand.

### The Legend of Zelda (The 3-Way Branching Split)
- **Origin**: *Skyward Sword* forging the Master Sword.
- **The Divergence Point**: *Ocarina of Time* where reality fractures into:
  - **Branch A (Fallen Hero)**: *A Link to the Past*, *Link’s Awakening*, classic NES titles.
  - **Branch B (Child Era)**: *Majora’s Mask*, *Twilight Princess*.
  - **Branch C (Adult Era)**: *The Wind Waker*, *Phantom Hourglass*, *Spirit Tracks*.
- **The Convergence**: *Breath of the Wild* and *Tears of the Kingdom*.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript (ES2022)
- **Bundler & Dev Server**: Vite
- **Interactive Graph (DAG)**: `@xyflow/react` + `dagre`
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Icons**: `lucide-react`
- **Animations & Delight**: `canvas-confetti` + `motion`
- **State & Storage**: Offline-first `localStorage` + JSON Schema Import/Export

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed.

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/omnichron-universe-guide.git

# Navigate to project directory
cd omnichron-universe-guide

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running at `http://localhost:3000`.

### Building for Production
```bash
npm run build
```

---

## 🔒 Offline-First Data & Backup

OmniChron requires **no accounts, passwords, or cloud logins**. All completion statuses, custom notes, and spoiler settings are stored locally in your browser.

To transfer progress across devices or backup your data:
1. Click **Binge Calc** in the navigation bar.
2. Click **Export Progress JSON** to download your encrypted progress snapshot.
3. On your other device or browser, click **Import Progress JSON** and paste the JSON to restore your entire watch history instantly.
