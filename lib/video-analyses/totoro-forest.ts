import { VideoExample } from '../examples';

export const totoroForestGuardianAnalysis: VideoExample = {
  id: 'totoro_forest_encounter_001',
  name: 'Totoro: Forest Guardian Awakens',
  promptPattern: 'totoro|ghibli style|enchanted forest|children|mystical|anime',
  promptKeywords: ['totoro', 'studio ghibli', 'my neighbor totoro', 'anime', 'animation', 'forest', 'spirit', 'children', 'magical', 'fantasy', 'rain', 'tree'],
  video: {
    path: '', // No video generated - generation failed
    duration: 0,
    resolution: 'N/A',
    description: 'Wide exterior: lush, vibrant ancient forest bathed in soft, dappled sunlight filtering through colossal, moss-covered trees. Two small children (one girl, one boy, in classic anime style) cautiously approach a colossal, furry creature (Totoro-like) stirring from slumber - low-angle, gentle push-in shot to emphasize scale and wonder. Cut to tight mid-shot: the creature\'s large, friendly eyes slowly open, a leaf perched on its nose; close-up on tiny forest spirits (Chibi-Totoro-like) flitting around its enormous paws - subtle shimmer and bokeh for magical realism. Lighting: warm, ethereal glow, lens flare through canopy gaps, soft rim lighting on the creature\'s fur; background slightly painterly for dreamlike quality. Mood: awe, innocence, gentle curiosity, serene magic, a sense of discovery - the quiet joy of an impossible encounter. Visual style: traditional hand-drawn animation aesthetic, warm naturalistic color-grading, shallow depth-of-field, subtle character animation, period-accurate Japanese children\'s clothing.',
  },
  results: {
    retrieved_context: {
      retrieved_ips: [
        {
          id: 'ip_ghibli_01',
          type: 'copyright_character',
          owner: 'Studio Ghibli / Hayao Miyazaki',
          name: 'Totoro (Character & Design)',
          relevance_score: 0.99,
        },
        {
          id: 'ip_ghibli_02',
          type: 'copyright_franchise',
          owner: 'Studio Ghibli / Hayao Miyazaki',
          name: 'My Neighbor Totoro (Film & Franchise)',
          relevance_score: 0.99,
        },
        {
          id: 'ip_ghibli_03',
          type: 'trade_dress_style',
          owner: 'Studio Ghibli',
          name: 'Studio Ghibli Animation Style (distinctive visual aesthetic)',
          relevance_score: 0.95,
        },
      ],
      retrieval_method: 'semantic_entity_extraction_and_visual_style_recognition',
      timestamp: new Date().toISOString(),
    },
    initial_attribution: {
      total_score: 0.98,
      confidence: 1.00,
      ip_attributions: { 
        'Studio Ghibli / Hayao Miyazaki': 0.99,
        'Studio Ghibli Animation Style': 0.95,
      },
      calculation_type: 'initial',
      algorithm_used: 'visual_recognition_and_metadata_check',
      details: { 
        visual_weight: 0.98, 
        audio_weight: 0.02, 
        temporal_weight: 0.0,
        resolution: 'Prompt analysis (pre-generation)',
        artifacts: 'Clear, fluid animation strongly mimicking Studio Ghibli\'s signature hand-drawn aesthetic, including character design and background painting.',
        audio: 'Gentle forest sounds and ambient music (reminiscent of Joe Hisaishi).',
        ip_conflict_detected: true,
        protected_character_detected: 'Totoro (Studio Ghibli) - Highly protected trademarked character',
      },
      timestamp: new Date().toISOString(),
    },
    pre_gen_safety: {
      passed: false, // FAILED - Protected character detected
      check_type: 'pre_generation',
      violations: ['copyright_character_infringement', 'trademarked_character_usage', 'unlicensed_ip_usage'],
      violation_details: [
        {
          violation_type: 'copyright_character_infringement',
          severity: 'critical',
          description: 'Direct depiction of "Totoro" character, a highly protected trademarked and copyrighted character owned by Studio Ghibli. Commercial use without license is strictly prohibited.',
        },
        {
          violation_type: 'trademarked_character_usage',
          severity: 'critical',
          description: 'Totoro is a registered trademark of Studio Ghibli. Any commercial use requires explicit licensing from the rights holder.',
        },
        {
          violation_type: 'unlicensed_ip_usage',
          severity: 'critical',
          description: 'Content attempts to use Studio Ghibli\'s protected intellectual property (characters, visual style, franchise elements) without proper licensing agreements.',
        },
      ],
      contamination_score: 0.95, // Extremely high - direct character usage
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { 
        violence_filters: 'PASS - No violence, wholesome content.',
        hate_harassment: 'PASS - No indicators.',
        policy_threshold: 'SFW Animated Content',
        license_verified: false,
        ip_conflict_blocking_generation: true,
        generation_blocked_reason: 'Protected Character Usage: Cannot generate content featuring Studio Ghibli\'s trademarked Totoro character without explicit licensing. Totoro is a highly protected IP with strict commercial use restrictions.',
        blocking_studios: ['Studio Ghibli / Hayao Miyazaki'],
      },
    },
    augmented_prompt: 'Wide exterior: lush, vibrant ancient forest bathed in soft, dappled sunlight filtering through colossal, moss-covered trees. Two small children (one girl, one boy, in classic anime style) cautiously approach a colossal, furry creature (Totoro-like) stirring from slumber - low-angle, gentle push-in shot to emphasize scale and wonder. Cut to tight mid-shot: the creature\'s large, friendly eyes slowly open, a leaf perched on its nose; close-up on tiny forest spirits (Chibi-Totoro-like) flitting around its enormous paws - subtle shimmer and bokeh for magical realism. Lighting: warm, ethereal glow, lens flare through canopy gaps, soft rim lighting on the creature\'s fur; background slightly painterly for dreamlike quality. Mood: awe, innocence, gentle curiosity, serene magic, a sense of discovery - the quiet joy of an impossible encounter. Visual style: traditional hand-drawn animation aesthetic, warm naturalistic color-grading, shallow depth-of-field, subtle character animation, period-accurate Japanese children\'s clothing.',
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
      violations: ['generation_blocked', 'copyright_character_infringement', 'trademarked_character_usage'],
      violation_details: [
        {
          violation_type: 'generation_blocked',
          severity: 'critical',
          description: 'Video generation was prevented at the pre-generation safety check stage due to protected character usage.',
        },
        {
          violation_type: 'copyright_character_infringement',
          severity: 'critical',
          description: 'Content would directly infringe on Studio Ghibli\'s copyright by depicting the trademarked Totoro character.',
        },
      ],
      contamination_score: 0.95,
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { 
        visual_safety: 'N/A - No video generated',
        misinformation_risk: 'N/A - No video generated',
        deepfake_risk: 'N/A - No video generated',
        overfitting_level: 'N/A - No video generated',
        detection_marker: 'Generation blocked before video creation due to protected character usage.',
        ip_contamination: '95% - Critical contamination level. Direct use of highly protected Studio Ghibli character.',
        monetization_viability: '0% - Generation blocked. Commercial monetization impossible.',
        copyright_risk: 'EXTREMELY HIGH - Direct use of Studio Ghibli\'s trademarked Totoro character without licensing.',
        final_recommendation: 'GENERATION BLOCKED: Content cannot be generated due to protected character usage. The prompt directly references Studio Ghibli\'s trademarked Totoro character, which requires explicit licensing for any commercial use. Studio Ghibli maintains strict control over their characters and does not typically license for user-generated content. To proceed, you would need to remove the specific character references or create original characters inspired by the aesthetic instead.',
        generation_status: 'BLOCKED',
        blocking_reason: 'Protected Character Usage - Trademarked Studio Ghibli character cannot be used without licensing',
      },
    },
    final_attribution: {
      total_score: 0.98,
      confidence: 1.00,
      ip_attributions: { 
        'Studio Ghibli / Hayao Miyazaki': 0.99,
        'Studio Ghibli Animation Style': 0.95,
      },
      calculation_type: 'final',
      algorithm_used: 'direct_source_identification',
      variance_from_initial: 0.0,
      details: { 
        visual_match: 1.00, 
        audio_match: 0.90, 
        temporal_match: 1.00,
        status: 'Generation Blocked / Non-Monetizable',
        user_ownership: 'User owns the prompt composition, but the content cannot be generated due to protected character usage.',
        legal_reality: 'The prompt attempts to create content featuring Studio Ghibli\'s trademarked Totoro character. Totoro is one of the most protected characters in animation, with strict commercial use restrictions. Studio Ghibli does not typically license their characters for user-generated or AI-generated content. Fair use protections are extremely limited for such direct character depictions.',
        ip_contamination_details: {
          character_design_main: 'Totoro (Studio Ghibli / Hayao Miyazaki) - 100% Match',
          character_design_minor: 'Chibi-Totoro (Studio Ghibli) - 100% Match',
          visual_style: 'Studio Ghibli\'s distinctive hand-drawn aesthetic - 95% Match',
          conflict_type: 'Protected Character - Trademarked character cannot be used without explicit licensing from Studio Ghibli',
        },
        monetization_verdict: 'IMPOSSIBLE - Generation Blocked',
        mandatory_actions: 'Generation was blocked. If you wish to create similar content: (1) Remove specific character references (Totoro, Chibi-Totoro). (2) Use generic descriptions (e.g., "large forest spirit" instead of "Totoro"). (3) Create original characters inspired by the aesthetic. (4) Ensure you have proper licensing if you must use Studio Ghibli characters.',
      },
      reconciliation_notes: 'VERDICT: GENERATION BLOCKED - Video generation was prevented due to protected character usage. The prompt directly references Studio Ghibli\'s trademarked Totoro character, which is one of the most protected characters in animation. Studio Ghibli maintains strict control over their intellectual property and does not typically license characters for user-generated or AI-generated content. Contamination score (95%) far exceeds the safe threshold. Final Recommendation: Modify the prompt to remove specific character references or create original characters inspired by Studio Ghibli\'s aesthetic instead.',
      timestamp: new Date().toISOString(),
    },
    video_analysis: {
      analysis: '**Generation Status: BLOCKED**\n\n**Why Generation Failed:**\n\nThe prompt was analyzed and found to contain direct references to Studio Ghibli\'s highly protected intellectual property:\n\n1. **Totoro Character** (Studio Ghibli / Hayao Miyazaki) - Trademarked and copyrighted character\n2. **Chibi-Totoro** (Studio Ghibli) - Protected character design\n3. **Studio Ghibli Animation Style** - Distinctive visual aesthetic\n\n**IP Protection Details:**\n- Totoro is one of the most protected characters in animation\n- Studio Ghibli maintains strict control over their characters\n- Commercial use requires explicit licensing from Studio Ghibli\n- No such licensing agreements exist for user-generated content\n- The contamination score (95%) indicates extremely high reliance on protected IP\n\n**Legal Implications:**\n- Studio Ghibli characters are trademarked and copyrighted\n- Direct character depictions require licensing for commercial use\n- Fair use protections are extremely limited for trademarked characters\n- AI generation of such content poses significant legal risks\n- Studio Ghibli does not typically license characters for user-generated content\n\n**Recommendation:**\nTo create similar content, modify your prompt to:\n- Remove specific character references (Totoro, Chibi-Totoro)\n- Use generic descriptions (e.g., "large forest spirit" instead of "Totoro")\n- Create original characters inspired by Studio Ghibli\'s aesthetic\n- Ensure you have proper licensing if you must use Studio Ghibli characters\n\n**Monetization Status:** Generation blocked - monetization is impossible as no video was created.',
      detected_objects: ['N/A - No video generated'],
      detected_brands: ['Studio Ghibli / Hayao Miyazaki (IP)', 'My Neighbor Totoro (IP)'],
      timestamp: new Date().toISOString(),
    },
    video_metrics: {
      frames_analyzed: 0, // No video to analyze
      embedding_matches: 0, // No video to analyze
    },
  },
};

