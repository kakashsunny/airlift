import React, { useState } from 'react';
import { 
  Cpu, 
  RotateCw, 
  Compass, 
  Layers, 
  ArrowDown, 
  ArrowRight, 
  ShieldCheck, 
  Radio, 
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface SensorDetail {
  id: string;
  name: string;
  samplingRate: string;
  role: string;
  redundancy: string;
}

const SENSORS: SensorDetail[] = [
  {
    id: 'imu_triple',
    name: 'Triple 6-DOF IMUs (Gyro + Accel)',
    samplingRate: '1000 Hz Sampling',
    role: 'Measures body angular rates (roll/pitch/yaw: ω_x, ω_y, ω_z) and linear specific force (a_x, a_y, a_z).',
    redundancy: '3 separate MEMS sensors mechanically isolated from rotor vibration harmonics.',
  },
  {
    id: 'lidar',
    name: 'Downward LiDAR Rangefinder',
    samplingRate: '100 Hz Continuous',
    role: 'Provides millimeter-accurate surface altitude estimation for 0–5m precision hover lock.',
    redundancy: 'Primary optical time-of-flight sensor backed by ultrasonic proximity backup.',
  },
  {
    id: 'baro',
    name: 'Dual High-Resolution Barometers',
    samplingRate: '50 Hz Sample Rate',
    role: 'Monitors ambient static atmospheric pressure to cross-validate vertical ascent rates.',
    redundancy: 'Dual isolated barometric capsules with foam acoustic wind baffles.',
  },
  {
    id: 'optflow',
    name: 'Downward Optical Flow Camera',
    samplingRate: '120 FPS Machine Vision',
    role: 'Tracks ground pixel displacement vectors to counteract lateral crosswind drift without GPS dependence.',
    redundancy: 'Operates independently of outdoor GNSS satellite locks.',
  },
  {
    id: 'telemetry_esc',
    name: '12x Bidirectional ESC Telemetry',
    samplingRate: '500 Hz DShot / CAN',
    role: 'Streams real-time individual motor RPM, ESC FET temperature, bus voltage, and phase current.',
    redundancy: 'Individual dedicated data lines per rotor channel.',
  },
];

export const FlightControlLoop: React.FC = () => {
  const [selectedSensor, setSelectedSensor] = useState<SensorDetail>(SENSORS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2);

  const loopSteps = [
    { title: '1. Multi-Sensor Input', desc: 'Triple IMUs, LiDAR, and ESC telemetry sample raw motion at 1000 Hz' },
    { title: '2. EKF State Estimation', desc: 'Extended Kalman Filter computes filtered position, attitude, and velocity state' },
    { title: '3. Dual Flight Computer', desc: 'PX4 lockstep algorithms calculate required roll, pitch, yaw, and thrust moments' },
    { title: '4. Dynamic Allocation', desc: 'Quadratic matrix solves optimal RPM commands across 12 rotors' },
    { title: '5. Motor & ESC Execution', desc: '12 smart ESCs generate field-oriented sinusoidal currents to brushless coils' },
    { title: '6. Aircraft Motion', desc: 'Aerodynamic vertical thrust lifts airframe, updating physical attitude state' },
  ];

  return (
    <section id="flight-control" className="relative py-20 bg-[#060913] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Intro */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <Cpu className="w-4 h-4" />
            <span className="tracking-widest uppercase">Avionics & State Estimation Loop</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            FLIGHT CONTROL & ESTIMATION LOOP
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Multirotor flight is inherently statically unstable. Real-time stabilization relies on an 800 Hz closed-loop architecture running sensor fusion, attitude estimation, and dynamic control allocation.
          </p>
        </div>

        {/* 1. Animated Closed-Loop Flow Diagram */}
        <div className="mb-16 p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#070b16] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-8">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Real-Time Closed-Loop Pipeline
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-0.5">
                800 HZ ATTITUDE & POSITION CONTROL LOOP
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Interactive execution flow
            </span>
          </div>

          {/* Stepper Timeline Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {loopSteps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveStepIndex(idx);
                  telemetryAudio.playClick();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeStepIndex === idx
                    ? 'border-cyan-500 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1">
                  <span className="font-bold">{step.title}</span>
                  <span className="text-[10px] text-slate-500">{(idx + 1) * 1.25} ms</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>[LOOP LATENCY]: Latency from IMU gyro sample to ESC motor phase update &le; 2.5 milliseconds.</span>
            <span className="text-slate-500 hidden sm:inline">PX4_DSHOT1200_SYNC</span>
          </div>
        </div>

        {/* 2. Sensor Suite Deep Dive */}
        <div className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Sensor Suite Architecture
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              SENSORS & TRIPLE REDUNDANT ESTIMATION
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sensor Selection Buttons (7 Cols) */}
            <div className="lg:col-span-7 space-y-2">
              {SENSORS.map((s) => {
                const isSelected = selectedSensor.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSensor(s);
                      telemetryAudio.playClick();
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/50 shadow-sm'
                        : 'border-slate-800 bg-[#070b16] hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-white mb-0.5">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.samplingRate}</div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800">
                      INSPECT
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sensor Detail Display (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl border border-cyan-900/60 bg-[#070e1e]">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                AVIONICS SENSOR TELEMETRY
              </span>
              <h4 className="text-lg font-display font-bold text-white mt-1 mb-2">
                {selectedSensor.name}
              </h4>
              <div className="text-xs font-mono text-amber-300 mb-4">
                Rate: {selectedSensor.samplingRate}
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div>
                  <strong className="text-white font-mono block mb-1">Primary Role:</strong>
                  <p className="text-slate-400 leading-relaxed">{selectedSensor.role}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/40">
                  <strong className="text-cyan-300 font-mono block mb-1">Redundancy & Fault Isolation:</strong>
                  <p className="text-slate-400 leading-relaxed">{selectedSensor.redundancy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Major Redundancy Section: DESIGNING FOR FAILURE */}
        <div className="p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#081226] via-[#060c1a] to-[#040810] shadow-2xl relative">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Core Aerospace Philosophy
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-1">
              DESIGNING FOR FAILURE
            </h3>
            <blockquote className="text-base sm:text-lg font-display italic text-cyan-200 mt-2">
              &ldquo;The aircraft is designed around the assumption that components can fail.&rdquo;
            </blockquote>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#050914]">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">POWER REDUNDANCY</div>
              <h5 className="font-display font-bold text-white text-sm mb-2">3 Independent Battery Systems</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Loss of one battery pack isolates only 4 of 12 motors; the remaining 8 motors maintain sufficient climb & attitude authority.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#050914]">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">COMPUTING REDUNDANCY</div>
              <h5 className="font-display font-bold text-white text-sm mb-2">Dual Flight Computers</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Master and Hot-Standby autopilots exchange 50 Hz sync heartbeats with sub-20ms failover hardware switching.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#050914]">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">SENSOR REDUNDANCY</div>
              <h5 className="font-display font-bold text-white text-sm mb-2">Triple IMU 2-of-3 Voting</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an accelerometer or gyroscope drifts beyond 3-sigma innovation limits, voting logic discards the faulty sensor instantly.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#050914]">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">PROPULSION REDUNDANCY</div>
              <h5 className="font-display font-bold text-white text-sm mb-2">12 Discrete Motor Channels</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coaxial counter-rotating motor pairs eliminate asymmetric yaw spins upon single motor failure, distributing load to lower rotor.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#05070d] text-xs font-mono text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-bold uppercase">Why Failure-Injection Testing Is Essential:</strong> Redundancy on paper is purely theoretical. Only physical hardware-in-the-loop (HIL) bench dyno testing and mid-flight tethered motor-cut tests can prove that electrical transients and aerodynamic cross-coupling do not induce unrecoverable pilot-induced oscillations.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
