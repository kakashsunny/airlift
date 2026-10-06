import React, { useState } from 'react';
import { 
  GitCommit, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Scale, 
  CheckCircle2, 
  Lock,
  Compass,
  ArrowDown
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface Stage {
  num: string;
  name: string;
  category: string;
  status: 'COMPLETED' | 'IN PROGRESS' | 'PLANNED' | 'NOT APPROVED / NOT PERFORMED';
  description: string;
  verificationCriteria: string;
  isRestricted?: boolean;
}

const ROADMAP_STAGES: Stage[] = [
  {
    num: '01',
    name: 'High-Fidelity Physics Simulation',
    category: 'Virtual Verification',
    status: 'IN PROGRESS',
    description: 'Gazebo & MATLAB/Simulink 6-DOF aerodynamic multirotor simulation incorporating coaxial wash velocity profiles, rotor ground effect, and wind turbulence.',
    verificationCriteria: 'Validation of closed-loop attitude stability under simulated 20 knot gusts in software-in-the-loop (SITL).',
  },
  {
    num: '02',
    name: 'Coaxial Motor Dyno Bench Testing',
    category: 'Hardware In The Loop',
    status: 'PLANNED',
    description: 'Single coaxial arm pair mounted on instrumented load cell dyno to log thrust curves, electrical current draw, temperature rise, and vibration FFT harmonics.',
    verificationCriteria: '100 continuous 5-minute hover cycles with motor temperatures staying < 70°C and torque balance verified.',
  },
  {
    num: '03',
    name: 'Sub-Scale Unmanned Prototype (Sunny-01)',
    category: 'Flight Test Phase 1',
    status: 'PLANNED',
    description: '1.5m diameter 12-rotor testbed carrying 10–15 kg deadweight ballast to test real-world PID and EKF control under live atmospheric draft.',
    verificationCriteria: 'Successful 10-minute autonomous altitude hold with automated single-motor cutoff recovery.',
  },
  {
    num: '04',
    name: 'Full-Scale Unmanned Aircraft on Static Rig',
    category: 'Flight Test Phase 2',
    status: 'PLANNED',
    description: 'Full ~155 kg scale airframe secured to a 6-axis load cell ground fixture. Complete high-voltage 50V electrical bus testing under maximum continuous current.',
    verificationCriteria: 'Full power climb ramp (45 kW electrical demand) with zero contactor trip or voltage collapse.',
  },
  {
    num: '05',
    name: 'Tethered Unmanned Free Hover',
    category: 'Flight Test Phase 3',
    status: 'PLANNED',
    description: 'Full-scale airframe operating in tethered safety gantry without human occupant, lifted to 1m, 3m, and 5m research altitudes via ground command.',
    verificationCriteria: '50 hours of accumulated tethered hover time with zero anomalous telemetry excursions.',
  },
  {
    num: '06',
    name: 'Instrumented Anthropomorphic Dummy Drop & Tests',
    category: 'Safety Validation',
    status: 'PLANNED',
    description: 'Standard Hybrid III automotive crash dummy seated with accelerometer sensors in head, spine, and pelvis during hard landing and tether cutoff simulations.',
    verificationCriteria: 'Crushable honeycomb seat maintains spinal load under 15 G during 5 m/s drop.',
  },
  {
    num: '07',
    name: 'DGCA & Aviation Regulatory Review',
    category: 'Regulatory Approval',
    status: 'PLANNED',
    description: 'Compilation of comprehensive safety case, structural FEA reports, FMEA registers, and application for experimental flight permits with Indian aviation authorities.',
    verificationCriteria: 'Formal authorization under relevant experimental / research flight provisions.',
  },
  {
    num: '08',
    name: 'Human-Carrying Flight Testing',
    category: 'Ultimate Research Milestone',
    status: 'NOT APPROVED / NOT PERFORMED',
    description: 'Controlled low-altitude manned hover up to 5 meters in strictly designated flight test corridor with full medical and safety crew on standby.',
    verificationCriteria: 'STRICTLY CONDITIONAL upon completion of Stages 01–07 and formal legal permissions.',
    isRestricted: true,
  },
];

export const RoadmapAndRegulatory: React.FC = () => {
  return (
    <section id="roadmap" className="relative py-20 bg-[#05070d] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <GitCommit className="w-4 h-4 text-cyan-400" />
            <span className="tracking-widest uppercase">Verification Pipeline & Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            TESTING ROADMAP & REGULATORY PATH
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Aerospace engineering requires sequential stage-gate validation. No stage is unlocked until previous physical and simulation milestones have been rigorously proven.
          </p>
        </div>

        {/* 1. 8-Stage Sequential Roadmap */}
        <div className="mb-20">
          <div className="space-y-4">
            {ROADMAP_STAGES.map((stage) => {
              return (
                <div
                  key={stage.num}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    stage.isRestricted
                      ? 'border-rose-500/60 bg-gradient-to-r from-rose-950/40 via-[#0a0c16] to-[#0a0c16] ring-1 ring-rose-500/30'
                      : stage.status === 'IN PROGRESS'
                      ? 'border-cyan-500/60 bg-[#070e20]'
                      : 'border-slate-800 bg-[#070b16]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${
                        stage.isRestricted
                          ? 'border-rose-500 bg-rose-950 text-rose-300'
                          : stage.status === 'IN PROGRESS'
                          ? 'border-cyan-500 bg-cyan-950 text-cyan-300'
                          : 'border-slate-700 bg-slate-900 text-slate-400'
                      }`}>
                        {stage.num}
                      </span>
                      <div>
                        <h4 className="text-base sm:text-lg font-display font-bold text-white">
                          {stage.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">
                          {stage.category}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border self-start sm:self-auto ${
                      stage.isRestricted
                        ? 'border-rose-500/50 bg-rose-950/80 text-rose-300 animate-pulse'
                        : stage.status === 'IN PROGRESS'
                        ? 'border-cyan-500/50 bg-cyan-950/80 text-cyan-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}>
                      {stage.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                    {stage.description}
                  </p>

                  <div className="pt-3 border-t border-slate-800/80 text-xs font-mono flex items-start gap-2">
                    <strong className="text-cyan-400 shrink-0">Stage Gate Exit Criteria:</strong>
                    <span className="text-slate-400">{stage.verificationCriteria}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Indian Aviation Regulatory Framework Deep-Dive */}
        <div className="p-6 sm:p-8 rounded-2xl border border-amber-900/50 bg-[#080d1a]">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="tracking-widest uppercase">Civil Aviation Compliance</span>
          </div>

          <h3 className="text-2xl font-display font-bold text-white mb-4">
            INDIA — REGULATORY FRAMEWORK & LEGAL PATH
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            A critical engineering and legal truth: <strong className="text-white">Unmanned aircraft (drones) and human-carrying aircraft occupy completely distinct legal and regulatory categories</strong> under Indian aviation law.
          </p>

          {/* Key Legal Provisions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#05070e]">
              <div className="text-xs font-mono font-bold text-amber-300 mb-1">
                DGCA & VAYUYAN ACT
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bharatiya Vayuyan Adhiniyam, 2024 and DGCA civil aviation requirements govern all experimental aircraft, airworthiness certifications, and pilot licensing mandates.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#05070e]">
              <div className="text-xs font-mono font-bold text-cyan-300 mb-1">
                AIRSPACE ALLOCATION
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test flights require designated restricted airspace segregations or authorized test ranges (Green/Yellow/Red airspace verification) with NOTAM coordination.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#05070e]">
              <div className="text-xs font-mono font-bold text-emerald-300 mb-1">
                INSURANCE & LIABILITY
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive third-party aviation liability insurance and institutional safety review board (SRB) authorizations are mandatory before any field trials.
              </p>
            </div>
          </div>

          {/* High-Visibility Legal Warning Banner */}
          <div className="p-5 rounded-xl border-2 border-rose-600/70 bg-rose-950/40 text-rose-200 text-xs sm:text-sm font-mono flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-rose-300 block mb-1 uppercase text-sm">
                MANDATORY LEGAL & SAFETY NOTICE:
              </strong>
              NO HUMAN-CARRYING FLIGHT SHALL BE ATTEMPTED WITHOUT FORMAL REGULATORY AUTHORISATION FROM THE DIRECTORATE GENERAL OF CIVIL AVIATION (DGCA), VERIFICATION BY LICENSED AERONAUTICAL PROFESSIONALS, AND COMPREHENSIVE THIRD-PARTY LIABILITY INSURANCE COVERAGE.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
