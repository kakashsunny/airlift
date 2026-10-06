# Project AeroLift — Innovation Quote Integration & Sunny Prototype Small 3D Showcase

Integrate the user's core innovation statement across the platform's architectural showcases and provide a dedicated interactive small 3D vehicle model for the sub-scale Sunny Prototype.

---

## User Review & Critical Decisions

- **Foundational Innovation Quote**: Integrate the exact statement prominently in the Hero, Overview, and Innovation & Research sections:
  > *"Our innovation is not inventing the multirotor itself. It is developing a safety-first, fault-tolerant system architecture that combines distributed propulsion, redundant power, intelligent control allocation, digital-twin failure simulation, and controlled testing for low-altitude human-lift research."*
- **Interactive 3D Model Mode Switcher**: Enhance `AircraftViewer3D.tsx` with a model toggle:
  - **Full-Scale AeroLift Research Platform** (~2.90 m span, 155 kg MTOM, pilot safety cage, 3 battery pods)
  - **Sunny Prototype Small Testbed** (~1.50 m span, 22–28 kg test mass, central instrumented ballast tank, sub-scale coaxial arms)
- **Dedicated Sub-Scale Deep-Dive**: Update `SunnyPrototype.tsx` with high-detail interactive testbed parameters, ballast configuration, and sensor flight telemetry.

---

## 1. Overview & Core Concept

- **Refined Positioning**: Highlight the exact distinction between component-level hardware (off-the-shelf motors and batteries) and the genuine aerospace research contribution (safety-first fault-tolerant systems architecture, EKF sensor voting, isolated electrical topology, and stage-gated testing).
- **Dual 3D Model Exploration**: Allow users to dynamically switch between the full-scale human-lift platform and the small Sunny Prototype within the WebGL 3D viewer to physically appreciate the scale and architectural differences.

---

## 2. User Experience & Visual Design

### Key Visual & Interactive Enhancements
1. **Interactive 3D Viewer Vehicle Switcher**: A segmented control in `AircraftViewer3D.tsx` allowing instantaneous toggle between *Full-Scale AeroLift (2.9m)* and *Sunny Prototype Small (1.5m)*, updating 3D geometry (ballast tank vs. pilot seat/cage), scale, and component specification pins.
2. **Hero & Innovation Quotation Banners**: High-impact aerospace quotation cards displaying the user's statement with crisp cyan/gold typographic styling and author/charter attribution.
3. **Sunny Prototype Small Spotlight**: Interactive ballast mass calculator and flight telemetry preview for Sunny-01.

---

## 3. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PROJECT AEROLIFT                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Hero Section + Core Innovation Quote Spotlight]                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  [3D Viewer: Full-Scale AeroLift (2.9m) ⟷ Sunny Prototype Small (1.5m)]    │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Sunny Prototype Deep-Dive: Ballast Telemetry & Control Tuning]            │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Innovation Taxonomy Card: Systems Engineering vs. Existing Components]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Edits
- `src/components/AircraftViewer3D.tsx`: Add vehicle toggle state (`'full' | 'sunny'`), dynamic 3D geometry rendering for the small Sunny Prototype (ballast tank, compact arms, high-RPM rotor heads), and contextual component spec pins.
- `src/components/SunnyPrototype.tsx`: Add small prototype visual callouts, live ballast tuning slider, and quote integration.
- `src/components/Hero.tsx` & `src/components/OverviewSection.tsx`: Integrate the exact innovation statement in prominent callout cards.
- `src/components/Footer.tsx`: Update the Innovation and Research section to showcase the quote as the governing engineering thesis.
