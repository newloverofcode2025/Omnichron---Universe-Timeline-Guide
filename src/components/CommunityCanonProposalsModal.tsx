import React, { useState } from 'react';
import { TimelineProposal, TimelineItem } from '../types';
import {
  GitPullRequest,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  CheckCircle2,
  Clock,
  PlusCircle,
  X,
  Send,
  Sparkles,
  AlertCircle,
  Filter,
  ArrowUpDown,
  CheckCheck
} from 'lucide-react';

interface CommunityCanonProposalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  universeName: string;
  universeId: string;
  items: TimelineItem[];
  proposals: TimelineProposal[];
  onVoteProposal: (proposalId: string, type: 'up' | 'down') => void;
  onSubmitProposal: (newProp: Omit<TimelineProposal, 'id' | 'votesUp' | 'votesDown' | 'status' | 'submittedDate'>) => void;
  onAdoptProposal?: (proposal: TimelineProposal) => void;
  adoptedProposalIds?: string[];
}

export const CommunityCanonProposalsModal: React.FC<CommunityCanonProposalsModalProps> = ({
  isOpen,
  onClose,
  universeName,
  universeId,
  items,
  proposals,
  onVoteProposal,
  onSubmitProposal,
  onAdoptProposal,
  adoptedProposalIds = [],
}) => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [proposalType, setProposalType] = useState<TimelineProposal['proposalType']>('correct_citation');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [citation, setCitation] = useState('');
  const [citationSource, setCitationSource] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'consensus_approved' | 'under_review'>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');

  if (!isOpen) return null;

  const activeUniverseProposals = proposals
    .filter((p) => p.universeId === universeId)
    .filter((p) => (statusFilter === 'all' ? true : p.status === statusFilter))
    .sort((a, b) => {
      if (sortBy === 'votes') {
        const scoreA = a.votesUp - a.votesDown;
        const scoreB = b.votesUp - b.votesDown;
        return scoreB - scoreA;
      }
      return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !citation.trim()) return;

    const targetItem = items.find((i) => i.id === selectedItemId);
    onSubmitProposal({
      universeId,
      targetItemId: selectedItemId,
      targetItemTitle: targetItem?.title || 'General Universe Canon',
      proposalType,
      title: title.trim(),
      proposedPlacementDescription: description.trim(),
      citation: citation.trim(),
      citationSource: citationSource.trim() || 'Community Lore Archive',
      submittedBy: authorName.trim() || 'Anonymous Lore Steward',
    });

    setTitle('');
    setDescription('');
    setCitation('');
    setCitationSource('');
    setShowSubmitForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-proposals-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-100">Community Canon Stewardship</h3>
              <p className="text-xs text-neutral-400">
                Peer-reviewed timeline revisions & canonical citation voting for {universeName}
              </p>
            </div>
          </div>

          <button
            id="btn-open-submit-proposal"
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-500/20 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showSubmitForm ? 'View Proposals' : 'Submit Revision Proposal'}</span>
          </button>
        </div>

        {/* Filter and Sorting Sub-bar (when viewing proposals) */}
        {!showSubmitForm && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 flex items-center gap-1 font-medium">
                <Filter className="w-3.5 h-3.5 text-neutral-500" /> Filter:
              </span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                All Proposals
              </button>
              <button
                onClick={() => setStatusFilter('consensus_approved')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  statusFilter === 'consensus_approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Consensus Approved
              </button>
              <button
                onClick={() => setStatusFilter('under_review')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  statusFilter === 'under_review'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Under Review
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 flex items-center gap-1 font-medium">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" /> Sort:
              </span>
              <button
                onClick={() => setSortBy(sortBy === 'votes' ? 'recent' : 'votes')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 hover:text-white"
              >
                {sortBy === 'votes' ? 'Top Consensus' : 'Most Recent'}
              </button>
            </div>
          </div>
        )}

        {/* Form to submit proposal */}
        {showSubmitForm ? (
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
            <h4 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Submit Timeline Revision Proposal
            </h4>
            <p className="text-xs text-neutral-400">
              Back your proposed chronological change with canonical citations (e.g. official books, author statements, or in-universe episode timestamps).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Target Media Item</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title} ({i.releaseYear})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Proposal Type</label>
                <select
                  value={proposalType}
                  onChange={(e) => setProposalType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
                >
                  <option value="correct_citation">Add / Correct Canonical Citation</option>
                  <option value="move_order">Reorder Chronological Placement</option>
                  <option value="timeline_branch">Propose Timeline Branch / Split</option>
                  <option value="change_tier">Revise Canon Tier Classification</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Proposal Summary Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Adjust Episode 1 to match Revenge of the Sith opening"
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Detailed Explanation & Chronological Rationale</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Describe why this placement is more accurate to the canon narrative flow..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Exact Citation / Timestamp / Page</label>
                <input
                  type="text"
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="e.g., Star Wars Timelines p.142 / Chapter 4 page 56"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Source / Publication Name</label>
                <input
                  type="text"
                  value={citationSource}
                  onChange={(e) => setCitationSource(e.target.value)}
                  placeholder="e.g., Official Lucasfilm Press, CDPR Lore Guide"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Steward Handle (Optional)"
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 w-52"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Proposal
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {activeUniverseProposals.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-neutral-800 bg-neutral-950">
                <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-neutral-300">No proposals match this filter</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Be the first community steward to propose a chronological refinement or canonical citation!
                </p>
              </div>
            ) : (
              activeUniverseProposals.map((prop) => {
                const totalVotes = prop.votesUp + prop.votesDown;
                const approvalRate = totalVotes > 0 ? Math.round((prop.votesUp / totalVotes) * 100) : 100;
                const isAdopted = adoptedProposalIds.includes(prop.id);

                return (
                  <div
                    key={prop.id}
                    id={`proposal-card-${prop.id}`}
                    className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30">
                            {prop.proposalType.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono text-cyan-400">
                            Target: {prop.targetItemTitle}
                          </span>
                          {prop.status === 'consensus_approved' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Consensus Approved
                            </span>
                          )}
                          {isAdopted && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                              <CheckCheck className="w-3 h-3" /> Adopted in Your Canon
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-neutral-100">{prop.title}</h4>
                        <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                          {prop.proposedPlacementDescription}
                        </p>
                      </div>

                      {/* Voting Buttons */}
                      <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl shrink-0">
                        <button
                          id={`btn-upvote-${prop.id}`}
                          onClick={() => onVoteProposal(prop.id, 'up')}
                          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                            prop.userVote === 'up'
                              ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                          }`}
                          title="Upvote canonical accuracy"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="font-mono">{prop.votesUp}</span>
                        </button>

                        <button
                          id={`btn-downvote-${prop.id}`}
                          onClick={() => onVoteProposal(prop.id, 'down')}
                          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                            prop.userVote === 'down'
                              ? 'bg-rose-500/20 text-rose-400 font-bold'
                              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                          }`}
                          title="Downvote inaccurate placement"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span className="font-mono">{prop.votesDown}</span>
                        </button>
                      </div>
                    </div>

                    {/* Citation Box */}
                    <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-start sm:items-center gap-2 text-neutral-300">
                        <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                        <div>
                          <span className="italic text-neutral-200 font-serif">"{prop.citation}"</span>
                          <span className="text-neutral-500 ml-1.5">— {prop.citationSource}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-[11px] font-mono text-neutral-400">
                          {approvalRate}% approval ({totalVotes} votes)
                        </span>
                        <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 transition-all duration-300"
                            style={{ width: `${approvalRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Row: Meta & Adopt Button */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                      <span>Submitted by <strong className="text-neutral-400">{prop.submittedBy}</strong> · {prop.submittedDate}</span>

                      {onAdoptProposal && (
                        <button
                          id={`btn-adopt-proposal-${prop.id}`}
                          onClick={() => onAdoptProposal(prop)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isAdopted
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
                          }`}
                        >
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>{isAdopted ? 'Applied to Your Canon' : 'Adopt Into Your Canon'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
