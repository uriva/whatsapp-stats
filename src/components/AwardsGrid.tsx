'use client';

import React from 'react';
import { 
  Trophy, 
  Zap, 
  Sparkles, 
  Moon, 
  BookOpen, 
  Smile, 
  Layers, 
  Camera, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { ChatAward, ParticipantStats } from '@/lib/types';

interface AwardsGridProps {
  awards: ChatAward[];
  participants: ParticipantStats[];
}

export function AwardsGrid({ awards, participants }: AwardsGridProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="h-5 w-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5 text-emerald-400" />;
      case 'Moon':
        return <Moon className="h-5 w-5 text-indigo-400" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5 text-cyan-400" />;
      case 'Smile':
        return <Smile className="h-5 w-5 text-pink-400" />;
      case 'Layers':
        return <Layers className="h-5 w-5 text-orange-400" />;
      case 'Camera':
        return <Camera className="h-5 w-5 text-purple-400" />;
      default:
        return <Trophy className="h-5 w-5 text-emerald-400" />;
    }
  };

  const getParticipantColor = (name: string) => {
    return participants.find(p => p.name === name)?.color || '#10B981';
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Chat Superlatives & Awards</h3>
          <p className="text-xs text-slate-400">Unique behavioral badges earned from this conversation</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {awards.map((award) => {
          const color = getParticipantColor(award.recipient);
          return (
            <div
              key={award.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition-all hover:border-slate-700 hover:bg-slate-950"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                    {getIcon(award.icon)}
                  </div>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-300 border border-slate-800">
                    {award.metric}
                  </span>
                </div>

                <h4 className="mt-4 text-base font-bold text-white">
                  {award.title}
                </h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {award.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-900 pt-3">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-semibold text-white">
                  {award.recipient}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
