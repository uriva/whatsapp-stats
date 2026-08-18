'use client';

import React, { useState } from 'react';
import { X, Smartphone, Apple, HelpCircle, CheckCircle2, FileText, Share2, MoreVertical, ShieldAlert } from 'lucide-react';

interface HowToExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToExportModal({ isOpen, onClose }: HowToExportModalProps) {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">How to Export Your WhatsApp Chat</h3>
              <p className="text-xs text-slate-400">Quick 20-second guide to get your .txt or .zip file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="mt-5 flex rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'ios'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="h-4 w-4" />
            <span>iPhone (iOS)</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === 'android'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Android</span>
          </button>
        </div>

        {/* Steps Content */}
        <div className="mt-5 space-y-3.5">
          {activeTab === 'ios' ? (
            <>
              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  1
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Open the WhatsApp Chat</p>
                  <p className="text-xs text-slate-400">Tap on the contact or group name at the very top of your screen to open Contact Info.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  2
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Tap &quot;Export Chat&quot;</p>
                  <p className="text-xs text-slate-400">Scroll down to the bottom and tap <span className="font-medium text-emerald-400">Export Chat</span>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  3
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Select &quot;Without Media&quot; (Recommended)</p>
                  <p className="text-xs text-slate-400">Choosing &quot;Without Media&quot; gives you a clean, lightweight <code className="text-emerald-400">_chat.txt</code> file in seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  4
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Save or AirDrop / Email to your Computer</p>
                  <p className="text-xs text-slate-400">Save to Files or send it to your computer, then drop it into this app.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  1
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Open the WhatsApp Chat</p>
                  <p className="text-xs text-slate-400">Tap the three vertical dots (⋮) in the top-right corner.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  2
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Select More &gt; Export Chat</p>
                  <p className="text-xs text-slate-400">Tap <span className="font-medium text-slate-200">More</span>, then tap <span className="font-medium text-emerald-400">Export chat</span>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  3
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Select &quot;Without Media&quot;</p>
                  <p className="text-xs text-slate-400">Tap &quot;Without Media&quot; for instant text export.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-950/50 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                  4
                </span>
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white">Save or Share</p>
                  <p className="text-xs text-slate-400">Send via Google Drive, Gmail, or cable to your device and upload here.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tip Box */}
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>Both single <strong className="text-white">.txt</strong> files and full <strong className="text-white">.zip</strong> export archives are supported!</span>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition-transform active:scale-95 hover:bg-emerald-400"
          >
            Got it, let&apos;s analyze!
          </button>
        </div>
      </div>
    </div>
  );
}
