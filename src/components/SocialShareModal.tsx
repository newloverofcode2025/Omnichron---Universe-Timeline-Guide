import React, { useState } from 'react';
import { Universe, OrderType, TimelineItem } from '../types';
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Send,
  MessageCircle,
  ExternalLink,
  Sparkles,
  X,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  universe: Universe;
  activeOrderType: OrderType;
  selectedCharacterArcName?: string;
  completedCount: number;
  totalCount: number;
  nextUpItem?: TimelineItem | null;
  completedItemIds: string[];
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  universe,
  activeOrderType,
  selectedCharacterArcName,
  completedCount,
  totalCount,
  nextUpItem,
  completedItemIds,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pathLabel = selectedCharacterArcName
    ? `${selectedCharacterArcName} Arc`
    : activeOrderType === 'curated'
    ? 'Curated Essential'
    : activeOrderType === 'chronological'
    ? 'In-Universe Chronological'
    : 'Release Order';

  // Construct URL with query parameters representing current journey state
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?u=${encodeURIComponent(universe.id)}&path=${encodeURIComponent(activeOrderType)}`
    : 'https://chronologeek.app';

  const shareTitle = `My ${universe.name} Journey on OmniChron`;
  const shareText = `I'm ${percentage}% through the ${universe.name} timeline (${completedCount}/${totalCount} completed) on the ${pathLabel} track! Next up: ${nextUpItem ? `"${nextUpItem.title}"` : 'Journey Completed!'} 🚀 Check out this spoiler-safe interactive timeline guide:`;

  // Native Web Share API (optimal for mobile iOS / Android)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Native share canceled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopySummary = () => {
    const markdownSummary = `🌌 **OmniChron Journey Progress**
Universe: **${universe.name}**
Path: **${pathLabel}**
Progress: **${completedCount}/${totalCount} (${percentage}%)**
Next Milestone: **${nextUpItem ? nextUpItem.title : 'Complete!'}**
Explore with adaptive spoiler shield: ${shareUrl}`;

    navigator.clipboard.writeText(markdownSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const redditIntentUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`Tracking my ${universe.name} journey (${percentage}% completed) with interactive DAG timelines on OmniChron`)}`;
  const whatsappIntentUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const telegramIntentUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          id="btn-close-share-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-100">Share Your Journey</h3>
            <p className="text-xs text-neutral-400">
              Showcase your timeline progress and invite friends with spoiler-protected links.
            </p>
          </div>
        </div>

        {/* Journey Passport Preview Card */}
        <div className={`p-5 rounded-2xl bg-gradient-to-br ${universe.bannerColor} border border-neutral-700/80 shadow-xl relative overflow-hidden mb-5 text-left`}>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-950/80 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                OmniChron Passport
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-neutral-950/60 px-2 py-0.5 rounded-md">
                {percentage}% Completed
              </span>
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-white">{universe.name}</h4>
              <p className="text-xs text-neutral-200 font-medium flex items-center gap-1.5 mt-0.5">
                <Compass className="w-3.5 h-3.5 text-cyan-300" />
                <span>{pathLabel} Journey</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-neutral-950/60 rounded-full overflow-hidden border border-neutral-700/40">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-neutral-300 font-mono">
                <span>{completedCount} of {totalCount} nodes</span>
                <span>{totalCount - completedCount} remaining</span>
              </div>
            </div>

            {nextUpItem && (
              <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-200 flex items-center justify-between">
                <span className="text-neutral-400">Next Up:</span>
                <span className="font-semibold text-cyan-300 truncate max-w-[200px]">
                  {nextUpItem.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-Native Share Trigger */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            id="btn-native-share"
            onClick={handleNativeShare}
            className="w-full py-3 mb-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open Mobile Share Sheet (WhatsApp, Messages, Stories)</span>
          </button>
        )}

        {/* Social Platforms Row */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Share Directly to Social Platforms
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* X / Twitter */}
            <a
              id="link-share-twitter"
              href={twitterIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white flex flex-col items-center gap-1.5 transition-colors text-center text-xs"
            >
              <Twitter className="w-4 h-4 text-sky-400" />
              <span>X / Twitter</span>
            </a>

            {/* Reddit */}
            <a
              id="link-share-reddit"
              href={redditIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white flex flex-col items-center gap-1.5 transition-colors text-center text-xs"
            >
              <MessageCircle className="w-4 h-4 text-orange-400" />
              <span>Reddit</span>
            </a>

            {/* WhatsApp */}
            <a
              id="link-share-whatsapp"
              href={whatsappIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white flex flex-col items-center gap-1.5 transition-colors text-center text-xs"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              id="link-share-telegram"
              href={telegramIntentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white flex flex-col items-center gap-1.5 transition-colors text-center text-xs"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram</span>
            </a>
          </div>
        </div>

        {/* Copyable Link & Markdown Snapshot */}
        <div className="mt-5 space-y-3 pt-4 border-t border-neutral-800">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Copy Direct Timeline Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono focus:outline-none"
              />
              <button
                id="btn-copy-share-link"
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              id="btn-copy-markdown-summary"
              onClick={handleCopySummary}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 hover:underline"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSummary ? 'Snapshot Copied to Clipboard!' : 'Copy Discord / Forum Markdown Snapshot'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
