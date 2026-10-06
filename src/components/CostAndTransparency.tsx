import React, { useState } from 'react';
import { 
  IndianRupee, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Layers, 
  Cpu, 
  Scale, 
  Sliders 
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface CostTier {
  id: string;
  name: string;
  estimatedCost: string;
  scope: string;
  hardwareIncludes: string[];
}

const COST_TIERS: CostTier[] = [
  {
    id: 'tier1',
    name: 'Sub-Scale Prototype (Sunny-01)',
    estimatedCost: '₹1.0 – 1.5 Lakh',
    scope: '1.5m diameter 12-rotor testbed for control algorithm & sensor fusion de-risking.',
    hardwareIncludes: [
      '12x sub-scale brushless outrunners & 15" carbon props',
      '6S high-discharge LiPo battery system',
      'PX4-based flight computer + triple IMUs',
      'Carbon tube frame & CNC aluminum hubs',
      'Ground safety tether test rig',
    ],
  },
  {
    id: 'tier2',
    name: 'Full-Scale Unmanned Research Platform',
    estimatedCost: '₹7.0 – 10.0 Lakh',
    scope: 'Full ~155 kg scale airframe for static ground dyno and unmanned tethered hovering.',
    hardwareIncludes: [
      '12x high-torque 4.5 kW electric motors & 30" carbon blades',
      '3x isolated 14S Li-ion high-current battery pods',
      'Dual lockstep flight computers & CAN telemetry ESCs',
      'Heavy-duty carbon airframe + landing gear',
      'Structural safety gantry & remote optical kill interlock',
    ],
  },
  {
    id: 'tier3',
    name: 'Advanced Instrumented Research Platform',
    estimatedCost: '₹18.0 – 28.0 Lakh+',
    scope: 'Crash-tested pilot cell, energy-absorbing seating, and extensive HIL dyno test facility.',
    hardwareIncludes: [
      'Aerospace-grade custom carbon-titanium safety roll cage',
      'Deformable honeycomb seating & 5-point aviation harness',
      'Automated intumescent fire suppression system',
      'Telemetry DAQ system + Anthropomorphic crash dummy',
      'Full spares inventory (motors, ESCs, carbon arms)',
    ],
  },
  {
    id: 'tier4',
    name: 'Professional Aerospace Development & Review',
    estimatedCost: '₹50 Lakh – ₹1 Crore+',
    scope: 'Institutional aerospace certification, environmental chamber testing, and DGCA formal safety filing.',
    hardwareIncludes: [
      'Full environmental vibration & EMI/EMC chamber compliance',
      'Certified DO-178C / DO-254 avionics audit pipeline',
      'Institutional safety review board & test range operations',
      'Comprehensive third-party aviation liability insurance',
      'Dedicated engineering and flight test team',
    ],
  },
];

const TRANSPARENCY_TABLE = [
  { item: 'Concept & Physics Math', status: 'PROPOSED & CALCULATED', badgeClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' },
  { item: 'System Architecture & Bus Segregation', status: 'PROPOSED ARCHITECTURE', badgeClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' },
  { item: '3D CAD & Digital Geometry Model', status: 'COMPLETE VIRTUAL CONCEPT', badgeClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' },
  { item: 'Software-In-The-Loop Simulation (SITL)', status: 'IN PROGRESS', badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-950/40' },
  { item: 'Sub-Scale Sunny Prototype (01)', status: 'PLANNED / IN PROGRESS', badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-950/40' },
  { item: 'Full-Scale 155 kg Physical Aircraft', status: 'NOT BUILT', badgeClass: 'text-slate-400 border-slate-700 bg-slate-900' },
  { item: 'Human-Carrying Flight Testing', status: 'NOT PERFORMED', badgeClass: 'text-rose-400 border-rose-500/40 bg-rose-950/60' },
  { item: 'DGCA / Aviation Regulatory Certification', status: 'NOT OBTAINED', badgeClass: 'text-rose-400 border-rose-500/40 bg-rose-950/60' },
];

export const CostAndTransparency: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<CostTier>(COST_TIERS[1]);

  return (
    <section id="transparency" className="relative py-20 bg-[#060913] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span className="tracking-widest uppercase">Honest Engineering & Budgeting</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            COST ESTIMATOR & TRANSPARENCY DASHBOARD
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Aerospace credibility relies on complete technical transparency. We clearly distinguish between what has been mathematically modeled versus what is proposed, while providing preliminary research budget estimates.
          </p>
        </div>

        {/* 1. What is Real vs Proposed Dashboard */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl border border-cyan-900/60 bg-[#070e1e] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                CREDIBILITY & STATUS MATRIX
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                WHAT IS REAL VS. PROPOSED?
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
              Zero Exaggeration Policy
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Research Milestone / Deliverable</th>
                  <th className="py-3 px-4 text-right">Current Verified Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {TRANSPARENCY_TABLE.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{row.item}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${row.badgeClass}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Interactive 4-Tier Preliminary Cost Breakdown */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Development Financial Budgeting
              </span>
              <h3 className="text-2xl font-display font-bold text-white">
                PRELIMINARY ESTIMATED RESEARCH BUDGETS
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-500/30">
              *PRELIMINARY ESTIMATES · NOT COMMERCIAL QUOTATIONS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Tier Tabs (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              {COST_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier);
                      telemetryAudio.playClick();
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/40 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'border-slate-800 bg-[#070b16] hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-white">{tier.name}</span>
                      <span className="text-amber-300 font-bold tabular-nums">{tier.estimatedCost}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">
                      {tier.scope}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Tier Bill of Materials Scope (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-amber-900/50 bg-[#080f1e] shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-4">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                  ESTIMATED HARDWARE & TESTING SCOPE
                </span>
                <span className="text-lg font-mono font-bold text-amber-300 tabular-nums">
                  {selectedTier.estimatedCost}
                </span>
              </div>

              <h4 className="text-xl font-display font-bold text-white mb-2">
                {selectedTier.name}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {selectedTier.scope}
              </p>

              <div className="space-y-2 text-xs font-mono border-t border-slate-800/80 pt-4">
                <div className="text-slate-400 uppercase text-[11px] mb-2">Key Hardware Allocations:</div>
                {selectedTier.hardwareIncludes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. The 6 Biggest Engineering Challenges */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16]">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Technical Realism
            </span>
            <h3 className="text-2xl font-display font-bold text-white mt-1 mb-2">
              THE 6 BIGGEST ENGINEERING CHALLENGES
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              &ldquo;The hardest problem is not generating enough vertical thrust. It is proving that the entire system can fail safely.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: '01', title: 'Battery Safety & Thermal Cascading', desc: 'Preventing a single cell thermal event from propagating across a 50V, 500A bus network.' },
              { num: '02', title: 'Fault-Tolerant Control Allocation', desc: 'Re-trimming 3-axis attitude moments in < 15ms without pilot-induced oscillations.' },
              { num: '03', title: 'Structural Integrity Under G-Loads', desc: 'Resisting 2.2x G dynamic landing impacts while keeping frame mass below 12 kg.' },
              { num: '04', title: 'High-Current Thermal Dissipation', desc: 'Dissipating continuous resistive I²R heat from 12 ESCs in forced propeller downwash.' },
              { num: '05', title: 'Tether & Gantry Dynamics', desc: 'Preventing dangerous inverted pendulum instability and propeller line entanglement.' },
              { num: '06', title: 'Indian Civil Aviation Compliance', desc: 'Navigating experimental airworthiness and safety authorizations under DGCA regulations.' },
            ].map((c) => (
              <div key={c.num} className="p-4 rounded-xl border border-slate-800 bg-[#05070e]">
                <div className="text-xs font-mono text-cyan-400 font-bold mb-1">CHALLENGE {c.num}</div>
                <h5 className="font-display font-bold text-white text-sm mb-2">{c.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
