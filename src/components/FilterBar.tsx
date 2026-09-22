import React from 'react';
import { OrderType, MediaFormat, CanonTier, Universe, CharacterArc } from '../types';
import {
  Sparkles,
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Layers,
  Radio,
  Clock,
  Calendar,
  Compass,
  User,
  Filter,
  GitFork,
  X
} from 'lucide-react';

interface FilterBarProps {
  universe: Universe;
  activeOrderType: OrderType;
  onChangeOrderType: (order: OrderType) => void;
  selectedFormats: MediaFormat[];
  onToggleFormat: (format: MediaFormat) => void;
  selectedCanonTiers: CanonTier[];
  onToggleCanonTier: (tier: CanonTier) => void;
  onlyEssential: boolean;
  onToggleEssential: () => void;
  selectedCharacterArcId: string | null;
  onSelectCharacterArc: (arcId: string | null) => void;
  activeBranchId: string;
  onChangeBranch: (branchId: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  universe,
  activeOrderType,
  onChangeOrderType,
  selectedFormats,
  onToggleFormat,
  selectedCanonTiers,
  onToggleCanonTier,
  onlyEssential,
  onToggleEssential,
  selectedCharacterArcId,
  onSelectCharacterArc,
  activeBranchId,
  onChangeBranch,
  onResetFilters,
}) => {
  const formatsList: { format: MediaFormat; label: string; icon: React.ReactNode }[] = [
    { format: 'movie', label: 'Movies', icon: <Film className="w-3.5 h-3.5" /> },
    { format: 'tv_series', label: 'Shows', icon: <Tv className="w-3.5 h-3.5" /> },
    { format: 'animation', label: 'Animation', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { format: 'video_game', label: 'Games', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { format: 'book', label: 'Books', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { format: 'comic', label: 'Comics', icon: <Layers className="w-3.5 h-3.5" /> },
    { format: 'audio_drama', label: 'Audio', icon: <Radio className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Row 1: Journey Paths (Order Types) & Essential Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Order Type Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Journey Path:
          </span>

          <button
            id="btn-order-curated"
            onClick={() => {
              onChangeOrderType('curated');
              onSelectCharacterArc(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeOrderType === 'curated' && !selectedCharacterArcId
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                : 'bg-neutral-950 text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated / Essential</span>
          </button>

          <button
            id="btn-order-chronological"
            onClick={() => {
              onChangeOrderType('chronological');
              onSelectCharacterArc(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeOrderType === 'chronological' && !selectedCharacterArcId
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                : 'bg-neutral-950 text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>In-Universe Chronology</span>
          </button>

          <button
            id="btn-order-release"
            onClick={() => {
              onChangeOrderType('release');
              onSelectCharacterArc(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeOrderType === 'release' && !selectedCharacterArcId
                ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                : 'bg-neutral-950 text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Release Order</span>
          </button>
        </div>

        {/* Essential / No-Filler Toggle */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-essential-track"
            onClick={onToggleEssential}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              onlyEssential
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 font-bold'
                : 'bg-neutral-950 text-amber-300 hover:text-amber-200 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Essential / No-Filler Track</span>
            {onlyEssential && <span className="text-[10px] bg-neutral-950/20 px-1.5 py-0.2 rounded">ON</span>}
          </button>
        </div>
      </div>

      {/* Row 2: Character Arcs (if present in universe) */}
      {universe.characterArcs && universe.characterArcs.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-neutral-800/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 whitespace-nowrap flex items-center gap-1 mr-1">
            <User className="w-3.5 h-3.5 text-amber-400" /> Character Arcs:
          </span>

          {universe.characterArcs.map((arc) => {
            const isSelected = selectedCharacterArcId === arc.id;
            return (
              <button
                key={arc.id}
                id={`btn-arc-${arc.id}`}
                onClick={() => {
                  if (isSelected) {
                    onSelectCharacterArc(null);
                  } else {
                    onSelectCharacterArc(arc.id);
                  }
                }}
                className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <img
                  src={arc.characterAvatar}
                  alt={arc.characterName}
                  referrerPolicy="no-referrer"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span>{arc.characterName}</span>
                {isSelected && <X className="w-3 h-3 text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Row 3: Transmedia Format Badges & Canon Tier Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
        {/* Media Formats */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-neutral-500" /> Formats:
          </span>

          {formatsList.map((f) => {
            const isActive = selectedFormats.includes(f.format);
            return (
              <button
                key={f.format}
                id={`btn-format-${f.format}`}
                onClick={() => onToggleFormat(f.format)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-neutral-800 text-neutral-100 border border-neutral-600'
                    : 'bg-neutral-950 text-neutral-500 hover:text-neutral-300 border border-neutral-850'
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Canon Tiers & Branches */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-canon-primary"
            onClick={() => onToggleCanonTier('primary_canon')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCanonTiers.includes('primary_canon')
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-neutral-950 text-neutral-500 border border-neutral-850'
            }`}
          >
            Primary Canon
          </button>

          <button
            id="btn-canon-legends"
            onClick={() => onToggleCanonTier('legends_extended')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedCanonTiers.includes('legends_extended')
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-neutral-950 text-neutral-500 border border-neutral-850'
            }`}
          >
            Legends / EU
          </button>

          {/* Branch selector if multiple branches */}
          {universe.branches.length > 1 && (
            <div className="flex items-center gap-1 pl-2 border-l border-neutral-800">
              <GitFork className="w-3.5 h-3.5 text-neutral-500" />
              <select
                id="select-branch"
                value={activeBranchId}
                onChange={(e) => onChangeBranch(e.target.value)}
                className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Branches</option>
                {universe.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
