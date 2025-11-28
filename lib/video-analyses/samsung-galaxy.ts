import { VideoExample } from '../examples';

export const samsungGalaxyAnalysis: VideoExample = {
  id: 'example_5',
  name: 'Samsung Galaxy Ad',
  promptPattern: 'samsung|galaxy|android|phone|smartphone|samsung phone',
  promptKeywords: ['samsung', 'galaxy', 'android', 'phone', 'smartphone'],
  video: {
    path: '/videos/example_5_samsung.mp4',
    duration: 6.2,
    resolution: '1080p',
    description: 'Samsung Galaxy smartphone with Samsung branding',
  },
  results: {
    retrieved_context: {
      retrieved_ips: [
        {
          id: 'ip_009',
          type: 'logo',
          owner: 'Samsung',
          name: 'Samsung Logo',
          relevance_score: 0.90,
        },
        {
          id: 'ip_010',
          type: 'product',
          owner: 'Samsung',
          name: 'Galaxy Phone',
          relevance_score: 0.86,
        },
      ],
      retrieval_method: 'vector_similarity',
      timestamp: new Date().toISOString(),
    },
    initial_attribution: {
      total_score: 0.84,
      confidence: 0.92,
      ip_attributions: { Samsung: 0.64, Apple: 0.20 },
      calculation_type: 'initial',
      algorithm_used: 'weighted_average',
      details: { visual_weight: 0.65, audio_weight: 0.25, temporal_weight: 0.1 },
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
    augmented_prompt: 'Samsung Galaxy smartphone with Samsung branding featuring Samsung Logo and Galaxy Phone',
    generated_video: {
      video_path: '/videos/example_5_samsung.mp4',
      duration: 6.2,
      resolution: '1080p',
      model_used: 'ltx-video',
      timestamp: new Date().toISOString(),
    },
    post_gen_safety: {
      passed: true,
      check_type: 'post_generation',
      violations: [],
      violation_details: [],
      contamination_score: 0.015,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { unauthorized_ip_detected: false },
    },
    final_attribution: {
      total_score: 0.81,
      confidence: 0.90,
      ip_attributions: { Samsung: 0.63, Apple: 0.20 },
      calculation_type: 'final',
      algorithm_used: 'weighted_average',
      variance_from_initial: -0.01,
      details: { visual_match: 0.85, audio_match: 0.0, temporal_match: 0.81 },
      timestamp: new Date().toISOString(),
    },
    video_analysis: {
      analysis: 'Video showcases Samsung Galaxy smartphone, Samsung logo visible on device and screen, modern design features highlighted, technology demonstration, duration 6.2 seconds',
      detected_objects: ['smartphone', 'logo', 'screen', 'device', 'technology'],
      detected_brands: ['Samsung'],
      timestamp: new Date().toISOString(),
    },
    video_metrics: {
      frames_analyzed: 186,
      embedding_matches: 184,
    },
  },
};

