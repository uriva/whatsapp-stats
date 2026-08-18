'use client';

import React from 'react';
import { Smile, Sparkles, BookOpen, MessageSquare, Hash } from 'lucide-react';
import { ChatAnalysis, ParticipantStats } from '@/lib/types';

interface WordsEmojisSectionProps {
  analysis: ChatAnalysis;
}

export function WordsEmojisSection({ analysis }: WordsEmojisSectionProps) {
  const { topGlobalEmojis, topGlobalWords, participants, totalEmojis } = analysis;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
          <Smile className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Emojis & Vocabulary</h3>
          <p className="text-xs text-slate-400">
            Most frequent expressions, reactions, and recurring vocabulary
          </p>
        </div>
      </div>

      {/* Global Emoji Ranking Bar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-white">Top Used Emojis Overall</h4>
            <p className="text-xs text-slate-400">{totalEmojis.toLocaleString()} total emojis dropped</p>
          </div>
        </div>

        {topGlobalEmojis.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {topGlobalEmojis.slice(0, 12).map((item, idx) => (
              <div
                key={item.emoji}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-2xl">
                  {item.emoji}
                </div>
                <div>
                  <div className="text-sm font-black text-white">{item.count.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">#{idx + 1} most used</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs text-slate-400">No emojis found in this chat export.</p>
        )}
      </div>

      {/* Per-Participant Emojis & Top Words */}
      <div className="grid gap-6 lg:grid-cols-2">
        {participants.map((p) => (
          <div
            key={p.name}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl"
          >
            {/* Participant Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="font-bold text-white">{p.name}&apos;s Favorite Expressions</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {p.totalEmojis} emojis &bull; {p.totalWords.toLocaleString()} words
              </span>
            </div>

            {/* Top Emojis */}
            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Top Emojis
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.topEmojis.length > 0 ? (
                  p.topEmojis.slice(0, 8).map((e) => (
                    <div
                      key={e.emoji}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs shadow-sm"
                    >
                      <span className="text-lg">{e.emoji}</span>
                      <span className="font-bold text-slate-200">{e.count}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">None used</span>
                )}
              </div>
            </div>

            {/* Top Words Cloud / Pills */}
            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Signature Vocabulary
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.topWords.length > 0 ? (
                  p.topWords.slice(0, 12).map((w, idx) => {
                    const opacity = Math.max(0.6, 1 - idx * 0.04);
                    return (
                      <span
                        key={w.word}
                        style={{ opacity }}
                        className="rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-slate-200"
                      >
                        {w.word} <strong className="text-emerald-400 font-bold">({w.count})</strong>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-500">No words found</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
