'use client';

import React from 'react';
import { 
  Sparkles, 
  Sun, 
  SunMedium, 
  Sunset, 
  Moon, 
  Clock, 
  MessageSquare, 
  Hourglass,
  Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { ChatAnalysis } from '@/lib/types';

interface InitiationSectionProps {
  analysis: ChatAnalysis;
}

export function InitiationSection({ analysis }: InitiationSectionProps) {
  const { participants, totalConversations, avgThreadDurationMinutes, avgThreadMessageCount, longestSilenceHours } = analysis;

  const pieData = participants.map((p) => ({
    name: p.name,
    value: p.conversationsInitiated,
    color: p.color,
    percentage: p.initiationPercentage,
  }));

  // Time of day breakdown per participant
  const timeOfDayData = [
    {
      time: 'Morning (5am-12pm)',
      icon: 'Sun',
      ...Object.fromEntries(participants.map(p => [p.name, p.morningInitiations])),
    },
    {
      time: 'Afternoon (12pm-5pm)',
      icon: 'SunMedium',
      ...Object.fromEntries(participants.map(p => [p.name, p.afternoonInitiations])),
    },
    {
      time: 'Evening (5pm-10pm)',
      icon: 'Sunset',
      ...Object.fromEntries(participants.map(p => [p.name, p.eveningInitiations])),
    },
    {
      time: 'Night (10pm-5am)',
      icon: 'Moon',
      ...Object.fromEntries(participants.map(p => [p.name, p.nightInitiations])),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Conversation Initiators</h3>
          <p className="text-xs text-slate-400">
            Who breaks the silence and starts conversations after a pause
          </p>
        </div>
      </div>

      {/* Highlights row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Total Conversations</span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">{totalConversations}</div>
          <p className="mt-1 text-[11px] text-slate-400">Separate conversation sessions</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Avg Convo Duration</span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {avgThreadDurationMinutes} mins
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Length of active back-and-forth</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <MessageSquare className="h-4 w-4 text-purple-400" />
            <span>Avg Messages / Convo</span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {avgThreadMessageCount} msgs
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Per conversation thread</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Hourglass className="h-4 w-4 text-amber-400" />
            <span>Longest Silence Gap</span>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {longestSilenceHours > 24 
              ? `${Math.round(longestSilenceHours / 24 * 10) / 10} days` 
              : `${longestSilenceHours} hrs`}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Maximum quiet time recorded</p>
        </div>
      </div>

      {/* Main Charts Split */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie: Initiation Share */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h4 className="text-base font-bold text-white">Initiation Share (% Who Texts First)</h4>
          <p className="text-xs text-slate-400">Percentage of conversation threads started</p>

          <div className="mt-4 flex h-[280px] w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val} threads (${(item && typeof item === 'object' && 'payload' in item && item.payload && typeof item.payload === 'object' && 'percentage' in item.payload ? item.payload.percentage : 0)}%)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {participants.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-xl bg-slate-950/70 p-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="font-bold text-white">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{p.conversationsInitiated} starts</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-emerald-400 font-bold">
                    {p.initiationPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar: Initiation by Time of Day */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
          <h4 className="text-base font-bold text-white">When Do They Text First?</h4>
          <p className="text-xs text-slate-400">Initiations by time of day (Morning vs Night)</p>

          <div className="mt-4 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayData} margin={{ top: 20, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
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

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Sun className="h-3.5 w-3.5" />
                <span>Morning Catalysts</span>
              </div>
              <p className="mt-1 text-slate-300">
                {participants.map(p => `${p.name}: ${p.morningInitiations}`).join(', ')}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <Moon className="h-3.5 w-3.5" />
                <span>Night Starters</span>
              </div>
              <p className="mt-1 text-slate-300">
                {participants.map(p => `${p.name}: ${p.nightInitiations}`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
