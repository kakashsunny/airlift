import React, { useState } from 'react';
import { 
  Gauge, 
  BatteryCharging, 
  Flame, 
  Zap, 
  Weight, 
  ShieldAlert, 
  Activity,
  Sliders,
  AlertTriangle,
  Info
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface MassItem {
  id: string;
  name: string;
  category: 'Payload' | 'Propulsion' | 'Power' | 'Airframe' | 'Avionics' | 'Safety';
  massKg: number;
  percentage: number;
  description: string;
}

const MASS_BUDGET: MassItem[] = [
  {
    id: 'pilot',
    name: 'Pilot (Human Occupant / Test Ballast)',
    category: 'Payload',
    massKg: 75.0,
    percentage: 48.4,
    description: 'Human pilot or equivalent anthropomorphic test dummy with safety flight suit & helmet.',
  },
  {
    id: 'battery',
    name: '3x Isolated Li-Ion Battery Pods',
    category: 'Power',
    massKg: 28.0,
    percentage: 18.1,
    description: 'Three 14S packs (9.3 kg each) enclosed in fire-resistant intumescent aluminum casings.',
  },
  {
    id: 'motors_props',
    name: '12x Brushless Motors + Carbon Props',
    category: 'Propulsion',
    massKg: 22.5,
    percentage: 14.5,
    description: '12 high-torque outrunner electric motors (~1.6 kg each) plus 12x 30" carbon propellers.',
  },
  {
    id: 'cage_seat',
    name: 'Safety Cage + Energy-Absorbing Seat',
    category: 'Safety',
    massKg: 12.0,
    percentage: 7.7,
    description: 'Tubular protective roll enclosure, crashable aluminum honeycomb seat pan, and 5-point harness.',
  },
  {
    id: 'frame',
    name: 'Carbon Fiber Frame & CNC Nodes',
    category: 'Airframe',
    massKg: 9.5,
    percentage: 6.1,
    description: '6 radial pultruded carbon tubes, central fuselage deck, and 7075-T6 alloy junction clamps.',
  },
  {
    id: 'electronics',
    name: '12x ESCs + Dual Flight Computers + Wiring',
    category: 'Avionics',
    massKg: 4.5,
    percentage: 2.9,
    description: 'Smart FOC ESCs, dual PX4 autopilots, 3 IMUs, LiDAR rangefinder, and high-current copper wiring.',
  },
  {
    id: 'landing_tether',
    name: 'Landing Skids + Ventral Tether Mount',
    category: 'Airframe',
    massKg: 3.5,
    percentage: 2.3,
    description: 'Wide elastomer-damped aluminum landing skids and 12 kN static-rated ventral tether anchor ring.',
  },
];

export const EngineeringDashboard: React.FC = () => {
  const [selectedMassItem, setSelectedMassItem] = useState<MassItem>(MASS_BUDGET[0]);
  const [activeBus, setActiveBus] = useState<'A' | 'B' | 'C' | 'ALL'>('ALL');

  const totalMass = MASS_BUDGET.reduce((acc, item) => acc + item.massKg, 0);

  return (
    <section id="dashboard" className="relative py-20 bg-[#05070d] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <Gauge className="w-4 h-4" />
            <span className="tracking-widest uppercase">Telemetry & Physical Feasibility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            ENGINEERING DASHBOARD & MASS BUDGET
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Aerospace feasibility begins with disciplined mass and power budgeting. Every gram of airframe mass directly dictates battery weight, current draw, voltage sag, and thermal dissipation limits.
          </p>
        </div>

        {/* 1. Core Engineering Target Metrics Panel */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-16">
          <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>TARGET MASS</span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-cyan-300">EST.</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">~155 <span className="text-xs text-slate-400">kg</span></div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">Total MTOM with pilot</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>PROPULSION</span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-cyan-300">EST.</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">12 <span className="text-xs text-slate-400">Motors</span></div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">6 Coaxial pairs</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>BATTERY PACKS</span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-cyan-300">EST.</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white">3 <span className="text-xs text-slate-400">Isolated</span></div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">Non-shared power buses</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>HOVER POWER</span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-cyan-300">EST.</span>
            </div>
            <div className="text-2xl font-mono font-bold text-cyan-300">22–25 <span className="text-xs text-slate-400">kW</span></div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">~1.9 kW / motor in hover</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>PEAK POWER</span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-cyan-300">EST.</span>
            </div>
            <div className="text-2xl font-mono font-bold text-amber-300">45–55 <span className="text-xs text-slate-400">kW</span></div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">Full climb authority</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>TARGET ALTITUDE</span>
              <span className="text-[9px] px-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">EST.</span>
            </div>
            <div className="text-2xl font-mono font-bold text-amber-300">5 <span className="text-xs text-slate-400">m</span></div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">Low-altitude research</div>
          </div>
        </div>

        {/* 2. Interactive Mass Budget Breakdown */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-2 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Weight Allocation Hierarchy
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                MASS BUDGET ALLOCATION (~{totalMass.toFixed(1)} KG TOTAL)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Click any category to review engineering margin
            </span>
          </div>

          {/* Interactive Stacked Visual Bar */}
          <div className="mb-8">
            <div className="w-full h-7 rounded-lg overflow-hidden flex bg-slate-900 border border-slate-700 p-0.5">
              {MASS_BUDGET.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedMassItem(item);
                    telemetryAudio.playClick();
                  }}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.name}: ${item.massKg} kg (${item.percentage}%)`}
                  className={`h-full cursor-pointer transition-all ${
                    selectedMassItem.id === item.id
                      ? 'bg-cyan-400 ring-2 ring-white z-10'
                      : item.category === 'Payload'
                      ? 'bg-blue-600 hover:bg-blue-500'
                      : item.category === 'Power'
                      ? 'bg-amber-500 hover:bg-amber-400'
                      : item.category === 'Propulsion'
                      ? 'bg-cyan-600 hover:bg-cyan-500'
                      : item.category === 'Safety'
                      ? 'bg-rose-500 hover:bg-rose-400'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* Sub-Legend */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 flex-wrap gap-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600" /> Pilot (48.4%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Batteries (18.1%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-600" /> Motors/Props (14.5%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> Safety Cage/Seat (7.7%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-600" /> Airframe & Wiring (11.3%)</span>
            </div>
          </div>

          {/* Mass List + Selected Item Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2">
              {MASS_BUDGET.map((item) => {
                const isSelected = selectedMassItem.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedMassItem(item);
                      telemetryAudio.playClick();
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/50 shadow-sm'
                        : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                      <span className="text-xs font-mono font-medium text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-slate-400">{item.percentage}%</span>
                      <span className="font-bold text-cyan-300 w-16 text-right tabular-nums">{item.massKg} kg</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Mass Card (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-xl border border-cyan-900/50 bg-[#080f20]">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                {selectedMassItem.category} SUB-SYSTEM
              </span>
              <h4 className="text-lg font-display font-bold text-white mt-1 mb-2">
                {selectedMassItem.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {selectedMassItem.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-900/80">
                  <span className="text-[10px] text-slate-400 block">ALLOCATED MASS</span>
                  <span className="text-base font-bold text-cyan-300 tabular-nums">{selectedMassItem.massKg} kg</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900/80">
                  <span className="text-[10px] text-slate-400 block">TOTAL FRACTION</span>
                  <span className="text-base font-bold text-white tabular-nums">{selectedMassItem.percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. High-Voltage Electrical & Power Architecture */}
        <div className="p-6 sm:p-8 rounded-2xl border border-amber-900/40 bg-[#070b16]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                Triple-Isolated Bus Topology
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                POWER SYSTEM & THERMAL HAZARD MITIGATION
              </h3>
            </div>

            {/* Bus selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['ALL', 'A', 'B', 'C'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setActiveBus(b);
                    telemetryAudio.playClick();
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                    activeBus === b
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b === 'ALL' ? 'All Buses' : `Bus ${b}`}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Bus Architecture Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                bus: 'A',
                voltage: '51.8 V (14S)',
                current: 'Up to 120 A Burst',
                motors: 'Motors #1, #2, #3, #4 (Arms 1 & 2)',
                protection: 'Pyrofuse + 150A Solid-State Contactor',
              },
              {
                bus: 'B',
                voltage: '51.8 V (14S)',
                current: 'Up to 120 A Burst',
                motors: 'Motors #5, #6, #7, #8 (Arms 3 & 4)',
                protection: 'Pyrofuse + 150A Solid-State Contactor',
              },
              {
                bus: 'C',
                voltage: '51.8 V (14S)',
                current: 'Up to 120 A Burst',
                motors: 'Motors #9, #10, #11, #12 (Arms 5 & 6)',
                protection: 'Pyrofuse + 150A Solid-State Contactor',
              },
            ].map((b) => {
              const isHighlighted = activeBus === 'ALL' || activeBus === b.bus;
              return (
                <div
                  key={b.bus}
                  className={`p-4 rounded-xl border transition-all ${
                    isHighlighted
                      ? 'border-amber-500/60 bg-[#0a1120]'
                      : 'border-slate-800 bg-[#050810] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                    <span className="font-bold">POWER BUS {b.bus}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                      ISOLATED
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Nominal Voltage:</span>
                      <span className="text-white font-bold">{b.voltage}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Max Channel Current:</span>
                      <span className="text-amber-300 font-bold">{b.current}</span>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-300">
                      <strong className="text-slate-400">Powers:</strong> {b.motors}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      {b.protection}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Critical Thermal Warning Banner */}
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/30 text-amber-200 text-xs font-mono flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase text-amber-300">Hazard Warning — High Current Arc & Thermal Runaway:</strong> Generating ~25 kW of hover power at ~50V requires continuous aggregate currents exceeding <strong className="text-white font-bold">500 Amperes</strong> across the vehicle. Hundreds of amperes create severe thermal hazards, resistive voltage sag (I²R heating), and catastrophic arc-flash risks. Isolation contactors, intumescent battery fire barriers, and active thermal sensor cutoffs are essential to prevent cross-pack thermal cascade.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
