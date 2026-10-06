import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  BatteryWarning, 
  Cpu, 
  Radio, 
  Wind, 
  RotateCcw, 
  ShieldAlert,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface FailureScenario {
  id: string;
  name: string;
  category: 'Propulsion' | 'Power' | 'Avionics' | 'Mechanical' | 'Environment';
  icon: React.ElementType;
  affectedComponents: string[];
  affectedMotors: number[]; // 1 to 12
  affectedBattery: 'A' | 'B' | 'C' | 'None';
  whatHappens: string;
  howDetected: string;
  recoveryPotential: 'High (Under Limit)' | 'Moderate (Degraded Authority)' | 'Low / Controlled Forced Descent';
  recoveryFeasible: boolean;
  emergencyProtocol: string;
  telemetryLog: string;
}

const SCENARIOS: FailureScenario[] = [
  {
    id: 'motor_fail',
    name: 'Motor #4 Hard Open-Circuit Failure',
    category: 'Propulsion',
    icon: AlertTriangle,
    affectedComponents: ['Motor #4 (Arm 2 Bottom)', 'ESC #4 Channel'],
    affectedMotors: [4],
    affectedBattery: 'None',
    whatHappens: 'Immediate loss of 1/12th vertical thrust (~25 kgf thrust delta) and sudden counter-torque imbalance on Arm 2.',
    howDetected: 'DShot bidirectional telemetry reports 0 RPM & 0 A within 8 ms. Primary EKF observer detects instantaneous roll/yaw acceleration spike.',
    recoveryPotential: 'High (Under Limit)',
    recoveryFeasible: true,
    emergencyProtocol: 'Control Allocation optimizer instantly commands Coaxial Partner (Motor #3 Top) to spool up to 125% and redistributes opposite Arm 5 motors to maintain zero-attitude trim. Automated descent initiated at 0.5 m/s.',
    telemetryLog: 'WARN: MOTOR_4_RPM_ZERO · ESC_STATUS_FAILSAFE · REALLOC_ATTITUDE_TRIM_OK',
  },
  {
    id: 'battery_trip',
    name: 'Battery Pack C Thermal Contactor Isolation',
    category: 'Power',
    icon: BatteryWarning,
    affectedComponents: ['Battery Pack C (33% Energy)', 'Bus C ESC Feeds (Motors #9, #10, #11, #12)'],
    affectedMotors: [9, 10, 11, 12],
    affectedBattery: 'C',
    whatHappens: 'BMS detects cell temperature rising past 65°C and trips pyrofuse isolation contactor. 4 motors powered by Bus C lose power simultaneously.',
    howDetected: 'Current shunt telemetry on Bus C drops to 0 A. CAN-BMS asserts EMERGENCY_ISOLATION_ASSERT.',
    recoveryPotential: 'Moderate (Degraded Authority)',
    recoveryFeasible: true,
    emergencyProtocol: 'Remaining 8 motors on Buses A & B enter emergency peak power envelope (3.8 kW/motor). Aircraft retains 1.25:1 thrust-to-weight margin. Immediate landing command executed within 15 seconds.',
    telemetryLog: 'CRIT: BUS_C_ISOLATED · 8_MOTORS_ACTIVE · TWR=1.28 · EMERGENCY_LANDING_NOW',
  },
  {
    id: 'sensor_drift',
    name: 'Primary IMU Gyroscope Severe Bias Drift',
    category: 'Avionics',
    icon: Cpu,
    affectedComponents: ['Primary Flight Computer IMU #1'],
    affectedMotors: [],
    affectedBattery: 'None',
    whatHappens: 'IMU #1 internal MEMS sensor suffers high vibration bias drift (+14°/sec false roll rate).',
    howDetected: 'Extended Kalman Filter residual threshold check fails; 2-out-of-3 voting logic flags IMU #1 divergence against IMU #2 and IMU #3 (> 3 sigma divergence).',
    recoveryPotential: 'High (Under Limit)',
    recoveryFeasible: true,
    emergencyProtocol: 'Flight software seamlessly deprioritizes IMU #1 weights and switches navigation state to healthy IMU #2. Zero physical flight attitude perturbation observed.',
    telemetryLog: 'WARN: IMU1_INNOVATION_REJECT · HEALTHY_IMU2_ACTIVE · 3_SIGMA_VOTE_SUCCESS',
  },
  {
    id: 'fc_lockup',
    name: 'Flight Computer #1 CPU Hard Lockup',
    category: 'Avionics',
    icon: AlertTriangle,
    affectedComponents: ['Primary STM32H7 Flight Controller'],
    affectedMotors: [],
    affectedBattery: 'None',
    whatHappens: 'Primary flight controller hangs due to memory fault or hardware watchdog timeout.',
    howDetected: 'Hardware heartbeat pulse disappears (> 20 ms without sync pulse). Standby FC detects missing heartbeat line.',
    recoveryPotential: 'Moderate (Degraded Authority)',
    recoveryFeasible: true,
    emergencyProtocol: 'Multiplexed CAN-bus switchover hardware flips command control lines to Secondary Hot-Standby Flight Controller. Pilot notified via HUD alarm chime; hover lock maintained.',
    telemetryLog: 'ALERT: MASTER_WATCHDOG_TRIP · HOT_STANDBY_FC2_ASSUMED_CONTROL · LATENCY: 18MS',
  },
  {
    id: 'prop_damage',
    name: 'Propeller Tip Delamination & Imbalance',
    category: 'Mechanical',
    icon: Flame,
    affectedComponents: ['Upper Propeller #7 (Arm 4)', 'Motor #7 Bearings'],
    affectedMotors: [7],
    affectedBattery: 'None',
    whatHappens: 'Foreign object debris damages carbon blade tip, causing severe 40 Hz rotational vibration and aerodynamic efficiency collapse.',
    howDetected: 'High-bandwidth IMU FFT detects localized vibration harmonic; ESC #7 reports irregular current oscillation.',
    recoveryPotential: 'Moderate (Degraded Authority)',
    recoveryFeasible: true,
    emergencyProtocol: 'System executes targeted intentional soft-shutdown of Motor #7 to prevent catastrophic structural resonance. Coaxial lower motor #8 handles Arm 4 thrust. Rapid descent.',
    telemetryLog: 'WARN: MOTOR_7_HARMONIC_VIB_TRIP · SHUTDOWN_MOTOR_7 · ARMED_COAXIAL_PAIR_REMAINS',
  },
  {
    id: 'wind_gust',
    name: '25 Knot Sudden Crosswind Downburst',
    category: 'Environment',
    icon: Wind,
    affectedComponents: ['All 12 Rotor Control Loops', 'Optical Flow / Barometer'],
    affectedMotors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    affectedBattery: 'None',
    whatHappens: 'Sudden horizontal wind shear and vertical downburst pushes aircraft towards edge of tether clearance zone.',
    howDetected: 'LiDAR rangefinder + downward optical flow and barometer detect vertical acceleration vector delta.',
    recoveryPotential: 'High (Under Limit)',
    recoveryFeasible: true,
    emergencyProtocol: 'Differential collective thrust tilts aircraft into the wind vector while maintaining 5m altitude envelope. Tether dynamic tensioner absorbs excess drift.',
    telemetryLog: 'INFO: WIND_SHEAR_COMPENSATE · PITCH_CORRECTION_12DEG · TETHER_TENSION_NOMINAL',
  },
];

