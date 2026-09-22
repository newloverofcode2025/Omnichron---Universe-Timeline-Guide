import React, { useState } from 'react';
import { CharacterDossier, TimelineItem } from '../types';
import {
  Users,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  X,
  ChevronRight,
  Skull,
  Heart,
  Zap
} from 'lucide-react';

interface CharacterDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossiers: CharacterDossier[];
  completedItemIds: string[];
  allItems: TimelineItem[];
  onSelectCharacterArc?: (arcId: string) => void;
}

export const CharacterDossierModal: React.FC<CharacterDossierModalProps> = ({
  isOpen,
  onClose,
  dossiers,
  completedItemIds,
  allItems,
  onSelectCharacterArc,
}) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    dossiers[0]?.id || ''
  );

  if (!isOpen || dossiers.length === 0) return null;

  const currentDossier = dossiers.find((d) => d.id === selectedCharacterId) || dossiers[0];

  const getStatusBadge = (status: 'alive' | 'deceased' | 'transformed' | 'unknown') => {
    switch (status) {
      case 'alive':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <Heart className="w-3 h-3" /> Active / Alive
          </span>
        );
      case 'deceased':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
            <Skull className="w-3 h-3" /> Deceased (Legend)
          </span>
        );
      case 'transformed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
            <Zap className="w-3 h-3" /> Transformed State
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-dossier-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-100">Character Dossiers & Dynamic Evolution</h3>
            <p className="text-xs text-neutral-400">
              Biography details unlock progressively based on completed milestones, preventing accidental spoiler deaths.
            </p>
          </div>
        </div>

        {/* Character Selector Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b border-neutral-800">
          {dossiers.map((char) => {
            const isSelected = char.id === currentDossier.id;
            return (
              <button
                key={char.id}
                id={`btn-select-char-${char.id}`}
                onClick={() => setSelectedCharacterId(char.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{char.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Character Profile */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src={currentDossier.avatarUrl}
            alt={currentDossier.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-neutral-700 shadow-md"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h4 className="text-lg font-bold text-neutral-100">{currentDossier.name}</h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                {currentDossier.faction}
              </span>
            </div>
            <p className="text-xs text-neutral-400">{currentDossier.initialRole}</p>
          </div>
        </div>

        {/* Progressive Timeline Bio Stages */}
        <div className="space-y-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Progressive Lore Stages ({currentDossier.stages.length} Milestones)
          </h5>

          {currentDossier.stages.map((stage, idx) => {
            const milestoneItem = allItems.find((i) => i.id === stage.milestoneItemId);
            const isUnlocked = completedItemIds.includes(stage.milestoneItemId);

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-neutral-950 border-neutral-800'
                    : 'bg-neutral-950/40 border-neutral-850'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 font-mono text-[10px] flex items-center justify-center font-bold">
                      {stage.stageNumber}
                    </span>
                    <h5 className="text-sm font-bold text-neutral-200">{stage.stageTitle}</h5>
                  </div>

                  {isUnlocked ? (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(stage.revealedStatus)}
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <Unlock className="w-3 h-3" /> Unlocked
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 font-medium bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
                      <Lock className="w-3 h-3" /> Locked Milestone
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-neutral-300 leading-relaxed pl-7">
                    {stage.content}
                  </p>
                ) : (
                  <div className="pl-7 py-2">
                    <p className="text-xs text-neutral-500 italic">
                      Protected against spoilers. Complete{' '}
                      <strong className="text-neutral-400 font-semibold">
                        "{milestoneItem?.title || stage.milestoneItemId}"
                      </strong>{' '}
                      to unlock this chapter of {currentDossier.name}’s journey.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
