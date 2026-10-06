import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Tag, 
  ShieldCheck,
  CheckCircle,
  Zap
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface QAItem {
  id: number;
  question: string;
  category: 'Propulsion' | 'Power' | 'Flight Control' | 'Safety & Testing' | 'Strategy & Reality';
  answer: string;
  keyTakeaway: string;
}

const QUESTIONS: QAItem[] = [
  {
    id: 1,
    question: 'Why choose 12 motors instead of 4, 6, or 8?',
    category: 'Propulsion',
    answer: 'A 4-rotor design has zero failure tolerance; a 6-rotor design loses severe yaw and roll authority on a single motor loss; and an 8-rotor flat frame requires an excessive footprint (> 2.8m diameter). A 12-rotor coaxial design (6 arms, 2 counter-rotating motors per arm) provides true multi-motor redundancy in a compact 1.6m arm radius while localizing aerodynamic torque cancellation.',
    keyTakeaway: 'Compact footprint + true multi-channel failure tolerance.',
  },
  {
    id: 2,
    question: 'What happens physically if a motor fails in mid-hover?',
    category: 'Propulsion',
    answer: 'Bidirectional DShot telemetry detects motor RPM loss within 8 ms. The quadratic programming control allocation optimizer immediately increases the setpoint of the coaxial partner motor on that same arm (up to 125% burst) and adjusts opposing arm pairs to preserve 3-axis equilibrium. The aircraft initiates a controlled autonomous descent.',
    keyTakeaway: 'Immediate coaxial spool compensation + automatic descent.',
  },
  {
    id: 3,
    question: 'What happens if a battery pack catches fire or suffers internal short?',
    category: 'Power',
    answer: 'The power architecture is segregated into 3 completely isolated battery pods (Packs A, B, C) with zero common DC bus. If Pack C fails or overheats, solid-state isolation contactors trip in < 10 ms, isolating only 4 of the 12 motors. The remaining 8 motors on Buses A and B supply ~1.28:1 thrust-to-weight ratio to land safely.',
    keyTakeaway: '3-way bus segregation prevents whole-vehicle electrical blackout.',
  },
  {
    id: 4,
    question: 'Why not simply use a ballistic parachute for pilot safety?',
    category: 'Safety & Testing',
    answer: 'Ballistic parachutes require a minimum deployment height of 30 to 50 meters to eject, unpack, and inflate canopy. At our target research ceiling of 5 meters AGL, a parachute has zero operational effectiveness. Safety must be engineered through airframe crashworthiness, energy-absorbing seating, and propulsion redundancy.',
    keyTakeaway: 'Parachutes cannot deploy under 30 meters.',
  },
  {
    id: 5,
    question: 'How much total thrust is required to lift the 155 kg aircraft?',
    category: 'Propulsion',
    answer: 'Hovering a 155 kg mass requires ~1520 N (155 kgf) of static thrust. For dynamic control authority, wind gust rejection, and single-motor failure margin, the system is designed for a 1.93:1 thrust-to-weight ratio, providing ~300 kgf (~2940 N) maximum collective peak thrust across all 12 rotors.',
    keyTakeaway: '~155 kgf hover thrust; ~300 kgf peak capability.',
  },
  {
    id: 6,
    question: 'How much electrical power is consumed in hover vs climb?',
    category: 'Power',
    answer: 'Preliminary aerodynamic blade-element calculations estimate hover power at ~22–25 kW total (~1.8–2.1 kW per motor). Peak climb throttle and failure-recovery transients can demand up to 45–55 kW aggregate for short 10-second bursts.',
    keyTakeaway: 'Hover: 22–25 kW; Peak: 45–55 kW.',
  },
  {
    id: 7,
    question: 'How long can this aircraft fly on battery power?',
    category: 'Power',
    answer: 'With a ~9.6 kWh usable battery pack (weighing ~28 kg) and a 23 kW hover draw, estimated hover endurance is approximately 10 to 14 minutes with a 20% reserve margin. Because this is a 5m research platform for stability validation, 10 minutes is more than sufficient for test runs.',
    keyTakeaway: '~10–14 minutes hover endurance.',
  },
  {
    id: 8,
    question: 'How do you prevent catastrophic lithium battery fire cascading?',
    category: 'Power',
    answer: 'Each of the 3 battery pods is housed in a separate, intumescent-lined CNC aluminum enclosure with directional blast pressure relief vents. Physical 300mm air gaps between pods prevent thermal runaway propagation from one pack to another.',
    keyTakeaway: 'Intumescent containment + physical air gap isolation.',
  },
  {
    id: 9,
    question: 'How do you validate the airframe structure before putting anything on it?',
    category: 'Safety & Testing',
    answer: 'Through sequential finite element analysis (FEA) under 2.2x G-load assumptions, followed by physical static sandbag proof load testing on a ground test stand to 150% limit load without permanent deflection or carbon delamination.',
    keyTakeaway: 'FEA simulation + 150% static proof load testing.',
  },
  {
    id: 10,
    question: 'How do you test the platform safely without risking a human pilot?',
    category: 'Safety & Testing',
    answer: 'The aircraft follows an 8-stage test roadmap: Stage 01 (SITL physics), Stage 03 (Sub-scale Sunny Prototype), Stage 04 (Full-scale unmanned static rig), Stage 05 (Tethered unmanned hover), and Stage 06 (Instrumented crash dummy with spinal telemetry). No human enters until full unmanned telemetry is proven.',
    keyTakeaway: 'Unmanned sub-scale + tethered gantry + dummy drop testing.',
  },
  {
    id: 11,
    question: 'What is actually innovative about this project?',
    category: 'Strategy & Reality',
    answer: 'The innovation is NOT inventing electric motors or carbon propellers (those are commodity components). The innovation lies in the fault-tolerant systems integration: the quadratic control allocation algorithm, the triple-isolated electrical bus topology, the crashable pilot survival cell, and the systematic failure-injection methodology.',
    keyTakeaway: 'Systems engineering, fault-tolerant control, and safety architecture.',
  },
  {
    id: 12,
    question: 'What is the Indian regulatory pathway for this vehicle?',
    category: 'Strategy & Reality',
    answer: 'Under Bharatiya Vayuyan Adhiniyam, 2024 and DGCA guidelines, human-carrying experimental aircraft require experimental airworthiness exemptions, institutional safety board reviews, designated flight test corridor NOTAMs, and third-party liability coverage. Unmanned sub-scale tests operate under DGCA drone regulations.',
    keyTakeaway: 'Strict DGCA experimental category review + drone rules for sub-scale.',
  },
  {
    id: 13,
    question: 'What is your single biggest engineering risk?',
    category: 'Strategy & Reality',
    answer: 'High-current electrical and thermal management during a rapid bus transfer or rotor stall. Pushing 500+ Amperes across 12 channels produces extreme resistive heating ($I^2R$) and voltage sag. Isolating electrical faults before they cause cascading BMS disconnects is our highest engineering priority.',
    keyTakeaway: 'Electrical bus fault isolation & thermal management.',
  },
  {
    id: 14,
    question: 'What have you actually built right now vs what is proposed?',
    category: 'Strategy & Reality',
    answer: 'Right now: The mathematical sizing models, aerodynamic 6-DOF simulation architecture, 3D CAD assemblies, and FMEA registers are complete. The sub-scale Sunny Prototype (Prototype 01) and physical dyno test bench are the immediate next build steps. Full-scale human flight has NOT been performed and is not certified.',
    keyTakeaway: 'Architecture & CAD complete; sub-scale prototype in progress.',
  },
  {
    id: 15,
    question: 'How much efficiency is lost by stacking propellers coaxially?',
    category: 'Propulsion',
    answer: 'Coaxial rotors lose approximately 6% to 8% aerodynamic efficiency compared to isolated planar rotors due to lower blade inflow turbulence and accelerated wake. We deliberately accept this loss in exchange for a 40% smaller airframe footprint and natural torque balance.',
    keyTakeaway: '6–8% efficiency trade-off for 40% geometric span reduction.',
  },
  {
    id: 16,
    question: 'How do you prevent ground resonance and dynamic rollover upon touchdown?',
    category: 'Safety & Testing',
    answer: 'The landing skids utilize a wide 1.85m stance with dual-stage polyurethane elastomeric damping pads. The flight controller includes ground-contact detection logic via downward LiDAR and ESC current drops that disarms rotor spin within 50 ms of weight-on-wheels.',
    keyTakeaway: 'Wide stance skids + elastomer damping + weight-on-wheels auto-disarm.',
  },
  {
    id: 17,
    question: 'What loop rate does the flight computer and ESC control operate at?',
    category: 'Flight Control',
    answer: 'The primary attitude control loop executes at 800 Hz on dual STM32H7 processors. ESCs are commanded via DShot1200 protocol at up to 1000 Hz with bidirectional RPM telemetry returned every cycle.',
    keyTakeaway: '800 Hz attitude loop + DShot1200 motor telemetry.',
  },
  {
    id: 18,
    question: 'How do you handle severe battery voltage sag at full climb power?',
    category: 'Power',
    answer: 'We utilize ultra-low internal resistance (IR) high-discharge lithium cells (30C continuous / 50C burst rated). The flight controller incorporates feed-forward voltage sag compensation, dynamically adjusting PWM modulation index as bus voltage droops under high load.',
    keyTakeaway: 'High-C low-IR cells + feed-forward PWM sag compensation.',
  },
  {
    id: 19,
    question: 'Can the multirotor glide or autorotate if all power cuts out?',
    category: 'Propulsion',
    answer: 'No. Fixed-pitch electric multirotors have negligible rotor inertia and cannot alter blade collective pitch to generate the autorotative aerodynamic flare of a helicopter. This is why multirotor safety must rely on redundant battery pods and motor channels.',
    keyTakeaway: 'Multirotors cannot autorotate; electrical redundancy is mandatory.',
  },
  {
    id: 20,
    question: 'Why limit the target research altitude strictly to 5 meters?',
    category: 'Safety & Testing',
    answer: '5 meters allows full investigation of ground-effect departure, turbulent wash recirculation, and multi-rotor hover authority while remaining strictly within the physical constraint envelope of ground safety tethers and energy-absorbing crashable seat structures.',
    keyTakeaway: 'Safe tether containment + ground effect transition research.',
  },
];

