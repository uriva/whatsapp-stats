'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Flame, 
  Sun, 
  Moon, 
  TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ChatAnalysis } from '@/lib/types';

interface HeatmapSectionProps {
  analysis: ChatAnalysis;
}

export function HeatmapSection({ analysis }: HeatmapSectionProps) {
  const { hourlyActivity, dayOfWeekActivity, punchcard, dailyTimeline, monthlyTimeline, participants } = analysis;
  const [timelineView, setTimelineView] = useState<'daily' | 'monthly'>('monthly');

  // Format 24-hour labels
  const formattedHourly = hourlyActivity.map((entry) => {
    const hour = entry.hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return {
      ...entry,
      label: `${h12}${ampm}`,
    };
  });

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Maximum count for punchcard coloring
  const maxPunchCount = Math.max(1, ...punchcard.map((p) => p.count));

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-slate-950 border-slate-900';
    const ratio = count / maxPunchCount;
    if (ratio < 0.2) return 'bg-emerald-950/70 border-emerald-900/50 text-emerald-300';
    if (ratio < 0.45) return 'bg-emerald-800/80 border-emerald-700/60 text-emerald-200';
    if (ratio < 0.75) return 'bg-emerald-600 border-emerald-500 text-slate-950';
    return 'bg-emerald-400 border-emerald-300 text-slate-950 font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Temporal Patterns & Heatmaps</h3>
          <p className="text-xs text-slate-400">
            When the chat comes alive: 24-hour diurnal rhythms, weekly punchcards, and timelines
          </p>
        </div>
      </div>

      {/* 24-Hour Activity Chart */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-base font-bold text-white">24-Hour Diurnal Rhythm</h4>
            <p className="text-xs text-slate-400">Messages sent throughout the 24 hours of the day</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Moon className="h-3.5 w-3.5 text-indigo-400" /> Late Night</span>
            <span className="flex items-center gap-1"><Sun className="h-3.5 w-3.5 text-amber-400" /> Daytime</span>
          </div>
        </div>

        <div className="mt-6 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedHourly} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                {participants.map((p, idx) => (
                  <linearGradient key={p.name} id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={p.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={p.color} stopOpacity={0.0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {participants.map((p, idx) => (
                <Area
                  key={p.name}
                  type="monotone"
                  dataKey={p.name}
                  stroke={p.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${idx})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column: Day of Week & 24x7 Punchcard */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Day of week bar */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h4 className="text-base font-bold text-white">Day of the Week Activity</h4>
          <p className="text-xs text-slate-400">Total volume on Mondays vs Weekends</p>

          <div className="mt-6 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekActivity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
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

        {/* 24x7 Activity Punchcard / Heatmap */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">24x7 Activity Heatmap Matrix</h4>
              <p className="text-xs text-slate-400">Hour of Day vs Day of Week density</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span>Low</span>
              <span className="h-2 w-2 rounded-sm bg-emerald-950 border border-emerald-900" />
              <span className="h-2 w-2 rounded-sm bg-emerald-800" />
              <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              <span className="h-2 w-2 rounded-sm bg-emerald-400" />
              <span>High</span>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[420px]">
              {/* Hour header */}
              <div className="flex text-[9px] text-slate-400 mb-1 pl-8">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="flex-1 text-center font-mono">
                    {h % 3 === 0 ? h : ''}
                  </div>
                ))}
              </div>

              {/* Rows for days 0-6 */}
              {DAY_NAMES.map((dayName, dIndex) => (
                <div key={dayName} className="flex items-center gap-1 my-1">
                  <span className="w-7 text-[10px] font-semibold text-slate-400">{dayName}</span>
                  <div className="flex flex-1 gap-1">
                    {Array.from({ length: 24 }, (_, hIndex) => {
                      const entry = punchcard.find((p) => p.day === dIndex && p.hour === hIndex);
                      const count = entry ? entry.count : 0;
                      return (
                        <div
                          key={hIndex}
                          title={`${dayName} at ${hIndex}:00 — ${count} messages`}
                          className={`h-5 flex-1 rounded-sm border transition-transform hover:scale-125 cursor-pointer ${getHeatColor(
                            count
                          )}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Timeline (Monthly / Daily) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-base font-bold text-white">Historical Message Volume Timeline</h4>
            <p className="text-xs text-slate-400">Message trajectory and intensity over time</p>
          </div>
          <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => setTimelineView('monthly')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                timelineView === 'monthly'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimelineView('daily')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                timelineView === 'daily'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily
            </button>
          </div>
        </div>

        <div className="mt-6 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={(timelineView === 'monthly' ? monthlyTimeline : dailyTimeline) as Record<string, any>[]}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <XAxis
                dataKey={timelineView === 'monthly' ? 'month' : 'date'}
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
              />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {participants.map((p) => (
                <Bar
                  key={p.name}
                  dataKey={p.name}
                  stackId="timeline"
                  fill={p.color}
                  radius={timelineView === 'monthly' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
