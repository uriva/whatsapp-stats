'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Filter,
  User
} from 'lucide-react';
import { ConversationThread, ParticipantStats } from '@/lib/types';
import { formatSeconds } from '@/lib/analyzer';

interface ThreadExplorerProps {
  threads: ConversationThread[];
  participants: ParticipantStats[];
}

export function ThreadExplorer({ threads, participants }: ThreadExplorerProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [initiatorFilter, setInitiatorFilter] = useState<string>('all');

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const filteredThreads = threads.filter((t) => {
    const matchesInitiator = initiatorFilter === 'all' || t.initiator === initiatorFilter;
    const matchesSearch =
      searchQuery === '' ||
      t.messages.some((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesInitiator && matchesSearch;
  });

  const getParticipantColor = (name: string) => {
    return participants.find((p) => p.name === name)?.color || '#10B981';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Conversation Thread Inspector</h3>
          <p className="text-xs text-slate-400">
            Browse through distinct chat sessions to inspect how conversations start, flow, and conclude
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages in threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400">Initiator:</span>
          <select
            value={initiatorFilter}
            onChange={(e) => setInitiatorFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Initiators</option>
            {participants.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-Column: Thread List & Message Viewer */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Thread List */}
        <div className="max-h-[560px] space-y-2 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/80 p-4 lg:col-span-5">
          <div className="mb-2 text-xs font-semibold text-slate-400">
            {filteredThreads.length} conversation threads found
          </div>

          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread, index) => {
              const isSelected = thread.id === selectedThread?.id;
              const initiatorColor = getParticipantColor(thread.initiator);
              const firstMsg = thread.messages[0];

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`cursor-pointer rounded-2xl border p-3.5 transition-all ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-500/10 shadow-lg'
                      : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: initiatorColor }}
                      />
                      <span className="text-xs font-bold text-white">
                        {thread.initiator} started
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {thread.startTime.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 line-clamp-1">
                    &quot;{firstMsg?.content || 'Media'}&quot;
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-900 pt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      {thread.durationMinutes}m duration
                    </span>
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 text-slate-300 font-semibold">
                      {thread.messageCount} msgs
                    </span>
                    {thread.gapBeforeHours > 0 && (
                      <span className="text-emerald-400 font-medium">
                        +{thread.gapBeforeHours}h gap
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-center text-xs text-slate-500">No threads matching filter</p>
          )}
        </div>

        {/* Right: Message Viewer for Selected Thread */}
        <div className="flex max-h-[560px] flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-5 lg:col-span-7">
          {selectedThread ? (
            <>
              {/* Thread Info Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Started by {selectedThread.initiator}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      {selectedThread.messageCount} messages
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedThread.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &mdash;{' '}
                    {selectedThread.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({selectedThread.durationMinutes} mins)
                  </p>
                </div>
              </div>

              {/* Messages list */}
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-2">
                {selectedThread.messages.map((m, idx) => {
                  const authorColor = getParticipantColor(m.author);
                  return (
                    <div
                      key={m.id || idx}
                      className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: authorColor }}
                          />
                          <span className="font-bold text-white" style={{ color: authorColor }}>
                            {m.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          {m.responseTimeSeconds && (
                            <span className="text-cyan-400 font-semibold">
                              (replied in {formatSeconds(m.responseTimeSeconds)})
                            </span>
                          )}
                          <span>{m.timeStr}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {m.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              Select a thread to view its messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
