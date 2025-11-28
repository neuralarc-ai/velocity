import { VideoExample } from '../examples';

export const mcdonaldsAnalysis: VideoExample = {
  id: 'example_4',
  name: 'McDonald\'s Food Ad',
  promptPattern: 'mcdonald|burger|fast food|fries|restaurant|mcd',
  promptKeywords: ['mcdonald', 'burger', 'fast food', 'fries', 'restaurant', 'mcd'],
  video: {
    path: '/videos/example_4_mcdonalds.mp4',
    duration: 5.8,
    resolution: '1080p',
    description: 'McDonald\'s burger and fries with golden arches logo',
  },
  results: {
    retrieved_context: {
      retrieved_ips: [
        {
          id: 'ip_007',
          type: 'logo',
          owner: 'McDonald\'s',
          name: 'Golden Arches',
          relevance_score: 0.93,
        },
        {
          id: 'ip_008',
          type: 'product',
          owner: 'McDonald\'s',
          name: 'Big Mac',
          relevance_score: 0.87,
        },
      ],
      retrieval_method: 'vector_similarity',
      timestamp: new Date().toISOString(),
    },
    initial_attribution: {
      total_score: 0.82,
      confidence: 0.91,
      ip_attributions: { 'McDonald\'s': 0.62, 'Burger King': 0.20 },
      calculation_type: 'initial',
      algorithm_used: 'weighted_average',
      details: { visual_weight: 0.6, audio_weight: 0.3, temporal_weight: 0.1 },
      timestamp: new Date().toISOString(),
    },
    pre_gen_safety: {
      passed: true,
      check_type: 'pre_generation',
      violations: [],
      violation_details: [],
      contamination_score: 0.0,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { license_verified: true },
    },
    augmented_prompt: 'McDonald\'s burger and fries with golden arches logo featuring Golden Arches and Big Mac',
    generated_video: {
      video_path: '/videos/example_4_mcdonalds.mp4',
      duration: 5.8,
      resolution: '1080p',
      model_used: 'ltx-video',
      timestamp: new Date().toISOString(),
    },
    post_gen_safety: {
      passed: true,
      check_type: 'post_generation',
      violations: [],
      violation_details: [],
      contamination_score: 0.025,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { unauthorized_ip_detected: false },
    },
    final_attribution: {
      total_score: 0.78,
      confidence: 0.89,
      ip_attributions: { 'McDonald\'s': 0.60, 'Burger King': 0.20 },
      calculation_type: 'final',
      algorithm_used: 'weighted_average',
      variance_from_initial: -0.02,
      details: { visual_match: 0.82, audio_match: 0.0, temporal_match: 0.78 },
      timestamp: new Date().toISOString(),
    },
    video_analysis: {
      analysis: 'Video displays McDonald\'s food products, Golden Arches logo visible on packaging and signage, burger and fries featured, appetizing food photography, duration 5.8 seconds',
      detected_objects: ['burger', 'fries', 'logo', 'packaging', 'food', 'restaurant'],
      detected_brands: ['McDonald\'s'],
      timestamp: new Date().toISOString(),
    },
    video_metrics: {
      frames_analyzed: 174,
      embedding_matches: 172,
    },
  },
};

