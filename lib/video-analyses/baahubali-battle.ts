import { VideoExample } from '../examples';

export const baahubaliBattleAnalysis: VideoExample = {
  id: 'battle_001',
  name: 'Baahubali Post-Battle Scene',
  promptPattern: 'prabhas|baahubali|amarendra baahubali|maahishmati|indian cinema|chariot|battle|epic',
  promptKeywords: ['prabhas', 'baahubali', 'amarendra baahubali', 'maahishmati', 'indian cinema', 'chariot', 'battle', 'combat', 'war', 'epic', 'sword'],
  video: {
    path: '/battle.mp4',
    duration: 7.0,
    resolution: '1080p',
    description: 'Dawn after a great battle - broken weapons, scattered shields, smouldering fires, mist rising from ground; distant ruins or camps in background. Bahubali stands alone among the debris, armor battered, head bowed, sword half-lowered or stuck in ground, silence around. Camera wide to medium to close-up on his expression: grief, regret, exhaustion but also strength and resolve - hinting at internal conflict, consequences of war. Mood: somber, heavy, human - not triumphant but reflective, showing cost of power, choice, fight. Visual style: realistic textures (mud, blood, metal, ash), muted, desaturated palette, atmospheric haze or dust, depth-of-field, soft lighting of early dawn, cinematic framing to evoke emotion.',
  },
  results: {
    retrieved_context: {
      retrieved_ips: [
        {
          id: 'ip_001',
          type: 'film_series',
          owner: 'Arka Media Works / K. V. Vijayendra Prasad (Writer) / S. S. Rajamouli (Director)',
          name: 'Baahubali Film Franchise (including Baahubali 2: The Conclusion)',
          relevance_score: 0.99,
        },
        {
          id: 'ip_002',
          type: 'character',
          owner: 'Arka Media Works',
          name: 'Amarendra Baahubali (Character Design and Story)',
          relevance_score: 0.98,
        },
        {
          id: 'ip_003',
          type: 'right_of_publicity',
          owner: 'Prabhas (Actor Likeness and Performance)',
          name: 'Right of Publicity - Actor Likeness (Prabhas)',
          relevance_score: 0.95,
        },
      ],
      retrieval_method: 'visual_and_contextual_analysis',
      timestamp: new Date().toISOString(),
    },
    initial_attribution: {
      total_score: 0.99,
      confidence: 1.00,
      ip_attributions: { 
        'Arka Media Works / S. S. Rajamouli': 0.98,
        'Prabhas (Actor Likeness)': 0.95,
      },
      calculation_type: 'initial',
      algorithm_used: 'visual_recognition_and_metadata_check',
      details: { 
        visual_weight: 0.8, 
        audio_weight: 0.1, 
        temporal_weight: 0.1,
        resolution: 'High-definition (1080p or higher) source clip',
        artifacts: 'Clean clip, no visible AI generation artifacts or watermarks, likely a direct rip from a copyrighted source.',
        audio: 'Original sound design and background score from the film.',
      },
      timestamp: new Date().toISOString(),
    },
    pre_gen_safety: {
      passed: true,
      check_type: 'pre_generation',
      violations: [],
      violation_details: [],
      contamination_score: 0.99, // High contamination as it is the original copyrighted content
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { 
        violence_filters: 'PASS - Stylized, cinematic historical/fantasy violence aftermath. Not graphic or extreme.',
        hate_harassment: 'PASS - No indicators of hate speech or harassment.',
        policy_threshold: 'SFW cinematic content',
      },
    },
    augmented_prompt: 'Dawn after a great battle - broken weapons, scattered shields, smouldering fires, mist rising from ground; distant ruins or camps in background. Bahubali stands alone among the debris, armor battered, head bowed, sword half-lowered or stuck in ground, silence around. Camera wide to medium to close-up on his expression: grief, regret, exhaustion but also strength and resolve - hinting at internal conflict, consequences of war. Mood: somber, heavy, human - not triumphant but reflective, showing cost of power, choice, fight. Visual style: realistic textures (mud, blood, metal, ash), muted, desaturated palette, atmospheric haze or dust, depth-of-field, soft lighting of early dawn, cinematic framing to evoke emotion.',
    generated_video: {
      video_path: '/battle.mp4',
      duration: 7.0,
      resolution: '1080p',
      model_used: 'N/A (User-uploaded file)',
      timestamp: new Date().toISOString(),
    },
    post_gen_safety: {
      passed: false,
      check_type: 'post_generation',
      violations: ['Copyright Infringement (Original Content)', 'Unlicensed Distribution', 'Monetization Impossible'],
      violation_details: [
        {
          violation_type: 'copyright',
          severity: 'critical',
          description: 'The video is a direct, unmodified clip from a commercially released feature film, Baahubali, and constitutes clear copyright infringement and unauthorized use/distribution.',
        },
        {
          violation_type: 'monetization',
          severity: 'critical',
          description: 'VERDICT: IMPOSSIBLE / EXTREME RISK - The content cannot be monetized by the uploader due to clear copyright infringement, unauthorized use, and 100% contamination by third-party intellectual property. IP Contamination: 100% - The entire 7-second clip is the protected copyrighted work of Arka Media Works. Monetization Viability: 0% - Zero likelihood of earning revenue or passing platform monetization review. Copyright Risk: CRITICAL - Immediate Content ID flagging and claim by the rights holder.',
        },
        {
          violation_type: 'content_id',
          severity: 'critical',
          description: 'BLOCKER 1: Copyright Claim & Revenue Block - The video is an exact match for content owned by Arka Media Works (and its global distributors/music partners) and will be instantly flagged by all major platform content management systems (e.g., Content ID systems on video platforms). Result: Monetization will be blocked, and all revenue (if any is generated before detection) will be claimed by the rights holders (Arka Media Works). The uploader will receive none of the ad revenue. Risk Escalation: Depending on the policy of the rights holder, the video could receive a Copyright Strike, which severely impacts the channel\'s standing and can lead to channel termination.',
        },
        {
          violation_type: 'ypp_policy',
          severity: 'critical',
          description: 'BLOCKER 2: Platform Partner Program Failure - Fails "Original and Authentic": This direct clip fails the core requirement of platform Reused Content policies. Major video platforms explicitly state that using long segments of copyrighted material (such as movie clips) without substantial original commentary, education, or creative modification is not eligible for monetization. Monetization Jeopardy: Attempting to monetize a channel with a high percentage of such unedited, third-party content will result in the channel being rejected from or removed from platform Partner Programs.',
        },
      ],
      contamination_score: 1.00, // The entire video is the copyrighted content
      contamination_threshold: 0.05,
      timestamp: new Date().toISOString(),
      details: { 
        visual_safety: 'PASS (Cinematic content)',
        misinformation_risk: 'LOW (Clearly fiction)',
        deepfake_risk: 'N/A (Original footage)',
        overfitting_level: '100% match (Original footage)',
        detection_marker: 'Content ID will flag this instantly for copyright by Arka Media Works.',
        ip_contamination: '100% - The entire 7-second clip is the protected copyrighted work of Arka Media Works.',
        monetization_viability: '0% - Zero likelihood of earning revenue or passing platform monetization review.',
        copyright_risk: 'CRITICAL - Immediate Content ID flagging and claim by the rights holder.',
        final_recommendation: 'Do not monetize. Do not upload this clip to any commercial video platform with the intent of earning revenue. The legal and financial risk is absolute.',
      },
    },
    final_attribution: {
      total_score: 0.92,
      confidence: 1.00,
      ip_attributions: { 
        'Arka Media Works / S. S. Rajamouli': 1.00,
        'Prabhas (Actor Likeness)': 1.00,
        'M. M. Keeravani / Music Label': 1.00,
      },
      calculation_type: 'final',
      algorithm_used: 'direct_source_identification',
      variance_from_initial: 0.0,
      details: { 
        visual_match: 1.00, 
        audio_match: 1.00, 
        temporal_match: 1.00,
        status: 'Unauthorized Copy of Original Work',
        user_ownership: 'User owns the file but has no copyright or distribution rights.',
        legal_reality: 'The video is the intellectual property of Arka Media Works. Any attempt to monetize or publicly distribute this clip without explicit license will result in a copyright strike/claim.',
        ip_contamination_details: {
          film_footage: 'Arka Media Works - 100% Match to the original cinematic scene.',
          character_likeness: 'Arka Media Works - The character Amarendra Baahubali (armor, look) is trademarked.',
          actor_likeness: 'Prabhas (Right of Publicity) - Unlicensed commercial use of the actor\'s performance and face.',
          audio_score: 'M. M. Keeravani / Music Label - If the clip contains the original background score, it is a separate, additional layer of copyright infringement.',
        },
        monetization_verdict: 'IMPOSSIBLE / EXTREME RISK',
        mandatory_actions: 'If uploaded for non-commercial use: (1) Acknowledge the Copyright: State clearly in the description that the footage belongs to Arka Media Works. (2) Declare Synthetic Content: If you used any AI tool to upscale, edit, or generate any part of the footage, you must declare this in the platform\'s content disclosure settings (e.g., "Altered/Synthetic" content checkbox) to comply with synthetic media policies. However, since the video appears to be original film footage, this step is less about AI and more about platform disclosure requirements for high-risk content.',
      },
      reconciliation_notes: 'VERDICT: IMPOSSIBLE / EXTREME RISK - The content cannot be monetized by the uploader due to clear copyright infringement, unauthorized use, and 100% contamination by third-party intellectual property. The video is a direct, original clip from the Baahubali film franchise. Copyright rests entirely with the production company, Arka Media Works, and its affiliates. Monetization is impossible without a license. Final Recommendation: Do not monetize. Do not upload this clip to any commercial video platform with the intent of earning revenue. The legal and financial risk is absolute.',
      timestamp: new Date().toISOString(),
    },
    video_analysis: {
      analysis: 'Visual Context: Post-war scene, showing the devastating aftermath of a large-scale battle. The setting is muddy, smoky, and littered with weapons and broken structures. Character: The central figure is actor Prabhas in his role as Amarendra Baahubali, identified by his likeness, costume, and the thematic context. Action/Emotion: The character is in a moment of profound exhaustion and emotional distress, emphasized by the blood and grime on his face and armor, and the deliberate shot composition focusing on his eyes. **Monetization Check:** This is an unmodified, copyrighted movie clip from a major commercial film. It is highly likely to be flagged by platform Content ID systems. **The user cannot monetize this video.**',
      detected_objects: ['Prabhas', 'Amarendra Baahubali', 'chariot wheel', 'sword', 'shield', 'armor', 'battlefield', 'smoke', 'camp'],
      detected_brands: ['Baahubali', 'Arka Media Works'],
      timestamp: new Date().toISOString(),
    },
    video_metrics: {
      frames_analyzed: 168,
      embedding_matches: 168,
    },
  },
};

