'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Sparkles, 
  Heart, 
  Zap, 
  MessageSquare, 
  Trophy, 
  Flame, 
  Share2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { ChatAnalysis } from '@/lib/types';
import { formatSeconds } from '@/lib/analyzer';

interface WrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ChatAnalysis;
}

export function WrappedModal({ isOpen, onClose, analysis }: WrappedModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#14B8A6'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    title,
    isGroup,
    participants,
    totalMessages,
    totalWords,
    totalEmojis,
    awards,
    chemistryScore,
    startDate,
    endDate
  } = analysis;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
      });
      const link = document.createElement('a');
      link.download = `WhatsApp-Wrapped-${title.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const p1 = participants[0];
    const p2 = participants[1];
    let summaryText = `📊 WhatsApp Wrapped: ${title}\n` +
      `💬 Total Messages: ${totalMessages.toLocaleString()}\n` +
      `🚀 Top Starter: ${awards.find(a => a.id === 'top-starter')?.recipient || 'N/A'}\n` +
      `⚡ Fastest Reply: ${awards.find(a => a.id === 'speed-demon')?.recipient || 'N/A'}\n`;
    
    if (chemistryScore && p1 && p2) {
      summaryText += `❤️ Chemistry Score: ${chemistryScore.overall}/100\n`;
    }

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-8 w-full max-w-lg">
        {/* Actions bar */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">Your WhatsApp Wrapped</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md transition-transform active:scale-95 hover:brightness-110"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* The Card (Rendered for Download) */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-7 text-white shadow-2xl"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.9) 75%)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black text-sm">
                W
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-emerald-400">
                WHATSAPP WRAPPED
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-400">
              {startDate.getFullYear()}
            </span>
          </div>

          <div className="mt-5 text-center">
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &mdash;{' '}
              {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Big Stat Box */}
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-4 text-center backdrop-blur-md">
            <div className="text-3xl font-black text-emerald-400 sm:text-4xl">
              {totalMessages.toLocaleString()}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Messages Exchanged
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {totalWords.toLocaleString()} words &bull; {totalEmojis.toLocaleString()} emojis
            </div>
          </div>

          {/* 1-on-1 Chemistry Bar (if 2 participants) */}
          {chemistryScore && participants.length === 2 && (
            <div className="mt-4 rounded-2xl border border-pink-500/20 bg-pink-950/20 p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-pink-300">
                  <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" />
                  Chat Chemistry
                </span>
                <span className="font-black text-pink-400">{chemistryScore.overall}/100</span>
              </div>
              
              <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-950">
                <div
                  className="bg-emerald-400"
                  style={{ width: `${participants[0].messagePercentage}%` }}
                />
                <div
                  className="bg-teal-400"
                  style={{ width: `${participants[1].messagePercentage}%` }}
                />
              </div>

              <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                <span>{participants[0].name} ({participants[0].messagePercentage}%)</span>
                <span>{participants[1].name} ({participants[1].messagePercentage}%)</span>
              </div>
            </div>
          )}

          {/* Top 3 Awards / Superlatives */}
          <div className="mt-4 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Featured Superlatives
            </div>
            
            {awards.slice(0, 3).map((award) => (
              <div
                key={award.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{award.title}</div>
                  <div className="text-[10px] text-slate-400">{award.recipient}</div>
                </div>
                <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  {award.metric}
                </span>
              </div>
            ))}
          </div>

          {/* Footer watermark */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[10px] text-slate-500">
            <span>WhatsStats Pro Analytics</span>
            <span>InstantDB Realtime Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
