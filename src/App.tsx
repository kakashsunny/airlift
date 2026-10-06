/**
 * Project AeroLift — Low-Altitude Electric Human-Lift Multirotor (5m Research Concept)
 * An aerospace engineering research platform and interactive technical portfolio.
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AircraftViewer3D } from './components/AircraftViewer3D';
import { OverviewSection } from './components/OverviewSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { FailureSimulator } from './components/FailureSimulator';
import { SunnyPrototype } from './components/SunnyPrototype';
import { EngineeringDashboard } from './components/EngineeringDashboard';
import { FlightControlLoop } from './components/FlightControlLoop';
import { SafetyAndTether } from './components/SafetyAndTether';
import { RiskAndFMEA } from './components/RiskAndFMEA';
import { RoadmapAndRegulatory } from './components/RoadmapAndRegulatory';
import { DigitalTwinStudio } from './components/DigitalTwinStudio';
import { JudgeModeQA } from './components/JudgeModeQA';
import { CostAndTransparency } from './components/CostAndTransparency';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Aerospace Navigation Bar */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        {/* 1. Cinematic Hero Section */}
        <Hero />

        {/* 2. Interactive 3D Aircraft CAD Viewer (Three.js WebGL) */}
        <AircraftViewer3D />

        {/* 3. Project Overview & "Why 5 Metres?" Altitude Analysis */}
        <OverviewSection />

        {/* 4. 12-Rotor Coaxial Propulsion & Topology Architecture */}
        <ArchitectureSection />

        {/* 5. Live Fault-Tolerant Failure Injection Studio */}
        <FailureSimulator />

        {/* 6. Dedicated Sunny Prototype (Prototype 01) Showcase */}
        <SunnyPrototype />

        {/* 7. Engineering Dashboard, Mass Budget (~155kg) & Isolated Power Topology */}
        <EngineeringDashboard />

        {/* 8. Flight Control Loop, Triple IMUs & Designing For Failure */}
        <FlightControlLoop />

        {/* 9. Pilot Survival Cell & Tethered Gantry Test Rig */}
        <SafetyAndTether />

        {/* 10. 5x5 Risk Matrix & Responsive FMEA Assessment */}
        <RiskAndFMEA />

        {/* 11. 8-Stage Testing Roadmap & Indian DGCA Regulatory Framework */}
        <RoadmapAndRegulatory />

        {/* 12. Digital Twin & HIL Simulation Studio */}
        <DigitalTwinStudio />

        {/* 13. Hackathon Judge Mode: 20+ Deep Technical Questions & Defense */}
        <JudgeModeQA />

        {/* 14. 4-Tier Cost Estimator & Real vs Proposed Status Board */}
        <CostAndTransparency />
      </main>

      {/* 15. Aerospace Engineering Stack, Innovation Taxonomy, & Final Statement */}
      <Footer />
    </div>
  );
}
