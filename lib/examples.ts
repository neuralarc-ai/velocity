/**
 * Pre-defined Video Examples with Hardcoded Outputs
 * Each example has a prompt pattern, video, and complete hardcoded results
 */

import { PipelineResult, AttributionResult, SafetyResult } from './models';

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

export const VIDEO_EXAMPLES: VideoExample[] = [
  {
    id: 'example_1',
    name: 'Nike Athletic Video',
    promptPattern: 'athlete|running|sport|nike|shoes|track',
    promptKeywords: ['athlete', 'running', 'nike', 'shoes', 'track', 'sport'],
    video: {
      path: '/videos/example_1_nike_athlete.mp4',
      duration: 5.2,
      resolution: '1080p',
      description: 'Professional athlete wearing Nike shoes running on a track',
    },
    results: {
      retrieved_context: {
        retrieved_ips: [
          {
            id: 'ip_001',
            type: 'logo',
            owner: 'Nike',
            name: 'Nike Swoosh Logo',
            relevance_score: 0.95,
          },
          {
            id: 'ip_002',
            type: 'product',
            owner: 'Nike',
            name: 'Nike Running Shoes',
            relevance_score: 0.88,
          },
        ],
        retrieval_method: 'vector_similarity',
        timestamp: new Date().toISOString(),
      },
      initial_attribution: {
        total_score: 0.87,
        confidence: 0.94,
        ip_attributions: { Nike: 0.65, Adidas: 0.22 },
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
      augmented_prompt: 'Professional athlete wearing Nike shoes running on a track featuring Nike Swoosh Logo and Nike Running Shoes',
      generated_video: {
        video_path: '/videos/example_1_nike_athlete.mp4',
        duration: 5.2,
        resolution: '1080p',
        model_used: 'ltx-video',
        timestamp: new Date().toISOString(),
      },
      post_gen_safety: {
        passed: true,
        check_type: 'post_generation',
        violations: [],
        violation_details: [],
        contamination_score: 0.02,
        contamination_threshold: 0.05,
        timestamp: new Date().toISOString(),
        details: { unauthorized_ip_detected: false },
      },
      final_attribution: {
        total_score: 0.86,
        confidence: 0.92,
        ip_attributions: { Nike: 0.64, Adidas: 0.22 },
        calculation_type: 'final',
        algorithm_used: 'weighted_average',
        variance_from_initial: -0.01,
        details: { visual_match: 0.88, audio_match: 0.0, temporal_match: 0.85 },
        timestamp: new Date().toISOString(),
      },
      video_analysis: {
        analysis: 'Video contains a professional athlete running on a track, Nike logo prominently visible on shoes and apparel, athletic shoe product featured throughout, duration 5.2 seconds',
        detected_objects: ['person', 'running_shoes', 'track', 'logo', 'athletic_apparel'],
        detected_brands: ['Nike'],
        timestamp: new Date().toISOString(),
      },
      video_metrics: {
        frames_analyzed: 156,
        embedding_matches: 154,
      },
    },
  },
  {
    id: 'example_2',
    name: 'Coca-Cola Commercial',
    promptPattern: 'cola|drink|beverage|coca|soda|refreshment',
    promptKeywords: ['cola', 'coca', 'drink', 'beverage', 'soda', 'refreshment'],
    video: {
      path: '/videos/example_2_coca_cola.mp4',
      duration: 6.5,
      resolution: '1080p',
      description: 'People enjoying Coca-Cola drinks at a party',
    },
    results: {
      retrieved_context: {
        retrieved_ips: [
          {
            id: 'ip_003',
            type: 'logo',
            owner: 'Coca-Cola',
            name: 'Coca-Cola Logo',
            relevance_score: 0.92,
          },
          {
            id: 'ip_004',
            type: 'product',
            owner: 'Coca-Cola',
            name: 'Coca-Cola Bottle',
            relevance_score: 0.85,
          },
        ],
        retrieval_method: 'vector_similarity',
        timestamp: new Date().toISOString(),
      },
      initial_attribution: {
        total_score: 0.78,
        confidence: 0.89,
        ip_attributions: { 'Coca-Cola': 0.58, 'Pepsi': 0.20 },
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
      augmented_prompt: 'People enjoying Coca-Cola drinks at a party featuring Coca-Cola Logo and Coca-Cola Bottle',
      generated_video: {
        video_path: '/videos/example_2_coca_cola.mp4',
        duration: 6.5,
        resolution: '1080p',
        model_used: 'ltx-video',
        timestamp: new Date().toISOString(),
      },
      post_gen_safety: {
        passed: true,
        check_type: 'post_generation',
        violations: [],
        violation_details: [],
        contamination_score: 0.03,
        contamination_threshold: 0.05,
        timestamp: new Date().toISOString(),
        details: { unauthorized_ip_detected: false },
      },
      final_attribution: {
        total_score: 0.76,
        confidence: 0.87,
        ip_attributions: { 'Coca-Cola': 0.56, 'Pepsi': 0.20 },
        calculation_type: 'final',
        algorithm_used: 'weighted_average',
        variance_from_initial: -0.02,
        details: { visual_match: 0.78, audio_match: 0.0, temporal_match: 0.74 },
        timestamp: new Date().toISOString(),
      },
      video_analysis: {
        analysis: 'Video shows people at a social gathering, Coca-Cola logo visible on bottles and cans, beverage product featured prominently, festive atmosphere, duration 6.5 seconds',
        detected_objects: ['person', 'bottle', 'can', 'logo', 'party', 'table'],
        detected_brands: ['Coca-Cola'],
        timestamp: new Date().toISOString(),
      },
      video_metrics: {
        frames_analyzed: 240,
        embedding_matches: 238,
      },
    },
  },
  {
    id: 'example_3',
    name: 'Apple Product Showcase',
    promptPattern: 'apple|iphone|technology|device|smartphone|tech',
    promptKeywords: ['apple', 'iphone', 'technology', 'device', 'smartphone', 'tech'],
    video: {
      path: '/videos/example_3_apple_iphone.mp4',
      duration: 7.0,
      resolution: '1080p',
      description: 'Apple iPhone being showcased with Apple logo',
    },
    results: {
      retrieved_context: {
        retrieved_ips: [
          {
            id: 'ip_005',
            type: 'logo',
            owner: 'Apple',
            name: 'Apple Logo',
            relevance_score: 0.96,
          },
          {
            id: 'ip_006',
            type: 'product',
            owner: 'Apple',
            name: 'iPhone',
            relevance_score: 0.91,
          },
        ],
        retrieval_method: 'vector_similarity',
        timestamp: new Date().toISOString(),
      },
      initial_attribution: {
        total_score: 0.91,
        confidence: 0.96,
        ip_attributions: { Apple: 0.68, Samsung: 0.23 },
        calculation_type: 'initial',
        algorithm_used: 'weighted_average',
        details: { visual_weight: 0.7, audio_weight: 0.2, temporal_weight: 0.1 },
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
      augmented_prompt: 'Apple iPhone being showcased with Apple logo featuring Apple Logo and iPhone',
      generated_video: {
        video_path: '/videos/example_3_apple_iphone.mp4',
        duration: 7.0,
        resolution: '1080p',
        model_used: 'ltx-video',
        timestamp: new Date().toISOString(),
      },
      post_gen_safety: {
        passed: true,
        check_type: 'post_generation',
        violations: [],
        violation_details: [],
        contamination_score: 0.01,
        contamination_threshold: 0.05,
        timestamp: new Date().toISOString(),
        details: { unauthorized_ip_detected: false },
      },
      final_attribution: {
        total_score: 0.90,
        confidence: 0.94,
        ip_attributions: { Apple: 0.67, Samsung: 0.23 },
        calculation_type: 'final',
        algorithm_used: 'weighted_average',
        variance_from_initial: -0.01,
        details: { visual_match: 0.92, audio_match: 0.0, temporal_match: 0.88 },
        timestamp: new Date().toISOString(),
      },
      video_analysis: {
        analysis: 'Video features close-up shots of Apple iPhone, Apple logo clearly visible on device back, product showcase style, modern technology aesthetic, duration 7.0 seconds',
        detected_objects: ['smartphone', 'logo', 'screen', 'device', 'hand'],
        detected_brands: ['Apple'],
        timestamp: new Date().toISOString(),
      },
      video_metrics: {
        frames_analyzed: 210,
        embedding_matches: 208,
      },
    },
  },
  {
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
        total_score: 0.80,
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
  },
  {
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
        total_score: 0.83,
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
  },
];

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

