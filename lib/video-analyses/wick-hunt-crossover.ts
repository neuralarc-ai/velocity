import { VideoExample } from '../examples';

export const johnWickEthanHuntAnalysis: VideoExample = {
  id: 'wick_hunt_crossover_001',
  name: 'Wick x Hunt: Midnight Protocol',
  promptPattern: 'john wick|ethan hunt|roof sprint|neon|rain|tactical|crossover',
  promptKeywords: ['john wick', 'ethan hunt', 'mission impossible', 'keanu reeves', 'tom cruise', 'tactical', 'noir', 'rain', 'roof chase', 'gun-fu', 'spycraft'],
  video: {
    path: '', // No video generated - generation failed
    duration: 0,
    resolution: 'N/A',
    description: 'Wide exterior: midnight urban rooftop spanning a sprawling metropolis, rain slicking the surfaces under a canopy of flickering neon signs. John Wick (in a tattered black suit) and Ethan Hunt (in tactical stealth gear) sprint in unison across the edge - low-angle, side-tracking shot to emphasize synchronized lethality and momentum. Cut to tight mid-shot: Wick performs a seamless press-check on his pistol, Hunt arms a glowing suction-glove; close-up on boots splashing through puddles and shattering glass - subtle vibration and rain droplets suspended in air for realism. Lighting: cool steel-blues and harsh magenta neon, deep noir shadows, anamorphic lens flare from a hovering helicopter spotlight; background heavily bokeh-ed to isolate the heroes. Mood: relentless focus, uneasy alliance, grim determination, a sense of impossible odds - the convergence of pure will and tactical genius. Visual style: hyper-realistic textures (wet fabric, skin pores), high-contrast color-grading, sharp focus, slight film grain to mimic IMAX action cinema, atmospheric steam and rain.',
  },
  results: {
    retrieved_context: {
      retrieved_ips: [
        {
          id: 'ip_jw_01',
          type: 'copyright_character',
          owner: 'Lionsgate / Summit Entertainment',
          name: 'John Wick (Character & Franchise Visuals)',
          relevance_score: 0.99,
        },
        {
          id: 'ip_mi_01',
          type: 'copyright_character',
          owner: 'Paramount Pictures',
          name: 'Ethan Hunt / Mission: Impossible Franchise',
          relevance_score: 0.99,
        },
        {
          id: 'ip_actor_01',
          type: 'right_of_publicity',
          owner: 'Keanu Reeves',
          name: 'Actor Likeness (Keanu Reeves)',
          relevance_score: 0.98,
        },
        {
          id: 'ip_actor_02',
          type: 'right_of_publicity',
          owner: 'Tom Cruise',
          name: 'Actor Likeness (Tom Cruise)',
          relevance_score: 0.98,
        },
      ],
      retrieval_method: 'semantic_entity_extraction',
      timestamp: new Date().toISOString(),
    },
    initial_attribution: {
      total_score: 0.98,
      confidence: 1.00,
      ip_attributions: { 
        'Lionsgate / Summit Entertainment': 0.99,
        'Paramount Pictures': 0.99,
        'Keanu Reeves': 0.98,
        'Tom Cruise': 0.98,
      },
      calculation_type: 'initial',
      algorithm_used: 'visual_recognition_and_metadata_check',
      details: { 
        visual_weight: 0.95, 
        audio_weight: 0.05, 
        temporal_weight: 0.0,
        resolution: 'Prompt analysis (pre-generation)',
        artifacts: 'Multiple protected IPs detected from conflicting universes.',
        audio: 'No audio detected in prompt.',
        ip_conflict_detected: true,
        conflicting_universes: ['Lionsgate (John Wick)', 'Paramount (Mission: Impossible)'],
      },
      timestamp: new Date().toISOString(),
    },
    pre_gen_safety: {
      passed: false, // FAILED - IP conflict detected
      check_type: 'pre_generation',
      violations: ['ip_universe_conflict', 'cross_studio_copyright', 'unlicensed_character_crossover'],
      violation_details: [
        {
          violation_type: 'ip_universe_conflict',
          severity: 'critical',
          description: 'Characters from incompatible copyrighted universes cannot coexist in generated content. John Wick (Lionsgate) and Ethan Hunt (Paramount) are from separate, competing franchises.',
        },
        {
          violation_type: 'cross_studio_copyright',
          severity: 'critical',
          description: 'Content attempts to combine intellectual property from two major competing studios (Lionsgate and Paramount) without licensing agreements.',
        },
        {
          violation_type: 'unlicensed_character_crossover',
          severity: 'critical',
          description: 'Character crossover requires explicit licensing from both rights holders. No such licensing detected.',
        },
      ],
      contamination_score: 0.98, // Extremely high - multiple protected IPs
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { 
        violence_filters: 'PASS - Context is action/cinematic, not gratuitous.',
        hate_harassment: 'PASS - No indicators.',
        policy_threshold: 'SFW Action Content',
        license_verified: false,
        ip_conflict_blocking_generation: true,
        generation_blocked_reason: 'IP Universe Conflict: Cannot generate content combining characters from competing studios without explicit licensing.',
        blocking_studios: ['Lionsgate / Summit Entertainment', 'Paramount Pictures'],
      },
    },
    augmented_prompt: 'Wide exterior: midnight urban rooftop spanning a sprawling metropolis, rain slicking the surfaces under a canopy of flickering neon signs. John Wick (in a tattered black suit) and Ethan Hunt (in tactical stealth gear) sprint in unison across the edge - low-angle, side-tracking shot to emphasize synchronized lethality and momentum. Cut to tight mid-shot: Wick performs a seamless press-check on his pistol, Hunt arms a glowing suction-glove; close-up on boots splashing through puddles and shattering glass - subtle vibration and rain droplets suspended in air for realism. Lighting: cool steel-blues and harsh magenta neon, deep noir shadows, anamorphic lens flare from a hovering helicopter spotlight; background heavily bokeh-ed to isolate the heroes. Mood: relentless focus, uneasy alliance, grim determination, a sense of impossible odds - the convergence of pure will and tactical genius. Visual style: hyper-realistic textures (wet fabric, skin pores), high-contrast color-grading, sharp focus, slight film grain to mimic IMAX action cinema, atmospheric steam and rain.',
    generated_video: {
      video_path: '', // Generation failed - no video produced
      duration: 0,
      resolution: 'N/A',
      model_used: 'N/A - Generation Blocked',
      timestamp: new Date().toISOString(),
    },
    post_gen_safety: {
      passed: false,
      check_type: 'post_generation',
      violations: ['generation_blocked', 'ip_universe_conflict', 'potential_copyright_infringement'],
      violation_details: [
        {
          violation_type: 'generation_blocked',
          severity: 'critical',
          description: 'Video generation was prevented at the pre-generation safety check stage due to IP conflicts.',
        },
        {
          violation_type: 'ip_universe_conflict',
          severity: 'critical',
          description: 'Content would infringe on copyrights from two competing studios (Lionsgate and Paramount) by combining their protected characters.',
        },
      ],
      contamination_score: 0.98,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { 
        visual_safety: 'N/A - No video generated',
        misinformation_risk: 'N/A - No video generated',
        deepfake_risk: 'N/A - No video generated',
        overfitting_level: 'N/A - No video generated',
        detection_marker: 'Generation blocked before video creation due to IP universe conflict.',
        ip_contamination: '98% - Critical contamination level. Multiple protected IPs from incompatible universes.',
        monetization_viability: '0% - Generation blocked. Commercial monetization impossible.',
        copyright_risk: 'CRITICAL - Cross-studio IP usage (Lionsgate + Paramount) without licensing.',
        final_recommendation: 'GENERATION BLOCKED: Content cannot be generated due to IP universe conflict. The prompt combines characters from two competing studios (Lionsgate\'s John Wick and Paramount\'s Mission: Impossible) without proper licensing. To proceed, you would need explicit licensing agreements from both studios, which is highly unlikely for fan-generated content.',
        generation_status: 'BLOCKED',
        blocking_reason: 'IP Universe Conflict - Incompatible copyrighted characters from competing studios',
      },
    },
    final_attribution: {
      total_score: 0.98,
      confidence: 1.00,
      ip_attributions: { 
        'Lionsgate / Summit Entertainment': 0.99,
        'Paramount Pictures': 0.99,
        'Keanu Reeves': 0.98,
        'Tom Cruise': 0.98,
      },
      calculation_type: 'final',
      algorithm_used: 'direct_source_identification',
      variance_from_initial: 0.0,
      details: { 
        visual_match: 1.00, 
        audio_match: 0.0, 
        temporal_match: 1.00,
        status: 'Generation Blocked / Non-Monetizable',
        user_ownership: 'User owns the prompt composition, but the content cannot be generated due to IP conflicts.',
        legal_reality: 'The prompt attempts to create a crossover of two major copyrighted franchises from competing studios. This requires explicit licensing from both Lionsgate (John Wick) and Paramount (Mission: Impossible), which is not available. Fair use may apply for parody/commentary in some jurisdictions, but commercial use and AI generation are restricted.',
        ip_contamination_details: {
          character_design_1: 'John Wick (Lionsgate / Summit Entertainment) - 99% Match',
          character_design_2: 'Ethan Hunt (Paramount Pictures) - 99% Match',
          visual_source: 'Likely training data from John Wick 1-4 and Mission Impossible 4-7.',
          conflict_type: 'Universe Incompatibility - Characters from competing studios cannot coexist without licensing.',
        },
        monetization_verdict: 'IMPOSSIBLE - Generation Blocked',
        mandatory_actions: 'Generation was blocked. If you wish to create similar content: (1) Remove one of the conflicting characters. (2) Use generic alternatives (e.g., "tactical assassin" instead of "John Wick"). (3) Ensure you have proper licensing if you must use both characters. (4) Consider creating original characters inspired by these archetypes instead.',
      },
      reconciliation_notes: 'VERDICT: GENERATION BLOCKED - Video generation was prevented due to IP universe conflict. The prompt combines John Wick (Lionsgate/Summit Entertainment) and Ethan Hunt (Paramount Pictures), two protected characters from competing studios. This creates an impossible licensing scenario where both studios would need to approve the crossover, which is not feasible for user-generated content. Contamination score (98%) far exceeds the safe threshold. Final Recommendation: Modify the prompt to remove one of the conflicting characters or use generic alternatives that do not infringe on specific copyrighted characters.',
      timestamp: new Date().toISOString(),
    },
    video_analysis: {
      analysis: '**Generation Status: BLOCKED**\n\n**Why Generation Failed:**\n\nThe prompt was analyzed and found to contain incompatible intellectual property from two competing studios:\n\n1. **John Wick** (Lionsgate / Summit Entertainment) - Protected character and franchise\n2. **Ethan Hunt / Mission: Impossible** (Paramount Pictures) - Protected character and franchise\n\n**IP Conflict Details:**\n- Both characters are from separate, competing film studios\n- Combining them requires explicit licensing from both Lionsgate and Paramount\n- No such licensing agreements exist for user-generated content\n- The contamination score (98%) indicates extremely high reliance on protected IP\n\n**Legal Implications:**\n- Cross-studio character crossovers are legally complex and typically require studio-to-studio agreements\n- Fair use protections are limited when combining multiple protected IPs\n- Commercial use would be impossible without proper licensing\n- AI generation of such content poses significant copyright risks\n\n**Recommendation:**\nTo create similar content, modify your prompt to:\n- Remove one of the conflicting characters\n- Use generic character descriptions (e.g., "tactical assassin" instead of "John Wick")\n- Create original characters inspired by these archetypes\n- Ensure you have proper licensing if you must use both specific characters\n\n**Monetization Status:** Generation blocked - monetization is impossible as no video was created.',
      detected_objects: ['N/A - No video generated'],
      detected_brands: ['Lionsgate / Summit Entertainment (IP)', 'Paramount Pictures (IP)'],
      timestamp: new Date().toISOString(),
    },
    video_metrics: {
      frames_analyzed: 0, // No video to analyze
      embedding_matches: 0, // No video to analyze
    },
  },
};

