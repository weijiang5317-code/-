import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store';
import { GestureType, AppPhase } from '../types';

// Icons
const SnowflakeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
    <path d="M12 2v0M12 22v0M2 12h0M22 12h0" strokeLinecap="round" strokeWidth="3" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MusicIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="16" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8.5" cy="8.5" r="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AudioPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const musicUrl = useStore((state) => state.musicUrl);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if(isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Autoplay prevented:", error);
                        setIsPlaying(false);
                    });
                }
            }
        }
    }, [musicUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.error("Playback failed:", error);
                });
            }
        }
    };

    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto z-20">
            <audio ref={audioRef} src={musicUrl} loop />
            
            <div 
                onClick={togglePlay}
                className={`relative group cursor-pointer flex items-center gap-4 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-500
                ${isPlaying ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-[pulse_3s_infinite]' : 'bg-black/30 hover:bg-white/10'}
            `}>
                <div className={`text-white transition-transform duration-[3s] linear ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                    <SnowflakeIcon className="w-6 h-6" />
                </div>
                
                <div className="overflow-hidden w-48">
                    <div className={`whitespace-nowrap text-white/90 text-sm font-light ${isPlaying ? 'animate-marquee' : ''}`}>
                       {musicUrl.startsWith('blob') ? 'Playing Custom Music' : 'Merry Christmas Mr. Lawrence - Ryuichi Sakamoto (Cover)'}
                    </div>
                </div>

                {/* Equalizer Visualizer */}
                <div className="flex gap-1 h-4 items-end">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`w-1 bg-white/80 rounded-t-sm transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-1'}`} style={{ height: isPlaying ? `${Math.random()*100}%` : '4px', animationDelay: `${i*0.1}s` }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const getInstructions = (phase: AppPhase, gesture: GestureType) => {
    if (phase === 'tree') return "Show 'OPEN PALM' to bloom.";
    if (phase === 'nebula') return "Show 'OPEN PALM' to rotate. 'CLOSED FIST' to reset.";
    if (phase === 'blooming') return "Magic happening...";
    return "Resetting...";
};

const UI: React.FC = () => {
    const phase = useStore((state) => state.phase);
    const gesture = useStore((state) => state.gesture);
    const toggleCamera = useStore((state) => state.toggleCamera);
    const isCameraOpen = useStore((state) => state.isCameraOpen);
    const setCustomPhotos = useStore((state) => state.setCustomPhotos);
    const setCustomMusic = useStore((state) => state.setCustomMusic);
    const centerText = useStore((state) => state.centerText);
    const setCenterText = useStore((state) => state.setCenterText);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isEditingText, setIsEditingText] = useState(false);
    const [tempText, setTempText] = useState(centerText);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const musicInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCustomPhotos(e.target.files);
        }
    };

    const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCustomMusic(e.target.files[0]);
        }
    };

    const handleTextSave = () => {
        setCenterText(tempText);
        setIsEditingText(false);
    };

    return (
        <div className="absolute inset-0 pointer-events-none select-none z-10">
            {/* Header / Title - Moved down to top-20 */}
            <div className="absolute top-20 w-full text-center pointer-events-none z-30">
                 <h1 className="font-cursive text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#b8860b] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] opacity-90 whitespace-nowrap">
                    Merry Christmas
                 </h1>
            </div>

            {/* Center Text Message */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0 w-full px-4">
                <h2 className="text-3xl md:text-5xl font-handwriting text-transparent bg-clip-text bg-gradient-to-r from-[#fbc2eb] via-[#ffd700] to-[#fbc2eb] drop-shadow-[0_0_12px_rgba(251,194,235,0.6)] leading-relaxed tracking-wider break-words">
                   {centerText}
                </h2>
            </div>

            {/* Collapsible Control Panel */}
            <div className={`absolute top-36 left-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto transition-all duration-500 ease-in-out ${isCollapsed ? 'w-16 h-12 overflow-hidden' : 'w-72'}`}>
                
                {/* Header Row */}
                <div className="flex justify-between items-center mb-2">
                    <div className={`flex items-center gap-2 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <h2 className="text-white font-semibold text-sm">Control Center</h2>
                        <div className="flex items-center gap-1">
                             <span className={`w-1.5 h-1.5 rounded-full ${gesture !== 'None' ? 'bg-green-400 shadow-[0_0_5px_#4ade80]' : 'bg-red-400'}`}></span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded-full hover:bg-white/10 text-white/70 transition-colors absolute right-3 top-3"
                    >
                        {isCollapsed ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
                    </button>
                </div>
                
                {!isCollapsed && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                        <p className="text-white/60 text-[10px] leading-relaxed">
                            {getInstructions(phase, gesture)}
                        </p>

                        {/* Text Editor */}
                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-white/50 uppercase tracking-wider">Center Text</span>
                                <button onClick={() => setIsEditingText(!isEditingText)} className="text-white/70 hover:text-white">
                                    <EditIcon className="w-3 h-3" />
                                </button>
                            </div>
                            {isEditingText ? (
                                <div className="flex flex-col gap-1">
                                    <input 
                                        type="text" 
                                        value={tempText}
                                        onChange={(e) => setTempText(e.target.value)}
                                        className="w-full bg-black/30 text-white text-xs p-1 rounded border border-white/10 focus:outline-none focus:border-indigo-400"
                                    />
                                    <button onClick={handleTextSave} className="bg-indigo-500/80 hover:bg-indigo-500 text-white text-[10px] py-0.5 rounded">Save</button>
                                </div>
                            ) : (
                                <p className="text-white/90 text-xs truncate italic">{centerText}</p>
                            )}
                        </div>

                        <button 
                            onClick={toggleCamera}
                            className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-[10px] font-semibold transition-colors border border-white/5 flex items-center justify-center gap-2"
                        >
                            {isCameraOpen ? 'CLOSE CAMERA' : 'OPEN CAMERA'}
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <input type="file" multiple accept="image/*" className="hidden" ref={photoInputRef} onChange={handlePhotoUpload}/>
                            <button onClick={() => photoInputRef.current?.click()} className="py-2 px-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-white/70 hover:text-white hover:border-indigo-400/30 text-[10px] font-semibold transition-all border border-white/5 flex flex-col items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>Add Photos</span>
                            </button>

                            <input type="file" accept="audio/*" className="hidden" ref={musicInputRef} onChange={handleMusicUpload}/>
                            <button onClick={() => musicInputRef.current?.click()} className="py-2 px-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-white hover:border-rose-400/30 text-[10px] font-semibold transition-all border border-white/5 flex flex-col items-center gap-1">
                                <MusicIcon className="w-3 h-3" />
                                <span>Change Music</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AudioPlayer />
            
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default UI;