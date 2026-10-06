import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Sliders, 
  Info,
  Filter
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface FMEARow {
  id: string;
  failureMode: string;
  category: string;
  consequence: string;
  detection: string;
  mitigation: string;
  severity: number; // 1 to 5
  likelihood: number; // 1 to 5
  residualRisk: 'Low' | 'Medium' | 'High';
}

const FMEA_DATA: FMEARow[] = [
  {
    id: 'f1',
    failureMode: 'Single Motor / ESC Phase Open Circuit',
    category: 'Propulsion',
    consequence: 'Loss of 1/12th vertical thrust (~25 kgf) and arm torque delta.',
    detection: 'DShot bidirectional telemetry reports 0 RPM in < 10 ms; EKF detects roll/pitch innovation.',
    mitigation: 'Quadratic control allocation re-allocates thrust across remaining 11 rotors; coaxial lower partner spools up.',
    severity: 3,
    likelihood: 3,
    residualRisk: 'Low',
  },
  {
    id: 'f2',
    failureMode: 'Single Battery Pack Thermal Runaway',
    category: 'Power',
    consequence: 'Severe localized fire hazard and loss of 33% total available electrical energy.',
    detection: 'BMS thermistors detect temperature > 65°C; CAN bus alerts flight computer.',
    mitigation: 'Solid-state contactor isolates pack; intumescent aluminum barrier prevents fire spread to other 2 packs; emergency landing.',
    severity: 4,
    likelihood: 2,
    residualRisk: 'Medium',
  },
  {
    id: 'f3',
    failureMode: 'Primary IMU Gyro Sensor Bias Drift',
    category: 'Avionics',
    consequence: 'False angular rate estimate causing incorrect attitude correction.',
    detection: 'Triple IMU voting logic detects 3-sigma divergence between IMU 1 and IMUs 2/3.',
    mitigation: 'Automatic soft-isolation of drifting IMU; seamless failover to healthy secondary IMU.',
    severity: 4,
    likelihood: 2,
    residualRisk: 'Low',
  },
  {
    id: 'f4',
    failureMode: 'Carbon Arm Structural Delamination / Joint Slip',
    category: 'Structures',
    consequence: 'Altered motor thrust alignment vector; high vibration and loss of arm stiffness.',
    detection: 'High-frequency IMU vibration FFT spike and sudden motor trim offset.',
    mitigation: 'High safety factor (2.2x max G-load); visual NDT ultrasonic inspection before every test flight.',
    severity: 5,
    likelihood: 1,
    residualRisk: 'Medium',
  },
  {
    id: 'f5',
    failureMode: 'Propeller Structural Delamination / Blade Shed',
    category: 'Propulsion',
    consequence: 'Severe rotational vibration, loss of arm lift, projectile debris hazard.',
    detection: 'Excessive gyro vibration telemetry and sudden ESC phase current imbalance.',
    mitigation: 'Protective roll cage deflects blade debris; motor auto-shutdown; rapid descent.',
    severity: 5,
    likelihood: 2,
    residualRisk: 'Medium',
  },
  {
    id: 'f6',
    failureMode: 'Safety Tether Line Entanglement in Propeller',
    category: 'Ground Testing',
    consequence: 'Tether cord caught in lower rotor blade, stalling motor and inducing roll torque.',
    detection: 'Sudden high current spike and mechanical stall on lower coaxial motor.',
    mitigation: 'Conical anti-snag guide cone below landing skids; constant-tension dynamic retractor.',
    severity: 4,
    likelihood: 2,
    residualRisk: 'Low',
  },
  {
    id: 'f7',
    failureMode: 'Sudden Wind Shear / Downburst Excursion',
    category: 'Environment',
    consequence: 'Lateral drift outside controlled 5m hover envelope; potential gantry contact.',
    detection: 'Downward optical flow and LiDAR rangefinder detect velocity vector delta.',
    mitigation: 'Strict weather go/no-go limits (< 10 kt ambient wind); differential rotor tilt; tether constraint.',
    severity: 3,
    likelihood: 3,
    residualRisk: 'Low',
  },
  {
    id: 'f8',
    failureMode: 'Pilot Medical Incapacitation / Human Error',
    category: 'Human Factors',
    consequence: 'Loss of pilot cyclic input or erroneous command inputs during hover.',
    detection: 'Dead-man switch / stick inactivity or Ground Safety Officer visual confirmation.',
    mitigation: 'Autonomous altitude & position hold failsafe; Ground Safety Officer remote override.',
    severity: 4,
    likelihood: 2,
    residualRisk: 'Low',
  },
];

