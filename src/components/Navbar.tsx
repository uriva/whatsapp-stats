'use client';

import React from 'react';
import { MessageSquare, Database, Sparkles, UploadCloud, RefreshCw } from 'lucide-react';

interface NavbarProps {
  hasData: boolean;
  onReset: () => void;
  onOpenWrapped: () => void;
}

export function Navbar({ hasData, onReset, onOpenWrapped }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={onReset}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
            <MessageSquare className="h-5 w-5 fill-slate-950 stroke-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white sm:text-lg">WhatsStats</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">WhatsApp Chat Analytics & Insights</p>
          </div>
        </div>

        {/* Center: InstantDB Sync Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 md:flex">
          <Database className="h-4 w-4 text-emerald-400" />
          <span>InstantDB Realtime Storage: Save Snapshots &amp; Share Invite Links</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {hasData ? (
            <>
              <button
                onClick={onOpenWrapped}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-transform active:scale-95 hover:brightness-110 sm:text-sm"
              >
                <Sparkles className="h-4 w-4 fill-slate-950 stroke-none" />
                <span>Wrapped Card</span>
              </button>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white sm:text-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Upload</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <UploadCloud className="h-4 w-4 text-emerald-400" />
              <span>Drag & drop ready</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
