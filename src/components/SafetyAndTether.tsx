import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Radio, 
  Lock, 
  AlertOctagon, 
  Activity, 
  Eye, 
  Compass, 
  Anchor,
  HelpCircle
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface SafetyLayer {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pilot Protection' | 'Ground Infrastructure' | 'Electrical Isolation';
  description: string;
  specs: string;
}

const SAFETY_LAYERS: SafetyLayer[] = [
  {
    id: 'helmet_harness',
    title: '5-Point Harness & Aviation Helmet',
    subtitle: 'Pilot Restraint & Head Deceleration',
    category: 'Pilot Protection',
    description: 'FIA/Aviation approved rotary cam-lock 5-point harness securing shoulders, pelvic bone, and crotch. Integrated helmet with shock absorption and comms.',
    specs: 'Proof rating: 15 kN shoulder pull; quick-release release in < 1 second.',
  },
  {
    id: 'crush_seat',
    title: 'Energy-Absorbing Honeycomb Seat',
    subtitle: 'Spinal Impact Load Attenuation',
    category: 'Pilot Protection',
    description: 'Custom molded composite seat pan mounted on collapsible 5052 aluminum honeycomb crush blocks engineered to stroke 80mm during hard vertical touchdown.',
    specs: 'Limits peak vertical spinal acceleration to < 14 G at 6.5 m/s impact.',
  },
  {
    id: 'safety_cage',
    title: 'Protective Tubular Roll Cage',
    subtitle: 'Blade Intrusion & Rollover Barrier',
    category: 'Pilot Protection',
    description: 'Triangulated chromoly and carbon structural cage preserving pilot survival volume in rollover events and preventing propeller blade intrusion.',
    specs: 'Minimum 350 mm blade tip clearance envelope around pilot envelope.',
  },
  {
    id: 'tether_gantry',
    title: 'Center-of-Gravity Tether Rig',
    subtitle: 'Flight Altitude & Excursion Envelope Constraint',
    category: 'Ground Infrastructure',
    description: 'Braided 12-strand Dyneema cable anchored directly to the ventral center-of-mass through a low-friction conical guide to avoid rotor contact.',
    specs: '12 kN breaking strength, progressive dynamic brake reel, anti-snag shroud.',
  },
  {
    id: 'ground_officer',
    title: 'Independent Ground Safety Officer',
    subtitle: 'Hardware Remote Kill Switch',
    category: 'Ground Infrastructure',
    description: 'Dedicated ground safety personnel with direct line-of-sight and dual-channel 868 MHz redundant remote kill transmitter.',
    specs: 'Optically isolated hard stop commands within 12 milliseconds.',
  },
  {
    id: 'fire_suppression',
    title: 'Battery Containment & Fire Suppression',
    subtitle: 'Thermal Runaway & Arc Protection',
    category: 'Electrical Isolation',
    description: 'Intumescent lined aluminum battery enclosures with one-way pressure relief vent ports. Class D lithium-battery fire extinguishers stationed at gantry perimeter.',
    specs: 'Thermal containment up to 750°C for > 5 minutes.',
  },
];

export const SafetyAndTether: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<SafetyLayer>(SAFETY_LAYERS[0]);

  return (
    <section id="safety" className="relative py-20 bg-[#05070d] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="tracking-widest uppercase">Comprehensive Safety Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            PILOT SURVIVAL & TETHERED TESTING SYSTEM
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In experimental aerospace development, human safety is not an afterthought added to a flying frame. The safety cage, crashable seating, and tethered gantry form the core engineering foundation.
          </p>
        </div>

        {/* 1. 6-Layer Pilot & Ground Safety Matrix */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Layer Selector Buttons (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Occupant Protection Sub-Systems:
              </span>

              {SAFETY_LAYERS.map((layer) => {
                const isSelected = activeLayer.id === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => {
                      setActiveLayer(layer);
                      telemetryAudio.playClick();
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'border-slate-800 bg-[#070b16] hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-white">{layer.title}</span>
                      <span className="text-[10px] text-emerald-400 uppercase">{layer.category}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {layer.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Safety Layer Showcase (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-emerald-900/50 bg-[#07111c] shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                    SAFETY STANDARD SPECIFICATION
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1">
                    {activeLayer.title}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                  {activeLayer.category}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {activeLayer.description}
              </p>

              <div className="p-4 rounded-xl bg-black/50 border border-slate-800 mb-6">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                  Design & Proof Load Standard:
                </div>
                <div className="text-xs font-mono text-slate-200">
                  {activeLayer.specs}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">FAILURE ISOLATION</span>
                  <span className="text-emerald-300 font-bold">Passive Mechanical Protection</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">HUMAN FACTOR</span>
                  <span className="text-white font-bold">Zero Single-Point Pilot Hazard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tethered Testing Environment & Gantry Layout */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16]">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Ground Validation Infrastructure
            </span>
            <h3 className="text-2xl font-display font-bold text-white mt-1 mb-2">
              TETHERED TEST ENVIRONMENT & SAFETY GANTRY
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Before any free-flight hovering is attempted, the aircraft operates inside an instrumented structural gantry with active safety tethers.
            </p>
          </div>

          {/* Isometric Gantry Diagram Box */}
          <div className="p-6 rounded-xl border border-cyan-900/40 bg-[#040710] mb-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
                <Anchor className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <div className="text-xs font-mono font-bold text-white mb-1">VENTRAL CG TETHER</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  High-tensile line prevents vertical excursions &gt; 5.2 m and absorbs kinetic runaway.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
                <AlertOctagon className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                <div className="text-xs font-mono font-bold text-white mb-1">STERILE ZONE (25M)</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Perimeter blast netting and barrier fencing preventing personnel entry during live spool.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
                <Radio className="w-5 h-5 text-rose-400 mx-auto mb-2" />
                <div className="text-xs font-mono font-bold text-white mb-1">EMERGENCY KILL SWITCH</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Ground Safety Officer remote optical radio hard stop kills all 12 ESC pulses in &lt; 15 ms.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/60">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                <div className="text-xs font-mono font-bold text-white mb-1">FIRE MITIGATION</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Class D lithium battery fire suppression systems ready on rapid-response cart.
                </p>
              </div>
            </div>
          </div>

          {/* Tether Engineering Caveat */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-mono flex items-start gap-3">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase text-amber-200">Critical Tether Engineering Dynamics:</strong> A tether is not simply a rope. If an aircraft tilts while attached to an off-axis tether, the tether tension generates a lateral restoring moment that can induce catastrophic pendulum instability and flip the aircraft. Furthermore, slack tether cables can be ingested into lower coaxial propellers. Therefore, the tether must use a conical anti-snag guide, constant-tension dynamic retractor, and center-of-gravity ventral alignment.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
