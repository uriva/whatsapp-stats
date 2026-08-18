'use client';

import React from 'react';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  Clock, 
  Sparkles, 
  Smile, 
  Image as ImageIcon,
  Flame,
  Zap,
  TrendingUp
} from 'lucide-react';
import { ChatAnalysis } from '@/lib/types';
import { formatSeconds } from '@/lib/analyzer';

interface StatsOverviewProps {
  analysis: ChatAnalysis;
}

export function StatsOverview({ analysis }: StatsOverviewProps) {
  const {
    title,
    isGroup,
    participants,
    totalMessages,
    totalWords,
    totalMedia,
    totalEmojis,
    totalConversations,
    totalDays,
    activeDaysCount,
    avgMessagesPerDay,
    longestSilenceHours,
    startDate,
    endDate
  } = analysis;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header bar with Chat Name & Participants pills */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              {isGroup ? `Group Chat (${participants.length} members)` : 'Direct 1-on-1 Chat'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {formatDate(startDate)} &mdash; {formatDate(endDate)} ({totalDays} days total &bull; {activeDaysCount} active days)
          </p>
        </div>

        {/* Participant color chips */}
        <div className="flex flex-wrap items-center gap-2">
          {participants.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span>{p.name}</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                {p.messagePercentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Messages */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Messages</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalMessages.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-semibold">~{avgMessagesPerDay}/day</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{totalWords.toLocaleString()} words exchanged</p>
        </div>

        {/* Conversations Initiated */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Conversations</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalConversations.toLocaleString()}</span>
            <span className="text-xs text-teal-400 font-semibold">threads</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Avg {analysis.avgThreadMessageCount} msgs / convo
          </p>
        </div>

        {/* Median Response Speed */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Median Response</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {participants[0] ? formatSeconds(participants[0].medianResponseTimeSeconds) : 'N/A'}
            </span>
            <span className="text-xs text-cyan-400 font-semibold">median</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {participants.length === 2 && participants[1]
              ? `vs ${formatSeconds(participants[1].medianResponseTimeSeconds)} (${participants[1].name})`
              : 'Across all replies'}
          </p>
        </div>

        {/* Media & Emojis */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Media & Emojis</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
              <Smile className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalEmojis.toLocaleString()}</span>
            <span className="text-xs text-pink-400 font-semibold">emojis</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{totalMedia.toLocaleString()} media & photos shared</p>
        </div>
      </div>
    </div>
  );
}
