import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Universe,
  TimelineItem,
  OrderType,
  MediaFormat,
  CanonTier,
  UserProgressState,
  TimelineProposal,
  CharacterDossier,
  CharacterArc
} from './types';
import {
  UNIVERSES_DATA,
  CHARACTER_DOSSIERS,
  INITIAL_PROPOSALS
} from './data/universes';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { JourneyPathHeader } from './components/JourneyPathHeader';
import { TimelineListView } from './components/TimelineListView';
import { DAGTimelineGraph } from './components/DAGTimelineGraph';
import { BingeCalculatorModal } from './components/BingeCalculatorModal';
import { CommunityCanonProposalsModal } from './components/CommunityCanonProposalsModal';
import { MetadataIngestionSimulator } from './components/MetadataIngestionSimulator';
import { CharacterDossierModal } from './components/CharacterDossierModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SocialShareModal } from './components/SocialShareModal';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  GitFork,
  ListFilter,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'omnichron_user_progress_v2';
const LOCAL_STORAGE_PROPOSALS_KEY = 'omnichron_proposals_v2';
const LOCAL_STORAGE_ADOPTED_KEY = 'omnichron_adopted_proposals_v2';

const DEFAULT_FORMATS: MediaFormat[] = [
  'movie',
  'tv_series',
  'animation',
  'video_game',
  'book',
  'comic',
  'audio_drama',
];

const DEFAULT_CANON_TIERS: CanonTier[] = [
  'primary_canon',
  'legends_extended',
  'alternate_timeline',
  'apocrypha',
];

