import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, CameraControls, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import ChristmasTree from './ChristmasTree';

const Scene: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 25], fov: 45 }}
      dpr={[1, 2]} // Optimization for varying pixel ratios
      gl={{ preserveDrawingBuffer: true, antialias: false, alpha: false, stencil: false, depth: true }}
    >
      <color attach="background" args={['#050505']} />
      
      {/* --- Environment & Lighting --- */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={[20, 20, 20]} size={2} speed={0.5} opacity={0.5} color="#ffffff" />
      
      {/* Warm Key Light */}
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffaa55" />
      {/* Cool Fill Light */}
      <pointLight position={[-10, 0, -10]} intensity={1} color="#55aaff" />
      {/* Divine Top Spot */}
      <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={5} castShadow color="#ffffff" />

      {/* HDR Environment for PBR Reflections */}
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ChristmasTree />
      </Suspense>

      {/* --- Post Processing --- */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>

      {/* --- Controls --- */}
      <CameraControls 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.5} 
        minDistance={10}
        maxDistance={40}
        dollySpeed={0.5}
        truckSpeed={0}
      />
    </Canvas>
  );
};

export default Scene;
