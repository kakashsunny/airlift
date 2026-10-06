import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Rotate3d, 
  Layers, 
  Zap, 
  Maximize2, 
  Eye, 
  Activity, 
  Info, 
  Compass,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Rocket,
  Weight
} from 'lucide-react';
import { telemetryAudio } from '../utils/audioTelemetry';

interface ComponentSpec {
  id: string;
  name: string;
  category: 'Propulsion' | 'Power' | 'Avionics' | 'Structure' | 'Safety';
  status: 'PRELIMINARY ESTIMATE' | 'PROPOSED / NOT YET VALIDATED' | 'RESEARCH CONCEPT';
  description: string;
  specs: { label: string; value: string }[];
  position: [number, number, number];
}

const FULL_SCALE_COMPONENTS: ComponentSpec[] = [
  {
    id: 'propellers',
    name: '12x Carbon Propellers (Full-Scale)',
    category: 'Propulsion',
    status: 'PRELIMINARY ESTIMATE',
    description: 'Counter-rotating high-aspect carbon fiber blades optimized for low-RPM hover efficiency and coaxial wash interaction.',
    specs: [
      { label: 'Diameter', value: '28–32 in' },
      { label: 'Pitch', value: '9.2 in' },
      { label: 'Material', value: 'Toray Carbon Prepreg' },
      { label: 'Total Rotor Count', value: '12 (6 Top / 6 Bottom)' },
    ],
    position: [0, 0.45, 1.6],
  },
  {
    id: 'motors',
    name: '12x Brushless Outrunner Motors',
    category: 'Propulsion',
    status: 'PRELIMINARY ESTIMATE',
    description: 'High-torque direct-drive electric motors configured in 6 coaxial pairs with individual telemetry sensing.',
    specs: [
      { label: 'Estimated Peak Power', value: '4.5 kW / motor' },
      { label: 'Hover Power Target', value: '~1.9 kW / motor' },
      { label: 'KV Rating', value: '100–120 KV' },
      { label: 'Cooling', value: 'Forced Air Propeller Wash' },
    ],
    position: [0, 0.25, 1.6],
  },
  {
    id: 'coaxial_pair',
    name: '6x Coaxial Arm Assemblies',
    category: 'Propulsion',
    status: 'PROPOSED / NOT YET VALIDATED',
    description: 'Shared vertical axis propulsion units providing pitch/roll/yaw control authority with localized aerodynamic torque cancellation.',
    specs: [
      { label: 'Arm Count', value: '6 Radial (60° Spacing)' },
      { label: 'Coaxial Efficiency Delta', value: '-6% to -8% (Trade-off for 40% Span Reduction)' },
      { label: 'Axial Spacing', value: '220 mm Rotor Separation' },
    ],
    position: [1.4, 0.3, 0.8],
  },
  {
    id: 'carbon_arms',
    name: 'Carbon Structural Arms',
    category: 'Structure',
    status: 'PRELIMINARY ESTIMATE',
    description: 'Pultruded high-modulus carbon fiber tubes with CNC machined 7075-T6 aluminum junction nodes.',
    specs: [
      { label: 'Arm Diameter', value: '50 mm Outer / 2 mm Wall' },
      { label: 'Arm Reach', value: '1.45 m Radius' },
      { label: 'Safety Factor', value: '2.2x Max G-Load (Target)' },
    ],
    position: [0.8, 0.1, 0.45],
  },
  {
    id: 'battery_packs',
    name: '3x Isolated Battery Pods',
    category: 'Power',
    status: 'PRELIMINARY ESTIMATE',
    description: 'Three physically separated high-discharge Li-ion / NMC battery enclosures with independent contactor isolation.',
    specs: [
      { label: 'Pack Voltage', value: '14S (51.8 V Nom) or 18S' },
      { label: 'Total Energy', value: '~9.6 kWh (Est)' },
      { label: 'Isolation', value: 'Independent 3-Bus Segregation' },
      { label: 'Fire Containment', value: 'Intumescent Lined Aluminum Casing' },
    ],
    position: [0, -0.2, 0.6],
  },
  {
    id: 'flight_controllers',
    name: 'Dual Redundant Flight Computers',
    category: 'Avionics',
    status: 'PROPOSED / NOT YET VALIDATED',
    description: 'Dual lock-step flight controllers running customized PX4/ArduPilot stack with triple IMU voting logic and EKF state estimation.',
    specs: [
      { label: 'Architecture', value: 'Master-Hot-Standby Dual Unit' },
      { label: 'IMU Redundancy', value: '3x 6-DOF Shock-Isolated IMUs' },
      { label: 'Control Loop Rate', value: '800 Hz Attitude / 200 Hz Position' },
      { label: 'Telemetry Link', value: 'Redundant 2.4 GHz + 868 MHz' },
    ],
    position: [0, 0.15, -0.3],
  },
  {
    id: 'pilot_seat',
    name: 'Impact-Absorbing Pilot Seat',
    category: 'Safety',
    status: 'PROPOSED / NOT YET VALIDATED',
    description: 'Deformable honeycomb composite pilot bucket with certified 5-point aviation harness for spinal deceleration absorption.',
    specs: [
      { label: 'Harness', value: '5-Point Quick-Release Aviation Harness' },
      { label: 'Crush Element', value: 'Expanded Aluminum Honeycomb Core' },
      { label: 'Design Deceleration', value: '< 15 G Spinal Load Limit' },
    ],
    position: [0, 0.1, 0],
  },
  {
    id: 'safety_cage',
    name: 'Protective Roll & Rotor Barrier Cage',
    category: 'Safety',
    status: 'PROPOSED / NOT YET VALIDATED',
    description: 'Surrounding structural cage preventing pilot contact with rotating blades and providing rollover occupant volume retention.',
    specs: [
      { label: 'Material', value: 'Thin-Wall Chromoly / Carbon Hybrid' },
      { label: 'Blade Clearance', value: '> 350 mm Minimum Perimeter Margin' },
      { label: 'Weight Allocation', value: '~12 kg' },
    ],
    position: [0, 0.8, 0],
  },
];

