'use client';

import React from 'react';
import { 
  Clock, 
  Zap, 
  Hourglass, 
  Layers, 
  CheckCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { ParticipantStats } from '@/lib/types';
import { formatSeconds } from '@/lib/analyzer';

interface ResponseTimeSectionProps {
  participants: ParticipantStats[];
}

export function ResponseTimeSection({ participants }: ResponseTimeSectionProps) {
  // Chart data for response buckets
  const bucketLabels = [
    { key: 'under1Min', label: '< 1 min' },
    { key: 'oneToFiveMin', label: '1 - 5 mins' },
    { key: 'fiveToFifteenMin', label: '5 - 15 mins' },
    { key: 'fifteenToSixtyMin', label: '15 - 60 mins' },
    { key: 'oneToSixHours', label: '1 - 6 hrs' },
    { key: 'overSixHours', label: '> 6 hrs' },
  ];

  const bucketData = bucketLabels.map(({ key, label }) => {
    const entry: { bucket: string; [author: string]: string | number } = { bucket: label };
    participants.forEach((p) => {
      entry[p.name] = p.responseTimeBuckets[key as keyof typeof p.responseTimeBuckets] || 0;
    });
    return entry;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Response Time & Dynamics</h3>
          <p className="text-xs text-slate-400">
            How quickly each participant replies when a message is received, plus double-texting patterns
          </p>
        </div>
      </div>

      {/* Participant Latency Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {participants.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
          >
            {/* Header pill */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="font-bold text-white">{p.name}</span>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                {p.responseCount} replies analyzed
              </span>
            </div>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Median Reply Time
                </span>
                <div className="mt-1 text-lg font-black text-cyan-400">
                  {formatSeconds(p.medianResponseTimeSeconds)}
                </div>
                <span className="text-[10px] text-slate-500">50% of replies faster</span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Average Reply Time
                </span>
                <div className="mt-1 text-lg font-black text-white">
                  {formatSeconds(p.avgResponseTimeSeconds)}
                </div>
                <span className="text-[10px] text-slate-500">arithmetic mean</span>
              </div>
            </div>

            {/* Additional dynamics (Double text & Left on Read) */}
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-slate-950/50 px-3 py-2">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Layers className="h-3.5 w-3.5 text-orange-400" />
                  Double-Texts Sent
                </span>
                <span className="font-bold text-white">{p.doubleTextCount} times</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-950/50 px-3 py-2">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <CheckCheck className="h-3.5 w-3.5 text-teal-400" />
                  Ended Conversation (Last msg)
                </span>
                <span className="font-bold text-white">{p.leftOnReadCandidateCount} threads</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-950/50 px-3 py-2">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Fastest Recorded Reply
                </span>
                <span className="font-bold text-emerald-400">
                  {formatSeconds(p.fastestResponseTimeSeconds)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Response Time Distribution Chart */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-base font-bold text-white">Response Latency Breakdown</h4>
            <p className="text-xs text-slate-400">
              Distribution of replies from instantaneous under 1 minute to over 6 hours
            </p>
          </div>
        </div>

        <div className="mt-6 h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bucketData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <XAxis 
                dataKey="bucket" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                allowDecimals={false} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
              />
              {participants.map((p) => (
                <Bar
                  key={p.name}
                  dataKey={p.name}
                  fill={p.color}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
