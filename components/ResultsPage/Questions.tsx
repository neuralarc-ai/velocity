'use client';

import { useState, useMemo } from 'react';
import { PipelineResult } from '@/lib/models';
import { VideoExample } from '@/lib/examples';
import {
  RiQuestionLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiShieldCheckLine,
  RiMoneyDollarCircleLine,
  RiCopyrightLine,
  RiAlertLine,
  RiFileTextLine,
  RiBarChartLine,
  RiVideoLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';

interface QuestionsProps {
  result: PipelineResult;
  matchedExampleData: VideoExample | null;
  prompt: string;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

// Simple hash function to generate a seed from prompt
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Shuffle array using seeded random
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const random = seededRandom(seed);
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Questions({ result, matchedExampleData, prompt }: QuestionsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  // Extract data from result or matchedExampleData
  const postGenSafety = result?.results?.post_gen_safety || matchedExampleData?.results?.post_gen_safety;
  const finalAttribution = result?.results?.final_attribution || matchedExampleData?.results?.final_attribution;
  const initialAttribution = result?.results?.initial_attribution || matchedExampleData?.results?.initial_attribution;
  const retrievedIps = result?.results?.retrieved_context?.retrieved_ips || matchedExampleData?.results?.retrieved_context?.retrieved_ips;
  const videoAnalysis = result?.results?.video_analysis || matchedExampleData?.results?.video_analysis;
  const videoMetrics = matchedExampleData?.results?.video_metrics;

  // Calculate key metrics
  const contaminationScore = postGenSafety?.contamination_score ?? 0;
  const contaminationPercent = (contaminationScore * 100).toFixed(1);
  const passed = postGenSafety?.passed ?? false;
  const monetizationVerdict = finalAttribution?.details?.monetization_verdict as string | undefined;
  const totalScore = finalAttribution?.total_score ?? initialAttribution?.total_score ?? 0;
  const confidence = finalAttribution?.confidence ?? initialAttribution?.confidence ?? 0;
  
  // Check monetization status
  const isApproved = passed && contaminationScore < 0.05 && !monetizationVerdict?.includes('IMPOSSIBLE') && !monetizationVerdict?.includes('EXTREME RISK');
  const isBlocked = contaminationScore > 0.9 || monetizationVerdict?.includes('IMPOSSIBLE') || monetizationVerdict?.includes('EXTREME RISK');
  const hasMonetizationRisk = monetizationVerdict && (
    monetizationVerdict.includes('IMPOSSIBLE') || 
    monetizationVerdict.includes('EXTREME RISK') || 
    monetizationVerdict.includes('HIGH RISK') ||
    monetizationVerdict.includes('UNLIKELY')
  );

  // Get top IP owners
  const topIpOwners = retrievedIps?.slice(0, 3).map(ip => ip.owner) || [];
  const detectedBrands = videoAnalysis?.detected_brands || [];
  const detectedObjects = videoAnalysis?.detected_objects || [];

  // Helper function to generate answers
  const getAnswer1 = (): string => {
    if (isApproved) {
      return `Yes, your content is approved for monetization. The analysis shows:\n\n• Safety checks: PASSED\n• Contamination score: ${contaminationPercent}% (below 5% threshold)\n• IP attribution: ${(totalScore * 100).toFixed(0)}% confidence\n• No copyright violations detected\n\nYour content meets all platform requirements and is ready for monetization with proper IP tracking in place.`;
    }
    if (isBlocked) {
      return `No, your content is blocked from monetization. The analysis indicates:\n\n• Contamination score: ${contaminationPercent}% (exceeds safe threshold)\n• Copyright risk: HIGH\n• Monetization verdict: ${monetizationVerdict || 'BLOCKED'}\n\nYour content contains unlicensed copyrighted material that prevents monetization. You should:\n\n1. Remove or replace copyrighted elements\n2. Obtain proper licenses for any IP used\n3. Create original content without copyrighted material\n\nSee the Monetization Status tab for detailed risk analysis.`;
    }
    return `Your content requires review before monetization. Current status:\n\n• Safety checks: ${passed ? 'PASSED' : 'FAILED'}\n• Contamination score: ${contaminationPercent}%\n• Monetization risk: ${hasMonetizationRisk ? 'HIGH' : 'MODERATE'}\n\n${hasMonetizationRisk ? 'There are significant copyright concerns that need to be addressed before monetization. See the Monetization Status tab for detailed recommendations.' : 'Please review the safety violations and IP attribution details to resolve any issues.'}`;
  };

  const getAnswer2 = (): string => {
    if (retrievedIps && retrievedIps.length > 0) {
      const ipList = retrievedIps.map((ip, index) => 
        `${index + 1}. ${ip.name || ip.owner}\n   • Owner: ${ip.owner}\n   • Type: ${ip.type.replace(/_/g, ' ')}\n   • Relevance: ${(ip.relevance_score * 100).toFixed(0)}%\n`
      ).join('\n');
      const mandatoryActions = finalAttribution?.details?.mandatory_actions || '1. Ensure proper attribution to all IP owners in your video description\n2. Include appropriate disclaimers if using trademarked elements\n3. Verify you have proper licensing or are within fair use guidelines\n4. Content is cleared for monetization with proper IP tracking';
      return `The following intellectual property has been detected in your content:\n\n${ipList}\n\nImportant Actions Required:\n\n${mandatoryActions}\n\nSee the Attribution Details tab for comprehensive IP analysis.`;
    }
    return 'No specific intellectual property was detected in your content. This suggests your content is original or uses elements that are not in our IP database. However, you should still:\n\n• Verify you have rights to all visual and audio elements\n• Check for any trademarks, logos, or copyrighted material\n• Ensure compliance with platform policies\n• Consider obtaining legal review for commercial use';
  };

  const getAnswer3 = (): string => {
    const status = contaminationScore < 0.05 ? '✅ WITHIN SAFE LIMITS' : contaminationScore < 0.1 ? '⚠️ MODERATE RISK' : '❌ HIGH RISK';
    const meaning = contaminationScore < 0.05
      ? 'Your content shows minimal model influence and is considered original creative work. This is ideal for monetization.'
      : contaminationScore < 0.1
      ? 'Your content shows some model influence but is still within acceptable limits. Monitor for any copyright concerns.'
      : 'Your content shows significant model influence, indicating potential copyright issues. Review and consider modifications before monetization.';
    const recommendations = contaminationScore < 0.05
      ? '• Your content is approved for monetization\n• Continue creating original content\n• Maintain proper IP attribution'
      : '• Review detected IP elements\n• Consider removing or replacing high-risk elements\n• Obtain proper licenses if needed\n• See Content Integrity Analysis for details';
    return `Your content has a contamination score of ${contaminationPercent}%.\n\nWhat is Contamination Score?\n\nThe contamination score measures how much your generated content may have been influenced by copyrighted material in the training data. It indicates the likelihood that your content contains elements derived from copyrighted sources.\n\nYour Score Breakdown:\n\n• Current Score: ${contaminationPercent}%\n• Safe Threshold: 5%\n• Status: ${status}\n\nWhat This Means:\n\n${meaning}\n\nRecommendations:\n\n${recommendations}`;
  };

  const getAnswer4 = (): string => {
    if (topIpOwners.length > 0) {
      const legalReality = finalAttribution?.details?.legal_reality || 'The video demonstrates original creative work. Trademarked elements are properly attributed and used within fair use guidelines for creative content.';
      const mandatoryActions = finalAttribution?.details?.mandatory_actions || '1. Include proper attribution in video description\n2. Add disclaimers for trademarked elements\n3. Review platform-specific policies\n4. Consult legal counsel for commercial use';
      return `Based on the analysis, your content includes IP from: ${topIpOwners.join(', ')}.\n\nLicensing Requirements:\n\n${legalReality}\n\nWhen You Need a License:\n\n• Commercial use of trademarks or logos\n• Direct reproduction of copyrighted material\n• Use of character likenesses or designs\n• Music or audio from copyrighted sources\n• Product placement or brand endorsements\n\nFair Use Considerations:\n\nYour content may qualify for fair use if:\n• It's transformative (adds new meaning or expression)\n• It's for commentary, criticism, or educational purposes\n• It uses only what's necessary for the purpose\n• It doesn't negatively impact the market for the original\n\nRecommended Actions:\n\n${mandatoryActions}\n\nNote: This analysis is not legal advice. Consult with an attorney for specific licensing requirements.`;
    }
    return 'No specific IP detected that requires licensing. However, you should still:\n\n• Verify you have rights to all visual and audio elements\n• Check for any trademarks, logos, or copyrighted material\n• Ensure compliance with platform policies\n• Consider obtaining legal review for commercial use';
  };

  const getAnswer5 = (): string => {
    const violations = postGenSafety?.violations && postGenSafety.violations.length > 0
      ? postGenSafety.violations.map(v => `• ${v}`).join('\n')
      : '• No violations detected';
    const finalRec = postGenSafety?.details?.final_recommendation || 'Content has passed all safety checks and is approved for use.';
    return `Your content underwent comprehensive safety checks with the following results:\n\nPre-Generation Safety Checks:\n\n• Violence filters: ${postGenSafety?.details?.violence_filters || 'PASSED'}\n• Hate/harassment: ${postGenSafety?.details?.hate_harassment || 'PASSED'}\n• Policy compliance: ${postGenSafety?.details?.policy_threshold || 'PASSED'}\n• License verification: ${postGenSafety?.details?.license_verified ? 'VERIFIED' : 'NOT VERIFIED'}\n\nPost-Generation Safety Checks:\n\n• Overall status: ${passed ? '✅ PASSED' : '❌ FAILED'}\n• Visual safety: ${postGenSafety?.details?.visual_safety || 'PASSED'}\n• Misinformation risk: ${postGenSafety?.details?.misinformation_risk || 'LOW'}\n• Deepfake risk: ${postGenSafety?.details?.deepfake_risk || 'N/A'}\n• Overfitting level: ${postGenSafety?.details?.overfitting_level || 'LOW'}\n\nViolations Detected:\n\n${violations}\n\nFinal Recommendation:\n\n${finalRec}\n\nSee the Content Analysis tab for detailed safety information.`;
  };

  const getAnswer6 = (): string => {
    const brandsList = detectedBrands.length > 0
      ? detectedBrands.map((brand, index) => `${index + 1}. ${brand}`).join('\n')
      : '• No specific brands detected';
    const objectsList = detectedObjects.length > 0
      ? detectedObjects.map((obj, index) => `${index + 1}. ${obj}`).join('\n')
      : '• No specific objects detected';
    const analysisDetails = videoAnalysis?.analysis || 'Video analysis completed successfully. See Content Analysis tab for comprehensive details.';
    const metrics = videoMetrics
      ? `• Frames analyzed: ${videoMetrics.frames_analyzed}\n• Embedding matches: ${videoMetrics.embedding_matches}\n• Analysis confidence: ${confidence > 0 ? (confidence * 100).toFixed(0) + '%' : 'N/A'}`
      : '• Video metrics not available';
    return `The video analysis detected the following elements:\n\nDetected Brands:\n\n${brandsList}\n\nDetected Objects:\n\n${objectsList}\n\nAnalysis Details:\n\n${analysisDetails}\n\nVideo Metrics:\n\n${metrics}\n\nWhat This Means:\n\nThese detections help identify potential IP concerns and ensure proper attribution. If brands or copyrighted objects are detected, ensure you have proper rights or are within fair use guidelines.`;
  };

  const getAnswer7 = (): string => {
    const algorithm = finalAttribution?.algorithm_used || initialAttribution?.algorithm_used || 'visual_recognition_and_metadata_check';
    const confidenceText = confidence >= 0.9
      ? 'HIGH CONFIDENCE - The attribution results are highly reliable. The detected IP matches are very likely accurate.'
      : confidence >= 0.7
      ? 'MODERATE CONFIDENCE - The attribution results are reasonably reliable but may require manual verification for critical decisions.'
      : 'LOW CONFIDENCE - The attribution results should be verified manually. Some detected IP may be false positives.';
    const visualMatch = finalAttribution?.details?.visual_match ? (Number(finalAttribution.details.visual_match) * 100).toFixed(0) + '%' : 'N/A';
    const audioMatch = finalAttribution?.details?.audio_match ? (Number(finalAttribution.details.audio_match) * 100).toFixed(0) + '%' : 'N/A';
    const temporalMatch = finalAttribution?.details?.temporal_match ? (Number(finalAttribution.details.temporal_match) * 100).toFixed(0) + '%' : 'N/A';
    const variance = finalAttribution?.variance_from_initial !== undefined ? (finalAttribution.variance_from_initial * 100).toFixed(1) + '%' : 'N/A';
    const recommendation = confidence >= 0.9
      ? 'You can proceed with confidence in the attribution results.'
      : 'Review the Attribution Details tab and verify critical IP matches manually.';
    return `The IP attribution analysis has a confidence score of ${(confidence * 100).toFixed(0)}%.\n\nAttribution Confidence Breakdown:\n\n• Total Score: ${(totalScore * 100).toFixed(0)}%\n• Confidence Level: ${(confidence * 100).toFixed(0)}%\n• Algorithm Used: ${algorithm}\n\nConfidence Interpretation:\n\n${confidenceText}\n\nFactors Affecting Accuracy:\n\n• Visual match quality: ${visualMatch}\n• Audio match quality: ${audioMatch}\n• Temporal match quality: ${temporalMatch}\n• Variance from initial: ${variance}\n\nRecommendation:\n\n${recommendation}`;
  };

  const getAnswer8 = (): string => {
    if (retrievedIps && retrievedIps.length > 0) {
      const requiredAttributions = retrievedIps.map((ip, index) => 
        `${index + 1}. ${ip.name || ip.owner}\n   - Owner: ${ip.owner}\n   - Type: ${ip.type.replace(/_/g, ' ')}\n   - Attribution: "This video features elements related to ${ip.owner}. All trademarks and copyrights belong to their respective owners."`
      ).join('\n\n');
      const attributionList = retrievedIps.map(ip => `• ${ip.owner} - ${ip.name || 'IP elements'}`).join('\n');
      const mandatoryActions = finalAttribution?.details?.mandatory_actions || '1. Include clear attribution to all IP owners\n2. Add appropriate disclaimers\n3. Specify fair use purpose if applicable\n4. Include links to original creators if available\n5. Follow platform-specific attribution requirements';
      return `Based on the detected IP, you should include the following in your video description:\n\nRequired Attribution:\n\n${requiredAttributions}\n\nStandard Attribution Template:\n\nATTRIBUTIONS:\n${attributionList}\n\nDISCLAIMER:\nThis video is for entertainment/educational purposes only. All trademarks, copyrights, and intellectual property belong to their respective owners. This content is not affiliated with, endorsed by, or sponsored by any of the mentioned entities.\n\nAdditional Recommendations:\n\n${mandatoryActions}\n\nPlatform-Specific Notes:\n\n• YouTube: Include attributions in description, consider end-screen credits\n• TikTok: Add attributions in video description\n• Instagram: Include in caption or story credits\n• Facebook: Add to post description\n\nLegal Note: Proper attribution helps but does not guarantee fair use. Consult legal counsel for commercial use.`;
    }
    return 'No specific IP attribution required based on current analysis. However, you should still:\n\n• Include general disclaimers if using any third-party content\n• Follow platform-specific attribution requirements\n• Document any sources used in your content';
  };

  const getAnswer9 = (): string => {
    const youtubeStatus = isApproved
      ? '✅ Eligible for monetization with proper attribution'
      : '⚠️ Review required - may face copyright claims or demonetization';
    const tiktokStatus = contaminationScore < 0.1
      ? '✅ Generally safe, but monitor for IP concerns'
      : '⚠️ May face content removal or account restrictions';
    const instagramStatus = passed && contaminationScore < 0.05
      ? '✅ Safe for posting with proper attribution'
      : '⚠️ Review IP concerns before posting';
    const twitterStatus = contaminationScore < 0.2
      ? '✅ Generally acceptable'
      : '⚠️ May face DMCA takedowns';
    const riskAssessment = isApproved
      ? 'LOW RISK - Your content is approved and should work across most platforms with proper attribution.'
      : hasMonetizationRisk
      ? 'HIGH RISK - Your content may face restrictions or removal on some platforms. Address IP concerns before cross-posting.'
      : 'MODERATE RISK - Review platform policies and ensure proper attribution before posting.';
    return `Platform eligibility depends on your content's compliance status:\n\nCurrent Status:\n\n• Safety checks: ${passed ? '✅ PASSED' : '❌ FAILED'}\n• Contamination score: ${contaminationPercent}%\n• Monetization status: ${isApproved ? 'APPROVED' : isBlocked ? 'BLOCKED' : 'REVIEW REQUIRED'}\n• IP attribution: ${(totalScore * 100).toFixed(0)}% confidence\n\nPlatform-Specific Considerations:\n\nYouTube:\n${youtubeStatus}\n\nTikTok:\n${tiktokStatus}\n\nInstagram/Facebook:\n${instagramStatus}\n\nTwitter/X:\n${twitterStatus}\n\nGeneral Guidelines:\n\n• Always include proper attribution\n• Review platform-specific IP policies\n• Monitor for copyright claims\n• Be prepared to respond to takedown notices\n• Consider platform age restrictions\n\nRisk Assessment:\n\n${riskAssessment}\n\nRecommendation:\n\nStart with platforms that have more lenient IP policies, then expand based on performance and feedback.`;
  };

  const getAnswer10 = (): string => {
    const immediateActions = isApproved
      ? '1. ✅ Proceed with Monetization\n   - Your content is approved and ready\n   - Add proper attribution to video description\n   - Upload to your chosen platform(s)\n   - Monitor for any copyright claims\n\n2. 📝 Document Attribution\n   - Save this analysis report\n   - Keep records of IP attributions\n   - Maintain proof of compliance\n\n3. 🎯 Optimize for Platforms\n   - Add required attributions\n   - Follow platform-specific guidelines\n   - Prepare metadata and tags'
      : isBlocked
      ? '1. ⚠️ Address Copyright Issues\n   - Review detected IP elements\n   - Remove or replace copyrighted material\n   - Obtain proper licenses if needed\n   - Re-run analysis after changes\n\n2. 🔄 Modify Content\n   - Create original alternatives\n   - Use licensed stock content\n   - Transform content to qualify for fair use\n\n3. 📋 Legal Review\n   - Consult with IP attorney\n   - Review licensing options\n   - Understand fair use limitations'
      : '1. 📊 Review Detailed Analysis\n   - Check Monetization Status tab\n   - Review IP Attribution Details\n   - Understand safety violations\n\n2. 🔧 Address Issues\n   - Resolve any safety violations\n   - Clarify IP attribution concerns\n   - Lower contamination score if needed\n\n3. ✅ Re-analyze if Needed\n   - Make necessary changes\n   - Run new analysis\n   - Verify compliance';
    return `Based on your analysis results, here are the recommended next steps:\n\nImmediate Actions:\n\n${immediateActions}\n\nOngoing Best Practices:\n\n• Monitor content performance\n• Track copyright claims\n• Maintain attribution records\n• Stay updated on platform policies\n• Review content periodically\n• Keep analysis reports for reference\n\nResources:\n\n• Attribution Details tab: Comprehensive IP breakdown\n• Monetization Status tab: Risk assessment and recommendations\n• Content Analysis tab: Safety and integrity details\n• Execution Logs tab: Technical analysis process\n\nSupport:\n\nIf you have questions about specific IP or need legal guidance, consult with an intellectual property attorney familiar with content creation and platform policies.`;
  };

  // Generate all questions based on analysis
  const allQuestions: Question[] = useMemo(() => [
    {
      id: 'q1',
      question: 'Is my content approved for monetization?',
      answer: getAnswer1(),
      icon: <RiMoneyDollarCircleLine className="w-5 h-5" />,
      category: 'Monetization',
    },
    {
      id: 'q2',
      question: 'What intellectual property (IP) is detected in my content?',
      answer: getAnswer2(),
      icon: <RiCopyrightLine className="w-5 h-5" />,
      category: 'IP Attribution',
    },
    {
      id: 'q3',
      question: 'What is the contamination score and what does it mean?',
      answer: getAnswer3(),
      icon: <RiAlertLine className="w-5 h-5" />,
      category: 'Content Integrity',
    },
    {
      id: 'q4',
      question: 'Do I need to obtain licenses for the detected IP?',
      answer: getAnswer4(),
      icon: <RiFileTextLine className="w-5 h-5" />,
      category: 'Legal',
    },
    {
      id: 'q5',
      question: 'What safety checks were performed and did my content pass?',
      answer: getAnswer5(),
      icon: <RiShieldCheckLine className="w-5 h-5" />,
      category: 'Safety',
    },
    {
      id: 'q6',
      question: 'What brands and objects were detected in my video?',
      answer: getAnswer6(),
      icon: <RiVideoLine className="w-5 h-5" />,
      category: 'Video Analysis',
    },
    {
      id: 'q7',
      question: 'How accurate is the IP attribution analysis?',
      answer: getAnswer7(),
      icon: <RiBarChartLine className="w-5 h-5" />,
      category: 'IP Attribution',
    },
    {
      id: 'q8',
      question: 'What should I include in my video description for proper attribution?',
      answer: getAnswer8(),
      icon: <RiFileTextLine className="w-5 h-5" />,
      category: 'Attribution',
    },
    {
      id: 'q9',
      question: 'Can I use this content on different platforms?',
      answer: getAnswer9(),
      icon: <RiCheckboxCircleLine className="w-5 h-5" />,
      category: 'Platform',
    },
    {
      id: 'q10',
      question: 'What are the next steps after this analysis?',
      answer: getAnswer10(),
      icon: <RiQuestionLine className="w-5 h-5" />,
      category: 'Next Steps',
    },
  ], [isApproved, isBlocked, hasMonetizationRisk, passed, contaminationPercent, totalScore, monetizationVerdict, retrievedIps, finalAttribution, postGenSafety, topIpOwners, contaminationScore, detectedBrands, detectedObjects, videoAnalysis, videoMetrics, confidence, initialAttribution]);

  // Select 5 random questions based on prompt
  const questions = useMemo(() => {
    const seed = hashString(prompt);
    const shuffled = shuffleWithSeed(allQuestions, seed);
    return shuffled.slice(0, 5);
  }, [prompt, allQuestions]);

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h3>
        <p className="text-gray-600 text-sm">
          Common questions about your content analysis, IP attribution, and monetization status. Click on any question to see the detailed answer.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, index) => {
          const isExpanded = expandedQuestions.has(q.id);
          
          return (
            <div
              key={q.id}
              className="bg-white border border-brand-mint-green/30 rounded-lg overflow-hidden hover:border-brand-orange transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => toggleQuestion(q.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-brand-cream/30 transition-colors duration-200"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 text-brand-orange font-bold text-base">
                    {index + 1}.
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900">
                      {q.question}
                    </h4>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4 text-gray-400">
                  {isExpanded ? (
                    <RiArrowUpSLine className="w-5 h-5" />
                  ) : (
                    <RiArrowDownSLine className="w-5 h-5" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-brand-mint-green/20 bg-brand-cream/10">
                  <div className="pl-12">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {q.answer}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

