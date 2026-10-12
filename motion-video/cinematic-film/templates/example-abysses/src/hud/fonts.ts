import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

export const SERIF = loadSerif("normal", { weights: ["300", "400", "500"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const SERIF_ITALIC = loadSerif("italic", { weights: ["300", "400"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["300", "400", "500"], subsets: ["latin", "latin-ext"] }).fontFamily;
