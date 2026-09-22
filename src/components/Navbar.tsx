import React from 'react';
import { Universe, OrderType, MediaFormat, CanonTier } from '../types';
import {
  Compass,
  GitFork,
  ListFilter,
  Zap,
  GitPullRequest,
  Cpu,
  Users,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  Share2
} from 'lucide-react';

interface NavbarProps {
  universes: Universe[];
  activeUniverse: Universe;
  onSelectUniverse: (universeId: string) => void;
  viewMode: 'graph' | 'list';
  onChangeViewMode: (mode: 'graph' | 'list') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCompletedCount: number;
  totalItemsCount: number;
  totalHoursRemaining: string;
  spoilerShieldLevel: 'strict' | 'relaxed' | 'off';
  onChangeSpoilerShield: (level: 'strict' | 'relaxed' | 'off') => void;
  onOpenBingeCalculator: () => void;
  onOpenProposals: () => void;
  onOpenIngestion: () => void;
  onOpenDossiers: () => void;
  onOpenShare: () => void;
  proposalsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  universes,
  activeUniverse,
  onSelectUniverse,
  viewMode,
  onChangeViewMode,
  searchQuery,
  onSearchChange,
  totalCompletedCount,
  totalItemsCount,
  totalHoursRemaining,
  spoilerShieldLevel,
  onChangeSpoilerShield,
  onOpenBingeCalculator,
  onOpenProposals,
  onOpenIngestion,
  onOpenDossiers,
  onOpenShare,
  proposalsCount,
}) => {
  const completionPercentage = totalItemsCount > 0
    ? Math.round((totalCompletedCount / totalItemsCount) * 100)
    : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Brand & Universe Picker */}
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Compass className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight text-neutral-100 flex items-center gap-1">
                    OmniChron
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Transmedia
                    </span>
                  </span>
                  <span className="hidden sm:block text-[11px] text-neutral-400">
                    Universal Chronology & Narrative Guide
                  </span>
                </div>
              </div>

              {/* Universe Selector Dropdown */}
              <div className="relative">
                <select
                  id="select-universe"
                  value={activeUniverse.id}
                  onChange={(e) => onSelectUniverse(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 text-xs font-semibold text-neutral-100 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm transition-colors min-h-[40px]"
                >
                  {universes.map((u) => (
                    <option key={u.id} value={u.id} className="bg-neutral-900 text-neutral-100">
                      {u.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Center: Search input */}
            <div className="relative flex-1 max-w-md hidden lg:block">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
              <input
                id="input-nav-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search works, characters, arcs in ${activeUniverse.name}...`}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            {/* Right: Modals & Tool Triggers */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {/* View Mode Toggle: DAG Graph vs List */}
              <div className="flex items-center bg-neutral-900 border border-neutral-800 p-0.5 rounded-xl">
                <button
                  id="btn-view-graph"
                  onClick={() => onChangeViewMode('graph')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px] ${
                    viewMode === 'graph'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Interactive DAG Branching Graph"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">DAG Graph</span>
                </button>

                <button
                  id="btn-view-list"
                  onClick={() => onChangeViewMode('list')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px] ${
                    viewMode === 'list'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Structured Timeline List"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">List View</span>
                </button>
              </div>

              {/* Character Dossiers */}
              <button
                id="btn-nav-dossiers"
                onClick={onOpenDossiers}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[36px]"
                title="Character Dossiers & Bio Evolution"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Dossiers</span>
              </button>

              {/* Community Canon Stewardship */}
              <button
                id="btn-nav-proposals"
                onClick={onOpenProposals}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-purple-300 border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors relative min-h-[36px]"
                title="Community Canon Proposals & Citations"
              >
                <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden md:inline">Canon Stewards</span>
                {proposalsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {proposalsCount}
                  </span>
                )}
              </button>

              {/* Automated Metadata Pipeline */}
              <button
                id="btn-nav-ingestion"
                onClick={onOpenIngestion}
                className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-300 border border-neutral-800 text-xs font-medium flex items-center gap-1.5 transition-colors min-h-[36px]"
                title="Automated Metadata Ingestion Simulator"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">API Ingestion</span>
              </button>

              {/* Binge Calculator & Schedule */}
              <button
                id="btn-nav-binge"
                onClick={onOpenBingeCalculator}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px]"
                title="Binge Calculator, Schedule Planner & Backup"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Binge Calc</span>
              </button>

              {/* Social Sharing Button */}
              <button
                id="btn-nav-share"
                onClick={onOpenShare}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 min-h-[36px]"
                title="Share Timeline Progress & Card"
              >
                <Share2 className="w-3.5 h-3.5 text-neutral-950" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Sub-bar: Universe Stats & Global Spoiler Shield Dropdown */}
          <div className="mt-2.5 pt-2.5 border-t border-neutral-850 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Progress Tracker Bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-medium text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  <strong className="text-emerald-400 font-mono">{totalCompletedCount}</strong> /{' '}
                  <span className="text-neutral-400 font-mono">{totalItemsCount}</span> Completed
                </span>
                <span className="text-neutral-500 font-mono">({completionPercentage}%)</span>
              </div>

              <div className="w-24 sm:w-32 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="hidden sm:flex items-center gap-1 text-neutral-400">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>~{totalHoursRemaining}h remaining</span>
              </div>
            </div>

            {/* Spoiler Shield Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Spoiler Shield:
              </span>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-[11px]">
                <button
                  id="btn-shield-strict"
                  onClick={() => onChangeSpoilerShield('strict')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    spoilerShieldLevel === 'strict'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Strict: Mask all future milestones"
                >
                  Strict
                </button>
                <button
                  id="btn-shield-relaxed"
                  onClick={() => onChangeSpoilerShield('relaxed')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    spoilerShieldLevel === 'relaxed'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Moderate masking"
                >
                  Relaxed
                </button>
                <button
                  id="btn-shield-off"
                  onClick={() => onChangeSpoilerShield('off')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    spoilerShieldLevel === 'off'
                      ? 'bg-neutral-800 text-neutral-300'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Shield Off: Show all summaries"
                >
                  Off
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-Friendly Fixed Bottom Navigation Bar (iOS / Android compatibility) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 px-2 py-1.5 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => onChangeViewMode(viewMode === 'list' ? 'graph' : 'list')}
          className="flex flex-col items-center justify-center p-1.5 text-neutral-300 hover:text-cyan-400 min-h-[44px] min-w-[44px]"
        >
          {viewMode === 'list' ? <GitFork className="w-4 h-4 text-cyan-400" /> : <ListFilter className="w-4 h-4 text-cyan-400" />}
          <span className="text-[10px] mt-0.5">{viewMode === 'list' ? 'Graph' : 'List'}</span>
        </button>

        <button
          onClick={onOpenDossiers}
          className="flex flex-col items-center justify-center p-1.5 text-neutral-300 hover:text-amber-400 min-h-[44px] min-w-[44px]"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] mt-0.5">Dossiers</span>
        </button>

        <button
          onClick={onOpenProposals}
          className="flex flex-col items-center justify-center p-1.5 text-neutral-300 hover:text-purple-400 min-h-[44px] min-w-[44px] relative"
        >
          <GitPullRequest className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] mt-0.5">Stewards</span>
          {proposalsCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-purple-400" />
          )}
        </button>

        <button
          onClick={onOpenBingeCalculator}
          className="flex flex-col items-center justify-center p-1.5 text-neutral-300 hover:text-amber-300 min-h-[44px] min-w-[44px]"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] mt-0.5">Binge</span>
        </button>

        <button
          onClick={onOpenShare}
          className="flex flex-col items-center justify-center p-1.5 text-cyan-400 font-bold min-h-[44px] min-w-[44px]"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Share</span>
        </button>
      </nav>
    </>
  );
};
