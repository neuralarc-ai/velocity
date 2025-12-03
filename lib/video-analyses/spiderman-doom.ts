import { VideoExample } from '../examples';

export const spidermanDoomAnalysis: VideoExample = {
  id: 'example_1',
  name: 'Spider-Man vs. Doctor Doom',
  promptPattern: 'spider-man|doctor doom|marvel|superhero|symbiote|venom|doom',
  promptKeywords: ['spider-man', 'doctor doom', 'marvel', 'superhero', 'symbiote', 'venom', 'doom', 'battle', 'combat'],
  video: {
    path: '/spideydoom.mp4',
    duration: 8.0,
    resolution: '1080p',
    description: 'Ultra-realistic, high-fidelity, Marvel-studio-grade cinematic scene of Spider-Man wearing the black Symbiote/Venom suit engaged in an intense battle against Doctor Doom in a vast, post-apocalyptic landscape. Dynamic action poses, dramatic lighting, swirling dust and debris, energy blasts illuminating the environment, detailed textures on the symbiote suit, metallic reflections on Doom\'s armor, and photorealistic atmospheric effects. Hyper-detailed environment with destroyed buildings, cracked ground, fire embers, and smoke trails. Shot on a high-end cinema camera in 8K resolution with sharp motion clarity, volumetric lighting, and deep contrast. Epic, powerful, and visually immersive - like a Marvel Studios action sequence.',
  },
  results: {
    retrieved_context: {
      retrieved_ips: [
        {
          id: 'ip_001',
          type: 'character',
          owner: 'The Marvel Studios',
          name: 'Spider-Man (Peter Parker)',
          relevance_score: 0.98,
        },
        {
          id: 'ip_002',
          type: 'character',
          owner: 'The Marvel Studios',
          name: 'Doctor Doom (Victor Von Doom)',
          relevance_score: 0.97,
        },
        {
          id: 'ip_003',
          type: 'character',
          owner: 'Robert Downey Jr. (if likeness used)',
          name: 'Right of Publicity - Actor Likeness',
          relevance_score: 0.85,
        },
      ],
      retrieval_method: 'vector_similarity',
      timestamp: new Date().toISOString(),
    },
    initial_attribution: {
      total_score: 0.95,
      confidence: 0.99,
      ip_attributions: { 
        'The Marvel Studios': 0.92,
        'Robert Downey Jr. (if likeness used)': 0.03,
      },
      calculation_type: 'initial',
      algorithm_used: 'weighted_average',
      details: { 
        visual_weight: 0.7, 
        audio_weight: 0.2, 
        temporal_weight: 0.1,
        resolution: 'High-definition (HD) with AI upscaling/generation characteristics',
        artifacts: 'Possible motion anomalies, deepfake blending inconsistencies, or watermarks',
        audio: 'Likely non-original, synthetic music and sound effects, or unlicensed tracks',
      },
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
      details: { 
        violence_filters: 'PASS - Stylized, fantasy/superhero combat (energy blasts, physical impacts) allowed under standard AI safety guardrails',
        hate_harassment: 'PASS - No indicators of hate speech or harassment',
        policy_threshold: 'SFW fantasy violence',
      },
    },
    augmented_prompt: 'Ultra-realistic, high-fidelity, Marvel-studio-grade cinematic scene of Spider-Man wearing the black Symbiote/Venom suit engaged in an intense battle against Doctor Doom in a vast, post-apocalyptic landscape. Dynamic action poses, dramatic lighting, swirling dust and debris, energy blasts illuminating the environment, detailed textures on the symbiote suit, metallic reflections on Doom\'s armor, and photorealistic atmospheric effects. Hyper-detailed environment with destroyed buildings, cracked ground, fire embers, and smoke trails. Shot on a high-end cinema camera in 8K resolution with sharp motion clarity, volumetric lighting, and deep contrast. Epic, powerful, and visually immersive - like a Marvel Studios action sequence.',
    generated_video: {
      video_path: '/spideydoom.mp4',
      duration: 8.0,
      resolution: '1080p',
      model_used: 'Veo 3.1',
      timestamp: new Date().toISOString(),
    },
    post_gen_safety: {
      passed: false,
      check_type: 'post_generation',
      violations: ['Unlicensed Derivative Work', 'Copyright Infringement', 'High Contamination'],
      violation_details: [
        {
          violation_type: 'copyright',
          severity: 'high',
          description: 'All core creative elements are protected Marvel IP. Video is unmarketable and un-copyrightable by user.',
        },
        {
          violation_type: 'contamination',
          severity: 'high',
          description: 'Model has reproduced highly specific, recognizable, copyrighted character designs (Spider-Man suit, Doctor Doom armor). Confirms AI was trained on copyrighted Marvel images/media.',
        },
        {
          violation_type: 'deepfake',
          severity: 'medium',
          description: 'If Doctor Doom/Tony Stark likeness is used, falls under synthetic media policies requiring mandatory disclosure on video platforms.',
        },
      ],
      contamination_score: 0.95,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { 
        visual_safety: 'PASS (Fantasy Violence)',
        misinformation_risk: 'LOW (Clearly fiction)',
        deepfake_risk: 'MEDIUM - Requires mandatory disclosure if actor likeness used',
        overfitting_level: 'HIGH - Model reproduced highly specific copyrighted character designs',
        detection_marker: 'If Veo 3.1 was used, imperceptible watermark (SynthID) embedded, allowing platforms to detect as AI-generated media',
      },
    },
    final_attribution: {
      total_score: 0.88,
      confidence: 0.99,
      ip_attributions: { 
        'The Marvel Studios': 0.92,
        'Robert Downey Jr. (if likeness used)': 0.03,
      },
      calculation_type: 'final',
      algorithm_used: 'weighted_average',
      variance_from_initial: 0.0,
      details: { 
        visual_match: 0.98, 
        audio_match: 0.0, 
        temporal_match: 0.92,
        status: 'Unlicensed Derivative Work',
        user_ownership: 'User owns prompt and video file but not the copyright',
        platform_ownership: 'Platform claims no ownership but prohibits use for generating third-party IP',
        legal_reality: 'Video is unmarketable and un-copyrightable by user because central subject matter is protected by Marvel copyright and trademark',
      },
      reconciliation_notes: 'User (You): Own the prompt and the video file but not the copyright. Platform (AI Tool): Claims no ownership but prohibits use for generating third-party IP. Legal Reality: The video is unmarketable and un-copyrightable by the user because the central subject matter is protected by Marvel\'s copyright and trademark.',
      timestamp: new Date().toISOString(),
    },
    video_analysis: {
      analysis: 'Visual Context: High-fidelity battle sequence, likely post-apocalyptic or ruined city setting. Characters: Entity A is Spider-Man (in the black Symbiote/Venom suit or similar dark armor). Entity B is Doctor Doom (or an Iron Man variant of Doctor Doom, often tied to fan speculation on Robert Downey Jr. returning). Action: Cinematic superhero combat, high-stakes confrontation. Dialogue/Intent: Establishes a narrative conflict between two major Marvel figures. Resolution/Frame Rate: Likely high-definition (HD) with characteristics of AI upscaling/generation. Artifacts: Possible motion anomalies, deepfake blending inconsistencies, or watermarks if a specific AI tool (like Veo 3.1, Midjourney, Runway) was used (even if cropped, invisible markers often remain). Audio: Likely non-original, synthetic music and sound effects, or unlicensed tracks, which adds a secondary layer of copyright risk.',
      detected_objects: ['spider-man', 'doctor_doom', 'superhero', 'battle', 'combat', 'cgi', 'deepfake', 'city', 'ruins', 'energy_blasts', 'armor', 'suit'],
      detected_brands: ['Marvel', 'Marvel Studios'],
      timestamp: new Date().toISOString(),
    },
    video_metrics: {
      frames_analyzed: 240,
      embedding_matches: 235,
    },
  },
};