export default function App() {
  // Universes state (allows dynamic ingestion addition and community revision adoptions)
  const [universes, setUniverses] = useState<Universe[]>(UNIVERSES_DATA);
  const [activeUniverseId, setActiveUniverseId] = useState<string>('star-wars');

  // Community proposals state
  const [proposals, setProposals] = useState<TimelineProposal[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROPOSALS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
    } catch {
      return INITIAL_PROPOSALS;
    }
  });

  // Adopted proposals IDs (user influenced canon)
  const [adoptedProposalIds, setAdoptedProposalIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ADOPTED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User progress state (Offline-first localStorage)
  const [progressState, setProgressState] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved progress', e);
    }
    return {
      completedItemIds: ['sw-ep1', 'sw-ep2'],
      inProgressItemIds: [],
      favoriteItemIds: [],
      notesByItemId: {},
      spoilerShieldLevel: 'strict',
      revealedSpoilerItemIds: [],
      activeUniverseId: 'star-wars',
      activeOrderType: 'curated',
      activeBranchId: 'all',
      selectedFormats: DEFAULT_FORMATS,
      selectedCanonTiers: DEFAULT_CANON_TIERS,
      onlyEssential: false,
      selectedCharacterArcId: null,
      searchQuery: '',
      targetBingeDate: null,
    };
  });

  // Handle URL query parameters for social shared links (?u=witcher&path=chronological)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const urlUniv = params.get('u');
      const urlPath = params.get('path');
      if (urlUniv && universes.some((u) => u.id === urlUniv)) {
        setActiveUniverseId(urlUniv);
        setProgressState((prev) => ({
          ...prev,
          activeUniverseId: urlUniv,
          activeOrderType: (urlPath as OrderType) || prev.activeOrderType,
        }));
      }
    }
  }, [universes]);

  // Active view mode: Graph vs List
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('list');
  const [dagOrientation, setDagOrientation] = useState<'LR' | 'TB'>('LR');

  // Modals state
  const [isBingeModalOpen, setIsBingeModalOpen] = useState(false);
  const [isProposalsModalOpen, setIsProposalsModalOpen] = useState(false);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);
  const [isDossiersModalOpen, setIsDossiersModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<TimelineItem | null>(null);

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressState));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progressState]);

  // Sync proposals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROPOSALS_KEY, JSON.stringify(proposals));
    } catch (e) {
      console.error('Failed to save proposals', e);
    }
  }, [proposals]);

  // Sync adopted proposals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ADOPTED_KEY, JSON.stringify(adoptedProposalIds));
    } catch (e) {
      console.error('Failed to save adopted proposals', e);
    }
  }, [adoptedProposalIds]);

  const activeUniverse = useMemo(() => {
    return universes.find((u) => u.id === activeUniverseId) || universes[0];
  }, [universes, activeUniverseId]);

  // Handle Universe Switching
  const handleSelectUniverse = (newUniverseId: string) => {
    setActiveUniverseId(newUniverseId);
    setProgressState((prev) => ({
      ...prev,
      activeUniverseId: newUniverseId,
      selectedCharacterArcId: null,
      activeBranchId: 'all',
    }));
  };

  // Toggle Item Completion
  const handleToggleComplete = useCallback((itemId: string) => {
    setProgressState((prev) => {
      const alreadyCompleted = prev.completedItemIds.includes(itemId);
      const newCompleted = alreadyCompleted
        ? prev.completedItemIds.filter((id) => id !== itemId)
        : [...prev.completedItemIds, itemId];

      // Celebrate with confetti if newly completed
      if (!alreadyCompleted) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 },
        });
      }

      return {
        ...prev,
        completedItemIds: newCompleted,
      };
    });
  }, []);

  // Filter and Order Timeline Items
  const processedItems = useMemo(() => {
    let items = [...activeUniverse.items];

    // 1. Search filter
    if (progressState.searchQuery.trim()) {
      const q = progressState.searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.synopsis.toLowerCase().includes(q) ||
          i.charactersInvolved.some((c) => c.toLowerCase().includes(q))
      );
    }

    // 2. Character Arc filter
    if (progressState.selectedCharacterArcId) {
      const arc = activeUniverse.characterArcs.find(
        (a) => a.id === progressState.selectedCharacterArcId
      );
      if (arc) {
        items = items.filter((i) => arc.itemIds.includes(i.id));
      }
    }

    // 3. Format filter
    items = items.filter((i) => progressState.selectedFormats.includes(i.format));

    // 4. Canon tier filter
    items = items.filter((i) => progressState.selectedCanonTiers.includes(i.canonTier));

    // 5. Essential only filter
    if (progressState.onlyEssential) {
      items = items.filter((i) => i.isEssential);
    }

    // 6. Branch filter
    if (progressState.activeBranchId && progressState.activeBranchId !== 'all') {
      items = items.filter((i) => i.branchId === progressState.activeBranchId);
    }

    // 7. Sort by active Journey Path / Order Type
    items.sort((a, b) => {
      if (progressState.selectedCharacterArcId) {
        const arc = activeUniverse.characterArcs.find(
          (aArc) => aArc.id === progressState.selectedCharacterArcId
        );
        if (arc) {
          return arc.itemIds.indexOf(a.id) - arc.itemIds.indexOf(b.id);
        }
      }

      switch (progressState.activeOrderType) {
        case 'chronological':
          return a.chronologicalRank - b.chronologicalRank;
        case 'release':
          return a.releaseRank - b.releaseRank;
        case 'curated':
        default:
          return a.curatedRank - b.curatedRank;
      }
    });

    return items;
  }, [
    activeUniverse,
    progressState.searchQuery,
    progressState.selectedCharacterArcId,
    progressState.selectedFormats,
    progressState.selectedCanonTiers,
    progressState.onlyEssential,
    progressState.activeBranchId,
    progressState.activeOrderType,
  ]);

  // Find furthest completed item for adaptive spoiler protection
  const highestCompletedItem = useMemo(() => {
    // Find the item with highest index in processedItems that is completed
    const completedInView = processedItems.filter((i) =>
      progressState.completedItemIds.includes(i.id)
    );
    if (completedInView.length === 0) return null;
    return completedInView[completedInView.length - 1];
  }, [processedItems, progressState.completedItemIds]);

  // Overall Stats
  const universeTotalCompleted = useMemo(() => {
    return activeUniverse.items.filter((i) =>
      progressState.completedItemIds.includes(i.id)
    ).length;
  }, [activeUniverse.items, progressState.completedItemIds]);

  const totalMinutesRemaining = useMemo(() => {
    return activeUniverse.items
      .filter((i) => !progressState.completedItemIds.includes(i.id))
      .reduce((acc, item) => acc + (item.durationMinutes || 0), 0);
  }, [activeUniverse.items, progressState.completedItemIds]);

  const totalHoursRemaining = (totalMinutesRemaining / 60).toFixed(0);

  // Handlers for Filters
  const handleToggleFormat = (format: MediaFormat) => {
    setProgressState((prev) => {
      const exists = prev.selectedFormats.includes(format);
      const updated = exists
        ? prev.selectedFormats.filter((f) => f !== format)
        : [...prev.selectedFormats, format];
      return { ...prev, selectedFormats: updated.length === 0 ? [format] : updated };
    });
  };

  const handleToggleCanonTier = (tier: CanonTier) => {
    setProgressState((prev) => {
      const exists = prev.selectedCanonTiers.includes(tier);
      const updated = exists
        ? prev.selectedCanonTiers.filter((t) => t !== tier)
        : [...prev.selectedCanonTiers, tier];
      return { ...prev, selectedCanonTiers: updated.length === 0 ? [tier] : updated };
    });
  };

  // Ingest new item dynamically into universe
  const handleIngestNewItem = (newItem: TimelineItem) => {
    setUniverses((prev) =>
      prev.map((u) => {
        if (u.id === activeUniverseId) {
          return {
            ...u,
            items: [newItem, ...u.items],
            totalItemsCount: u.totalItemsCount + 1,
          };
        }
        return u;
      })
    );
    confetti({ particleCount: 30, spread: 50 });
  };

  // Vote on Community Proposal
  const handleVoteProposal = (proposalId: string, type: 'up' | 'down') => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          const wasUp = p.userVote === 'up';
          const wasDown = p.userVote === 'down';

          let up = p.votesUp;
          let down = p.votesDown;

          if (type === 'up') {
            if (wasUp) {
              up -= 1;
              return { ...p, votesUp: up, userVote: undefined };
            }
            if (wasDown) down -= 1;
            up += 1;
            return { ...p, votesUp: up, votesDown: down, userVote: 'up' };
          } else {
            if (wasDown) {
              down -= 1;
              return { ...p, votesDown: down, userVote: undefined };
            }
            if (wasUp) up -= 1;
            down += 1;
            return { ...p, votesUp: up, votesDown: down, userVote: 'down' };
          }
        }
        return p;
      })
    );
  };

  const handleSubmitNewProposal = (newProp: Omit<TimelineProposal, 'id' | 'votesUp' | 'votesDown' | 'status' | 'submittedDate'>) => {
    const created: TimelineProposal = {
      ...newProp,
      id: `prop-${Date.now()}`,
      votesUp: 1,
      votesDown: 0,
      userVote: 'up',
      status: 'under_review',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    setProposals((prev) => [created, ...prev]);
    confetti({ particleCount: 25, spread: 45 });
  };

  // Adopt Community Proposal directly into local active canon
  const handleAdoptProposal = (prop: TimelineProposal) => {
    setUniverses((prev) =>
      prev.map((u) => {
        if (u.id === prop.universeId) {
          return {
            ...u,
            items: u.items.map((item) => {
              if (item.id === prop.targetItemId) {
                return {
                  ...item,
                  canonicalCitation: `${prop.citation} (${prop.citationSource}) — Verified by Community Canon Stewards`,
                };
              }
              return item;
            }),
          };
        }
        return u;
      })
    );

    if (!adoptedProposalIds.includes(prop.id)) {
      setAdoptedProposalIds((prev) => [...prev, prop.id]);
    }
    confetti({ particleCount: 40, spread: 55 });
  };

  // Personal Note Save
  const handleSaveNote = (itemId: string, note: string) => {
    setProgressState((prev) => ({
      ...prev,
      notesByItemId: {
        ...prev.notesByItemId,
        [itemId]: note,
      },
    }));
  };

  // Force reveal individual item spoilers
  const handleForceRevealItem = (itemId: string) => {
    setProgressState((prev) => ({
      ...prev,
      revealedSpoilerItemIds: [...prev.revealedSpoilerItemIds, itemId],
    }));
  };

  const activeUniverseDossiers = useMemo(() => {
    return CHARACTER_DOSSIERS.filter((d) => d.universeId === activeUniverseId);
  }, [activeUniverseId]);

  const activeCharacterArc = useMemo(() => {
    if (!progressState.selectedCharacterArcId) return null;
    return activeUniverse.characterArcs.find(
      (a) => a.id === progressState.selectedCharacterArcId
    );
  }, [activeUniverse, progressState.selectedCharacterArcId]);

  // Determine if the selected modal item is ahead of progress
  const isSelectedDetailAhead = useMemo(() => {
    if (!selectedItemForDetail || !highestCompletedItem) return false;
    const currentIndex = processedItems.findIndex((i) => i.id === selectedItemForDetail.id);
    const highestIndex = processedItems.findIndex((i) => i.id === highestCompletedItem.id);
    return (
      !progressState.completedItemIds.includes(selectedItemForDetail.id) &&
      highestIndex !== -1 &&
      currentIndex > highestIndex
    );
  }, [selectedItemForDetail, highestCompletedItem, processedItems, progressState.completedItemIds]);

  return (
    <div className="min-h-screen bg-[#08090d] text-neutral-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 pb-20 sm:pb-8">
      {/* Top Navbar */}
      <Navbar
        universes={universes}
        activeUniverse={activeUniverse}
        onSelectUniverse={handleSelectUniverse}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        searchQuery={progressState.searchQuery}
        onSearchChange={(q) => setProgressState((prev) => ({ ...prev, searchQuery: q }))}
        totalCompletedCount={universeTotalCompleted}
        totalItemsCount={activeUniverse.items.length}
        totalHoursRemaining={totalHoursRemaining}
        spoilerShieldLevel={progressState.spoilerShieldLevel}
        onChangeSpoilerShield={(level) =>
          setProgressState((prev) => ({ ...prev, spoilerShieldLevel: level }))
        }
        onOpenBingeCalculator={() => setIsBingeModalOpen(true)}
        onOpenProposals={() => setIsProposalsModalOpen(true)}
        onOpenIngestion={() => setIsIngestionModalOpen(true)}
        onOpenDossiers={() => setIsDossiersModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        proposalsCount={proposals.filter((p) => p.universeId === activeUniverseId).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick Universe Hub Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {universes.map((u) => {
            const isActive = u.id === activeUniverseId;
            return (
              <button
                key={u.id}
                onClick={() => handleSelectUniverse(u.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-neutral-800 text-white border-neutral-600 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850 border-neutral-800'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: u.accentColor }}
                />
                <span>{u.name.split(' ')[0]} {u.id === 'marvel-universe' ? 'MCU' : u.id === 'star-trek' ? 'Trek' : u.id === 'star-wars' ? 'Wars' : ''}</span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {u.items.length} works
                </span>
              </button>
            );
          })}
        </div>

        {/* Universe Header Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${activeUniverse.bannerColor} border border-neutral-800/80 shadow-2xl relative overflow-hidden`}>
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {activeUniverse.eras.length} Eras · {activeUniverse.branches.length} Branches
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {activeUniverse.loreContext}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-display">
              {activeUniverse.name}
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
              {activeUniverse.description}
            </p>

            {/* Eras pill preview */}
            <div className="flex items-center gap-2 flex-wrap mt-4">
              {activeUniverse.eras.map((era) => (
                <div
                  key={era.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300 backdrop-blur-sm"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: era.color }} />
                  <span className="font-semibold">{era.name}</span>
                  <span className="text-neutral-500 font-mono text-[10px]">({era.timeframe})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Journey Path Header & Next Milestone Spotlight */}
        <JourneyPathHeader
          activeOrderType={progressState.activeOrderType}
          selectedCharacterArc={activeCharacterArc}
          itemsInPath={processedItems}
          completedItemIds={progressState.completedItemIds}
          onToggleComplete={handleToggleComplete}
          onSelectItem={(item) => setSelectedItemForDetail(item)}
        />

        {/* Multi-Path Journey Filters & Controls */}
        <FilterBar
          universe={activeUniverse}
          activeOrderType={progressState.activeOrderType}
          onChangeOrderType={(order) =>
            setProgressState((prev) => ({ ...prev, activeOrderType: order }))
          }
          selectedFormats={progressState.selectedFormats}
          onToggleFormat={handleToggleFormat}
          selectedCanonTiers={progressState.selectedCanonTiers}
          onToggleCanonTier={handleToggleCanonTier}
          onlyEssential={progressState.onlyEssential}
          onToggleEssential={() =>
            setProgressState((prev) => ({ ...prev, onlyEssential: !prev.onlyEssential }))
          }
          selectedCharacterArcId={progressState.selectedCharacterArcId}
          onSelectCharacterArc={(arcId) =>
            setProgressState((prev) => ({ ...prev, selectedCharacterArcId: arcId }))
          }
          activeBranchId={progressState.activeBranchId}
          onChangeBranch={(branchId) =>
            setProgressState((prev) => ({ ...prev, activeBranchId: branchId }))
          }
          onResetFilters={() =>
            setProgressState((prev) => ({
              ...prev,
              selectedFormats: DEFAULT_FORMATS,
              selectedCanonTiers: DEFAULT_CANON_TIERS,
              onlyEssential: false,
              selectedCharacterArcId: null,
              searchQuery: '',
              activeBranchId: 'all',
            }))
          }
        />

        {/* View Content: DAG Graph vs Structured List */}
        <section>
          {viewMode === 'graph' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span className="flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  Showing <strong>{processedItems.length}</strong> narrative nodes with dependency arcs
                </span>
                <span className="text-neutral-500">
                  Tip: Toggle orientation or zoom to inspect deep transmedia branches
                </span>
              </div>
              <DAGTimelineGraph
                items={processedItems}
                completedItemIds={progressState.completedItemIds}
                onToggleComplete={handleToggleComplete}
                onSelectItem={(item) => setSelectedItemForDetail(item)}
                selectedItemId={selectedItemForDetail?.id}
                orientation={dagOrientation}
                onToggleOrientation={() =>
                  setDagOrientation((prev) => (prev === 'LR' ? 'TB' : 'LR'))
                }
                activeBranchId={progressState.activeBranchId}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span>
                  Showing <strong>{processedItems.length}</strong> entries in{' '}
                  <strong className="text-cyan-400 uppercase tracking-wider font-mono">
                    {progressState.selectedCharacterArcId
                      ? 'Character Arc Journey'
                      : `${progressState.activeOrderType} Order`}
                  </strong>
                </span>
                {progressState.spoilerShieldLevel !== 'off' && (
                  <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Adaptive Shield Active ({progressState.spoilerShieldLevel})
                  </span>
                )}
              </div>

              <TimelineListView
                items={processedItems}
                completedItemIds={progressState.completedItemIds}
                highestCompletedItem={highestCompletedItem}
                onToggleComplete={handleToggleComplete}
                onSelectItem={(item) => setSelectedItemForDetail(item)}
                activeOrderType={progressState.activeOrderType}
                spoilerShieldLevel={progressState.spoilerShieldLevel}
                revealedItemIds={progressState.revealedSpoilerItemIds}
                onForceRevealItem={handleForceRevealItem}
              />
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-900 bg-neutral-950 py-8 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-medium text-neutral-400">
            OmniChron Universe Guide · Next-Generation Transmedia Chronology Architecture
          </p>
          <p>
            Offline-first progress saved to local storage · Zero account requirement · Community Canon Consensus System
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 pt-2 text-neutral-400">
            <span>Star Wars</span>
            <span>•</span>
            <span>Marvel Cinematic Universe</span>
            <span>•</span>
            <span>Star Trek</span>
            <span>•</span>
            <span>The Witcher</span>
            <span>•</span>
            <span>Cyberpunk</span>
            <span>•</span>
            <span>The Legend of Zelda</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BingeCalculatorModal
        isOpen={isBingeModalOpen}
        onClose={() => setIsBingeModalOpen(false)}
        items={activeUniverse.items}
        completedItemIds={progressState.completedItemIds}
        userProgress={progressState}
        onImportProgress={(imported) =>
          setProgressState((prev) => ({ ...prev, ...imported }))
        }
        onResetProgress={() =>
          setProgressState((prev) => ({
            ...prev,
            completedItemIds: [],
            revealedSpoilerItemIds: [],
          }))
        }
      />

      <CommunityCanonProposalsModal
        isOpen={isProposalsModalOpen}
        onClose={() => setIsProposalsModalOpen(false)}
        universeName={activeUniverse.name}
        universeId={activeUniverse.id}
        items={activeUniverse.items}
        proposals={proposals}
        onVoteProposal={handleVoteProposal}
        onSubmitProposal={handleSubmitNewProposal}
        onAdoptProposal={handleAdoptProposal}
        adoptedProposalIds={adoptedProposalIds}
      />

      <MetadataIngestionSimulator
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        activeUniverseId={activeUniverse.id}
        onIngestItem={handleIngestNewItem}
      />

      <CharacterDossierModal
        isOpen={isDossiersModalOpen}
        onClose={() => setIsDossiersModalOpen(false)}
        dossiers={activeUniverseDossiers}
        completedItemIds={progressState.completedItemIds}
        allItems={activeUniverse.items}
      />

      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        universe={activeUniverse}
        activeOrderType={progressState.activeOrderType}
        selectedCharacterArcName={activeCharacterArc?.characterName}
        completedCount={universeTotalCompleted}
        totalCount={activeUniverse.items.length}
        nextUpItem={processedItems.find((i) => !progressState.completedItemIds.includes(i.id))}
        completedItemIds={progressState.completedItemIds}
      />

      <ItemDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        isCompleted={
          selectedItemForDetail
            ? progressState.completedItemIds.includes(selectedItemForDetail.id)
            : false
        }
        onToggleComplete={handleToggleComplete}
        allUniverseItems={activeUniverse.items}
        userNote={
          selectedItemForDetail
            ? progressState.notesByItemId[selectedItemForDetail.id] || ''
            : ''
        }
        onSaveNote={handleSaveNote}
        isAheadOfProgress={isSelectedDetailAhead}
        highestCompletedTitle={highestCompletedItem?.title}
        spoilerShieldLevel={progressState.spoilerShieldLevel}
        isManuallyRevealed={
          selectedItemForDetail
            ? progressState.revealedSpoilerItemIds.includes(selectedItemForDetail.id)
            : false
        }
        onForceReveal={() =>
          selectedItemForDetail && handleForceRevealItem(selectedItemForDetail.id)
        }
      />
    </div>
  );
}