const SUNNY_COMPONENTS: ComponentSpec[] = [
  {
    id: 'sunny_ballast',
    name: 'Instrumented Ballast Tank',
    category: 'Structure',
    status: 'RESEARCH CONCEPT',
    description: 'Central load-cell instrumented ballast tank capable of holding 10–15 kg of fluid or lead ballast to simulate pilot payload mass distribution.',
    specs: [
      { label: 'Ballast Capacity', value: '10–15 kg Adjustable' },
      { label: 'Instrumentation', value: '3-Axis Center-of-Mass Load Cells' },
      { label: 'Fluid Damping', value: 'Internal Baffles to Prevent Slosh' },
    ],
    position: [0, 0.1, 0],
  },
  {
    id: 'sunny_propellers',
    name: '12x 15" Sub-Scale Carbon Blades',
    category: 'Propulsion',
    status: 'PRELIMINARY ESTIMATE',
    description: 'High-RPM counter-rotating carbon propellers sized for sub-scale coaxial arm testing.',
    specs: [
      { label: 'Blade Span', value: '15.0 in' },
      { label: 'Max RPM', value: '5,800 RPM' },
      { label: 'Rotor Count', value: '12 Rotors (6 Coaxial Pairs)' },
    ],
    position: [0, 0.2, 0.75],
  },
  {
    id: 'sunny_motors',
    name: '12x Micro Brushless Outrunners',
    category: 'Propulsion',
    status: 'PRELIMINARY ESTIMATE',
    description: 'Direct-drive brushless outrunners operating on 6S LiPo power bus with live telemetry.',
    specs: [
      { label: 'Peak Power', value: '650 W / motor' },
      { label: 'Hover Power Target', value: '~280 W / motor' },
      { label: 'KV Rating', value: '380 KV' },
    ],
    position: [0, 0.15, 0.75],
  },
  {
    id: 'sunny_avionics',
    name: 'PX4 Flight Computer & HIL Telemetry',
    category: 'Avionics',
    status: 'RESEARCH CONCEPT',
    description: 'Shock-mounted flight control computer logging high-frequency sensor fusion innovation errors and testing dynamic motor cutoff recovery.',
    specs: [
      { label: 'Telemetry Stream', value: 'High-Bandwidth 915 MHz Radiomaster' },
      { label: 'Control Loop', value: '400 Hz EKF3 Attitude Loop' },
      { label: 'Failure Injector', value: 'Remote Single-Motor Kill Relays' },
    ],
    position: [0, 0.25, 0],
  },
  {
    id: 'sunny_battery',
    name: '6S High-Discharge LiPo Pack',
    category: 'Power',
    status: 'PRELIMINARY ESTIMATE',
    description: 'High-discharge 6S 16,000 mAh LiPo battery pack providing 10–12 minutes of tethered hover time.',
    specs: [
      { label: 'Voltage', value: '22.2 V Nominal (6S)' },
      { label: 'Capacity', value: '16 Ah (355 Wh)' },
      { label: 'Weight', value: '2.1 kg' },
    ],
    position: [0, -0.15, 0],
  },
  {
    id: 'sunny_tether',
    name: 'Sub-Scale Gantry Tether Point',
    category: 'Safety',
    status: 'RESEARCH CONCEPT',
    description: 'Ventral anchor for tethered gantry testing inside laboratory containment envelope.',
    specs: [
      { label: 'Line Type', value: 'Dyneema 2.5mm' },
      { label: 'Max Excursion', value: '1.8 m AGL Ceiling' },
    ],
    position: [0, -0.3, 0],
  },
];

