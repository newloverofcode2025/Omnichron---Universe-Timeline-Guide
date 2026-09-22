export type MediaFormat =
  | 'movie'
  | 'tv_series'
  | 'animation'
  | 'video_game'
  | 'book'
  | 'comic'
  | 'audio_drama';

export type MediumType =
  | 'live_action'
  | 'animation'
  | 'interactive'
  | 'literature'
  | 'audio';

export type CanonTier =
  | 'primary_canon'        // Official primary canon (e.g. Disney Star Wars, CDPR/Sapkowski canon)
  | 'legends_extended'     // Legends / Extended Universe / Non-canonical legends
  | 'alternate_timeline'   // Multiverse branch, What If, alternate outcome
  | 'apocrypha';           // TTRPG guidebooks, non-narrative reference

export type OrderType =
  | 'chronological'        // Strict in-universe chronological timeline
  | 'release'              // Real-world public release order
  | 'curated'              // Essential / Recommended / Machete order
  | 'character_arc';       // Character-centric narrative journey

export interface WhereToConsume {
  platformName: string;
  category: 'streaming' | 'store' | 'subscription' | 'library';
  url: string;
  badgeText?: string;
  isFreeWithSub?: boolean;
}

export interface CharacterBioStage {
  milestoneItemId: string; // The item ID that must be completed to unlock this stage
  stageNumber: number;
  stageTitle: string;
  content: string; // Biography, allegiance, status at this point
  revealedStatus: 'alive' | 'deceased' | 'transformed' | 'unknown';
}

export interface CharacterDossier {
  id: string;
  name: string;
  universeId: string;
  avatarUrl: string;
  initialRole: string;
  faction: string;
  stages: CharacterBioStage[];
}

export interface TimelineProposal {
  id: string;
  universeId: string;
  targetItemId: string;
  targetItemTitle: string;
  proposalType: 'move_order' | 'change_tier' | 'timeline_branch' | 'correct_citation';
  title: string;
  proposedPlacementDescription: string;
  citation: string;
  citationSource: string; // e.g. "Star Wars Timelines p.142", "CDPR Lore Compendium"
  submittedBy: string;
  votesUp: number;
  votesDown: number;
  userVote?: 'up' | 'down';
  status: 'under_review' | 'consensus_approved' | 'rejected';
  submittedDate: string;
}

export interface TimelineItem {
  id: string;
  universeId: string;
  title: string;
  originalTitle?: string;
  format: MediaFormat;
  mediumType?: MediumType;
  releaseYear: number;
  releaseDate: string; // YYYY-MM-DD
  chronologicalDateStr: string; // In-universe time notation (e.g. "32 BBY", "1272", "2077")
  chronologicalRank: number;    // Absolute chronological sorting index
  releaseRank: number;          // Absolute release sorting index
  curatedRank: number;          // Curated / Machete / Essential sorting index
  isEssential: boolean;         // True if in "No-Filler / Road to Core" track
  durationMinutes?: number;     // Runtime in minutes (for films, series, games)
  pageCount?: number;           // For books and comics
  canonTier: CanonTier;
  branchId: string;             // Branch ID (e.g. "sacred", "fallen_hero", "legends", "main")
  parentItemIds: string[];      // For DAG dependency rendering (node dependencies)
  synopsis: string;             // Plain spoiler-free summary
  spoilersNotice?: string;      // Specific major reveal shielded
  majorEvents: string[];        // Key events in this node
  charactersInvolved: string[]; // Character names for character-centric filtering
  whereToConsume: WhereToConsume[];
  communityConfidenceScore: number; // 0 - 100%
  canonicalCitation?: string;
  posterBg: string;             // Gradient or color theme
  eraId: string;                // Grouping era
}

export interface TimelineEra {
  id: string;
  name: string;
  timeframe: string;
  description: string;
  color: string;
}

export interface TimelineBranch {
  id: string;
  name: string;
  description: string;
  color: string;
  isMainBranch?: boolean;
  timeframe?: string;
}

export interface CharacterArc {
  id: string;
  characterName: string;
  characterAvatar: string;
  tagline: string;
  itemIds: string[];
}

export interface Universe {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bannerColor: string;
  accentColor: string;
  eras: TimelineEra[];
  branches: TimelineBranch[];
  characterArcs: CharacterArc[];
  items: TimelineItem[];
  defaultOrder: OrderType;
  totalItemsCount: number;
  loreContext: string;
}

export interface UserProgressState {
  completedItemIds: string[];
  inProgressItemIds: string[];
  favoriteItemIds: string[];
  notesByItemId: Record<string, string>;
  spoilerShieldLevel: 'strict' | 'relaxed' | 'off';
  revealedSpoilerItemIds: string[];
  activeUniverseId: string;
  activeOrderType: OrderType;
  activeBranchId: string; // 'all' or specific branch
  selectedFormats: MediaFormat[];
  selectedCanonTiers: CanonTier[];
  onlyEssential: boolean;
  selectedCharacterArcId: string | null;
  searchQuery: string;
  targetBingeDate: string | null;
}
