import React from 'react';
import { OrderType, TimelineItem, CharacterArc } from '../types';
import {
  Compass,
  Clock,
  Calendar,
  Sparkles,
  User,
  CheckCircle2,
  Circle,
  PlayCircle,
  ArrowRight,
  Info,
  ShieldCheck
} from 'lucide-react';

interface JourneyPathHeaderProps {
  activeOrderType: OrderType;
  selectedCharacterArc?: CharacterArc | null;
  itemsInPath: TimelineItem[];
  completedItemIds: string[];
  onToggleComplete: (itemId: string) => void;
  onSelectItem: (item: TimelineItem) => void;
}

export const JourneyPathHeader: React.FC<JourneyPathHeaderProps> = ({
  activeOrderType,
  selectedCharacterArc,
  itemsInPath,
  completedItemIds,
  onToggleComplete,
  onSelectItem,
}) => {
  const completedInPath = itemsInPath.filter((i) => completedItemIds.includes(i.id));
  const nextUpItem = itemsInPath.find((i) => !completedItemIds.includes(i.id));
  const percentage = itemsInPath.length > 0
    ? Math.round((completedInPath.length / itemsInPath.length) * 100)
    : 0;

  const totalMinutesRemaining = itemsInPath
    .filter((i) => !completedItemIds.includes(i.id))
    .reduce((acc, i) => acc + (i.durationMinutes || 0), 0);
  const hoursRemaining = (totalMinutesRemaining / 60).toFixed(1);

  // Path contextual descriptions
  let pathTitle = '';
  let pathDescription = '';
  let pathBadge = '';
  let pathIcon = <Compass className="w-5 h-5 text-cyan-400" />;

  if (selectedCharacterArc) {
    pathTitle = `${selectedCharacterArc.characterName}’s Personal Journey`;
    pathDescription = selectedCharacterArc.tagline;
    pathBadge = 'Focused Character Track';
    pathIcon = (
      <img
        src={selectedCharacterArc.characterAvatar}
        alt={selectedCharacterArc.characterName}
        referrerPolicy="no-referrer"
        className="w-7 h-7 rounded-full object-cover border border-amber-400"
      />
    );
  } else {
    switch (activeOrderType) {
      case 'chronological':
        pathTitle = 'In-Universe Chronological Journey';
        pathDescription =
          'Follow the universe strictly as events unfolded within the in-universe calendar. Perfect for lore scholars, re-watchers, and understanding causal narrative continuity across centuries.';
        pathBadge = 'Timeline Continuity Track';
        pathIcon = <Clock className="w-5 h-5 text-cyan-400" />;
        break;
      case 'release':
        pathTitle = 'Original Release Order Journey';
        pathDescription =
          'Experience the saga in the exact historical order original audiences discovered it. Preserves foundational plot twists, artistic evolution, and references exactly as the creators intended.';
        pathBadge = 'Audience Premiere Track';
        pathIcon = <Calendar className="w-5 h-5 text-cyan-400" />;
        break;
      case 'curated':
      default:
        pathTitle = 'Curated Essential / No-Filler Journey';
        pathDescription =
          'A precision-crafted narrative route skipping filler episodes, non-essential spinoffs, and repetitive side quests. Designed for newcomers and streamlined re-bingeing.';
        pathBadge = 'Recommended Golden Path';
        pathIcon = <Sparkles className="w-5 h-5 text-amber-400" />;
        break;
    }
  }

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top Banner: Path Definition & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
            {pathIcon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {pathBadge}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {itemsInPath.length} media works in this journey
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-100">{pathTitle}</h2>
            <p className="text-xs text-neutral-400 max-w-2xl mt-1 leading-relaxed">
              {pathDescription}
            </p>
          </div>
        </div>

        {/* Path Quick Metrics */}
        <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800/90 p-3 rounded-xl shrink-0 self-start lg:self-center">
          <div className="text-center">
            <span className="block text-xs font-mono text-neutral-400">Progress</span>
            <span className="text-base font-extrabold font-mono text-cyan-400">{percentage}%</span>
          </div>
          <div className="w-px h-8 bg-neutral-800" />
          <div className="text-center">
            <span className="block text-xs font-mono text-neutral-400">Completed</span>
            <span className="text-base font-extrabold font-mono text-emerald-400">
              {completedInPath.length}/{itemsInPath.length}
            </span>
          </div>
          <div className="w-px h-8 bg-neutral-800" />
          <div className="text-center">
            <span className="block text-xs font-mono text-neutral-400">Est. Remaining</span>
            <span className="text-base font-extrabold font-mono text-amber-400">{hoursRemaining}h</span>
          </div>
        </div>
      </div>

      {/* Next Up Spotlight Card (if path has uncompleted items) */}
      {nextUpItem ? (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-neutral-950 to-neutral-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
            onClick={() => onSelectItem(nextUpItem)}
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <PlayCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Next Milestone Up In This Path
              </span>
              <h4 className="text-sm font-bold text-neutral-100 group-hover:text-cyan-300 truncate transition-colors">
                {nextUpItem.title}
              </h4>
              <span className="text-[11px] text-neutral-400 font-mono">
                {nextUpItem.chronologicalDateStr} · Released {nextUpItem.releaseYear} · {nextUpItem.format.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 justify-end">
            <button
              id={`btn-complete-nextup-${nextUpItem.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(nextUpItem.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark Completed</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>You have completed all milestones in this journey path! Congratulations lore master.</span>
        </div>
      )}
    </div>
  );
};
