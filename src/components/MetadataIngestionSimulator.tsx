import React, { useState } from 'react';
import { TimelineItem, MediaFormat, CanonTier } from '../types';
import {
  Database,
  Search,
  CheckCircle2,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  X,
  Plus,
  RefreshCw,
  Server
} from 'lucide-react';

interface MetadataIngestionSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  activeUniverseId: string;
  onIngestItem: (newItem: TimelineItem) => void;
}

interface ExternalMockResult {
  source: 'TMDB' | 'IGDB' | 'ComicVine' | 'OpenLibrary';
  sourceId: string;
  title: string;
  format: MediaFormat;
  releaseDate: string;
  releaseYear: number;
  inUniverseChronologySuggestion: string;
  durationMinutes?: number;
  pageCount?: number;
  overview: string;
  suggestedCanonTier: CanonTier;
  confidenceScore: number;
}

const SAMPLE_EXTERNAL_CATALOG: ExternalMockResult[] = [
  {
    source: 'TMDB',
    sourceId: 'tmdb-1022789',
    title: 'Star Wars: Skeleton Crew',
    format: 'tv_series',
    releaseDate: '2024-12-03',
    releaseYear: 2024,
    inUniverseChronologySuggestion: '9 - 10 ABY (Mandoverse Era)',
    durationMinutes: 360,
    overview: 'Four children make a mysterious discovery on their seemingly safe home planet, then get lost in a strange and dangerous galaxy, befriending Jude Law’s Jod Na Nawood.',
    suggestedCanonTier: 'primary_canon',
    confidenceScore: 97,
  },
  {
    source: 'IGDB',
    sourceId: 'igdb-248109',
    title: 'Star Wars: Outlaws',
    format: 'video_game',
    releaseDate: '2024-08-30',
    releaseYear: 2024,
    inUniverseChronologySuggestion: 'Between Empire Strikes Back (3 ABY) and Return of the Jedi (4 ABY)',
    durationMinutes: 2400,
    overview: 'Experience the first-ever open world Star Wars game, set between the events of The Empire Strikes Back and Return of the Jedi. Explore distinct planets across the galaxy as scoundrel Kay Vess.',
    suggestedCanonTier: 'primary_canon',
    confidenceScore: 99,
  },
  {
    source: 'ComicVine',
    sourceId: 'cv-89104',
    title: 'The Witcher: Corvo Bianco (Dark Horse Comics)',
    format: 'comic',
    releaseDate: '2024-05-08',
    releaseYear: 2024,
    inUniverseChronologySuggestion: '1275+ (Direct continuation after Blood and Wine)',
    pageCount: 120,
    overview: 'Geralt has retired to his Corvo Bianco vineyard in Toussaint with Yennefer, hoping for quiet, but the past refuses to leave him alone as bandits threaten his domain.',
    suggestedCanonTier: 'primary_canon',
    confidenceScore: 96,
  },
  {
    source: 'OpenLibrary',
    sourceId: 'ol-312984',
    title: 'Cyberpunk RED: Tales of the RED - Street Stories',
    format: 'book',
    releaseDate: '2022-07-15',
    releaseYear: 2022,
    inUniverseChronologySuggestion: '2045 (Time of the Red)',
    pageCount: 192,
    overview: 'Anthology of 9 full-length missions taking place in the Time of the Red, chronicling Night City’s reconstruction between the Corporate Wars and 2077.',
    suggestedCanonTier: 'primary_canon',
    confidenceScore: 95,
  },
];

