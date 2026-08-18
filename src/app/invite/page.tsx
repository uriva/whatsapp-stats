'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Share2, 
  Heart, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Smile, 
  Zap, 
  ShieldCheck, 
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db, id, ensureGuestSession } from '@/lib/instant';
import { ChatAnalysis } from '@/lib/types';
import { StatsOverview } from '@/components/StatsOverview';
import { AwardsGrid } from '@/components/AwardsGrid';
import { ChemistryCard } from '@/components/ChemistryCard';
import { ResponseTimeSection } from '@/components/ResponseTimeSection';
import { InitiationSection } from '@/components/InitiationSection';
import { MessagesMediaSection } from '@/components/MessagesMediaSection';
import { HeatmapSection } from '@/components/HeatmapSection';
import { WordsEmojisSection } from '@/components/WordsEmojisSection';
import { ThreadExplorer } from '@/components/ThreadExplorer';
import { WrappedModal } from '@/components/WrappedModal';

function InviteContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    // Check search param 'code' or extract from pathname
    const paramCode = searchParams.get('code') || searchParams.get('invite') || searchParams.get('snapshot');
    if (paramCode) {
      setCode(paramCode);
    } else if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length > 1) {
        setCode(parts[parts.length - 1]);
      }
    }
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'responses' | 'initiations' | 'media' | 'heatmaps' | 'words' | 'threads'
  >('overview');
  const [showWrapped, setShowWrapped] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto guest login
  useEffect(() => {
    ensureGuestSession();
  }, []);

  // Query snapshot from InstantDB
  const { data, isLoading } = db.useQuery({
    snapshots: {
      $: {
        where: {
          shareCode: code || '__none__',
        },
      },
      reactions: {
        $: {
          order: {
            createdAt: 'desc',
          },
        },
      },
    },
  });

  const snapshot = data?.snapshots?.[0];
  const reactions = snapshot?.reactions || [];

  // Parse analysis JSON when loaded
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);

  useEffect(() => {
    if (snapshot?.dataJson) {
      try {
        const parsed: ChatAnalysis = JSON.parse(snapshot.dataJson);
        parsed.startDate = new Date(parsed.startDate);
        parsed.endDate = new Date(parsed.endDate);
        parsed.threads.forEach((t) => {
          t.startTime = new Date(t.startTime);
          t.endTime = new Date(t.endTime);
          t.messages.forEach((m) => {
            m.timestamp = new Date(m.timestamp);
          });
        });
        setAnalysis(parsed);
      } catch (err) {
        console.error('Error parsing snapshot JSON', err);
      }
    }
  }, [snapshot]);

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendReaction = async (emoji: string) => {
    if (!snapshot) return;
    try {
      const reactionId = id();
      await db.transact(
        db.tx.reactions[reactionId]
          .create({
            emoji,
            authorName: 'Guest Friend',
            createdAt: Date.now(),
          })
          .link({ snapshot: snapshot.id })
      );

      // Trigger mini confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Error sending reaction', err);
    }
  };

  if (isLoading || (!code && typeof window !== 'undefined' && window.location.search)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080C14] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        <p className="mt-4 text-sm font-semibold text-slate-300">
          Loading WhatsApp Chat Stats Invite...
        </p>
        <p className="mt-1 text-xs text-slate-500">Connecting securely as guest via InstantDB</p>
      </div>
    );
  }

  if (!snapshot || !analysis) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080C14] p-4 text-white">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Invite Link Not Found</h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            This chat snapshot invite might have been deleted or the code is missing.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-transform active:scale-95 hover:bg-emerald-400"
            >
              Analyze Your Own WhatsApp Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] pb-20 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Banner */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span>WhatsStats Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied Link' : 'Copy Invite'}</span>
            </button>
            <button
              onClick={() => setShowWrapped(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110"
            >
              <Sparkles className="h-3.5 w-3.5 fill-slate-950 stroke-none" />
              <span>Wrapped Card</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Inviter Greeting Hero Box */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>You&apos;ve Been Invited!</span>
              </div>
              <h1 className="mt-3 text-2xl font-black text-white sm:text-4xl">
                {snapshot.title}
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                <strong className="text-emerald-400">{snapshot.inviterName}</strong> invited you to explore your WhatsApp stats and chat dynamics.
              </p>
              {snapshot.inviteMessage && (
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 italic">
                  &quot;{snapshot.inviteMessage}&quot;
                </div>
              )}
            </div>

            {/* Guest session badge */}
            <div className="flex flex-col items-start sm:items-end gap-2 text-xs">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Logged in as Guest &bull; InstantDB</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Shared on {new Date(snapshot.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Real-time Emoji Reactions Bar */}
          <div className="mt-6 border-t border-slate-800/80 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  React to these stats:
                </span>
                <div className="flex gap-1.5">
                  {['🔥', '❤️', '😂', '⚡', '🤯', '👏', '🥺'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSendReaction(emoji)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-base transition-transform active:scale-125 hover:scale-110 hover:border-emerald-500/50"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reaction counter badges */}
              {reactions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {Array.from(
                    reactions.reduce((map, r) => {
                      map.set(r.emoji, (map.get(r.emoji) || 0) + 1);
                      return map;
                    }, new Map<string, number>())
                  ).map(([emoji, count]) => (
                    <span
                      key={emoji}
                      className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-0.5 text-xs text-slate-300"
                    >
                      <span>{emoji}</span>
                      <span className="font-bold text-emerald-400">{count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="mt-8 flex overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-1.5">
          {[
            { id: 'overview', label: 'Overview & Awards', icon: Sparkles },
            { id: 'responses', label: 'Response Times', icon: Clock },
            { id: 'initiations', label: 'Who Texts First', icon: Zap },
            { id: 'media', label: 'Messages & Media', icon: MessageSquare },
            { id: 'heatmaps', label: 'Diurnal Heatmaps', icon: Calendar },
            { id: 'words', label: 'Emojis & Words', icon: Smile },
            { id: 'threads', label: 'Thread Explorer', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Panel */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <StatsOverview analysis={analysis} />
              {analysis.chemistryScore && (
                <ChemistryCard
                  chemistry={analysis.chemistryScore}
                  participants={analysis.participants}
                />
              )}
              <AwardsGrid
                awards={analysis.awards}
                participants={analysis.participants}
              />
            </div>
          )}

          {activeTab === 'responses' && (
            <ResponseTimeSection participants={analysis.participants} />
          )}

          {activeTab === 'initiations' && (
            <InitiationSection analysis={analysis} />
          )}

          {activeTab === 'media' && (
            <MessagesMediaSection participants={analysis.participants} />
          )}

          {activeTab === 'heatmaps' && (
            <HeatmapSection analysis={analysis} />
          )}

          {activeTab === 'words' && (
            <WordsEmojisSection analysis={analysis} />
          )}

          {activeTab === 'threads' && (
            <ThreadExplorer
              threads={analysis.threads}
              participants={analysis.participants}
            />
          )}
        </div>
      </main>

      {/* Wrapped Modal */}
      {showWrapped && (
        <WrappedModal
          isOpen={showWrapped}
          onClose={() => setShowWrapped(false)}
          analysis={analysis}
        />
      )}
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#080C14] text-white">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}
