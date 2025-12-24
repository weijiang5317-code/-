export type AppPhase = 'tree' | 'blooming' | 'nebula' | 'collapsing';

export type GestureType = 'None' | 'Open_Palm' | 'Closed_Fist' | 'Pointing_Up';

export interface PhotoData {
  id: number;
  url: string;
  title: string;
}

export interface ParticleData {
  initialPos: [number, number, number];
  nebulaPos: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}