export const MetadataIngestionSimulator: React.FC<MetadataIngestionSimulatorProps> = ({
  isOpen,
  onClose,
  activeUniverseId,
  onIngestItem,
}) => {
  const [selectedResult, setSelectedResult] = useState<ExternalMockResult>(SAMPLE_EXTERNAL_CATALOG[0]);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ingestedSuccessId, setIngestedSuccessId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCatalog = SAMPLE_EXTERNAL_CATALOG.filter((item) => {
    const matchesSource = filterSource === 'all' || item.source === filterSource;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleExecuteIngestion = () => {
    const newItem: TimelineItem = {
      id: `ingested-${selectedResult.source.toLowerCase()}-${selectedResult.sourceId}`,
      universeId: activeUniverseId,
      title: selectedResult.title,
      format: selectedResult.format,
      releaseYear: selectedResult.releaseYear,
      releaseDate: selectedResult.releaseDate,
      chronologicalDateStr: selectedResult.inUniverseChronologySuggestion,
      chronologicalRank: 99,
      releaseRank: 99,
      curatedRank: 99,
      isEssential: false,
      durationMinutes: selectedResult.durationMinutes,
      pageCount: selectedResult.pageCount,
      canonTier: selectedResult.suggestedCanonTier,
      branchId: 'branch-canon-main',
      parentItemIds: [],
      synopsis: selectedResult.overview,
      spoilersNotice: 'Ingested via Automated API Pipeline. Unverified narrative spoilers shielded.',
      majorEvents: ['Newly Ingested Transmedia Node'],
      charactersInvolved: ['Cross-Media Cast'],
      whereToConsume: [
        { platformName: selectedResult.source, category: 'store', url: 'https://google.com', badgeText: selectedResult.source }
      ],
      communityConfidenceScore: selectedResult.confidenceScore,
      canonicalCitation: `Ingested from ${selectedResult.source} ID #${selectedResult.sourceId}`,
      posterBg: 'from-blue-950 to-neutral-900',
      eraId: 'era-new-republic',
    };

    onIngestItem(newItem);
    setIngestedSuccessId(newItem.id);
    setTimeout(() => setIngestedSuccessId(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-ingestion-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-100">Automated Metadata Ingestion Pipeline</h3>
            <p className="text-xs text-neutral-400">
              Unifies TMDB, IGDB, ComicVine & OpenLibrary feeds into our normalized transmedia schema.
            </p>
          </div>
        </div>

        {/* API Health & Pipeline Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">TMDB (Film/TV)</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 99.8% Online
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">IGDB (Video Games)</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 99.4% Online
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">ComicVine (Comics)</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 98.9% Online
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">Open Library (Books)</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 100% Online
            </span>
          </div>
        </div>

        {/* Source Provider Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'TMDB', 'IGDB', 'ComicVine', 'OpenLibrary'].map((src) => (
              <button
                key={src}
                onClick={() => setFilterSource(src)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterSource === src
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 border border-neutral-700/60'
                }`}
              >
                {src === 'all' ? 'All Providers' : src}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incoming queue..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Interactive Ingestion Split View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Feed list */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredCatalog.map((item) => {
              const isSelected = selectedResult.sourceId === item.sourceId;
              return (
                <div
                  key={item.sourceId}
                  onClick={() => setSelectedResult(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-cyan-300 border border-neutral-700">
                      {item.source}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {item.sourceId}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-100">{item.title}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{item.overview}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Normalized Schema Inspector & Ingest button */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" /> Normalized Schema Mapping
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  {selectedResult.confidenceScore}% Canon Fit
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-neutral-300 bg-neutral-900/90 p-3 rounded-lg border border-neutral-800 overflow-x-auto">
                <div><span className="text-neutral-500">title:</span> "{selectedResult.title}"</div>
                <div><span className="text-neutral-500">format:</span> "{selectedResult.format}"</div>
                <div><span className="text-neutral-500">releaseDate:</span> "{selectedResult.releaseDate}"</div>
                <div><span className="text-neutral-500">chronologySuggestion:</span> <span className="text-cyan-300">"{selectedResult.inUniverseChronologySuggestion}"</span></div>
                <div><span className="text-neutral-500">canonTier:</span> "{selectedResult.suggestedCanonTier}"</div>
                <div><span className="text-neutral-500">sourceBridge:</span> "{selectedResult.source}:{selectedResult.sourceId}"</div>
              </div>

              <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                {selectedResult.overview}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-800/80 mt-4">
              {ingestedSuccessId ? (
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Successfully mapped & added to active timeline DAG!</span>
                </div>
              ) : (
                <button
                  id="btn-execute-ingestion"
                  onClick={handleExecuteIngestion}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ingest & Inject Node into Active Timeline</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
