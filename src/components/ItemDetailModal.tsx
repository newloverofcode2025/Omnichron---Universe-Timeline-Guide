import React, { useState } from 'react';
import { TimelineItem, MediaFormat } from '../types';
import { AdaptiveSpoilerShield } from './AdaptiveSpoilerShield';
import {
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Layers,
  Radio,
  ExternalLink,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  BookMarked,
  Sparkles,
  GitFork,
  X,
  ShieldAlert,
  FileEdit,
  Quote,
  ShieldCheck
} from 'lucide-react';

interface ItemDetailModalProps {
  item: TimelineItem | null;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  allUniverseItems: TimelineItem[];
  userNote?: string;
  onSaveNote: (itemId: string, note: string) => void;
  isAheadOfProgress?: boolean;
  highestCompletedTitle?: string;
  spoilerShieldLevel?: 'strict' | 'relaxed' | 'off';
  isManuallyRevealed?: boolean;
  onForceReveal?: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  isCompleted,
  onToggleComplete,
  allUniverseItems,
  userNote = '',
  onSaveNote,
  isAheadOfProgress = false,
  highestCompletedTitle,
  spoilerShieldLevel = 'strict',
  isManuallyRevealed = false,
  onForceReveal,
}) => {
  const [noteText, setNoteText] = useState(userNote);
  const [isEditingNote, setIsEditingNote] = useState(false);

  if (!item) return null;

  const parentItems = allUniverseItems.filter((i) => item.parentItemIds.includes(i.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-item-detail"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pr-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-800 text-neutral-200 border border-neutral-700 capitalize">
              {item.format.replace('_', ' ')}
            </span>
            {item.mediumType && (
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                item.mediumType === 'animation'
                  ? 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30'
                  : item.mediumType === 'live_action'
                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                {item.mediumType === 'animation' ? 'Animation' : item.mediumType === 'live_action' ? 'Live Action' : item.mediumType}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {item.canonTier.replace('_', ' ')}
            </span>
            {item.isEssential && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Essential Storyline
              </span>
            )}
            {isAheadOfProgress && spoilerShieldLevel !== 'off' && !isManuallyRevealed && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Lore Protected
              </span>
            )}
          </div>

          <button
            id="btn-detail-toggle-completed"
            onClick={() => onToggleComplete(item.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
            <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
          </button>
        </div>

        {/* Title & Chronological Anchor */}
        <h2 className="text-2xl font-bold text-neutral-100">{item.title}</h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-2 pb-4 border-b border-neutral-800">
          <span className="inline-flex items-center gap-1 font-mono font-medium text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            In-Universe: {item.chronologicalDateStr}
          </span>
          <span className="text-neutral-600">•</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            Released: {item.releaseDate}
          </span>
          {item.durationMinutes && (
            <>
              <span className="text-neutral-600">•</span>
              <span>{Math.floor(item.durationMinutes / 60)}h {item.durationMinutes % 60}m runtime</span>
            </>
          )}
          {item.pageCount && (
            <>
              <span className="text-neutral-600">•</span>
              <span>{item.pageCount} pages</span>
            </>
          )}
        </div>

        {/* Protected Narrative Synopsis via Adaptive Spoiler Shield */}
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Narrative Synopsis & Canon Details
            </h4>
            <AdaptiveSpoilerShield
              isAheadOfProgress={isAheadOfProgress}
              safeText={item.synopsis}
              spoilerText={item.spoilersNotice || ''}
              highestCompletedTitle={highestCompletedTitle}
              itemTitle={item.title}
              shieldLevel={spoilerShieldLevel}
              isManuallyRevealed={isManuallyRevealed}
              onForceReveal={onForceReveal}
            />
          </div>

          {/* Pivotal Canon Events (Protected if shielded) */}
          {item.majorEvents && item.majorEvents.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Pivotal Canon Events
              </h4>
              {isAheadOfProgress && spoilerShieldLevel === 'strict' && !isManuallyRevealed ? (
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-500 italic">
                  Key story beats are hidden by your Spoiler Shield until you reach this chronological point.
                </div>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.majorEvents.map((evt, eIdx) => (
                    <li
                      key={eIdx}
                      className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span>{evt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Canonical Citation Source */}
          {item.canonicalCitation && (
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block mb-0.5">Canonical Verification:</span>
                <p className="text-neutral-400">{item.canonicalCitation}</p>
              </div>
            </div>
          )}

          {/* Narrative Dependencies (DAG connections) */}
          {parentItems.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                Narrative Prerequisites (DAG Predecessors)
              </h4>
              <div className="flex flex-wrap gap-2">
                {parentItems.map((parent) => (
                  <div
                    key={parent.id}
                    className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2 font-mono"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{parent.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Where to Stream / Buy Links */}
          {item.whereToConsume && item.whereToConsume.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Where to Watch / Play / Read
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.whereToConsume.map((platform, idx) => (
                  <a
                    key={idx}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700 text-xs font-medium transition-colors"
                  >
                    <span>{platform.platformName}</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Personal Lore Notes */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                Personal Lore Notes & Scratchpad
              </h4>
              {!isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  {noteText ? 'Edit Note' : '+ Add Note'}
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record your thoughts, theories, or favorite quotes from this work..."
                  className="w-full h-20 p-3 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="px-3 py-1 text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onSaveNote(item.id, noteText);
                      setIsEditingNote(false);
                    }}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold rounded-lg"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : (
              noteText && (
                <p className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 italic">
                  "{noteText}"
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
