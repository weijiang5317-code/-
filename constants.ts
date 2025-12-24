// Replace these with your local assets if needed
// e.g. import myMusic from './assets/music.mp3';

export const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=christmas-magic-127540.mp3"; 

// To use your own photos:
// 1. Create a 'photos' folder in your 'public' directory.
// 2. Rename your images to 1.jpg, 2.jpg, etc.
// 3. Uncomment the 'url' lines pointing to /photos/ and comment out the Unsplash lines.

export const PHOTOS = [
  { id: 1, url: "https://images.unsplash.com/photo-1563241527-3004b7be0fee?auto=format&fit=crop&w=600", title: "Pink Bouquet" }, // url: "/photos/1.jpg"
  { id: 2, url: "https://images.unsplash.com/photo-1583093952416-8c4309c86918?auto=format&fit=crop&w=600", title: "Traditional Beauty" }, // url: "/photos/2.jpg"
  { id: 3, url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600", title: "365 Days" }, // url: "/photos/3.jpg"
  { id: 4, url: "https://images.unsplash.com/photo-1542296332-2e44a99cfef9?auto=format&fit=crop&w=600", title: "Snowy Night" }, // url: "/photos/4.jpg"
  { id: 5, url: "https://images.unsplash.com/photo-1516575150278-77136aed6920?auto=format&fit=crop&w=600", title: "Warm Embrace" }, // url: "/photos/5.jpg"
  { id: 6, url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600", title: "Night Stroll" }, // url: "/photos/6.jpg"
  { id: 7, url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?auto=format&fit=crop&w=600", title: "Sunset Heart" }, // url: "/photos/7.jpg"
  { id: 8, url: "https://images.unsplash.com/photo-1501854140884-074bf86ee911?auto=format&fit=crop&w=600", title: "Green Hills" }, // url: "/photos/8.jpg"
  { id: 9, url: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600", title: "Retro Love" }, // url: "/photos/9.jpg"
  { id: 10, url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600", title: "Flowers & Smiles" }, // url: "/photos/10.jpg"
  { id: 11, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600", title: "Beach Day" }, // url: "/photos/11.jpg"
  { id: 12, url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600", title: "Peace in Woods" }, // url: "/photos/12.jpg"
  { id: 13, url: "https://images.unsplash.com/photo-1621112904887-41553d46784e?auto=format&fit=crop&w=600", title: "Holding Hands" }, // url: "/photos/13.jpg"
  { id: 14, url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600", title: "Lakeside" }, // url: "/photos/14.jpg"
];

export const ORNAMENT_COLORS = [
  "#C5A059", // Retro Gold
  "#722F37", // Wine Red
  "#708090", // Slate Blue
  "#B76E79", // Rose Gold
  "#F7E7CE", // Champagne
];

export const TREE_PARTICLE_COUNT = 5000;
export const ORNAMENT_COUNT = 150;

// Vision task model
export const VISION_MODEL_ASSET_PATH = "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";
export const WASM_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm";