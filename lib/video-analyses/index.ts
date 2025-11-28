/**
 * Video Analysis Index
 * 
 * This file exports all video analysis data from individual files.
 * To add a new video analysis:
 * 1. Create a new file in this folder (e.g., `my-video.ts`)
 * 2. Export a VideoExample object from that file
 * 3. Import and add it to the array below
 */

import { VideoExample } from '../examples';
import { spidermanDoomAnalysis } from './spiderman-doom';
import { baahubaliBattleAnalysis } from './baahubali-battle';
import { fordGt40Analysis } from './ford-gt40';
import { mcdonaldsAnalysis } from './mcdonalds';
import { samsungGalaxyAnalysis } from './samsung-galaxy';

/**
 * Array of all video analyses
 * Add new video analyses here by importing and including them in this array
 */
export const VIDEO_ANALYSES: VideoExample[] = [
  spidermanDoomAnalysis,
  baahubaliBattleAnalysis,
  fordGt40Analysis,
  mcdonaldsAnalysis,
  samsungGalaxyAnalysis,
];

/**
 * Get video analysis by ID
 */
export function getVideoAnalysisById(id: string): VideoExample | null {
  return VIDEO_ANALYSES.find(analysis => analysis.id === id) || null;
}

/**
 * Get video analysis by video path
 */
export function getVideoAnalysisByPath(path: string): VideoExample | null {
  return VIDEO_ANALYSES.find(analysis => analysis.video.path === path) || null;
}

