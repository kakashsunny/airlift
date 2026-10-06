import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Activity, 
  Cpu, 
  Zap, 
  Compass, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 bg-[#05070d] overflow-hidden">
      {/* Precision Engineering Coordinate Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-sm text-cyan-300 text-xs font-mono mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="tracking-widest uppercase font-semibold">CONCEPTUAL ENGINEERING PROJECT</span>
          <span className="text-cyan-600">·</span>
          <span className="text-slate-400">5 M LOW-ALTITUDE RESEARCH</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-none mb-4 uppercase">
          PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">AEROLIFT</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-medium max-w-3xl mx-auto mb-3">
          Low-Altitude Electric Human-Lift Research Platform
        </p>

        {/* Feature Tags */}
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-mono text-cyan-400/90 mb-8 flex-wrap">
          <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">12-Rotor Coaxial</span>
          <span className="text-slate-600">/</span>
          <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">100% Electric</span>
          <span className="text-slate-600">/</span>
          <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">Triple-Isolated Power</span>
          <span className="text-slate-600">/</span>
          <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-amber-300 border-amber-500/30">Safety-First Design</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 max-w-xl mx-auto">
          <a
            href="#architecture"
            onClick={() => telemetryAudio.playClick()}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-cyan-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          >
            <span>Explore Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#safety"
            onClick={() => telemetryAudio.playClick()}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-200 font-mono font-medium text-xs uppercase tracking-wider hover:border-cyan-500/60 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>View Safety System</span>
          </a>

          <a
            href="#3d-model"
            onClick={() => telemetryAudio.playClick()}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 font-mono font-medium text-xs uppercase tracking-wider hover:border-slate-700 hover:text-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>3D Aircraft CAD</span>
          </a>
        </div>

        {/* Foundational Innovation Statement Banner */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-[#070e1e]/90 backdrop-blur-md text-left mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-1 flex items-center gap-2">
                <span>FOUNDATIONAL RESEARCH THESIS</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-300">SUNNY PROTOTYPE SMALL & FULL PLATFORM</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium italic">
                &ldquo;Our innovation is not inventing the multirotor itself. It is developing a safety-first, fault-tolerant system architecture that combines distributed propulsion, redundant power, intelligent control allocation, digital-twin failure simulation, and controlled testing for low-altitude human-lift research.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Key Envelope Metrics Grid (4 items) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto text-left">
          <div className="p-4 rounded-xl border border-slate-800 bg-[#080d1a]/80 backdrop-blur-sm relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>TARGET MASS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">EST.</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              ~155 <span className="text-sm font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Pilot + Frame + 3 Battery Pods
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#080d1a]/80 backdrop-blur-sm relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>PROPULSION</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">6 COAXIAL</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              12 <span className="text-sm font-normal text-slate-400">Motors</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Counter-rotating rotor pairs
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#080d1a]/80 backdrop-blur-sm relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>HOVER POWER</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">EST.</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
              22–25 <span className="text-sm font-normal text-slate-400">kW</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Peak: 45–55 kW available
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#080d1a]/80 backdrop-blur-sm relative">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>RESEARCH CEILING</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">ENVELOPE</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tabular-nums">
              5 <span className="text-sm font-normal text-slate-400">m AGL</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Controlled tethered altitude
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#overview"
            onClick={() => telemetryAudio.playClick()}
            aria-label="Scroll to Overview"
            className="flex flex-col items-center gap-1 text-slate-500 hover:text-cyan-400 transition-colors text-xs font-mono"
          >
            <span>DISCOVER RESEARCH CONCEPT</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
