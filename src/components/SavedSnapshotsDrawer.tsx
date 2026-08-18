'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderArchive, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  Eye, 
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { db, ensureGuestSession } from '@/lib/instant';
import { ChatAnalysis } from '@/lib/types';

interface SavedSnapshotsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnapshot: (analysis: ChatAnalysis, shareCode: string) => void;
}

export function SavedSnapshotsDrawer({
  isOpen,
  onClose,
  onSelectSnapshot
}: SavedSnapshotsDrawerProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      ensureGuestSession();
    }
  }, [isOpen]);

  // Query snapshots in InstantDB
  const { data, isLoading, error } = db.useQuery({
    snapshots: {
      $: {
        order: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!isOpen) return null;

  const snapshots = data?.snapshots || [];

  const handleCopy = (code: string) => {
    const url = `${window.location.origin}/invite/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this snapshot?')) return;
    try {
      await db.transact(db.tx.snapshots[id].delete());
    } catch (err) {
      console.error('Failed to delete snapshot', err);
    }
  };

  const handleLoad = (s: typeof snapshots[0]) => {
    try {
      const parsedAnalysis: ChatAnalysis = JSON.parse(s.dataJson);
      // Rehydrate Dates
      parsedAnalysis.startDate = new Date(parsedAnalysis.startDate);
      parsedAnalysis.endDate = new Date(parsedAnalysis.endDate);
      parsedAnalysis.threads.forEach(t => {
        t.startTime = new Date(t.startTime);
        t.endTime = new Date(t.endTime);
        t.messages.forEach(m => {
          m.timestamp = new Date(m.timestamp);
        });
      });
      onSelectSnapshot(parsedAnalysis, s.shareCode);
      onClose();
    } catch (err) {
      console.error('Error parsing snapshot JSON', err);
      alert('Could not load this snapshot.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <FolderArchive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Saved Chat Snapshots</h3>
              <p className="text-xs text-slate-400">Realtime database on InstantDB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              <span>Loading saved snapshots...</span>
            </div>
          ) : snapshots.length === 0 ? (
            <div className="flex h-60 flex-col items-center justify-center text-center p-4">
              <FolderArchive className="h-10 w-10 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No snapshots saved yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Upload a WhatsApp chat and click &quot;Save &amp; Share&quot; to generate an invite link.
              </p>
            </div>
          ) : (
            snapshots.map((s) => (
              <div
                key={s.id}
                onClick={() => handleLoad(s)}
                className="group relative cursor-pointer rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-emerald-500/40 hover:bg-slate-950 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                      {s.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Invited by <strong className="text-slate-200">{s.inviterName}</strong>
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-opacity"
                    title="Delete snapshot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {s.inviteMessage && (
                  <p className="mt-2 text-xs text-slate-300 italic line-clamp-1 bg-slate-900/60 rounded-lg px-2.5 py-1">
                    &quot;{s.inviteMessage}&quot;
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-slate-900 pt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(s.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(s.shareCode);
                      }}
                      className="flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                    >
                      {copiedCode === s.shareCode ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>Invite Link</span>
                    </button>

                    <div className="flex items-center gap-0.5 font-bold text-emerald-400">
                      <span>Load</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
