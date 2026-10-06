import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Wind, 
  Sliders, 
  RotateCw, 
  ShieldCheck, 
  Radio, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

export const DigitalTwinStudio: React.FC = () => {
  const [disturbanceType, setDisturbanceType] = useState<'nominal' | 'wind' | 'motor_drop' | 'voltage_sag'>('nominal');
  const [simTime, setSimTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimTime((t) => (t + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate waveform heights for visual simulation
  const getSimValue = (offset: number) => {
    const t = (simTime + offset) * 0.1;
    let base = Math.sin(t) * 15 + 50;
    if (disturbanceType === 'wind') base += Math.sin(t * 3.5) * 20;
    if (disturbanceType === 'motor_drop') base += Math.sin(t * 1.5) * 12 - 8;
    if (disturbanceType === 'voltage_sag') base = base * 0.85 + Math.sin(t * 2) * 5;
    return Math.max(10, Math.min(90, base));
  };

  return (
    <section id="digital-twin" className="relative py-20 bg-[#05070d] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="tracking-widest uppercase">Cyber-Physical Dynamics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            DIGITAL TWIN & HARDWARE-IN-THE-LOOP (HIL)
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Real-time digital twin synchronization continuously cross-validates physical dyno sensor telemetry against aerodynamic 6-DOF simulation models to refine control allocation matrices.
          </p>
        </div>

        {/* Digital Twin Interactive Console */}
        <div className="p-6 sm:p-8 rounded-2xl border border-cyan-900/60 bg-[#070e1e] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-3 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                DIGITAL MODEL ↔ PHYSICAL TELEMETRY SYNCHRONIZATION
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                REAL-TIME TELEMETRY RESIDUAL OBSERVER
              </h3>
            </div>

            {/* Disturbance Injector */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 flex-wrap">
              {(
                [
                  { id: 'nominal', label: 'Nominal Hover' },
                  { id: 'wind', label: 'Wind Turbulence' },
                  { id: 'motor_drop', label: 'Motor Loss Transients' },
                  { id: 'voltage_sag', label: 'High-Current Sag' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDisturbanceType(d.id);
                    telemetryAudio.playClick();
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                    disturbanceType === d.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Waveform Canvas Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
            {/* Waveform Visualization (8 Cols) */}
            <div className="lg:col-span-8 p-5 rounded-xl border border-slate-800 bg-[#04060c] relative">
              <div className="flex items-center justify-between text-xs font-mono mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2.5 h-0.5 bg-cyan-400" /> Digital Twin Model
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <span className="w-2.5 h-0.5 bg-amber-400" /> Physical Telemetry
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-[10px]">SAMPLING: 800 HZ</span>
              </div>

              {/* Dynamic Waveform Graph Bars */}
              <div className="h-44 w-full flex items-end justify-between gap-1 pt-4 pb-2 border-b border-slate-800">
                {Array.from({ length: 32 }).map((_, idx) => {
                  const valIdeal = getSimValue(idx * 3);
                  const valReal = valIdeal + (Math.sin(idx + simTime) * 6 - 3);
                  return (
                    <div key={idx} className="h-full flex-1 flex flex-col justify-end items-center gap-0.5">
                      <div
                        style={{ height: `${valIdeal}%` }}
                        className="w-full bg-cyan-500/80 rounded-t-sm transition-all duration-100"
                      />
                      <div
                        style={{ height: `${valReal * 0.9}%` }}
                        className="w-full bg-amber-500/80 rounded-t-sm transition-all duration-100"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
                <span>T-5.0s</span>
                <span>T-2.5s</span>
                <span>NOW (LIVE TELEMETRY)</span>
              </div>
            </div>

            {/* State Estimation Statistics (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-xl border border-slate-800 bg-[#060a16] space-y-3 font-mono text-xs">
              <div className="text-slate-400 uppercase text-[11px] pb-2 border-b border-slate-800 flex justify-between">
                <span>EKF State Innovation</span>
                <span className="text-emerald-400">NOMINAL</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Roll/Pitch Error (Δθ):</span>
                <span className="text-cyan-300 font-bold tabular-nums">0.14°</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Vertical Velocity (dz/dt):</span>
                <span className="text-cyan-300 font-bold tabular-nums">0.02 m/s</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Bus Voltage Droop:</span>
                <span className="text-amber-300 font-bold tabular-nums">-1.8 V (3.4%)</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Tether Tension Load:</span>
                <span className="text-emerald-300 font-bold tabular-nums">140 N</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono text-slate-300">
            <strong>Simulation Feedback:</strong> As physical dyno test bench data is logged across varying ambient temperatures, aerodynamic drag coefficients and battery internal resistance (IR) tables are continuously updated back into the software-in-the-loop (SITL) model.
          </div>
        </div>
      </div>
    </section>
  );
};
