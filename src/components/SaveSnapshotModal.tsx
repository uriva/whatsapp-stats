'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  MessageCircle, 
  QrCode, 
  ShieldCheck,
  Send,
  Loader2,
  ExternalLink
} from 'lucide-react';
import QRCode from 'qrcode';
import { db, id, generateShareCode, ensureGuestSession } from '@/lib/instant';
import { ChatAnalysis } from '@/lib/types';

interface SaveSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ChatAnalysis;
  onSaved?: (shareCode: string) => void;
}

export function SaveSnapshotModal({ isOpen, onClose, analysis, onSaved }: SaveSnapshotModalProps) {
  const [title, setTitle] = useState(analysis.title || 'WhatsApp Chat Stats');
  const [inviterName, setInviterName] = useState(analysis.participants[0]?.name || 'Chat Partner');
  const [inviteMessage, setInviteMessage] = useState('Check out who texts first & our WhatsApp Wrapped stats! 🔥');
  const [isSaving, setIsSaving] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      ensureGuestSession();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const inviteUrl = shareCode && typeof window !== 'undefined'
    ? `${window.location.origin}/invite/${shareCode}`
    : '';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !inviterName.trim()) return;

    try {
      setIsSaving(true);
      await ensureGuestSession();

      const newCode = generateShareCode(title);
      const snapshotId = id();

      // Transact in InstantDB
      await db.transact(
        db.tx.snapshots[snapshotId].create({
          title: title.trim(),
          shareCode: newCode,
          inviterName: inviterName.trim(),
          inviteMessage: inviteMessage.trim(),
          dataJson: JSON.stringify(analysis),
          createdAt: Date.now(),
          views: 1,
        })
      );

      setShareCode(newCode);

      // Generate QR Code
      const url = `${window.location.origin}/invite/${newCode}`;
      const qrData = await QRCode.toDataURL(url, {
        width: 240,
        margin: 1,
        color: {
          dark: '#10B981',
          light: '#090D16',
        },
      });
      setQrCodeDataUrl(qrData);

      if (onSaved) onSaved(newCode);
    } catch (err) {
      console.error('Failed to save snapshot to InstantDB:', err);
      alert('Failed to save snapshot. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getWhatsAppShareUrl = () => {
    const text = `Hey! Check out our WhatsApp Wrapped & Chat Stats (who texts first & reply speeds): ${inviteUrl}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-6 w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-md">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Save & Share Invite Link</h3>
              <p className="text-xs text-slate-400">Powered by InstantDB realtime database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!shareCode ? (
          /* Form state */
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300">Chat Snapshot Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Liam & Elena or Weekend Squad"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300">Your Name (Inviter)</label>
                <input
                  type="text"
                  value={inviterName}
                  onChange={(e) => setInviterName(e.target.value)}
                  placeholder="e.g. Liam"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300">Access Mode</label>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Instant Guest Login (No email needed)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">Invite Message</label>
              <input
                type="text"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Message displayed to invitees when they open the link"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">⚡ Seamless Guest Experience:</span> Anyone with this invite link will instantly view the complete interactive statistics, Wrapped card, and leave reactions without needing to create an account or provide an email.
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-md transition-transform active:scale-95 hover:brightness-110 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving to InstantDB...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 fill-slate-950 stroke-none" />
                    <span>Generate Invite Link</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Link Generated Success state */
          <div className="mt-5 space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                🎉 Invite Link Ready!
              </span>
              <p className="mt-1 text-xs text-slate-300">
                Share this link with your chat partner or friends. They can view the snapshot instantly as a guest!
              </p>
            </div>

            {/* Link Copy Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5">
              <label className="block text-[11px] font-semibold text-slate-400">Your Shareable Invite Link</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110"
              >
                <MessageCircle className="h-4 w-4 fill-slate-950 stroke-none" />
                <span>Send via WhatsApp</span>
              </a>

              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <ExternalLink className="h-4 w-4 text-emerald-400" />
                <span>Open Invite Page</span>
              </a>
            </div>

            {/* QR Code preview */}
            {qrCodeDataUrl && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="overflow-hidden rounded-xl border border-emerald-500/20 bg-slate-950 p-2 shadow-lg">
                  <img src={qrCodeDataUrl} alt="Invite QR Code" className="h-32 w-32" />
                </div>
                <span className="mt-2 text-[10px] text-slate-400">Scan with camera to open instantly</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
