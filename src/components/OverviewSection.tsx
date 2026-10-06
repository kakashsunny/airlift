import React, { useState } from 'react';
import { 
  Target, 
  AlertOctagon, 
  ShieldCheck, 
  Wind, 
  Flame, 
  ZapOff, 
  HelpCircle,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

export const OverviewSection: React.FC = () => {
  const [activeAltitude, setActiveAltitude] = useState<number>(5);

  const altitudeSteps = [
    {
      alt: 0,
      label: '0 m · Ground Stage',
      phase: 'Ground Dynamics',
      desc: 'Static dyno thrust validation, ground resonance frequency checks, and high-voltage isolation proofing.',
      riskFactor: 'High electrical & high-RPM projectile hazard. Minimal gravitational kinetic risk.',
      mitigation: 'Physical blast shields, ground tether anchor, remote optical kill switch.',
    },
    {
      alt: 1,
      label: '1 m · Micro-Hover',
      phase: 'Ground Effect Transition',
      desc: 'Evaluation of localized downwash cushion, turbulent recirculation underneath 12 coaxial rotors, and initial EKF altitude hold.',
      riskFactor: 'Severe ground effect turbulence, vortex ring recirculation, tip-over torque.',
      mitigation: 'Wide-stance landing skids (1.85m), progressive polyurethane shock dampers.',
    },
    {
      alt: 3,
      label: '3 m · Intermediate Envelope',
      phase: 'Clean Air Stability',
      desc: 'Free-stream aerodynamic hover away from ground reflection; validation of dual flight computer attitude stabilization under cross-drafts.',
      riskFactor: 'Kinetic fall energy (E = mgh ≈ 4.5 kJ). Insufficient height for parachute deployment.',
      mitigation: 'Tensioned dual safety tether gantry, active failure detection.',
    },
    {
      alt: 5,
      label: '5 m · Target Ceiling',
      phase: 'Research Boundary',
      desc: 'Target controlled flight envelope. Investigates whether multi-rotor redundancy allows safe vertical position holding for human mass.',
      riskFactor: 'Terminal fall velocity ≈ 9.9 m/s (35 km/h). Free-fall impact without redundancy is catastrophic.',
      mitigation: '12-rotor failure tolerance, 3-pack bus isolation, crushable honeycomb seat, safety cage.',
    },
  ];

  return (
    <section id="overview" className="relative py-20 bg-[#05070d] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="tracking-widest uppercase">Project Charter & Scope</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            WHAT ARE WE TRYING TO BUILD?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            An electrically powered multirotor research platform designed to investigate controlled low-altitude human-lift flight up to approximately <strong className="text-cyan-300 font-semibold">5 metres</strong>.
          </p>
        </div>

        {/* Philosophy Callout Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-cyan-900/60 bg-gradient-to-r from-[#070e1e] via-[#091428] to-[#070e1e] shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-mono tracking-wider uppercase text-cyan-400">
                Core Engineering Philosophy
              </span>
              <blockquote className="text-lg sm:text-xl font-display font-medium text-white italic">
                &ldquo;The goal is not simply to make a machine fly. The goal is to investigate whether human-lift flight can be approached through redundancy, simulation, controlled testing and engineering validation.&rdquo;
              </blockquote>
            </div>
            <div className="shrink-0">
              <div className="px-4 py-2.5 rounded-lg border border-amber-500/30 bg-amber-950/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero Commercial Claims · Pure Research</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why 5 Metres Interactive Analysis */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Aerospace Risk & Altitude Boundary
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1">
                WHY 5 METRES?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
                Low altitude does <span className="text-rose-400 font-semibold uppercase">not</span> automatically mean low risk. In fact, low-altitude human flight introduces unique safety challenges.
              </p>
            </div>

            {/* Altitude Selector Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
              {altitudeSteps.map((step) => (
                <button
                  key={step.alt}
                  onClick={() => {
                    setActiveAltitude(step.alt);
                    telemetryAudio.playClick();
                  }}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                    activeAltitude === step.alt
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {step.alt}m
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Altitude Ladder Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-10">
            {/* Visual Altitude Gauge (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-xl border border-slate-800 bg-[#070a14] flex flex-col justify-between">
              <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between pb-3 border-b border-slate-800">
                <span>VERTICAL FLIGHT PROFILE</span>
                <span className="text-cyan-400">AGL (ABOVE GROUND LEVEL)</span>
              </div>

              {/* Vertical Metric Meter */}
              <div className="relative my-6 py-4 flex flex-col justify-between h-64 border-l-2 border-dashed border-slate-700 ml-6 pl-6">
                {[5, 3, 1, 0].map((h) => (
                  <div
                    key={h}
                    onClick={() => {
                      setActiveAltitude(h);
                      telemetryAudio.playClick();
                    }}
                    className={`relative cursor-pointer transition-all flex items-center gap-3 ${
                      activeAltitude === h ? 'scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 transition-colors ${
                        activeAltitude === h
                          ? 'border-cyan-400 bg-cyan-400 ring-4 ring-cyan-500/20'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    />
                    <div className="font-mono text-sm font-bold text-white">{h} METRES</div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {h === 5 ? 'Target Ceiling' : h === 0 ? 'Ground Base' : 'Phase Test'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Target Ceiling constrained strictly by energy budget & tether gantry limits.
              </div>
            </div>

            {/* Selected Altitude Deep-Dive (8 Cols) */}
            <div className="lg:col-span-8 p-6 rounded-xl border border-cyan-900/50 bg-[#080e1c] shadow-lg flex flex-col justify-between">
              {(() => {
                const current = altitudeSteps.find((s) => s.alt === activeAltitude) || altitudeSteps[3];
                return (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                        {current.label} — {current.phase}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                        STAGE SPECIFICATION
                      </span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                      {current.phase} Dynamics
                    </h4>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {current.desc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-rose-900/40 bg-rose-950/20">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-300 mb-1">
                          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>PHYSICAL RISK FACTOR</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">
                          {current.riskFactor}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border border-emerald-900/40 bg-emerald-950/20">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 mb-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>ENGINEERING MITIGATION</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">
                          {current.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 4 Reasons Why Low Altitude is High Risk */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
              <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>NO PARACHUTE RECOVERY</span>
              </div>
              <h5 className="font-display font-bold text-sm text-white mb-1">
                Zero Parachute Deployment Time
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ballistic recovery systems require &ge; 30–50 m to deploy and inflate canopy. At 5 m altitude, a parachute is completely non-functional.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
              <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" />
                <span>NO AUTOROTATION</span>
              </div>
              <h5 className="font-display font-bold text-sm text-white mb-1">
                Fixed-Pitch Electric Rotors
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike helicopters with swashplates and collective pitch, multirotor fixed-pitch blades cannot windmill to glide down safely upon total power loss.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
              <div className="text-xs font-mono text-cyan-400 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ARCHITECTURAL REDUNDANCY</span>
              </div>
              <h5 className="font-display font-bold text-sm text-white mb-1">
                Safety Must Live In The System
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Since emergency escape systems do not exist at 5m, safety must rely entirely on 12-motor failure tolerance, 3-pack electrical bus segregation, and controlled gantry tethers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