export const FailureSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<FailureScenario>(SCENARIOS[0]);

  const selectScenario = (s: FailureScenario) => {
    setActiveScenario(s);
    telemetryAudio.playAlarm();
  };

  return (
    <section id="failures" className="relative py-20 bg-[#05070d] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span className="tracking-widest uppercase">Designing For Failure · Fault-Tolerant Control</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            LIVE FAILURE INJECTION SIMULATOR
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            &ldquo;The aircraft is engineered around the fundamental assumption that individual components <strong className="text-amber-300 font-semibold">will fail</strong>.&rdquo; Test how redundant flight systems, isolated battery buses, and dynamic control allocation respond to simulated hardware emergencies.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Failure Mode Triggers (4 Cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Inject Simulated Hardware Fault:
            </span>

            {SCENARIOS.map((scenario) => {
              const isSelected = activeScenario.id === scenario.id;
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => selectScenario(scenario)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/40 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-slate-800 bg-[#070b16] hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-display font-bold text-white leading-tight">
                        {scenario.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {scenario.category} Fault Mode
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isSelected ? 'ACTIVE' : 'TEST'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Telemetry & Diagnostic Analysis (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Real-time Airframe Rotor Schematic */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#070d1a] relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2 mb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    12-ROTOR TELEMETRY MAPPING
                  </span>
                  <div className="text-lg font-display font-bold text-white">
                    {activeScenario.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Recovery Status:</span>
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold border border-emerald-500/40 bg-emerald-950/40 text-emerald-300">
                    {activeScenario.recoveryPotential}
                  </span>
                </div>
              </div>

              {/* 6 Arms / 12 Motors Circular Status Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((motorNum) => {
                  const isFaulty = activeScenario.affectedMotors.includes(motorNum);
                  const armIndex = Math.ceil(motorNum / 2);
                  const isTop = motorNum % 2 !== 0;

                  return (
                    <div
                      key={motorNum}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isFaulty
                          ? 'border-rose-500/80 bg-rose-950/50 text-rose-300 animate-pulse ring-2 ring-rose-500/30'
                          : 'border-cyan-900/40 bg-slate-900/60 text-cyan-300'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-400">
                        ARM {armIndex} · {isTop ? 'TOP' : 'BOT'}
                      </div>
                      <div className="font-mono font-bold text-sm my-1">
                        M#{motorNum}
                      </div>
                      <div className={`text-[10px] font-mono font-bold ${isFaulty ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isFaulty ? 'TRIPPED' : 'NOMINAL'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Console Log */}
              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-cyan-400 flex items-center justify-between overflow-x-auto">
                <span>[BUS TELEMETRY]: {activeScenario.telemetryLog}</span>
                <span className="text-slate-500 shrink-0 ml-2">RT_LOOP_800HZ</span>
              </div>
            </div>

            {/* Diagnostic Breakdown Matrix: What Happens / Detection / Recovery / Emergency Protocol */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: What Happens */}
              <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
                <div className="text-xs font-mono text-amber-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>1. WHAT HAPPENS PHYSICALLY?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeScenario.whatHappens}
                </p>
              </div>

              {/* Box 2: How Detected */}
              <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
                <div className="text-xs font-mono text-cyan-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>2. HOW IS IT DETECTED?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeScenario.howDetected}
                </p>
              </div>

              {/* Box 3: Can System Recover */}
              <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3. RECOVERY POTENTIAL</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeScenario.recoveryPotential} — Control allocation adjusts remaining motor setpoints within available headroom margins.
                </p>
              </div>

              {/* Box 4: Emergency Response */}
              <div className="p-4 rounded-xl border border-slate-800 bg-[#070b16]">
                <div className="text-xs font-mono text-rose-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>4. EMERGENCY RESPONSE EXECUTED</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeScenario.emergencyProtocol}
                </p>
              </div>
            </div>

            {/* Crucial Aerospace Honest Disclaimer */}
            <div className="p-4 rounded-xl border border-rose-950 bg-rose-950/20 text-rose-300 text-xs font-mono flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold uppercase">Engineering Truth:</strong> No flight control simulation guarantees 100% real-world survival. Rotor blade structural shed debris, asymmetric rotor aerodynamic wash turbulence, and high mechanical shock can cause cascading failures. Controlled tethered testing and physical dyno failure injection are non-negotiable requirements before validation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
