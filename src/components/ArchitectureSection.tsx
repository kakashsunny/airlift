import React, { useState } from 'react';
import { 
  GitFork, 
  Cpu, 
  Zap, 
  RotateCw, 
  RotateCcw, 
  Wind, 
  Check, 
  X, 
  AlertTriangle, 
  Info,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface SystemNode {
  id: string;
  name: string;
  type: 'control' | 'power' | 'thrust';
  description: string;
  specs: string;
}

const SYSTEM_NODES: Record<string, SystemNode> = {
  pilot_input: {
    id: 'pilot_input',
    name: 'Pilot Command Interface',
    type: 'control',
    description: 'Fly-by-wire cyclic stick, collective collective lever, and rudder pedals with dual Hall-effect position encoders.',
    specs: 'Dual CAN-bus output, 12-bit resolution, physical center spring return',
  },
  dual_fc: {
    id: 'dual_fc',
    name: 'Dual Flight Controllers',
    type: 'control',
    description: 'Lockstep PX4-based autopilots computing state estimation via EKF3 and handling triple-sensor voting.',
    specs: '800 Hz loop frequency, redundant STM32H7 processors, isolated power feeds',
  },
  allocation: {
    id: 'allocation',
    name: 'Dynamic Control Allocation Matrix',
    type: 'control',
    description: 'Quadratic programming optimizer mapping 3-axis torque and vertical thrust demands across 12 individual ESCs.',
    specs: 'Real-time re-allocation in < 5 ms upon motor/ESC telemetry failure detection',
  },
  escs: {
    id: 'escs',
    name: '12x Smart ESCs',
    type: 'control',
    description: 'Individual field-oriented control (FOC) motor controllers running DShot1200 protocol with live RPM/current telemetry.',
    specs: '100 A continuous, 150 A burst per channel, CAN-telemetry feedback',
  },
  motors: {
    id: 'motors',
    name: '12x Coaxial Motors',
    type: 'thrust',
    description: '6 top and 6 bottom direct-drive brushless outrunner motors arranged coaxially on 6 radial arms.',
    specs: 'Total collective thrust capacity: ~300 kgf (1.93:1 Thrust-to-Weight Ratio)',
  },
  propellers: {
    id: 'propellers',
    name: '12x Counter-Rotating Propellers',
    type: 'thrust',
    description: 'Upper props (CW) and Lower props (CCW) with staggered pitch to balance torque in accelerated coaxial inflow.',
    specs: 'Carbon fiber 30-inch blades, 220 mm axial separation gap',
  },
  batteries: {
    id: 'batteries',
    name: '3x Segregated Battery Pods',
    type: 'power',
    description: 'Physically separated Li-ion packs (Packs A, B, C), each powering 4 dedicated motors across alternating arm quadrants.',
    specs: '51.8 V nominal, 60 Ah total capacity, isolated thermal enclosures',
  },
  power_dist: {
    id: 'power_dist',
    name: 'Isolated Power Distribution Bus',
    type: 'power',
    description: 'Three non-shared copper busbars equipped with bidirectional current shunts, solid-state contactors, and pyro fuses.',
    specs: 'Zero common ground power bus to prevent cross-bank thermal runaway cascade',
  },
};

export const ArchitectureSection: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SystemNode>(SYSTEM_NODES.dual_fc);
  const [activeConfigTab, setActiveConfigTab] = useState<'4' | '6' | '8' | '12'>('12');

  const configs = [
    {
      id: '4',
      name: '4-Rotor (Quadcopter)',
      arms: 4,
      motors: 4,
      complexity: 'Low',
      redundancy: 'Zero (Non-Tolerant)',
      failureTolerance: 'Catastrophic crash upon single motor/ESC failure.',
      footprint: 'Large (~2.4m span)',
      suitability: 'Unsuitable for Human Flight',
      status: 'Rejected',
    },
    {
      id: '6',
      name: '6-Rotor (Hexacopter)',
      arms: 6,
      motors: 6,
      complexity: 'Moderate',
      redundancy: 'Marginal',
      failureTolerance: 'Can maintain attitude in calm air; severe loss of yaw authority, risk of flip.',
      footprint: 'Moderate (~2.2m span)',
      suitability: 'Marginal / High Risk',
      status: 'Rejected',
    },
    {
      id: '8',
      name: '8-Rotor (Octocopter Flat)',
      arms: 8,
      motors: 8,
      complexity: 'High',
      redundancy: 'Good',
      failureTolerance: 'Can tolerate 1 motor loss safely with degraded climb rate.',
      footprint: 'Very Large (> 2.8m span for adequate prop diameter)',
      suitability: 'Viable but High Geometric Footprint',
      status: 'Alternative',
    },
    {
      id: '12',
      name: '12-Rotor Coaxial (AeroLift)',
      arms: 6,
      motors: 12,
      complexity: 'Very High',
      redundancy: 'Comprehensive',
      failureTolerance: 'Engineered to tolerate 1 or 2 non-adjacent motor failures without loss of trim.',
      footprint: 'Compact (~1.6m arm radius due to stacked coaxial pairs)',
      suitability: 'Candidate for Low-Altitude Research Platform',
      status: 'Selected Research Concept',
    },
  ];

  return (
    <section id="architecture" className="relative py-20 bg-[#060913] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <GitFork className="w-4 h-4" />
            <span className="tracking-widest uppercase">System Topology & Propulsion Mechanics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            FLIGHT SYSTEM ARCHITECTURE
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The flight architecture pairs dual redundant flight control computers with three physically isolated battery buses to drive 12 coaxial propulsion units.
          </p>
        </div>

        {/* 1. Interactive End-to-End System Topology Diagram */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Data & Power Flow Architecture
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                INTERACTIVE AVIONICS & POWER DISTRIBUTION BUS
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Click any node to inspect signal flow & specifications
            </span>
          </div>

          {/* Flow Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Control Path (Column 1) */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-cyan-950">
                <Cpu className="w-3.5 h-3.5" />
                <span>Control Chain (Triple Redundant)</span>
              </div>

              {[
                SYSTEM_NODES.pilot_input,
                SYSTEM_NODES.dual_fc,
                SYSTEM_NODES.allocation,
              ].map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    telemetryAudio.playClick();
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                    selectedNode.id === node.id
                      ? 'border-cyan-500 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1">
                    <span>{node.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {node.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Power Isolation Path (Column 2) */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-amber-950">
                <Zap className="w-3.5 h-3.5" />
                <span>Power Bus (3-Way Segregated)</span>
              </div>

              {[
                SYSTEM_NODES.batteries,
                SYSTEM_NODES.power_dist,
                SYSTEM_NODES.escs,
              ].map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    telemetryAudio.playClick();
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                    selectedNode.id === node.id
                      ? 'border-amber-500 bg-amber-950/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                    <span>{node.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {node.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Propulsion & Thrust Path (Column 3) */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-sky-950">
                <Wind className="w-3.5 h-3.5" />
                <span>Propulsion Output (12 Rotors)</span>
              </div>

              {[
                SYSTEM_NODES.motors,
                SYSTEM_NODES.propellers,
              ].map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    telemetryAudio.playClick();
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                    selectedNode.id === node.id
                      ? 'border-sky-500 bg-sky-950/60 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-sky-300 mb-1">
                    <span>{node.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {node.description}
                  </div>
                </button>
              ))}

              {/* Selected Node Specs Detail */}
              <div className="mt-4 p-4 rounded-xl border border-cyan-900/60 bg-[#0a1222] text-xs font-mono">
                <div className="text-cyan-400 uppercase tracking-wider text-[11px] mb-1">
                  Active Node Telemetry:
                </div>
                <div className="font-bold text-white text-sm mb-1">{selectedNode.name}</div>
                <div className="text-slate-300 text-xs mb-2 leading-relaxed">{selectedNode.description}</div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300 font-mono">
                  SPEC: {selectedNode.specs}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Rotor Configuration Comparison: 4 vs 6 vs 8 vs 12 */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Architectural Trade-Off Analysis
              </span>
              <h3 className="text-2xl font-display font-bold text-white">
                ROTOR COUNT SELECTION: WHY 12 ROTORS?
              </h3>
            </div>

            {/* Tab Filter for Mobile / Quick Select */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['4', '6', '8', '12'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveConfigTab(tab);
                    telemetryAudio.playClick();
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                    activeConfigTab === tab
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}-Rotor
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {configs.map((c) => {
              const isCandidate = c.id === '12';
              const isSelected = activeConfigTab === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConfigTab(c.id as any);
                    telemetryAudio.playClick();
                  }}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    isCandidate
                      ? 'border-cyan-500/80 bg-gradient-to-b from-[#09152b] to-[#070b16] ring-1 ring-cyan-500/30'
                      : isSelected
                      ? 'border-slate-600 bg-slate-900/90'
                      : 'border-slate-800 bg-[#070a14] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">{c.arms} Arms / {c.motors} Motors</span>
                    {isCandidate && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                        RESEARCH CANDIDATE
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-display font-bold text-white mb-3">
                    {c.name}
                  </h4>

                  <div className="space-y-2 text-xs font-mono border-t border-slate-800/80 pt-3 mb-4">
                    <div className="flex justify-between py-0.5 border-b border-slate-800/40">
                      <span className="text-slate-400">Complexity:</span>
                      <span className="text-slate-200">{c.complexity}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800/40">
                      <span className="text-slate-400">Redundancy:</span>
                      <span className={isCandidate ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                        {c.redundancy}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800/40">
                      <span className="text-slate-400">Footprint:</span>
                      <span className="text-slate-300">{c.footprint}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                    {c.failureTolerance}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Caveat Callout Banner */}
          <div className="mt-4 p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-mono flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase">Critical Aerospace Precept:</strong> More motors do <span className="underline">not</span> automatically guarantee more safety. Having 12 motors triples the quantity of potential component failure points (12 ESCs, 12 solder joints, 12 bearing sets). Redundancy is only meaningful if the control allocation algorithm and electrical bus architecture can safely isolate failures without dynamic loss of control.
            </div>
          </div>
        </div>

        {/* 3. Coaxial Propulsion Dynamics & Flow Physics */}
        <div className="p-6 sm:p-8 rounded-2xl border border-cyan-900/50 bg-[#070d1c]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Animated Vector Diagram (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-xl border border-slate-800 bg-[#05070e] flex flex-col items-center text-center relative overflow-hidden">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-4">
                COAXIAL AIRFLOW DYNAMICS
              </span>

              {/* Upper Propeller */}
              <div className="w-48 h-8 rounded-full border border-cyan-400/80 bg-cyan-950/40 flex items-center justify-between px-3 text-cyan-300 text-xs font-mono relative animate-pulse">
                <RotateCw className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span className="font-bold">UPPER ROTOR (CW)</span>
                <span className="text-[10px]">Free-Stream</span>
              </div>

              {/* Downward Accelerated Airflow Ingestion */}
              <div className="my-3 flex flex-col items-center gap-1 text-slate-500 font-mono text-[10px]">
                <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-sky-400 animate-bounce" />
                <span>Inter-Rotor Gap (220mm)</span>
                <div className="w-0.5 h-6 bg-gradient-to-b from-sky-400 to-amber-400 animate-bounce" />
              </div>

              {/* Lower Propeller */}
              <div className="w-48 h-8 rounded-full border border-amber-400/80 bg-amber-950/40 flex items-center justify-between px-3 text-amber-300 text-xs font-mono relative animate-pulse">
                <RotateCcw className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="font-bold">LOWER ROTOR (CCW)</span>
                <span className="text-[10px]">Accelerated Inflow</span>
              </div>

              {/* Net Thrust Vector */}
              <div className="mt-4 pt-3 border-t border-slate-800 w-full flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
                <span className="font-bold">COMBINED VERTICAL THRUST (~25–30 kgf / arm)</span>
              </div>
            </div>

            {/* Technical Explanation & Pros/Cons (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Aerodynamic Trade-Offs
              </span>
              <h4 className="text-2xl font-display font-bold text-white">
                Coaxial Propulsion Principles
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                In a coaxial configuration, two propulsion units are positioned on the same vertical axis. The upper propeller ingests ambient air, accelerating it downwards. The lower propeller operates inside this high-velocity slipstream.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg border border-emerald-900/40 bg-emerald-950/20">
                  <div className="text-xs font-mono font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ENGINEERING ADVANTAGES</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li>· 40% reduction in overall airframe footprint diameter.</li>
                    <li>· Localized torque cancellation without yaw drift.</li>
                    <li>· Continuous thrust authority if either motor fails.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-amber-900/40 bg-amber-950/20">
                  <div className="text-xs font-mono font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-amber-400" />
                    <span>KNOWN DISADVANTAGES</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    <li>· 6% to 8% aerodynamic efficiency loss vs planar rotors.</li>
                    <li>· Turbulent boundary layer ingestion into lower propeller.</li>
                    <li>· Increased mechanical vibration & axial bearing loads.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
