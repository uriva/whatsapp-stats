'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Share2, 
  FolderArchive, 
  Clock, 
  Zap, 
  MessageSquare, 
  Calendar, 
  Smile, 
  ShieldCheck,
  RefreshCw,
  Award,
  Flame,
  Layers,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/Navbar';
import { UploadDropzone } from '@/components/UploadDropzone';
import { HowToExportModal } from '@/components/HowToExportModal';
import { SaveSnapshotModal } from '@/components/SaveSnapshotModal';
import { SavedSnapshotsDrawer } from '@/components/SavedSnapshotsDrawer';
import { StatsOverview } from '@/components/StatsOverview';
import { AwardsGrid } from '@/components/AwardsGrid';
import { ChemistryCard } from '@/components/ChemistryCard';
import { ResponseTimeSection } from '@/components/ResponseTimeSection';
import { InitiationSection } from '@/components/InitiationSection';
import { MessagesMediaSection } from '@/components/MessagesMediaSection';
import { HeatmapSection } from '@/components/HeatmapSection';
import { WordsEmojisSection } from '@/components/WordsEmojisSection';
import { ThreadExplorer } from '@/components/ThreadExplorer';
import { WrappedModal } from '@/components/WrappedModal';
import { parseWhatsAppChat, extractChatFromFile } from '@/lib/parser';
import { analyzeChat } from '@/lib/analyzer';
import { ChatAnalysis, ParseOptions } from '@/lib/types';
import { ensureGuestSession } from '@/lib/instant';

export default function Home() {
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'responses' | 'initiations' | 'media' | 'heatmaps' | 'words' | 'threads'
  >('overview');

  // Modals & Drawers
  const [showHowTo, setShowHowTo] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showWrapped, setShowWrapped] = useState(false);
  const [options, setOptions] = useState<ParseOptions>({
    dateFormat: 'auto',
    conversationGapHours: 6,
  });

  // Ensure guest session on mount
  useEffect(() => {
    ensureGuestSession();
  }, []);

  const handleProcessText = (rawText: string, title: string = 'WhatsApp Chat') => {
    try {
      setIsLoading(true);
      const messages = parseWhatsAppChat(rawText, options);
      if (messages.length === 0) {
        alert('Could not detect WhatsApp messages in this file. Please verify the format.');
        setIsLoading(false);
        return;
      }

      const analyzed = analyzeChat(messages, title, {
        conversationGapHours: options.conversationGapHours,
      });
      setAnalysis(analyzed);
      setActiveTab('overview');

      // Celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#3B82F6', '#EC4899', '#F59E0B', '#14B8A6'],
        });
      } catch {}
    } catch (err) {
      console.error('Error analyzing chat:', err);
      alert('An error occurred while analyzing the chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const { text, filename } = await extractChatFromFile(file);
      const cleanTitle = filename.replace(/\.(txt|zip)$/i, '').replace(/^WhatsApp Chat - /i, '');
      handleProcessText(text, cleanTitle || 'My WhatsApp Chat');
    } catch (err: unknown) {
      console.error('Failed to extract file', err);
      const message = err instanceof Error ? err.message : 'Failed to read file';
      alert(message);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-[#080C14] pb-24 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        hasData={!!analysis}
        onReset={handleReset}
        onOpenWrapped={() => setShowWrapped(true)}
      />

      {/* Hero / Upload Screen if no analysis */}
      {!analysis ? (
        <main>
          <UploadDropzone
            onFileUpload={handleFileUpload}
            onTextSubmit={handleProcessText}
            onOpenHowTo={() => setShowHowTo(true)}
            options={options}
            setOptions={setOptions}
            isLoading={isLoading}
          />
        </main>
      ) : (
        /* Analytics Dashboard */
        <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          {/* Action Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Viewing:</span>
              <span className="font-bold text-white text-sm sm:text-base">{analysis.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDrawer(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <FolderArchive className="h-4 w-4 text-slate-400" />
                <span>Saved Snapshots</span>
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-transform active:scale-95 hover:brightness-110"
              >
                <Share2 className="h-4 w-4" />
                <span>Save &amp; Share Invite</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-1.5">
            {[
              { id: 'overview', label: 'Overview & Awards', icon: Sparkles },
              { id: 'responses', label: 'Response Times', icon: Clock },
              { id: 'initiations', label: 'Who Texts First', icon: Zap },
              { id: 'media', label: 'Messages & Media', icon: MessageSquare },
              { id: 'heatmaps', label: 'Diurnal Heatmaps', icon: Calendar },
              { id: 'words', label: 'Emojis & Words', icon: Smile },
              { id: 'threads', label: 'Thread Explorer', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="mt-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <StatsOverview analysis={analysis} />
                {analysis.chemistryScore && (
                  <ChemistryCard
                    chemistry={analysis.chemistryScore}
                    participants={analysis.participants}
                  />
                )}
                <AwardsGrid
                  awards={analysis.awards}
                  participants={analysis.participants}
                />
              </div>
            )}

            {activeTab === 'responses' && (
              <ResponseTimeSection participants={analysis.participants} />
            )}

            {activeTab === 'initiations' && (
              <InitiationSection analysis={analysis} />
            )}

            {activeTab === 'media' && (
              <MessagesMediaSection participants={analysis.participants} />
            )}

            {activeTab === 'heatmaps' && (
              <HeatmapSection analysis={analysis} />
            )}

            {activeTab === 'words' && (
              <WordsEmojisSection analysis={analysis} />
            )}

            {activeTab === 'threads' && (
              <ThreadExplorer
                threads={analysis.threads}
                participants={analysis.participants}
              />
            )}
          </div>
        </main>
      )}

      {/* How to export guide modal */}
      <HowToExportModal
        isOpen={showHowTo}
        onClose={() => setShowHowTo(false)}
      />

      {/* Save snapshot to InstantDB modal */}
      {analysis && (
        <SaveSnapshotModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          analysis={analysis}
        />
      )}

      {/* Saved snapshots drawer */}
      <SavedSnapshotsDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSelectSnapshot={(loadedAnalysis) => {
          setAnalysis(loadedAnalysis);
          setActiveTab('overview');
        }}
      />

      {/* Wrapped visual modal */}
      {analysis && (
        <WrappedModal
          isOpen={showWrapped}
          onClose={() => setShowWrapped(false)}
          analysis={analysis}
        />
      )}
    </div>
  );
}
