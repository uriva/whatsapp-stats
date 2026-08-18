'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Archive, 
  Sparkles, 
  HelpCircle, 
  Clipboard, 
  SlidersHorizontal, 
  Database,
  Check,
  ArrowRight,
  Flame
} from 'lucide-react';
import { SAMPLE_CHATS, SampleChatPreset } from '@/lib/sampleChats';
import { ParseOptions } from '@/lib/types';

interface UploadDropzoneProps {
  onFileUpload: (file: File) => void;
  onTextSubmit: (text: string, title?: string) => void;
  onOpenHowTo: () => void;
  options: ParseOptions;
  setOptions: React.Dispatch<React.SetStateAction<ParseOptions>>;
  isLoading: boolean;
}

export function UploadDropzone({
  onFileUpload,
  onTextSubmit,
  onOpenHowTo,
  options,
  setOptions,
  isLoading
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleLoadSample = (sample: SampleChatPreset) => {
    onTextSubmit(sample.rawText, sample.name);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim()) return;
    onTextSubmit(pasteText, pasteTitle.trim() || 'Pasted Chat');
    setShowPasteModal(false);
    setPasteText('');
  };

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 -z-10 flex justify-center overflow-hidden">
        <div className="h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      {/* Hero Headline */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Discover Your Real Chat Dynamics</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Who Texts First? <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Who Takes 4 Hours to Reply?
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
          Upload any WhatsApp export (<code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-emerald-400">.txt</code> or <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-emerald-400">.zip</code>) to unlock deep stats on conversation starters, response speeds, night owls, double texting, and chat chemistry.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="mt-8">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 transition-all sm:p-12 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10 shadow-2xl shadow-emerald-500/20'
              : 'border-slate-700/80 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900/90'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.zip"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 transition-transform group-hover:scale-110">
            {isLoading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-400 border-t-transparent" />
            ) : (
              <UploadCloud className="h-10 w-10" />
            )}
          </div>

          <div className="mt-5 text-center">
            <p className="text-base font-semibold text-white sm:text-lg">
              {isLoading ? 'Analyzing chat timestamps & dynamics...' : 'Drop your WhatsApp chat export here'}
            </p>
            <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
              Supports single <strong className="text-slate-200">_chat.txt</strong> files or complete <strong className="text-slate-200">.zip</strong> export archives
            </p>
          </div>

          {/* Quick buttons inside box */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition-transform active:scale-95 hover:bg-emerald-400 sm:text-sm"
            >
              Browse Computer
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPasteModal(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 sm:text-sm"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>Paste Text</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenHowTo();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700/50 bg-slate-800/40 px-3.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-emerald-400"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>How to export?</span>
            </button>
          </div>

          {/* InstantDB Storage & Invite Badge */}
          <div className="mt-8 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5 text-xs text-emerald-400">
            <Database className="h-3.5 w-3.5" />
            <span>InstantDB Cloud Sync — Save snapshots &amp; share invite links instantly</span>
          </div>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{showSettings ? 'Hide Analysis Settings' : 'Custom Settings (Gap threshold & Date format)'}</span>
        </button>
      </div>

      {showSettings && (
        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-semibold text-slate-200">
                Conversation Gap Threshold: <span className="text-emerald-400">{options.conversationGapHours || 6} hours</span>
              </label>
              <p className="mt-0.5 text-slate-400">
                Silence longer than this counts as starting a new conversation thread.
              </p>
              <div className="mt-2 flex gap-2">
                {[3, 6, 8, 12, 24].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => setOptions(prev => ({ ...prev, conversationGapHours: hrs }))}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      (options.conversationGapHours || 6) === hrs
                        ? 'bg-emerald-500 text-slate-950'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-200">
                Date Parsing Mode: <span className="text-emerald-400">{options.dateFormat || 'auto'}</span>
              </label>
              <p className="mt-0.5 text-slate-400">
                Auto-detection handles 99% of chats. Override if dates look flipped.
              </p>
              <div className="mt-2 flex gap-2">
                {[
                  { label: 'Auto Detect', val: 'auto' },
                  { label: 'DD/MM/YYYY', val: 'dmy' },
                  { label: 'MM/DD/YYYY', val: 'mdy' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setOptions(prev => ({ ...prev, dateFormat: item.val as ParseOptions['dateFormat'] }))}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      (options.dateFormat || 'auto') === item.val
                        ? 'bg-emerald-500 text-slate-950'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Demo Chats */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Or Try Demo Chat Datasets
            </h3>
          </div>
          <span className="text-xs text-slate-500">Instant one-click load</span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {SAMPLE_CHATS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className="group relative cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 transition-all hover:border-emerald-500/40 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                  {sample.badge}
                </span>
                <span className="text-[11px] text-slate-400">{sample.participantsCount} participants</span>
              </div>

              <h4 className="mt-3 text-base font-bold text-white group-hover:text-emerald-300">
                {sample.name}
              </h4>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                {sample.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
                <span className="text-xs font-medium text-slate-400">{sample.category}</span>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Paste Raw WhatsApp Export Text</h3>
            <p className="mt-1 text-xs text-slate-400">
              Copy and paste raw chat lines directly from your WhatsApp text export.
            </p>

            <form onSubmit={handlePasteSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300">Chat Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Liam & Elena or Weekend Squad"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Chat Log Text</label>
                <textarea
                  rows={8}
                  placeholder={`[15/01/2024, 14:32:05] John: Hello there!\n[15/01/2024, 14:33:10] Alice: Hey John! How are you?`}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Parse & Analyze
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
