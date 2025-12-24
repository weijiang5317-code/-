import React, { useLayoutEffect, useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useStore } from '../store';
import { ORNAMENT_COLORS, ORNAMENT_COUNT, TREE_PARTICLE_COUNT } from '../constants';
import { getConePoint, getNebulaPoint, getSpiralPoint } from '../utils/geometry';

// Reusable dummy object for matrix calculations
const dummy = new THREE.Object3D();
const tempVec3 = new THREE.Vector3();
const mouseVec = new THREE.Vector3();

// Define a 5-pointed Star Shape
const starShape = new THREE.Shape();
const points = 5;
const outerRadius = 0.8;
const innerRadius = 0.4;
for (let i = 0; i < points * 2; i++) {
  const angle = (i * Math.PI) / points - Math.PI / 2;
  const r = i % 2 === 0 ? outerRadius : innerRadius;
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  if (i === 0) starShape.moveTo(x, y);
  else starShape.lineTo(x, y);
}
starShape.closePath();

// --- Sub-component: Photo Item ---
interface PhotoItemProps {
  data: any;
  index: number;
  totalCount: number;
  phase: string;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ data, index, totalCount, phase }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [aspect, setAspect] = useState(1);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Logic Changed: Photos now live ON THE SPIRAL in tree mode, dispersed among ornaments
  const treePos = useMemo(() => {
     // We map the photo index to a 't' value (0 to 1) for the spiral, similar to ornaments
     // Offset slightly so they don't sit exactly on ornaments
     const t = (index / totalCount) * 0.9 + 0.05; 
     // Use same spiral logic: height=14, baseRadius=6, turns=6
     // Add a slight radius offset (+0.5) so they float just outside the ornaments
     return getSpiralPoint(t, 14, 6.5, 6); 
  }, [index, totalCount]);
  
  const nebulaPos = useMemo(() => {
    const angle = (index / totalCount) * Math.PI * 2;
    const radius = Math.max(18, 12 + (totalCount * 0.5));
    return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  }, [index, totalCount]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "Anonymous";
    loader.load(
      data.url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setAspect(tex.image.width / tex.image.height);
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load image: ${data.url}`);
      }
    );
  }, [data.url]);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (phase === 'nebula') {
        groupRef.current.lookAt(0, 0, 0);
        groupRef.current.position.y = nebulaPos.y + Math.sin(state.clock.elapsedTime + index) * 0.5;
    } else if (phase === 'tree') {
         // Slight hover effect on tree
         groupRef.current.lookAt(new THREE.Vector3(0, groupRef.current.position.y, 0));
         // Rotate photo to face outward
         groupRef.current.rotateY(Math.PI); 
    }
  });
  
  useLayoutEffect(() => {
     if (!groupRef.current) return;
     
     if (phase === 'tree' || phase === 'collapsing') {
         gsap.to(groupRef.current.position, {
             x: treePos.x, y: treePos.y, z: treePos.z,
             duration: 2,
             ease: "power3.inOut"
         });
         // Scale down slightly on tree compared to nebula, but visible
         gsap.to(groupRef.current.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 1.5 });
     } else if (phase === 'blooming' || phase === 'nebula') {
         gsap.to(groupRef.current.position, {
             x: nebulaPos.x, y: nebulaPos.y, z: nebulaPos.z,
             duration: 2.5,
             ease: "elastic.out(1, 0.5)",
             delay: 0.5
         });
         gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 2, delay: 0.5 });
     }
  }, [phase, nebulaPos, treePos]);

  const isLandscape = aspect > 1;
  const frameWidth = isLandscape ? 4.2 : 3.2;
  const frameHeight = isLandscape ? 3.5 : 4.5;
  const imgScale = isLandscape ? [3.8, 2.8, 1] as [number, number, number] : [2.8, 3.8, 1] as [number, number, number];

  return (
    <group ref={groupRef} position={treePos} scale={[0,0,0]}>
        <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[frameWidth, frameHeight]} />
            <meshStandardMaterial color="#fff" roughness={0.2} metalness={0.1} />
        </mesh>
        
        {texture && (
          <mesh position={[0, 0.2, 0.05]} scale={imgScale}>
             <planeGeometry args={[1, 1]} />
             <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
          </mesh>
        )}
    </group>
  );
};

const ChristmasTree: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const ornamentsRef = useRef<THREE.InstancedMesh>(null);
  const goldenParticlesRef = useRef<THREE.InstancedMesh>(null); // New Ref for Golden Particles
  const groupRef = useRef<THREE.Group>(null);
  
  const phase = useStore((state) => state.phase);
  const setPhase = useStore((state) => state.setPhase);
  const gesture = useStore((state) => state.gesture);
  const photos = useStore((state) => state.photos);
  const { viewport } = useThree();

  // --- Data Generation ---
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < TREE_PARTICLE_COUNT; i++) {
        const tPos = getConePoint(14, 6);
        const nPos = getNebulaPoint(10, 25);
        
        temp.push({
            treePos: tPos,
            nebulaPos: nPos,
            scale: Math.random() * 0.15 + 0.05,
            color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.5) 
        });
    }
    return temp;
  }, []);

  const ornaments = useMemo(() => {
    const temp = [];
    for (let i = 0; i < ORNAMENT_COUNT; i++) {
        const t = i / ORNAMENT_COUNT;
        const tPos = getSpiralPoint(t, 14, 6, 6); 
        const nPos = getNebulaPoint(15, 30);
        const color = ORNAMENT_COLORS[Math.floor(Math.random() * ORNAMENT_COLORS.length)];
        temp.push({ tPos, nPos, color });
    }
    return temp;
  }, []);

  // Generate many small golden particles around ornaments
  const GOLDEN_COUNT = ORNAMENT_COUNT * 4;
  const goldenData = useMemo(() => {
      const temp = [];
      for(let i=0; i < GOLDEN_COUNT; i++) {
          const ornamentIndex = Math.floor(i / 4);
          // Random offset from the parent ornament
          const offset = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)).normalize().multiplyScalar(0.4 + Math.random()*0.4);
          temp.push({ ornamentIndex, offset });
      }
      return temp;
  }, [GOLDEN_COUNT]);

  const transitionProgress = useRef(0);
  const nebulaRotation = useRef(0);

  // --- Animation Logic ---

  useLayoutEffect(() => {
    if (phase === 'blooming') {
        gsap.to(transitionProgress, {
            current: 1,
            duration: 2.5,
            ease: "power4.out",
            onComplete: () => setPhase('nebula')
        });
    } else if (phase === 'collapsing') {
        gsap.to(transitionProgress, {
            current: 0,
            duration: 2,
            ease: "power3.inOut",
            onComplete: () => setPhase('tree')
        });
    }
  }, [phase, setPhase]);

  useFrame((state) => {
    if (!meshRef.current || !ornamentsRef.current || !groupRef.current || !goldenParticlesRef.current) return;

    const time = state.clock.getElapsedTime();
    const isTree = transitionProgress.current < 0.1;
    mouseVec.set(state.pointer.x * viewport.width / 2, state.pointer.y * viewport.height / 2, 0);

    // 1. Update Green Particles
    for (let i = 0; i < TREE_PARTICLE_COUNT; i++) {
        const { treePos, nebulaPos, scale } = particles[i];
        tempVec3.lerpVectors(treePos, nebulaPos, transitionProgress.current);

        if (isTree) {
            const dist = tempVec3.distanceTo(mouseVec);
            if (dist < 3) {
                const force = (3 - dist) * 1.5;
                const dir = tempVec3.clone().sub(mouseVec).normalize().multiplyScalar(force);
                tempVec3.add(new THREE.Vector3(dir.x, dir.y, dir.z * 0.5)); 
            }
            tempVec3.y += Math.sin(time * 2 + treePos.x) * 0.1;
        } 
        
        if (!isTree) {
            const angle = time * 0.1 + nebulaRotation.current;
            tempVec3.y += Math.sin(time + nebulaPos.x) * 0.2;
        }

        dummy.position.copy(tempVec3);
        let currentScale = scale;
        if (phase === 'blooming') currentScale *= (1 + Math.sin(transitionProgress.current * Math.PI) * 2);
        
        dummy.scale.setScalar(currentScale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // 2. Update Ornaments & Golden Particles
    // First, map orbit positions for golden particles
    for (let i = 0; i < ORNAMENT_COUNT; i++) {
        const { tPos, nPos } = ornaments[i];
        // Calculate ornament current pos
        const currentPos = new THREE.Vector3().lerpVectors(tPos, nPos, transitionProgress.current);
        
        // Interaction logic for ornaments
        if (isTree) {
             const dist = currentPos.distanceTo(mouseVec);
             if (dist < 3) {
                 const force = (3 - dist) * 2;
                 const dir = currentPos.clone().sub(mouseVec).normalize().multiplyScalar(force);
                 currentPos.add(dir);
             }
        }

        dummy.position.copy(currentPos);
        dummy.scale.setScalar(0.4); 
        dummy.updateMatrix();
        ornamentsRef.current.setMatrixAt(i, dummy.matrix);

        // Update associated golden particles
        for(let j=0; j<4; j++) {
            const goldenIdx = i*4 + j;
            if(goldenIdx < GOLDEN_COUNT) {
                const { offset } = goldenData[goldenIdx];
                // Rotate offset slightly for "orbiting" effect
                const rotOffset = offset.clone().applyAxisAngle(new THREE.Vector3(0,1,0), time * 2);
                
                tempVec3.copy(currentPos).add(rotOffset);
                
                // Add sparkle breathing
                const breathe = 1 + Math.sin(time * 5 + goldenIdx) * 0.3;
                
                dummy.position.copy(tempVec3);
                dummy.scale.setScalar(0.08 * breathe); 
                dummy.updateMatrix();
                goldenParticlesRef.current.setMatrixAt(goldenIdx, dummy.matrix);
            }
        }
    }
    ornamentsRef.current.instanceMatrix.needsUpdate = true;
    goldenParticlesRef.current.instanceMatrix.needsUpdate = true;

    // 3. Global Rotation
    if (phase === 'nebula') {
        if (gesture === 'Open_Palm') {
             groupRef.current.rotation.y += 0.01;
        } else {
             groupRef.current.rotation.y += 0.002;
        }
    } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
    }
  });

  useLayoutEffect(() => {
     if(ornamentsRef.current) {
         for(let i=0; i<ORNAMENT_COUNT; i++) {
             ornamentsRef.current.setColorAt(i, new THREE.Color(ornaments[i].color));
         }
         ornamentsRef.current.instanceColor!.needsUpdate = true;
     }
  }, [ornaments]);

  return (
    <group ref={groupRef}>
      {/* Tree Particles - Brighter Green */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, TREE_PARTICLE_COUNT]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
            color="#4ade80" 
            emissive="#2d5a27" 
            emissiveIntensity={0.2}
            roughness={0.4} 
            metalness={0.1} 
        />
      </instancedMesh>

      {/* Ornaments */}
      <instancedMesh ref={ornamentsRef} args={[undefined, undefined, ORNAMENT_COUNT]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial roughness={0.1} metalness={0.8} />
      </instancedMesh>

      {/* Golden Particles - New */}
      <instancedMesh ref={goldenParticlesRef} args={[undefined, undefined, GOLDEN_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={3} toneMapped={false} />
      </instancedMesh>

      <group visible={phase === 'tree' || phase === 'collapsing'}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[0, 7.5, 0]}>
                <extrudeGeometry args={[starShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05, bevelSegments: 2 }]} />
                <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            <Sparkles position={[0, 7.5, 0]} count={20} scale={3} size={4} speed={0.4} opacity={1} color="#FFF" />
        </Float>
      </group>

      {photos.map((photo, i) => (
          <PhotoItem key={photo.id} data={photo} index={i} totalCount={photos.length} phase={phase} />
      ))}
    </group>
  );
};

export default ChristmasTree;