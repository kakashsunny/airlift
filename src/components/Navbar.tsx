import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Layers } from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const newMuted = telemetryAudio.toggleMute();
    setIsMuted(newMuted);
  };

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: '3D Explorer', href: '#3d-model' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Sunny Prototype', href: '#prototype-01' },
    { label: 'Failure Studio', href: '#failures' },
    { label: 'Safety Systems', href: '#safety' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Judge Q&A', href: '#judge-qa' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05070d]/90 backdrop-blur-md border-b border-cyan-950/60 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element Brand Zone */}
        <a
          href="#"
          onClick={() => telemetryAudio.playClick()}
          className="flex items-center gap-2.5 text-white group"
        >
          <div className="w-7 h-7 rounded border border-cyan-500/40 bg-cyan-950/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs tracking-wider group-hover:border-cyan-400 transition-colors">
            AL
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
            PROJECT AEROLIFT
          </span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => telemetryAudio.playClick()}
              className="hover:text-cyan-400 transition-colors py-1 relative text-xs uppercase tracking-wider font-mono"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Audio Telemetry Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Enable Audio Telemetry' : 'Mute Audio Telemetry'}
            aria-label={isMuted ? 'Enable Audio Telemetry' : 'Mute Audio Telemetry'}
            className={`p-2 rounded border text-xs transition-colors flex items-center gap-1.5 font-mono ${
              isMuted
                ? 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                : 'border-cyan-500/50 bg-cyan-950/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-semibold">
              {isMuted ? 'Audio Off' : 'Audio On'}
            </span>
          </button>

          {/* Preliminary Status Action */}
          <a
            href="#transparency"
            onClick={() => telemetryAudio.playClick()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/30 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 transition-colors text-xs font-mono font-medium tracking-wide whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Research Concept</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              telemetryAudio.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070a14] border-b border-cyan-950 px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  telemetryAudio.playClick();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/30 rounded border border-transparent hover:border-cyan-900/50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-[11px]">STATUS: PRELIMINARY ESTIMATE</span>
            <span className="text-cyan-400">5M RESEARCH ENVELOPE</span>
          </div>
        </div>
      )}
    </header>
  );
};
