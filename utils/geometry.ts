import * as THREE from 'three';

// Generate a random point inside a cone (Tree Shape)
export const getConePoint = (height: number, radius: number): THREE.Vector3 => {
  const y = Math.random() * height; // Height from bottom (0 to height)
  const rAtY = (1 - y / height) * radius; // Radius at this height
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * rAtY; // Uniform distribution in circle

  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  
  // Center the cone vertically
  return new THREE.Vector3(x, y - height / 2, z);
};

// Generate a random point on a spiral for ornaments
export const getSpiralPoint = (t: number, height: number, radius: number, turns: number): THREE.Vector3 => {
  const y = t * height - (height / 2);
  const rAtY = (1 - t) * radius;
  const angle = t * Math.PI * 2 * turns;
  
  const x = Math.cos(angle) * rAtY;
  const z = Math.sin(angle) * rAtY;

  return new THREE.Vector3(x, y, z);
};

// Generate a point in a ring/nebula shape
export const getNebulaPoint = (minRadius: number, maxRadius: number): THREE.Vector3 => {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * (maxRadius - minRadius) + minRadius;
  const heightSpread = (Math.random() - 0.5) * 4; // Flat-ish disk
  
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  
  return new THREE.Vector3(x, heightSpread, z);
};
