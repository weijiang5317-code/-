import React from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import HandTracker from './components/HandTracker';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Overlay Layer */}
      <UI />

      {/* Hand Tracker Logic & Preview */}
      <HandTracker />
    </div>
  );
};

export default App;