export const AircraftViewer3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vehicleMode, setVehicleMode] = useState<'full' | 'sunny'>('full');
  const [activeComponent, setActiveComponent] = useState<ComponentSpec>(FULL_SCALE_COMPONENTS[0]);
  const [explodedRatio, setExplodedRatio] = useState(0);
  const [rotorSpeed, setRotorSpeed] = useState(1);
  const [isSpinning, setIsSpinning] = useState(true);
  const [activePreset, setActivePreset] = useState<'iso' | 'top' | 'side' | 'cockpit'>('iso');
  const [showCage, setShowCage] = useState(true);
  const [showPropulsion, setShowPropulsion] = useState(true);
  const [showBatteries, setShowBatteries] = useState(true);
  const [showAvionics, setShowAvionics] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const rotorsRef = useRef<THREE.Mesh[]>([]);
  const armGroupsRef = useRef<THREE.Group[]>([]);
  const batteryGroupRef = useRef<THREE.Group | null>(null);
  const cageGroupRef = useRef<THREE.Group | null>(null);
  const avionicsGroupRef = useRef<THREE.Group | null>(null);
  const ballastGroupRef = useRef<THREE.Group | null>(null);
  const fullAirframeGroupRef = useRef<THREE.Group | null>(null);
  const sunnyAirframeGroupRef = useRef<THREE.Group | null>(null);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  const currentComponents = vehicleMode === 'full' ? FULL_SCALE_COMPONENTS : SUNNY_COMPONENTS;

  // Toggle vehicle mode
  const toggleVehicleMode = (mode: 'full' | 'sunny') => {
    setVehicleMode(mode);
    setActiveComponent(mode === 'full' ? FULL_SCALE_COMPONENTS[0] : SUNNY_COMPONENTS[0]);
    telemetryAudio.playClick();
  };

  // Update camera view presets
  const setCameraPreset = useCallback((preset: 'iso' | 'top' | 'side' | 'cockpit') => {
    setActivePreset(preset);
    autoRotateRef.current = false;
    telemetryAudio.playClick();
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    if (preset === 'iso') {
      camera.position.set(3.2, 2.2, 3.5);
      camera.lookAt(0, 0, 0);
    } else if (preset === 'top') {
      camera.position.set(0, 5.2, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (preset === 'side') {
      camera.position.set(4.5, 0.2, 0);
      camera.lookAt(0, 0, 0);
    } else if (preset === 'cockpit') {
      camera.position.set(0, 0.4, -0.2);
      camera.lookAt(0, 0.3, 2.0);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.08);

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(3.4, 2.3, 3.6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting (Studio Aerospace 3-Point Lighting)
    const ambientLight = new THREE.AmbientLight(0x223344, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x67e8f9, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-5, 4, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    rimLight.position.set(0, -4, -6);
    scene.add(rimLight);

    // Grid helper on floor
    const grid = new THREE.GridHelper(10, 20, 0x06b6d4, 0x1e293b);
    grid.position.y = -1.0;
    scene.add(grid);

    // Master Root Group
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Materials
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.35,
      metalness: 0.8,
    });

    const alloyMat = new THREE.MeshStandardMaterial({
      color: 0x8a99ad,
      roughness: 0.25,
      metalness: 0.95,
    });

    const motorMat = new THREE.MeshStandardMaterial({
      color: 0x0e1726,
      roughness: 0.3,
      metalness: 0.85,
    });

    const propMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.85,
    });

    const batteryMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.6,
    });

    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x222634,
      roughness: 0.8,
      metalness: 0.2,
    });

    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.9,
    });

    const ballastMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.75,
    });

    // Sub-Groups for Full-Scale vs Sunny Prototype
    const fullAirframeGroup = new THREE.Group();
    fullAirframeGroupRef.current = fullAirframeGroup;
    rootGroup.add(fullAirframeGroup);

    const sunnyAirframeGroup = new THREE.Group();
    sunnyAirframeGroupRef.current = sunnyAirframeGroup;
    rootGroup.add(sunnyAirframeGroup);

    // ----------------------------------------------------
    // 1. FULL-SCALE AEROLIFT (2.9M SPAN) GEOMETRY
    // ----------------------------------------------------
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, 0.16, 12), alloyMat);
    fullAirframeGroup.add(hub);

    // Pilot Bucket Seat
    const seatGroup = new THREE.Group();
    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.45), seatMat);
    seatBase.position.set(0, 0.08, 0);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.6, 0.08), seatMat);
    seatBack.position.set(0, 0.35, -0.2);
    seatBack.rotation.x = -0.15;
    seatGroup.add(seatBase, seatBack);

    // Harness
    const harnessL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.02), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    harnessL.position.set(-0.1, 0.35, -0.15);
    harnessL.rotation.x = -0.15;
    const harnessR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.5, 0.02), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
    harnessR.position.set(0.1, 0.35, -0.15);
    harnessR.rotation.x = -0.15;
    seatGroup.add(harnessL, harnessR);
    fullAirframeGroup.add(seatGroup);

    // Safety Roll Cage
    const cageGroup = new THREE.Group();
    cageGroupRef.current = cageGroup;
    const hoopGeo = new THREE.TorusGeometry(0.65, 0.02, 8, 24, Math.PI);
    const hoopFront = new THREE.Mesh(hoopGeo, cageMat);
    hoopFront.position.set(0, 0.2, 0.3);
    hoopFront.rotation.x = Math.PI / 2;
    hoopFront.rotation.y = Math.PI / 2;

    const hoopBack = new THREE.Mesh(hoopGeo, cageMat);
    hoopBack.position.set(0, 0.2, -0.3);
    hoopBack.rotation.x = Math.PI / 2;
    hoopBack.rotation.y = Math.PI / 2;

    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8), cageMat);
    spine.position.set(0, 0.85, 0);
    spine.rotation.x = Math.PI / 2;
    cageGroup.add(hoopFront, hoopBack, spine);
    fullAirframeGroup.add(cageGroup);

    // Full-Scale Landing Skids
    const skidGroup = new THREE.Group();
    const skidL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8), alloyMat);
    skidL.position.set(-0.65, -0.7, 0);
    skidL.rotation.x = Math.PI / 2;
    const skidR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8), alloyMat);
    skidR.position.set(0.65, -0.7, 0);
    skidR.rotation.x = Math.PI / 2;

    const strutFL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 8), carbonMat);
    strutFL.position.set(-0.4, -0.35, 0.4);
    strutFL.rotation.z = 0.4;
    const strutFR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 8), carbonMat);
    strutFR.position.set(0.4, -0.35, 0.4);
    strutFR.rotation.z = -0.4;
    const strutBL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 8), carbonMat);
    strutBL.position.set(-0.4, -0.35, -0.4);
    strutBL.rotation.z = 0.4;
    const strutBR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 8), carbonMat);
    strutBR.position.set(0.4, -0.35, -0.4);
    strutBR.rotation.z = -0.4;

    const tetherRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.9 }));
    tetherRing.position.set(0, -0.38, 0);
    tetherRing.rotation.x = Math.PI / 2;
    skidGroup.add(skidL, skidR, strutFL, strutFR, strutBL, strutBR, tetherRing);
    fullAirframeGroup.add(skidGroup);

    // 3x Battery Pods
    const batteryGroup = new THREE.Group();
    batteryGroupRef.current = batteryGroup;
    for (let b = 0; b < 3; b++) {
      const bAngle = (b * Math.PI * 2) / 3 + Math.PI / 6;
      const bBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.38), batteryMat);
      const bRadius = 0.52;
      bBox.position.set(Math.cos(bAngle) * bRadius, -0.12, Math.sin(bAngle) * bRadius);
      bBox.rotation.y = -bAngle;
      batteryGroup.add(bBox);
    }
    fullAirframeGroup.add(batteryGroup);

    // Dual Avionics Flight Computers
    const avionicsGroup = new THREE.Group();
    avionicsGroupRef.current = avionicsGroup;
    const fc1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.14), new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 }));
    fc1.position.set(-0.12, 0.14, -0.32);
    const fc2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.14), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 }));
    fc2.position.set(0.12, 0.14, -0.32);
    avionicsGroup.add(fc1, fc2);
    fullAirframeGroup.add(avionicsGroup);

    // ----------------------------------------------------
    // 2. SUNNY PROTOTYPE SMALL (1.5M SPAN) GEOMETRY
    // ----------------------------------------------------
    const sunnyHub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.1, 12), alloyMat);
    sunnyAirframeGroup.add(sunnyHub);

    // Central Instrumented Ballast Tank (Water/Lead container)
    const ballastGroup = new THREE.Group();
    ballastGroupRef.current = ballastGroup;
    const ballastCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.28, 16), ballastMat);
    ballastCylinder.position.set(0, 0.16, 0);
    const ballastCap = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.04, 16), alloyMat);
    ballastCap.position.set(0, 0.31, 0);

    // Sensor instrumentation ring
    const sensorRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.015, 8, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    sensorRing.position.set(0, 0.16, 0);
    sensorRing.rotation.x = Math.PI / 2;

    ballastGroup.add(ballastCylinder, ballastCap, sensorRing);
    sunnyAirframeGroup.add(ballastGroup);

    // Sub-Scale Battery Box (6S LiPo)
    const sunnyBattery = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.25), batteryMat);
    sunnyBattery.position.set(0, -0.08, 0);
    sunnyAirframeGroup.add(sunnyBattery);

    // Sub-Scale Landing Legs
    for (let leg = 0; leg < 4; leg++) {
      const legAngle = (leg * Math.PI) / 2 + Math.PI / 4;
      const legMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 8), carbonMat);
      legMesh.position.set(Math.cos(legAngle) * 0.28, -0.28, Math.sin(legAngle) * 0.28);
      legMesh.rotation.z = Math.cos(legAngle) * 0.3;
      legMesh.rotation.x = Math.sin(legAngle) * 0.3;
      sunnyAirframeGroup.add(legMesh);
    }

    // ----------------------------------------------------
    // 3. COMMON 6 ARMS & 12 COAXIAL MOTORS
    // ----------------------------------------------------
    const armGroups: THREE.Group[] = [];
    const rotors: THREE.Mesh[] = [];
    const armLength = 1.6;
    const numArms = 6;

    for (let i = 0; i < numArms; i++) {
      const angle = (i * Math.PI * 2) / numArms;
      const armGroup = new THREE.Group();
      armGroup.rotation.y = angle;

      // Carbon Arm Tube
      const armTube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, armLength, 12), carbonMat);
      armTube.position.set(0, 0, armLength / 2);
      armTube.rotation.x = Math.PI / 2;
      armGroup.add(armTube);

      // Motor Mount Block
      const motorMount = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.12), alloyMat);
      motorMount.position.set(0, 0, armLength);
      armGroup.add(motorMount);

      // Top Motor & Propeller
      const topMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.08, 16), motorMat);
      topMotor.position.set(0, 0.16, armLength);
      armGroup.add(topMotor);

      const topPropGeo = new THREE.BoxGeometry(0.04, 0.012, 0.85);
      const topProp = new THREE.Mesh(topPropGeo, propMat);
      topProp.position.set(0, 0.22, armLength);
      topProp.userData = { direction: i % 2 === 0 ? 1 : -1, speedMult: 1.0 };
      armGroup.add(topProp);
      rotors.push(topProp);

      // Bottom Motor & Propeller
      const bottomMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.08, 16), motorMat);
      bottomMotor.position.set(0, -0.16, armLength);
      armGroup.add(bottomMotor);

      const bottomPropGeo = new THREE.BoxGeometry(0.04, 0.012, 0.85);
      const bottomProp = new THREE.Mesh(bottomPropGeo, propMat);
      bottomProp.position.set(0, -0.22, armLength);
      bottomProp.userData = { direction: i % 2 === 0 ? -1 : 1, speedMult: 1.05 };
      armGroup.add(bottomProp);
      rotors.push(bottomProp);

      rootGroup.add(armGroup);
      armGroups.push(armGroup);
    }

    rotorsRef.current = rotors;
    armGroupsRef.current = armGroups;

    // Mouse & Touch Controls
    let isMouseDown = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isMouseDown = true;
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastX = clientX;
      lastY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - lastX;
      const deltaY = clientY - lastY;
      lastX = clientX;
      lastY = clientY;

      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.y += deltaX * 0.008;
        rootGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, rootGroupRef.current.rotation.x + deltaY * 0.008));
      }
    };

    const onPointerUp = () => {
      isMouseDown = false;
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      autoRotateRef.current = false;
      if (cameraRef.current) {
        const zoomDelta = e.deltaY * 0.002;
        const newDist = cameraRef.current.position.length() + zoomDelta;
        if (newDist > 1.5 && newDist < 8.0) {
          cameraRef.current.position.setLength(newDist);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Spin Rotors
      if (isSpinning) {
        rotorsRef.current.forEach((rotor) => {
          const dir = rotor.userData.direction || 1;
          const mult = rotor.userData.speedMult || 1;
          rotor.rotation.y += delta * 24 * rotorSpeed * dir * mult;
        });
      }

      // Gentle auto-rotation if idle
      if (autoRotateRef.current && rootGroupRef.current) {
        rootGroupRef.current.rotation.y += delta * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [isSpinning, rotorSpeed]);

  // Handle Model Switching (Full-scale vs Sunny Prototype)
  useEffect(() => {
    if (!fullAirframeGroupRef.current || !sunnyAirframeGroupRef.current || !rootGroupRef.current) return;

    if (vehicleMode === 'full') {
      fullAirframeGroupRef.current.visible = true;
      sunnyAirframeGroupRef.current.visible = false;
      rootGroupRef.current.scale.set(1.0, 1.0, 1.0);
    } else {
      fullAirframeGroupRef.current.visible = false;
      sunnyAirframeGroupRef.current.visible = true;
      // Scale down to reflect 1.5m subscale geometry
      rootGroupRef.current.scale.set(0.65, 0.65, 0.65);
    }
  }, [vehicleMode]);

  // Handle Exploded View updates
  useEffect(() => {
    if (!armGroupsRef.current) return;
    const ratio = explodedRatio;

    armGroupsRef.current.forEach((group) => {
      group.position.z = ratio * 0.4;
    });

    if (cageGroupRef.current) {
      cageGroupRef.current.position.y = ratio * 0.5;
    }

    if (batteryGroupRef.current) {
      batteryGroupRef.current.position.y = -ratio * 0.3;
    }

    if (avionicsGroupRef.current) {
      avionicsGroupRef.current.position.y = ratio * 0.35;
    }

    if (ballastGroupRef.current) {
      ballastGroupRef.current.position.y = ratio * 0.3;
    }
  }, [explodedRatio]);

  // Toggle Visibility
  useEffect(() => {
    if (cageGroupRef.current) cageGroupRef.current.visible = showCage && vehicleMode === 'full';
    if (batteryGroupRef.current) batteryGroupRef.current.visible = showBatteries && vehicleMode === 'full';
    if (avionicsGroupRef.current) avionicsGroupRef.current.visible = showAvionics;
    armGroupsRef.current.forEach((arm) => {
      arm.visible = showPropulsion;
    });
  }, [showCage, showBatteries, showAvionics, showPropulsion, vehicleMode]);

  const selectComponent = (comp: ComponentSpec) => {
    setActiveComponent(comp);
    telemetryAudio.playClick();
  };

  return (
    <section id="3d-model" className="relative py-16 bg-[#060913] border-t border-b border-slate-900 overflow-hidden">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <Rotate3d className="w-4 h-4" />
              <span className="tracking-widest uppercase">Interactive 3D Engineering Model</span>
              <span className="text-slate-600">/</span>
              <span className="text-amber-300">
                {vehicleMode === 'full' ? 'Full-Scale Platform (~2.9m)' : 'Sunny Prototype Small (~1.5m)'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
              AIRCRAFT DIGITAL CAD EXPLORER
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Toggle between the full-scale human-lift platform with safety cage and the small Sunny Prototype with central ballast water tank.
            </p>
          </div>

          {/* Vehicle Switcher + Camera Preset Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Vehicle Mode Toggle */}
            <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800">
              <button
                onClick={() => toggleVehicleMode('full')}
                className={`px-3 py-1.5 text-xs font-mono rounded font-medium transition-all ${
                  vehicleMode === 'full'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Platform (2.9m)
              </button>
              <button
                onClick={() => toggleVehicleMode('sunny')}
                className={`px-3 py-1.5 text-xs font-mono rounded font-medium transition-all flex items-center gap-1.5 ${
                  vehicleMode === 'sunny'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Sunny Small (1.5m)</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1">
              {(['iso', 'top', 'side', 'cockpit'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCameraPreset(preset)}
                  className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                    activePreset === preset
                      ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main 3D Canvas Stage + HUD Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Viewport Box (8 Cols) */}
          <div className="lg:col-span-8 relative rounded-xl border border-cyan-950/80 bg-[#04060b] overflow-hidden shadow-2xl">
            {/* Viewport Canvas */}
            <div
              ref={containerRef}
              className="w-full h-[420px] sm:h-[500px] lg:h-[560px] cursor-grab active:cursor-grabbing"
              title="Drag to rotate, scroll to zoom"
            />

            {/* Top Viewport HUD Overlay Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-mono text-cyan-300">
                <Compass className="w-3.5 h-3.5" />
                <span>MODEL: {vehicleMode === 'full' ? 'AEROLIFT 155KG CONCEPT' : 'SUNNY PROTOTYPE SMALL'}</span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => {
                    const newSpin = !isSpinning;
                    setIsSpinning(newSpin);
                    if (newSpin) telemetryAudio.playRotorSpool(rotorSpeed);
                  }}
                  className={`px-2 py-1 text-xs font-mono rounded border transition-colors flex items-center gap-1 ${
                    isSpinning
                      ? 'border-cyan-500/60 bg-cyan-950/80 text-cyan-300'
                      : 'border-slate-800 bg-black/60 text-slate-400'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>{isSpinning ? 'Rotors: ACTIVE' : 'Rotors: IDLE'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Viewport Control Tray */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono">
              {/* Exploded View Slider */}
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-300 text-[11px] uppercase tracking-wider shrink-0">Exploded View:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explodedRatio}
                  onChange={(e) => {
                    setExplodedRatio(parseFloat(e.target.value));
                    telemetryAudio.playClick();
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-cyan-300 tabular-nums text-[11px] w-8">{Math.round(explodedRatio * 100)}%</span>
              </div>

              {/* Layer Visibility Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400 text-[11px] hidden sm:inline">LAYERS:</span>
                {vehicleMode === 'full' && (
                  <button
                    onClick={() => {
                      setShowCage(!showCage);
                      telemetryAudio.playClick();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                      showCage ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 bg-slate-900/60 text-slate-500'
                    }`}
                  >
                    Cage
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowPropulsion(!showPropulsion);
                    telemetryAudio.playClick();
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                    showPropulsion ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 bg-slate-900/60 text-slate-500'
                  }`}
                >
                  Rotors
                </button>
                {vehicleMode === 'full' && (
                  <button
                    onClick={() => {
                      setShowBatteries(!showBatteries);
                      telemetryAudio.playClick();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                      showBatteries ? 'border-amber-500/50 bg-amber-950/40 text-amber-300' : 'border-slate-800 bg-slate-900/60 text-slate-500'
                    }`}
                  >
                    Batteries
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowAvionics(!showAvionics);
                    telemetryAudio.playClick();
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                    showAvionics ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 bg-slate-900/60 text-slate-500'
                  }`}
                >
                  Avionics
                </button>
              </div>
            </div>
          </div>

          {/* Component Inspection & Specs Panel (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Component Quick Selector Tabs */}
            <div className="p-3 rounded-xl border border-slate-800 bg-[#070b16]">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span>INSPECT {vehicleMode === 'full' ? 'FULL PLATFORM' : 'SUNNY SMALL'}</span>
                <span className="text-[10px] text-cyan-400">{currentComponents.length} SUB-SYSTEMS</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {currentComponents.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => selectComponent(comp)}
                    className={`text-left px-2.5 py-1.5 rounded text-xs font-mono truncate transition-colors ${
                      activeComponent.id === comp.id
                        ? 'bg-cyan-950/80 border border-cyan-500 text-cyan-200 shadow-sm'
                        : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Component Specification Card */}
            <div className="p-5 rounded-xl border border-cyan-900/50 bg-[#070d1c] shadow-lg relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  {activeComponent.category} MODULE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 bg-amber-950/30 text-amber-300">
                  {activeComponent.status}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-2">
                {activeComponent.name}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeComponent.description}
              </p>

              {/* Specs Table */}
              <div className="border-t border-slate-800/80 pt-3 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Preliminary Engineering Targets:
                </div>
                {activeComponent.specs.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-800/40 last:border-0">
                    <span className="text-slate-400">{s.label}</span>
                    <span className="text-cyan-300 font-medium tabular-nums">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>
                  {vehicleMode === 'full'
                    ? 'Values based on 155 kg target MTOM hover dynamics calculation.'
                    : 'Values based on Sunny Prototype ~24 kg ballasted testbed.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
