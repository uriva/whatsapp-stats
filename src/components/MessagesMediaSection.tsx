'use client';

import React from 'react';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Sticker, 
  FileText, 
  Link as LinkIcon, 
  Trash2, 
  HelpCircle, 
  Smile,
  AlignLeft,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ParticipantStats } from '@/lib/types';

interface MessagesMediaSectionProps {
  participants: ParticipantStats[];
}

export function MessagesMediaSection({ participants }: MessagesMediaSectionProps) {
  // Media categories chart
  const mediaCategories = [
    { label: 'Photos', key: 'imagesCount', icon: ImageIcon },
    { label: 'Videos', key: 'videosCount', icon: Video },
    { label: 'Voice Notes', key: 'voiceNotesCount', icon: Mic },
    { label: 'Stickers', key: 'stickersCount', icon: Sticker },
    { label: 'Documents', key: 'documentsCount', icon: FileText },
    { label: 'Links', key: 'linksCount', icon: LinkIcon },
    { label: 'Questions (?)', key: 'questionsCount', icon: HelpCircle },
    { label: 'Laughs (haha/lol)', key: 'laughCount', icon: Smile },
  ];

  const mediaChartData = mediaCategories.map(({ label, key }) => {
    const entry: { category: string; [participant: string]: string | number } = { category: label };
    participants.forEach((p) => {
      entry[p.name] = (p[key as keyof ParticipantStats] as number) || 0;
    });
    return entry;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Messages & Media Breakdown</h3>
          <p className="text-xs text-slate-400">
            Word depth, character counts, voice notes, stickers, links, and laughs
          </p>
        </div>
      </div>

      {/* Participant Text Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {participants.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="font-bold text-white">{p.name}</span>
              </div>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-bold text-emerald-400">
                {p.totalMessages.toLocaleString()} msgs ({p.messagePercentage}%)
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Total Words</span>
                <div className="mt-1 text-lg font-black text-white">{p.totalWords.toLocaleString()}</div>
                <span className="text-[10px] text-slate-500">{p.totalChars.toLocaleString()} chars</span>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Avg Message Length</span>
                <div className="mt-1 text-lg font-black text-purple-400">{p.avgWordsPerMessage}</div>
                <span className="text-[10px] text-slate-500">words / message</span>
              </div>
            </div>

            {/* Media mini counts list */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
              <div className="flex flex-col items-center rounded-lg bg-slate-950/70 p-2 text-center">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
                <span className="mt-1 font-bold text-white">{p.imagesCount}</span>
                <span className="text-[9px] text-slate-400">Photos</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-slate-950/70 p-2 text-center">
                <Mic className="h-4 w-4 text-cyan-400" />
                <span className="mt-1 font-bold text-white">{p.voiceNotesCount}</span>
                <span className="text-[9px] text-slate-400">Voice Notes</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-slate-950/70 p-2 text-center">
                <Sticker className="h-4 w-4 text-pink-400" />
                <span className="mt-1 font-bold text-white">{p.stickersCount}</span>
                <span className="text-[9px] text-slate-400">Stickers</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-slate-950/70 p-2 text-center">
                <LinkIcon className="h-4 w-4 text-blue-400" />
                <span className="mt-1 font-bold text-white">{p.linksCount}</span>
                <span className="text-[9px] text-slate-400">Links</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-slate-950/70 p-2 text-center">
                <HelpCircle className="h-4 w-4 text-amber-400" />
                <span className="mt-1 font-bold text-white">{p.questionsCount}</span>
                <span className="text-[9px] text-slate-400">Questions</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-slate-950/70 p-2 text-center">
                <Smile className="h-4 w-4 text-yellow-400" />
                <span className="mt-1 font-bold text-white">{p.laughCount}</span>
                <span className="text-[9px] text-slate-400">Laughs</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Comparison Chart */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <h4 className="text-base font-bold text-white">Media, Links & Content Distribution</h4>
        <p className="text-xs text-slate-400">Side-by-side comparison across all content formats</p>

        <div className="mt-6 h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mediaChartData} margin={{ top: 20, right: 10, left: -10, bottom: 20 }}>
              <XAxis 
                dataKey="category" 
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
    </div>
  );
}
