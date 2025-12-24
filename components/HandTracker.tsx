import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { useStore } from '../store';
import { VISION_MODEL_ASSET_PATH, WASM_PATH } from '../constants';
import { GestureType } from '../types';

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [recognizer, setRecognizer] = useState<GestureRecognizer | null>(null);
  const [loaded, setLoaded] = useState(false);
  const requestRef = useRef<number>(0);
  
  const isCameraOpen = useStore((state) => state.isCameraOpen);
  const setGesture = useStore((state) => state.setGesture);
  const setPhase = useStore((state) => state.setPhase);
  const phase = useStore((state) => state.phase);

  // Initialize MediaPipe
  useEffect(() => {
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
        const recognizerInstance = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: VISION_MODEL_ASSET_PATH,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        setRecognizer(recognizerInstance);
        setLoaded(true);
      } catch (error) {
        console.error("Failed to load MediaPipe:", error);
      }
    };
    init();
  }, []);

  // Handle Camera Stream
  useEffect(() => {
    if (!isCameraOpen || !loaded || !videoRef.current) return;

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, loaded]);

  // Prediction Loop
  const predict = () => {
    if (recognizer && videoRef.current && videoRef.current.readyState === 4) {
      const results = recognizer.recognizeForVideo(videoRef.current, Date.now());
      
      if (results.gestures.length > 0) {
        const categoryName = results.gestures[0][0].categoryName;
        const score = results.gestures[0][0].score;

        if (score > 0.5) {
            let detectedGesture: GestureType = 'None';
            
            // Map MediaPipe names to our types
            if (categoryName === 'Open_Palm') detectedGesture = 'Open_Palm';
            if (categoryName === 'Closed_Fist') detectedGesture = 'Closed_Fist';
            if (categoryName === 'Pointing_Up') detectedGesture = 'Pointing_Up';

            setGesture(detectedGesture);

            // Phase Transition Logic based on Gestures
            if (detectedGesture === 'Open_Palm' && phase === 'tree') {
                setPhase('blooming');
            }
            if (detectedGesture === 'Closed_Fist' && phase === 'nebula') {
                setPhase('collapsing');
            }
        }
      } else {
        setGesture('None');
      }
    }
    requestRef.current = requestAnimationFrame(predict);
  };

  useEffect(() => {
    if (isCameraOpen && loaded) {
      requestRef.current = requestAnimationFrame(predict);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOpen, loaded, phase, recognizer]);

  if (!isCameraOpen) return null;

  return (
    <div className="absolute top-4 right-4 w-48 h-36 rounded-2xl overflow-hidden border border-white/20 bg-black/50 backdrop-blur-md shadow-lg z-50 transition-all duration-500">
        {!loaded && <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs">Loading AI...</div>}
        <video 
            ref={videoRef} 
            className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
            muted 
            playsInline
        />
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-mono">
            HAND TRACKING
        </div>
    </div>
  );
};

export default HandTracker;