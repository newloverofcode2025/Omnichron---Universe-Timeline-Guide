import React, { useState } from 'react';
import { Shield, ShieldAlert, Eye, EyeOff, Lock, Sparkles } from 'lucide-react';

interface AdaptiveSpoilerShieldProps {
  isAheadOfProgress: boolean;
  spoilerText: string;
  safeText: string;
  highestCompletedTitle?: string;
  itemTitle: string;
  shieldLevel: 'strict' | 'relaxed' | 'off';
  onForceReveal?: () => void;
  isManuallyRevealed?: boolean;
}

export const AdaptiveSpoilerShield: React.FC<AdaptiveSpoilerShieldProps> = ({
  isAheadOfProgress,
  spoilerText,
  safeText,
  highestCompletedTitle,
  itemTitle,
  shieldLevel,
  onForceReveal,
  isManuallyRevealed = false,
}) => {
  const [temporaryPeek, setTemporaryPeek] = useState(false);

  // If shield level is off, or item is completed/behind progress, no shielding is required
  const shouldMask = shieldLevel !== 'off' && isAheadOfProgress && !isManuallyRevealed && !temporaryPeek;

  if (!shouldMask) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-neutral-300 leading-relaxed">{safeText}</p>
        {spoilerText && (
          <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300">
            <span className="font-semibold text-amber-400 block mb-1">Key Canon Events & Revelations:</span>
            <p>{spoilerText}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 overflow-hidden group">
      {/* Blurred background content */}
      <div className="select-none filter blur-md opacity-40 transition-all pointer-events-none space-y-2">
        <p className="text-sm text-neutral-300">{safeText}</p>
        <p className="text-xs text-neutral-400">{spoilerText}</p>
      </div>

      {/* Overlay Alert and Shield controls */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm transition-all text-center">
        <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h5 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
          Adaptive Spoiler Shield
        </h5>
        <p className="text-xs text-neutral-400 max-w-sm mt-1 mb-3">
          {highestCompletedTitle ? (
            <>
              Hidden because this work takes place after your furthest progress in{' '}
              <span className="text-neutral-200 font-medium font-mono">"{highestCompletedTitle}"</span>.
            </>
          ) : (
            'Hidden to preserve story twists until prior chronological milestones are completed.'
          )}
        </p>

        <div className="flex items-center gap-2">
          <button
            id={`btn-peek-${itemTitle.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => {
              setTemporaryPeek(true);
              setTimeout(() => setTemporaryPeek(false), 12000);
            }}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-neutral-700"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Peek (12s)</span>
          </button>

          {onForceReveal && (
            <button
              id={`btn-unveil-${itemTitle.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={onForceReveal}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-amber-500/30"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Unveil Always</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
