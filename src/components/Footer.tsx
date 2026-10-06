import React from 'react';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Compass, 
  ShieldCheck, 
  ArrowUp,
  GitBranch,
  Activity,
  Zap
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    telemetryAudio.playClick();
  };

  const stack = [
    { category: 'CAD & Modeling', tools: 'SolidWorks · CATIA · Fusion 360', desc: 'Kinematic 3D assembly & 12-rotor packaging.' },
    { category: 'Physics Simulation', tools: 'MATLAB · Simulink · SITL · Gazebo', desc: '6-DOF multirotor aerodynamic wash & gust modeling.' },
    { category: 'Flight Control', tools: 'PX4 Autopilot · ArduPilot · EKF3', desc: 'Real-time attitude estimation & quadratic allocation.' },
    { category: 'Electronics & Power', tools: 'KiCad · Digital Oscilloscope · Shunts', desc: 'Triple-bus PCB schematics & current telemetry.' },
    { category: 'Embedded Code', tools: 'Embedded C / C++ · Python · FreeRTOS', desc: 'Low-latency motor comms via DShot1200 & CAN.' },
    { category: 'Structural Analysis', tools: 'ANSYS FEA · OpenFOAM CFD', desc: '2.2x G-load stress analysis & coaxial wash slipstream.' },
  ];

  const futureVersions = [
    { ver: 'V1', title: 'Sunny Prototype (Sub-Scale)', status: 'In Development', desc: '1.5m 12-rotor testbed for control algorithm & sensor fusion proof-of-concept.' },
    { ver: 'V2', title: 'Fault-Tolerant Full-Scale Unmanned', status: 'Planned', desc: '155 kg full airframe operating on static dyno & tethered gantry.' },
    { ver: 'V3', title: 'Experimental Research Aircraft', status: 'Conceptual', desc: 'Crash-tested pilot survival cage & tethered low-altitude human trials.' },
    { ver: 'V4', title: 'Potential Certified Human Multirotor', status: 'Long-Term Vision', desc: 'Full institutional DGCA airworthiness certification & civil operation.' },
  ];

  return (
    <footer className="relative bg-[#04060b] text-slate-400 border-t border-slate-900 pt-20 pb-12 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Engineering Stack Cards */}
        <div className="mb-20">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <Terminal className="w-4 h-4" />
            <span className="tracking-widest uppercase">Technical Toolchain</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6">
            AEROSPACE ENGINEERING STACK
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stack.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold block mb-1">
                  {s.category}
                </span>
                <div className="text-sm font-display font-bold text-white mb-1">
                  {s.tools}
                </div>
                <p className="text-xs text-slate-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Innovation Taxonomy: Existing vs Integrated vs Research */}
        <div className="mb-20 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#060a14]">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Technological Positioning
            </span>
            <h3 className="text-2xl font-display font-bold text-white mt-1 mb-2">
              INNOVATION & RESEARCH CONTRIBUTION
            </h3>
            <blockquote className="text-xs sm:text-sm text-cyan-200 font-display italic mb-4 leading-relaxed border-l-2 border-cyan-500 pl-3">
              &ldquo;Our innovation is not inventing the multirotor itself. It is developing a safety-first, fault-tolerant system architecture that combines distributed propulsion, redundant power, intelligent control allocation, digital-twin failure simulation, and controlled testing for low-altitude human-lift research.&rdquo;
            </blockquote>
            <p className="text-xs text-slate-400">
              We delineate standard commercial hardware from our systems engineering and flight stability contributions:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#04070f]">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-2">
                1. EXISTING TECHNOLOGY
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>· High-torque brushless outrunners</li>
                <li>· Commercial flight controllers (PX4)</li>
                <li>· Carbon-fiber composite propellers</li>
                <li>· High-discharge Li-ion NMC cells</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-cyan-900/50 bg-[#050b18]">
              <div className="text-xs font-mono text-cyan-300 uppercase font-bold mb-2">
                2. SYSTEM INTEGRATION
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>· 3-way isolated bus power topology</li>
                <li>· 12-channel coaxial motor allocation</li>
                <li>· Dynamic sensor voting and failover</li>
                <li>· Center-of-gravity ventral tether gantry</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-emerald-900/50 bg-[#051118]">
              <div className="text-xs font-mono text-emerald-300 uppercase font-bold mb-2">
                3. RESEARCH CONTRIBUTION
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li>· Fault-tolerant control allocation math</li>
                <li>· Physical failure-injection methodology</li>
                <li>· Digital Twin HIL dyno telemetry loop</li>
                <li>· Low-altitude crash cell attenuation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Future Roadmap Versions */}
        <div className="mb-20">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Long-Term Aircraft Evolution
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              VEHICLE DEVELOPMENT ROADMAP (V1 → V4)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {futureVersions.map((v) => (
              <div key={v.ver} className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-cyan-400 font-bold">{v.ver}</span>
                  <span className="text-[10px] text-slate-400">{v.status}</span>
                </div>
                <h5 className="font-display font-bold text-white text-sm mb-1">{v.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Cinematic Final Statement */}
        <div className="p-8 sm:p-12 rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#08152c] via-[#050b18] to-[#04060c] text-center shadow-2xl relative overflow-hidden mb-16">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Aerospace Progression Chain */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-cyan-300 font-bold flex-wrap uppercase tracking-wider">
              <span>SIMULATE</span>
              <span>→</span>
              <span>BUILD</span>
              <span>→</span>
              <span>TEST</span>
              <span>→</span>
              <span>MEASURE</span>
              <span>→</span>
              <span className="text-amber-300">FAIL SAFELY</span>
              <span>→</span>
              <span>IMPROVE</span>
              <span>→</span>
              <span className="text-emerald-300">VALIDATE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
              PROJECT AEROLIFT
            </h2>

            <blockquote className="text-lg sm:text-2xl font-display text-slate-200 italic max-w-2xl mx-auto">
              &ldquo;The goal is not simply to make a machine fly. The goal is to engineer a system that deserves to fly.&rdquo;
            </blockquote>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Return to Top CAD View</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Clean Footer Metadata */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Project AeroLift · Conceptual Aerospace Research Project.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-amber-400">NOT FLIGHT CERTIFIED</span>
            <span>·</span>
            <span>PRELIMINARY ESTIMATE</span>
            <span>·</span>
            <span className="text-cyan-400">DGCA COMPLIANCE PATH</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
