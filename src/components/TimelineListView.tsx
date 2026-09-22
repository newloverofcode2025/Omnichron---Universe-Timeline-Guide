import React from 'react';
import { TimelineItem, MediaFormat, CanonTier, OrderType } from '../types';
import { AdaptiveSpoilerShield } from './AdaptiveSpoilerShield';
import {
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Layers,
  Radio,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  GitFork,
  Clock,
  BookMarked,
  Info,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface TimelineListViewProps {
  items: TimelineItem[];
  completedItemIds: string[];
  highestCompletedItem?: TimelineItem | null;
  onToggleComplete: (itemId: string) => void;
  onSelectItem: (item: TimelineItem) => void;
  activeOrderType: OrderType;
  spoilerShieldLevel: 'strict' | 'relaxed' | 'off';
  revealedItemIds: string[];
  onForceRevealItem: (itemId: string) => void;
}

const getFormatIcon = (format: MediaFormat) => {
  switch (format) {
    case 'movie':
      return <Film className="w-4 h-4 text-rose-400" />;
    case 'tv_series':
      return <Tv className="w-4 h-4 text-sky-400" />;
    case 'animation':
      return <Sparkles className="w-4 h-4 text-fuchsia-400" />;
    case 'video_game':
      return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
    case 'book':
      return <BookOpen className="w-4 h-4 text-amber-400" />;
    case 'comic':
      return <Layers className="w-4 h-4 text-purple-400" />;
    case 'audio_drama':
      return <Radio className="w-4 h-4 text-indigo-400" />;
  }
};

const getCanonBadge = (tier: CanonTier) => {
  switch (tier) {
    case 'primary_canon':
      return { label: 'Primary Canon', style: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' };
    case 'legends_extended':
      return { label: 'Legends / EU', style: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    case 'alternate_timeline':
      return { label: 'Branch Split', style: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
    case 'apocrypha':
      return { label: 'Apocrypha', style: 'bg-stone-500/10 text-stone-300 border-stone-500/30' };
  }
};

export const TimelineListView: React.FC<TimelineListViewProps> = ({
  items,
  completedItemIds,
  highestCompletedItem,
  onToggleComplete,
  onSelectItem,
  activeOrderType,
  spoilerShieldLevel,
  revealedItemIds,
  onForceRevealItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Info className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-neutral-200">No media items match your active filters</h4>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
          Try expanding your format filters, including Legends or side branches, or clearing your search term.
        </p>
      </div>
    );
  }

  // Find index of highest completed item in the current ordered array
  const highestIndex = highestCompletedItem
    ? items.findIndex((i) => i.id === highestCompletedItem.id)
    : -1;

  return (
    <div className="relative space-y-4">
      {/* Central Timeline Rail (Desktop) */}
      <div className="hidden lg:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-cyan-500/40 via-neutral-800 to-transparent pointer-events-none" />

      {items.map((item, index) => {
        const isCompleted = completedItemIds.includes(item.id);
        const canonBadge = getCanonBadge(item.canonTier);
        // An item is considered ahead of progress if its current index > highest completed index,
        // and it is not already marked completed
        const isAheadOfProgress = !isCompleted && highestIndex !== -1 && index > highestIndex;
        const isManuallyRevealed = revealedItemIds.includes(item.id);

        return (
          <div
            key={item.id}
            id={`timeline-card-${item.id}`}
            onClick={() => onSelectItem(item)}
            className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-4 sm:p-5
              ${isCompleted
                ? 'bg-neutral-900/60 border-emerald-500/30 hover:border-emerald-400/50'
                : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
              }
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Left Column: Number Marker & Checkbox & Main Info */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Checkbox Trigger */}
                <button
                  id={`btn-complete-list-${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(item.id);
                  }}
                  className={`mt-0.5 p-1 rounded-full transition-transform active:scale-95 ${
                    isCompleted
                      ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                  }`}
                  title={isCompleted ? 'Mark as unwatched' : 'Mark as completed'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  {/* Metadata Header Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {/* Format Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {getFormatIcon(item.format)}
                      <span className="capitalize">{item.format.replace('_', ' ')}</span>
                    </span>

                    {/* Canon Tier Pill */}
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${canonBadge.style}`}>
                      {canonBadge.label}
                    </span>

                    {/* Medium Type Pill (Animation vs Live Action) */}
                    {item.mediumType && (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                        item.mediumType === 'animation'
                          ? 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30'
                          : item.mediumType === 'live_action'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}>
                        {item.mediumType === 'animation' ? 'Animation' : item.mediumType === 'live_action' ? 'Live Action' : item.mediumType}
                      </span>
                    )}

                    {/* Essential Marker */}
                    {item.isEssential && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <Sparkles className="w-3 h-3" /> Essential
                      </span>
                    )}

                    {/* Order Index */}
                    <span className="text-xs font-mono text-neutral-500 ml-auto">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Title & Chronological date */}
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-100 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Sub-bar: Chrono date vs Release Date & Duration */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
                    <span className="inline-flex items-center gap-1 font-mono font-medium text-cyan-400">
                      <Clock className="w-3.5 h-3.5" />
                      {item.chronologicalDateStr}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="inline-flex items-center gap-1 text-neutral-400">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      Released {item.releaseYear}
                    </span>
                    {item.durationMinutes && (
                      <>
                        <span className="text-neutral-600">•</span>
                        <span>
                          {Math.floor(item.durationMinutes / 60)}h{' '}
                          {item.durationMinutes % 60 > 0 ? `${item.durationMinutes % 60}m` : ''}
                        </span>
                      </>
                    )}
                    {item.pageCount && (
                      <>
                        <span className="text-neutral-600">•</span>
                        <span className="inline-flex items-center gap-1">
                          <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                          {item.pageCount} pages
                        </span>
                      </>
                    )}
                  </div>

                  {/* Adaptive Spoiler Shield Synopsis */}
                  <div className="mt-3">
                    <AdaptiveSpoilerShield
                      isAheadOfProgress={isAheadOfProgress}
                      safeText={item.synopsis}
                      spoilerText={item.spoilersNotice || ''}
                      highestCompletedTitle={highestCompletedItem?.title}
                      itemTitle={item.title}
                      shieldLevel={spoilerShieldLevel}
                      isManuallyRevealed={isManuallyRevealed}
                      onForceReveal={() => onForceRevealItem(item.id)}
                    />
                  </div>

                  {/* Where To Consume & Availability Links */}
                  {item.whereToConsume && item.whereToConsume.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-800/80">
                      <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                        Available on:
                      </span>
                      {item.whereToConsume.map((platform, pIdx) => (
                        <a
                          key={pIdx}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800/80 hover:bg-neutral-700 text-cyan-300 hover:text-cyan-200 border border-neutral-700/80 transition-colors"
                        >
                          <span>{platform.platformName}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Click Details Chevron */}
              <div className="hidden sm:flex flex-col items-end justify-between self-stretch text-neutral-500 group-hover:text-cyan-400 transition-colors">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                {item.communityConfidenceScore && (
                  <span className="text-[10px] font-mono text-neutral-500" title="Community Canon Consensus">
                    {item.communityConfidenceScore}% consensus
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