export const RiskAndFMEA: React.FC = () => {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [selectedRow, setSelectedRow] = useState<FMEARow>(FMEA_DATA[0]);

  const filteredFMEA = selectedRiskFilter === 'ALL'
    ? FMEA_DATA
    : FMEA_DATA.filter((r) => r.residualRisk === selectedRiskFilter);

  return (
    <section id="risk-fmea" className="relative py-20 bg-[#060913] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="tracking-widest uppercase">System Safety Assessment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            RISK MATRIX & FMEA ASSESSMENT
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Failure Mode and Effects Analysis (FMEA) is the rigorous aerospace methodology used to identify potential breakdown points, quantify severity vs. likelihood, and engineer mechanical and software mitigations.
          </p>
        </div>

        {/* 1. Interactive 5x5 Aerospace Risk Heatmap */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                5x5 Severity vs Likelihood Matrix
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                PRELIMINARY RISK DISTRIBUTION HEATMAP
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              *Preliminary Engineering Assessment
            </span>
          </div>

          {/* 5x5 Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="space-y-1">
                <div className="text-xs font-mono text-slate-400 text-center mb-2">
                  LIKELIHOOD (PROBABILITY OF OCCURRENCE) →
                </div>
                
                {/* 5 rows (Severity 5 down to 1) */}
                {[5, 4, 3, 2, 1].map((sev) => (
                  <div key={sev} className="flex items-center gap-2">
                    <span className="w-14 text-right text-[11px] font-mono text-slate-400">
                      Sev {sev}
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 flex-1">
                      {[1, 2, 3, 4, 5].map((lik) => {
                        const score = sev * lik;
                        const matchingItems = FMEA_DATA.filter((d) => d.severity === sev && d.likelihood === lik);
                        const hasItems = matchingItems.length > 0;
                        const isHigh = score >= 15;
                        const isMed = score >= 8 && score < 15;

                        return (
                          <div
                            key={lik}
                            className={`h-10 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all relative ${
                              hasItems
                                ? isHigh
                                  ? 'border-rose-500 bg-rose-950/80 text-rose-200 ring-2 ring-rose-500/40'
                                  : isMed
                                  ? 'border-amber-500 bg-amber-950/80 text-amber-200 ring-1 ring-amber-500/40'
                                  : 'border-emerald-500 bg-emerald-950/80 text-emerald-200'
                                : 'border-slate-800 bg-slate-900/30 text-slate-700'
                            }`}
                          >
                            {hasItems ? `${matchingItems.length} Hazard${matchingItems.length > 1 ? 's' : ''}` : '-'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2">
                  <span className="w-14" />
                  <div className="grid grid-cols-5 gap-1.5 flex-1 text-center text-[10px] font-mono text-slate-500">
                    <span>1 (Remote)</span>
                    <span>2 (Low)</span>
                    <span>3 (Med)</span>
                    <span>4 (High)</span>
                    <span>5 (Frequent)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Legend & Explanation (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-xl border border-slate-800 bg-[#050812] space-y-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Risk Classification Framework
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every identified failure mode is mitigated until its residual risk score falls into the acceptable envelope before physical testing.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-rose-950/30 border border-rose-900/40 flex items-center justify-between text-rose-300">
                  <span className="font-bold">CRITICAL / HIGH RISK (Score &ge; 15)</span>
                  <span>Unacceptable: Requires Redesign</span>
                </div>
                <div className="p-2.5 rounded bg-amber-950/30 border border-amber-900/40 flex items-center justify-between text-amber-300">
                  <span className="font-bold">MEDIUM RISK (Score 8–14)</span>
                  <span>Tolerable with Active Interlocks</span>
                </div>
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-900/40 flex items-center justify-between text-emerald-300">
                  <span className="font-bold">LOW RISK (Score 1–7)</span>
                  <span>Acceptable for Tethered Trials</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Responsive FMEA Table */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Failure Modes and Effects Analysis
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                FMEA MITIGATION & RESIDUAL RISK REGISTER
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['ALL', 'Medium', 'Low'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedRiskFilter(lvl);
                    telemetryAudio.playClick();
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                    selectedRiskFilter === lvl
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl === 'ALL' ? 'All Risks' : `${lvl} Residual`}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table / Mobile Card Layout */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Failure Mode</th>
                  <th className="py-3 px-3">Consequence</th>
                  <th className="py-3 px-3">Detection Method</th>
                  <th className="py-3 px-3">Mitigation Strategy</th>
                  <th className="py-3 px-3 text-right">Residual Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredFMEA.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white max-w-[200px]">
                      {row.failureMode}
                      <span className="block text-[10px] text-cyan-400 font-normal">{row.category}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 max-w-[220px]">{row.consequence}</td>
                    <td className="py-3.5 px-3 text-cyan-200 max-w-[220px]">{row.detection}</td>
                    <td className="py-3.5 px-3 text-emerald-200 max-w-[260px]">{row.mitigation}</td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        row.residualRisk === 'High'
                          ? 'border-rose-500/40 bg-rose-950 text-rose-300'
                          : row.residualRisk === 'Medium'
                          ? 'border-amber-500/40 bg-amber-950 text-amber-300'
                          : 'border-emerald-500/40 bg-emerald-950 text-emerald-300'
                      }`}>
                        {row.residualRisk}
                      </span>
                    </td>
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
