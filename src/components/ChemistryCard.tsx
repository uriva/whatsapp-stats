'use client';

import React from 'react';
import { Heart, Activity, Zap, Sparkles, MessageCircle, Moon, CheckCircle2 } from 'lucide-react';
import { ChatAnalysis, ParticipantStats } from '@/lib/types';
import { formatSeconds } from '@/lib/analyzer';

interface ChemistryCardProps {
  chemistry: NonNullable<ChatAnalysis['chemistryScore']>;
  participants: ParticipantStats[];
}

export function ChemistryCard({ chemistry, participants }: ChemistryCardProps) {
  const p1 = participants[0];
  const p2 = participants[1];

  if (!p1 || !p2) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/20 p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
            <Heart className="h-5 w-5 fill-pink-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">1-on-1 Chat Chemistry & Balance</h3>
              <span className="rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-bold text-pink-400 border border-pink-500/20">
                Score: {chemistry.overall}/100
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Measuring conversation reciprocity, mutual effort, and rhythm between {p1.name} and {p2.name}
            </p>
          </div>
        </div>

        {/* Big Overall Circle / Badge */}
        <div className="flex items-center gap-3 rounded-2xl border border-pink-500/20 bg-slate-950/80 px-4 py-2.5">
          <Activity className="h-5 w-5 text-pink-400" />
          <div>
            <div className="text-xs font-medium text-slate-400">Compatibility Index</div>
            <div className="text-xl font-black text-pink-400">{chemistry.overall}%</div>
          </div>
        </div>
      </div>

      {/* Narrative Verdict */}
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300">
        <span className="font-semibold text-pink-300">Dynamic Verdict: </span>
        {chemistry.summary}
      </div>

      {/* 4 Balance Meters */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* 1. Talk Volume Balance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Message Volume Split</span>
            <span className="font-bold text-emerald-400">{chemistry.talkBalance}% Balanced</span>
          </div>
          
          <div className="mt-2.5 flex h-4 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <div
              className="flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all"
              style={{ width: `${p1.messagePercentage}%`, backgroundColor: p1.color }}
            >
              {p1.messagePercentage > 15 && `${p1.messagePercentage}%`}
            </div>
            <div
              className="flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all"
              style={{ width: `${p2.messagePercentage}%`, backgroundColor: p2.color }}
            >
              {p2.messagePercentage > 15 && `${p2.messagePercentage}%`}
            </div>
          </div>

          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span style={{ color: p1.color }}>{p1.name} ({p1.totalMessages} msgs)</span>
            <span style={{ color: p2.color }}>{p2.name} ({p2.totalMessages} msgs)</span>
          </div>
        </div>

        {/* 2. Initiation Balance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Conversation Starts (Who texts first)</span>
            <span className="font-bold text-teal-400">{chemistry.initiationBalance}% Balanced</span>
          </div>

          {(() => {
            const totalInits = p1.conversationsInitiated + p2.conversationsInitiated;
            const p1Pct = totalInits > 0 ? Math.round((p1.conversationsInitiated / totalInits) * 100) : 50;
            const p2Pct = 100 - p1Pct;
            return (
              <>
                <div className="mt-2.5 flex h-4 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
                  <div
                    className="flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all"
                    style={{ width: `${p1Pct}%`, backgroundColor: p1.color }}
                  >
                    {p1Pct > 15 && `${p1Pct}%`}
                  </div>
                  <div
                    className="flex items-center justify-center text-[10px] font-bold text-slate-950 transition-all"
                    style={{ width: `${p2Pct}%`, backgroundColor: p2.color }}
                  >
                    {p2Pct > 15 && `${p2Pct}%`}
                  </div>
                </div>

                <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                  <span style={{ color: p1.color }}>{p1.name} ({p1.conversationsInitiated} starts)</span>
                  <span style={{ color: p2.color }}>{p2.name} ({p2.conversationsInitiated} starts)</span>
                </div>
              </>
            );
          })()}
        </div>

        {/* 3. Response Speed Symmetry */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Response Speed Ratio</span>
            <span className="font-bold text-cyan-400">{chemistry.responseSpeedBalance}% Symmetry</span>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900 p-2.5">
              <span className="text-[11px] font-medium" style={{ color: p1.color }}>{p1.name}</span>
              <div className="mt-1 text-sm font-bold text-white">{formatSeconds(p1.medianResponseTimeSeconds)}</div>
              <span className="text-[10px] text-slate-400">median reply time</span>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900 p-2.5">
              <span className="text-[11px] font-medium" style={{ color: p2.color }}>{p2.name}</span>
              <div className="mt-1 text-sm font-bold text-white">{formatSeconds(p2.medianResponseTimeSeconds)}</div>
              <span className="text-[10px] text-slate-400">median reply time</span>
            </div>
          </div>
        </div>

        {/* 4. Effort & Depth (Words per msg) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Message Depth & Effort</span>
            <span className="font-bold text-amber-400">{chemistry.effortBalance}% Match</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900 p-2.5">
              <span className="text-[11px] font-medium" style={{ color: p1.color }}>{p1.name}</span>
              <div className="mt-1 text-sm font-bold text-white">{p1.avgWordsPerMessage} wpm</div>
              <span className="text-[10px] text-slate-400">avg words / msg</span>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900 p-2.5">
              <span className="text-[11px] font-medium" style={{ color: p2.color }}>{p2.name}</span>
              <div className="mt-1 text-sm font-bold text-white">{p2.avgWordsPerMessage} wpm</div>
              <span className="text-[10px] text-slate-400">avg words / msg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
