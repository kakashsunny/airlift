import React, { useState } from 'react';
import { 
  Rocket, 
  Layers, 
  Weight, 
  Maximize2, 
  ShieldCheck, 
  Cpu, 
  Activity,
  CheckCircle,
  HelpCircle,
  Zap,
  Sliders,
  RotateCw
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

export const SunnyPrototype: React.FC = () => {
  const [ballastWeight, setBallastWeight] = useState<number>(12);

  // Dynamic calculations for the Sunny testbed
  const dryAirframeMass = 10.5; // kg
  const totalSunnyMass = dryAirframeMass + ballastWeight;
  const maxSunnyThrust = 48.0; // kgf (12x ~4 kgf peak)
  const twr = (maxSunnyThrust / totalSunnyMass).toFixed(2);
  const estHoverPowerKw = (totalSunnyMass * 0.14).toFixed(1);

  const comparisonSpecs = [
    {
      metric: 'Vehicle Role',
      sunny: 'Sub-Scale Architecture & Control Validation',
      fullScale: 'Human-Lift 5m Low-Altitude Research Platform',
    },
    {
      metric: 'Occupancy / Payload',
      sunny: `${ballastWeight} kg Instrumented Ballast (No Human)`,
      fullScale: '~80 kg Pilot with 5-Point Safety Harness',
    },
    {
      metric: 'Propulsion Configuration',
      sunny: '6 Arms / 12 Brushless Motors (Coaxial Pairs)',
      fullScale: '6 Arms / 12 High-Torque Outrunners (Coaxial Pairs)',
    },
    {
      metric: 'Airframe Wingspan / Diameter',
      sunny: '~1.50 m Tip-to-Tip Diameter',
      fullScale: '~2.90 m Tip-to-Tip Diameter',
    },
    {
      metric: 'Total All-Up Mass (MTOM)',
      sunny: `~${totalSunnyMass.toFixed(1)} kg (Current Ballast Config)`,
      fullScale: '~155 kg (Preliminary Design Target)',
    },
    {
      metric: 'Estimated Hover Power',
      sunny: `~${estHoverPowerKw} kW Total`,
      fullScale: '~22–25 kW Total (Est)',
    },
    {
      metric: 'Thrust-to-Weight Ratio',
      sunny: `${twr} : 1 Dynamic Margin`,
      fullScale: '1.93 : 1 Peak Margin',
    },
    {
      metric: 'Battery Chemistry / Bus',
      sunny: '6S LiPo Pack / Dual Redundant Bus',
      fullScale: '14S/18S NMC High-Discharge / 3 Isolated Buses',
    },
    {
      metric: 'Safety Restraint Enclosure',
      sunny: 'Lightweight Gantry Skid Tether',
      fullScale: 'Tubular Roll Cage + Energy-Absorbing Seat + 5m Tether',
    },
    {
      metric: 'Testing Protocol Stage',
      sunny: 'Phase 03 (Unmanned Sub-Scale Validation)',
      fullScale: 'Phase 04/05 (Unmanned Full-Scale Gantry Trials)',
    },
  ];

  return (
    <section id="prototype-01" className="relative py-20 bg-[#060913] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span className="tracking-widest uppercase">Sub-Scale Testbed · Prototype 01</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            SUNNY PROTOTYPE (PROTOTYPE 01 SMALL)
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Before engineering a 155 kg human-scale aircraft, our experimental methodology requires a sub-scale, unmanned flight vehicle to prove multi-rotor control allocation algorithms, EKF sensor fusion, and failure-injection response safely.
          </p>
        </div>

        {/* Foundational Innovation Statement Banner */}
        <div className="p-6 rounded-2xl border border-cyan-500/30 bg-[#070e20] shadow-xl mb-12 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-1">
                Core Innovation Philosophy
              </span>
              <blockquote className="text-sm sm:text-base text-white font-display italic leading-relaxed">
                &ldquo;Our innovation is not inventing the multirotor itself. It is developing a safety-first, fault-tolerant system architecture that combines distributed propulsion, redundant power, intelligent control allocation, digital-twin failure simulation, and controlled testing for low-altitude human-lift research.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>

        {/* Prototype Hero Card + Live Ballast Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 p-6 sm:p-8 rounded-2xl border border-cyan-900/50 bg-[#070e1e] shadow-xl">
          {/* Left Visual Presentation & Ballast Tuning (6 Cols) */}
          <div className="lg:col-span-6 p-6 rounded-xl border border-slate-800 bg-[#04060c] relative">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-4 pb-2 border-b border-slate-800">
              <span>DESIGNATION: SUNNY-01 (SMALL)</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 text-[10px] border border-amber-500/30">
                1.5M TEST VEHICLE
              </span>
            </div>

            {/* Prototype Graphic / Schematic representation */}
            <div className="relative py-6 flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center relative animate-pulse">
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <div
                    key={i}
                    style={{ transform: `rotate(${deg}deg) translate(80px) rotate(-${deg}deg)` }}
                    className="absolute w-6 h-6 rounded-full border border-cyan-400 bg-cyan-950 flex items-center justify-center text-[9px] font-mono text-cyan-300 font-bold"
                  >
                    C{i + 1}
                  </div>
                ))}
                <div className="w-20 h-20 rounded-full border border-cyan-500/60 bg-cyan-950/80 flex flex-col items-center justify-center text-center p-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Weight className="w-4 h-4 text-cyan-300 mb-0.5" />
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{ballastWeight} kg</span>
                  <span className="text-[8px] font-mono text-slate-400">Ballast Tank</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-sm font-display font-bold text-white">
                  1.5m Span · 12 Coaxial Micro-Rotors
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  Sub-Scale Hardware-In-The-Loop Validation Platform
                </div>
              </div>
            </div>

            {/* Live Interactive Ballast Load Slider */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Adjust Testbed Ballast Weight:</span>
                </span>
                <span className="text-cyan-300 font-bold tabular-nums">{ballastWeight} kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="1"
                value={ballastWeight}
                onChange={(e) => {
                  setBallastWeight(parseInt(e.target.value));
                  telemetryAudio.playClick();
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>5 kg (Lightweight)</span>
                <span>10 kg (Nominal)</span>
                <span>15 kg (Max Load)</span>
              </div>
            </div>

            {/* Real-time Subscale Calculated Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-xs font-mono mt-3">
              <div className="p-2 rounded bg-slate-900/60 text-slate-300">
                <span className="text-[10px] text-slate-400 block">TOTAL MASS</span>
                <span className="font-bold text-white tabular-nums">{totalSunnyMass.toFixed(1)} kg</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 text-slate-300">
                <span className="text-[10px] text-slate-400 block">TWR RATIO</span>
                <span className="font-bold text-emerald-400 tabular-nums">{twr} : 1</span>
              </div>
              <div className="p-2 rounded bg-slate-900/60 text-slate-300">
                <span className="text-[10px] text-slate-400 block">HOVER POWER</span>
                <span className="font-bold text-cyan-300 tabular-nums">{estHoverPowerKw} kW</span>
              </div>
            </div>
          </div>

          {/* Right Core Purpose & Rationale (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Risk Reduction Milestones
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Why We Start With Sunny Prototype
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The goal of the Sunny Prototype is <strong className="text-white">not to carry a person</strong>. Its sole mission is to de-risk the complex aerodynamics of coaxial rotor-wash interaction, tune attitude estimation algorithms under real vibration profiles, and physically validate failure-injection recovery on a low-cost, repairable testbed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-lg border border-slate-800 bg-[#060912]">
                <div className="text-xs font-mono font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Control Allocation Tuning</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Proves quadratic programming matrix solves rotor torque balancing without gyro oscillation.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-800 bg-[#060912]">
                <div className="text-xs font-mono font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Physical Failure Injection</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Cut motor power mid-hover under tether to record telemetry and verify automatic re-trimming.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#3d-model"
                onClick={() => telemetryAudio.playClick()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 text-xs font-mono font-bold uppercase transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>View Sunny Prototype in 3D CAD</span>
              </a>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Technical Specifications Comparison
              </span>
              <h4 className="text-xl font-display font-bold text-white">
                SUNNY PROTOTYPE SMALL vs. FULL-SCALE AEROLIFT PLATFORM
              </h4>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
              PRELIMINARY ESTIMATES
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Engineering Parameter</th>
                  <th className="py-3 px-4 text-cyan-300">Sunny Prototype Small (1.5m)</th>
                  <th className="py-3 px-4 text-amber-300">Project AeroLift (Full 2.9m Concept)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {comparisonSpecs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{row.metric}</td>
                    <td className="py-3.5 px-4 text-cyan-200">{row.sunny}</td>
                    <td className="py-3.5 px-4 text-slate-300">{row.fullScale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
