'use client';
import { useState, useRef, useEffect } from 'react';
import { Globe, Volume2, VolumeX } from 'lucide-react';
import LanguageSwitcher from '@/app/invite/_components/LanguageSwitcher';
import { WEDDING_EVENT } from '@/lib/wedding';
import { Button } from '@/components/ui/button';

function LocaleControl() {
  const [showLocales, setShowLocales] = useState(false);
  const localeBtnRef = useRef<HTMLButtonElement | null>(null);
  const localePanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showLocales) return;

    function handleOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (localeBtnRef.current?.contains(target)) return;
      if (localePanelRef.current?.contains(target)) return;
      setShowLocales(false);
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [showLocales]);

  // Close panel on Escape key
  useEffect(() => {
    if (!showLocales) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowLocales(false);
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLocales]);

  const toggleLocales = () => setShowLocales((prev) => !prev);

  return (
    <div className="pointer-events-auto">
      <Button
        ref={localeBtnRef}
        onClick={toggleLocales}
        aria-label="Change language"
        aria-haspopup="dialog"
        aria-expanded={showLocales}
        aria-controls="locale-panel"
        variant="ghost"
        size="icon"
      >
        <Globe className="size-5 text-zinc-600" />
      </Button>
      {showLocales && (
        <div
          id="locale-panel"
          ref={localePanelRef}
          className="animate-in fade-in zoom-in-95 mt-2 w-64 rounded-lg border border-zinc-300 bg-white p-2 text-zinc-700 shadow-lg ring-1 ring-black/5"
        >
          <LanguageSwitcher />
        </div>
      )}
    </div>
  );
}

function MusicControl() {
  const [muted, setMuted] = useState(true); // start muted to comply with autoplay policies
  const [audioAvailable, setAudioAvailable] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio playback based on muted state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = muted;
    audio.volume = 0.3; // Set volume to 30%

    if (!muted) {
      audio.play().catch(() => {
        // If play fails (autoplay restriction), revert to muted
        setMuted(true);
      });
    } else {
      audio.pause();
    }
  }, [muted]);

  const toggleMute = () => setMuted((prev) => !prev);

  const handleAudioError = () => setAudioAvailable(false);

  if (!audioAvailable) return null;

  return (
    <div className="pointer-events-auto">
      <Button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
        variant="ghost"
        size="icon"
      >
        {muted ? (
          <VolumeX className="size-5 text-zinc-600" />
        ) : (
          <Volume2 className="size-5 text-zinc-600" />
        )}
      </Button>
      <audio
        ref={audioRef}
        src={WEDDING_EVENT.musicUrl}
        loop
        onError={handleAudioError}
        className="hidden"
      />
    </div>
  );
}

export function TopControls() {
  return (
    <div className="pointer-events-none absolute top-0 right-0 left-0 z-30 mx-auto max-w-[430px]">
      <div className="relative">
        {/* Left: Language selector */}
        <div className="absolute top-2 left-2">
          <LocaleControl />
        </div>

        {/* Right: Music control */}
        <div className="absolute top-2 right-2">
          <MusicControl />
        </div>
      </div>
    </div>
  );
}
