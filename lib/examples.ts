/**
 * Video Examples Module
 * 
 * This module provides the VideoExample interface and functions to match prompts to video examples.
 * 
 * Video analysis data is stored in separate files in the `video-analyses/` folder.
 * To add a new video:
 * 1. Create a new file in `lib/video-analyses/` (e.g., `my-video.ts`)
 * 2. Export a VideoExample object from that file
 * 3. Import and add it to the VIDEO_ANALYSES array in `lib/video-analyses/index.ts`
 */

import { AttributionResult, SafetyResult } from './models';
import { VIDEO_ANALYSES } from './video-analyses';

export interface VideoExample {
  id: string;
  name: string;
  promptPattern: string; // Pattern to match user prompt
  promptKeywords: string[]; // Keywords that indicate this example
  video: {
    path: string;
    duration: number;
    resolution: string;
    description: string;
  };
  results: {
    retrieved_context: {
      retrieved_ips: Array<{
        id: string;
        type: string;
        owner: string;
        name: string;
        relevance_score: number;
      }>;
      retrieval_method: string;
      timestamp: string;
    };
    initial_attribution: AttributionResult;
    pre_gen_safety: SafetyResult;
    augmented_prompt: string;
    generated_video: {
      video_path: string;
      duration: number;
      resolution: string;
      model_used: string;
      timestamp: string;
    };
    post_gen_safety: SafetyResult;
    final_attribution: AttributionResult;
    video_analysis: {
      analysis: string;
      detected_objects: string[];
      detected_brands: string[];
      timestamp: string;
    };
    video_metrics: {
      frames_analyzed: number;
      embedding_matches: number;
    };
  };
}

/**
 * All video examples - imported from video-analyses folder
 * Video analysis data is stored in separate files for easier management
 */
export const VIDEO_EXAMPLES: VideoExample[] = VIDEO_ANALYSES;

/**
 * Match user prompt to the best example
 */
export function matchPromptToExample(userPrompt: string): VideoExample | null {
  const lowerPrompt = userPrompt.toLowerCase();
  
  // Score each example based on keyword matches
  const scored = VIDEO_EXAMPLES.map(example => {
    let score = 0;
    example.promptKeywords.forEach(keyword => {
      if (lowerPrompt.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    return { example, score };
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Return the best match if score > 0, otherwise return first example as default
  if (scored[0].score > 0) {
    return scored[0].example;
  }

  // Default to first example if no match
  return VIDEO_EXAMPLES[0];
}

/**
 * Get example by ID
 */
export function getExampleById(id: string): VideoExample | null {
  return VIDEO_EXAMPLES.find(ex => ex.id === id) || null;
}

