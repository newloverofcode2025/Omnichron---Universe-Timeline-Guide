import React, { useState, useMemo } from 'react';
import { TimelineItem, UserProgressState } from '../types';
import {
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  X,
  RotateCcw,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BingeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: TimelineItem[];
  completedItemIds: string[];
  userProgress: UserProgressState;
  onImportProgress: (imported: Partial<UserProgressState>) => void;
  onResetProgress: () => void;
}

export const BingeCalculatorModal: React.FC<BingeCalculatorModalProps> = ({
  isOpen,
  onClose,
  items,
  completedItemIds,
  userProgress,
  onImportProgress,
  onResetProgress,
}) => {
  // Preset default target date 30 days from now
  const defaultTarget = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const [targetDate, setTargetDate] = useState<string>(
    userProgress.targetBingeDate || defaultTarget
  );
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [showImportBox, setShowImportBox] = useState(false);

  // Filter uncompleted items
  const uncompletedItems = useMemo(() => {
    return items.filter((item) => !completedItemIds.includes(item.id));
  }, [items, completedItemIds]);

  // Aggregate totals
  const totalMinutesRemaining = useMemo(() => {
    return uncompletedItems.reduce((acc, item) => acc + (item.durationMinutes || 0), 0);
  }, [uncompletedItems]);

  const totalPagesRemaining = useMemo(() => {
    return uncompletedItems.reduce((acc, item) => acc + (item.pageCount || 0), 0);
  }, [uncompletedItems]);

  const totalHoursRemaining = (totalMinutesRemaining / 60).toFixed(1);

  // Calculate days remaining
  const daysUntilTarget = useMemo(() => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 1);
  }, [targetDate]);

  const weeksUntilTarget = Math.max(daysUntilTarget / 7, 0.5);

  const dailyMinutes = Math.round(totalMinutesRemaining / daysUntilTarget);
  const weeklyHours = (totalMinutesRemaining / 60 / weeksUntilTarget).toFixed(1);
  const weeklyPages = Math.round(totalPagesRemaining / weeksUntilTarget);

  const handleExportJson = () => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      app: 'OmniChron Universe Guide',
      progress: userProgress,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnichron-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyImport = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importJsonText);
      const progressData = parsed.progress || parsed;
      if (!progressData || !Array.isArray(progressData.completedItemIds)) {
        throw new Error('Invalid OmniChron JSON format. Missing completedItemIds array.');
      }
      onImportProgress(progressData);
      confetti({ particleCount: 50, spread: 60 });
      setShowImportBox(false);
      setImportJsonText('');
    } catch (err: any) {
      setImportError(err.message || 'Failed to parse JSON file');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="btn-close-binge-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-100">Binge Calculator & Schedule Planner</h3>
            <p className="text-xs text-neutral-400">
              Calculate your personalized catch-up schedule and manage your offline-first progress.
            </p>
          </div>
        </div>

        {/* Target Date Picker & Preset Buttons */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Target Completion Deadline
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              id="input-binge-target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 text-sm font-medium focus:outline-none focus:border-cyan-400"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 14);
                  setTargetDate(d.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300"
              >
                In 2 Weeks
              </button>
              <button
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 30);
                  setTargetDate(d.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300"
              >
                In 1 Month
              </button>
              <button
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 90);
                  setTargetDate(d.toISOString().split('T')[0]);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300"
              >
                In 3 Months
              </button>
            </div>
          </div>
        </div>

        {/* Pacing Stats Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-center">
            <span className="text-xs text-neutral-400 block mb-1">Unfinished Works</span>
            <span className="text-xl font-mono font-bold text-cyan-400">{uncompletedItems.length}</span>
            <span className="text-[10px] text-neutral-500 block">out of {items.length} total</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-center">
            <span className="text-xs text-neutral-400 block mb-1">Watch Time</span>
            <span className="text-xl font-mono font-bold text-amber-400">{totalHoursRemaining}h</span>
            <span className="text-[10px] text-neutral-500 block">{totalMinutesRemaining} mins</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-center">
            <span className="text-xs text-neutral-400 block mb-1">Reading Load</span>
            <span className="text-xl font-mono font-bold text-emerald-400">{totalPagesRemaining}</span>
            <span className="text-[10px] text-neutral-500 block">pages total</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-center">
            <span className="text-xs text-neutral-400 block mb-1">Time Left</span>
            <span className="text-xl font-mono font-bold text-purple-400">{daysUntilTarget}d</span>
            <span className="text-[10px] text-neutral-500 block">until target</span>
          </div>
        </div>

        {/* Dynamic Plan Recommendation */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-neutral-950 to-neutral-900 border border-cyan-500/30 mb-6">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Recommended Pacing Pace to Catch Up:</span>
          </div>
          {uncompletedItems.length === 0 ? (
            <p className="text-sm text-emerald-400 font-medium">
              You are completely caught up with this universe timeline! Fantastic work.
            </p>
          ) : (
            <p className="text-sm text-neutral-200 leading-relaxed">
              To catch up before <strong className="text-cyan-300 font-mono">{targetDate}</strong> ({daysUntilTarget} days),
              aim for approximately <strong className="text-amber-300">{weeklyHours} hours</strong> of media
              {totalPagesRemaining > 0 ? ` and ~${weeklyPages} pages of reading` : ''} per week
              (about <strong className="text-cyan-300">{dailyMinutes} minutes daily</strong>).
            </p>
          )}
        </div>

        {/* Offline-First Data & Backup Section */}
        <div className="pt-4 border-t border-neutral-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Offline-First Data & Portability (Zero Login Required)
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-export-progress-json"
              onClick={handleExportJson}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-2 border border-neutral-700 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Progress JSON</span>
            </button>

            <button
              id="btn-toggle-import-box"
              onClick={() => setShowImportBox(!showImportBox)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-2 border border-neutral-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Import Progress JSON</span>
            </button>

            <button
              id="btn-reset-progress"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset your progress for this universe?')) {
                  onResetProgress();
                }
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 flex items-center gap-1.5 border border-rose-500/20 transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Import JSON Input Area */}
          {showImportBox && (
            <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <label className="block text-xs font-medium text-neutral-300">
                Paste OmniChron exported JSON text below:
              </label>
              <textarea
                id="textarea-import-json"
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"completedItemIds": ["sw-ep1", "sw-ep2"]}'
                className="w-full h-28 p-3 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-400"
              />
              {importError && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {importError}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImportBox(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  id="btn-apply-import-json"
                  onClick={handleApplyImport}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs"
                >
                  Restore Progress
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