export const JudgeModeQA: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const categories = ['ALL', 'Propulsion', 'Power', 'Flight Control', 'Safety & Testing', 'Strategy & Reality'];

  const filteredQuestions = QUESTIONS.filter((q) => {
    const matchesCat = activeCategory === 'ALL' || q.category === activeCategory;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    telemetryAudio.playClick();
  };

  return (
    <section id="judge-qa" className="relative py-20 bg-[#060913] border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="tracking-widest uppercase">Hackathon & Academic Defense</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            JUDGE MODE: 20+ TECHNICAL QUESTIONS & DEFENSE
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Prepared technical answers addressing deep aerospace questions regarding aerodynamics, battery isolation, control allocation, failure physics, and Indian regulatory compliance.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-[#070b16] mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technical questions (e.g. autorotation, voltage sag, parachute, 12 motors)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Question Counter */}
            <div className="text-xs font-mono text-cyan-400 shrink-0">
              Showing <span className="font-bold text-white">{filteredQuestions.length}</span> of {QUESTIONS.length} Questions
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  telemetryAudio.playClick();
                }}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Accordion List */}
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'border-cyan-500/70 bg-[#081022] shadow-lg'
                    : 'border-slate-800 bg-[#070a14] hover:border-slate-700'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleAccordion(q.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-xs font-mono font-bold text-cyan-400 w-6 shrink-0 mt-0.5 sm:mt-0">
                      Q{q.id < 10 ? `0${q.id}` : q.id}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-display font-bold text-white">
                        {q.question}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                        <span className="text-cyan-300 uppercase">{q.category}</span>
                        <span>·</span>
                        <span className="text-slate-300">Key: {q.keyTakeaway}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                    isExpanded ? 'border-cyan-500 bg-cyan-950 text-cyan-300' : 'border-slate-800 text-slate-500'
                  }`}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/80">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                      {q.answer}
                    </p>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-cyan-950 text-xs font-mono text-cyan-300 flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span><strong>Aerospace Defense Summary:</strong> {q.keyTakeaway}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
