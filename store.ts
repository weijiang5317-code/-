import { create } from 'zustand';
import { AppPhase, GestureType, PhotoData } from './types';
import { PHOTOS, MUSIC_URL } from './constants';

interface AppState {
  phase: AppPhase;
  gesture: GestureType;
  isCameraOpen: boolean;
  activePhotoIndex: number;
  centerText: string;
  
  // Dynamic Assets
  photos: PhotoData[];
  musicUrl: string;
  
  setPhase: (phase: AppPhase) => void;
  setGesture: (gesture: GestureType) => void;
  toggleCamera: () => void;
  setActivePhotoIndex: (index: number) => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
  setCenterText: (text: string) => void;

  // Upload Actions
  setCustomPhotos: (files: FileList) => void;
  setCustomMusic: (file: File) => void;
}

export const useStore = create<AppState>((set) => ({
  phase: 'tree',
  gesture: 'None',
  isCameraOpen: true,
  activePhotoIndex: -1,
  centerText: "To Ms.Si—愿光与雪都落在你心上",

  // Initialize with defaults from constants
  photos: PHOTOS,
  musicUrl: MUSIC_URL,

  setPhase: (phase) => set({ phase }),
  setGesture: (gesture) => set({ gesture }),
  toggleCamera: () => set((state) => ({ isCameraOpen: !state.isCameraOpen })),
  setActivePhotoIndex: (index) => set({ activePhotoIndex: index }),
  nextPhoto: () => set((state) => ({ activePhotoIndex: state.activePhotoIndex + 1 })), 
  prevPhoto: () => set((state) => ({ activePhotoIndex: state.activePhotoIndex - 1 })),
  setCenterText: (text) => set({ centerText: text }),

  setCustomPhotos: (files) => set((state) => {
    // Convert FileList to PhotoData array with Blob URLs
    const newPhotos: PhotoData[] = Array.from(files).map((file, index) => ({
        id: Date.now() + index + Math.random(),
        url: URL.createObjectURL(file),
        title: file.name.split('.')[0]
    }));
    
    // Check if we are currently using the default constants
    const isDefault = state.photos === PHOTOS;

    return { photos: isDefault ? newPhotos : [...state.photos, ...newPhotos] };
  }),

  setCustomMusic: (file) => {
      const newUrl = URL.createObjectURL(file);
      set({ musicUrl: newUrl });
  }
}));