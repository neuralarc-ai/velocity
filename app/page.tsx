'use client';

import { useState, useEffect } from 'react';
import { StrandPipeline } from '@/lib/pipeline';
import { PipelineResult } from '@/lib/models';
import { VIDEO_EXAMPLES, matchPromptToExample, type VideoExample } from '@/lib/examples';
import { formatPercentage, formatPercentageValue } from '@/lib/utils';
import LandingPage from '@/components/LandingPage/LandingPage';
import ProcessingPage from '@/components/ProcessingPage/ProcessingPage';
import ResultsPage from '@/components/ResultsPage/ResultsPage';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending' | 'Failed' | 'Blocked' | 'Skipped';
  description: string;
  details?: string[];
}

type PageState = 'landing' | 'processing' | 'results';

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('landing');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [prompt, setPrompt] = useState('');
  const [matchedExample, setMatchedExample] = useState<string | null>(null);
  const [matchedExampleData, setMatchedExampleData] = useState<VideoExample | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [processingStepIndex, setProcessingStepIndex] = useState<number>(0);
  const [generationBlocked, setGenerationBlocked] = useState<boolean>(false);
  const [failedSteps, setFailedSteps] = useState<string[]>([]);

  // Map pipeline steps to processing page steps (12 analysis steps)
  const TOTAL_PROCESSING_STEPS = 12;

  const handleStartAnalysis = (inputPrompt: string) => {
    setPrompt(inputPrompt);
    setPageState('processing');
    setProcessingStepIndex(0);
    handleRunPipeline(inputPrompt);
  };

  const handleNewAnalysis = () => {
    setPageState('landing');
    setPrompt('');
    setResult(null);
    setCurrentStep(0);
    setMatchedExample(null);
    setMatchedExampleData(null);
    setProcessSteps([]);
    setProcessingStepIndex(0);
    setIsRunning(false);
    setGenerationBlocked(false);
    setFailedSteps([]);
  };

  const handleRunPipeline = async (inputPrompt: string) => {
    setIsRunning(true);
    setResult(null);
    setCurrentStep(0);
    setMatchedExample(null);
    setProcessingStepIndex(0);
    setGenerationBlocked(false);
    setFailedSteps([]);

    // Start with empty steps - they'll be added one by one
    setProcessSteps([]);

    // Track start time for realistic processing time calculation
    const processingStartTime = Date.now();

      // Define step delays for each video to ensure unique processing times
      // Format: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12]
      // Target times: Spider-Man: 125s, Baahubali: 98s, Ford GT40: 112s, McDonald's: 105s, Samsung: 108s, Wick-Hunt: 95s (fails early)
      const stepDelaysConfig: Record<string, number[]> = {
        'example_1': [4500, 9000, 6600, 11400, 9600, 7800, 28500, 14400, 10500, 8400, 6900, 6000], // Spider-Man: ~125s total
        'battle_001': [3600, 7500, 5400, 9600, 8400, 6600, 25500, 12600, 9000, 7200, 6000, 5400], // Baahubali: ~98s total
        'gt40_gulf_001': [4200, 8400, 6000, 10500, 9000, 7200, 27000, 13500, 9600, 7800, 6600, 5700], // Ford GT40: ~112s total
        'example_4': [3900, 8100, 5700, 10200, 8700, 6900, 26400, 13200, 9300, 7500, 6300, 5550], // McDonald's: ~105s total
        'totoro_forest_encounter_001': [3500, 7000, 5000, 9000, 8000, 6500, 2000, 0, 0, 0, 0, 0], // Totoro: ~40s total (fails at step 7)
        'wick_hunt_crossover_001': [3500, 7000, 5000, 9000, 8000, 6500, 2000, 0, 0, 0, 0, 0], // Wick-Hunt: ~40s total (fails at step 7)
      };

    try {
      const pipeline = new StrandPipeline();
      
      // Simulate step-by-step execution - add steps one by one
      const addStep = (stepId: number, title: string, description: string, status: ProcessStep['status'], details?: string[]) => {
        const newStep: ProcessStep = {
          id: stepId,
          title,
          status,
          description,
          details,
        };
        
        setProcessSteps(prev => {
          // Check if step already exists
          const existingIndex = prev.findIndex(s => s.id === stepId);
          if (existingIndex >= 0) {
            // Update existing step
            return prev.map((step, idx) => 
              idx === existingIndex ? newStep : step
            );
          } else {
            // Add new step
            return [...prev, newStep];
          }
        });
        setCurrentStep(stepId);
      };

      // Step 1: Prompt Receipt (maps to Analysis Step 0: Market research)
      setProcessingStepIndex(0);
      addStep(1, 'Prompt Receipt', 'Original prompt received and validated', 'Running');
      
      // Get matched example early to determine delays
      const matchedExample = matchPromptToExample(inputPrompt);
      if (!matchedExample) {
        throw new Error('Failed to match prompt to example');
      }
      setMatchedExample(matchedExample.id);
      setMatchedExampleData(matchedExample);
      
      // Get step delays for this video
      const stepDelays = stepDelaysConfig[matchedExample.id] || stepDelaysConfig['battle_001'];
      
      await new Promise(resolve => setTimeout(resolve, stepDelays[0]));
      addStep(1, 'Prompt Receipt', 'Original prompt received and validated', 'Complete', [`Prompt: "${inputPrompt}"`]);

      // Step 2: Semantic Analysis (maps to Analysis Step 1: Competitor analysis)
      setProcessingStepIndex(1);
      addStep(2, 'Semantic Analysis', 'Prompt analyzed for creative intent', 'Running');
      await new Promise(resolve => setTimeout(resolve, stepDelays[1]));
      
      const analysisDetails = [
        `Intent: ${matchedExample.name} content creation`,
        `IP Elements: ${matchedExample.results.retrieved_context.retrieved_ips.map(ip => ip.name).join(', ')}`,
        `Detected Objects: ${matchedExample.results.video_analysis.detected_objects.join(', ')}`,
        `Brands: ${matchedExample.results.video_analysis.detected_brands.join(', ')}`,
      ];
      addStep(2, 'Semantic Analysis', 'Prompt analyzed for creative intent', 'Complete', analysisDetails);

      // Step 3: Safety Check (maps to Analysis Step 2: Target audience)
      setProcessingStepIndex(2);
      addStep(3, 'ID Safety Check (Pre-Gen)', 'No safety violations detected in prompt', 'Running');
      await new Promise(resolve => setTimeout(resolve, stepDelays[2]));
      
      // Check if pre-gen safety passed
      const preGenSafetyPassed = matchedExample.results.pre_gen_safety.passed;
      if (!preGenSafetyPassed) {
        addStep(3, 'ID Safety Check (Pre-Gen)', 'Safety check failed - IP conflict detected', 'Failed', [
          'IP universe conflict detected',
          ...(matchedExample.results.pre_gen_safety.violation_details?.map((v: any) => v.description || v.violation_type) || []),
        ]);
        setGenerationBlocked(true);
        setFailedSteps(['safety-check', 'video-generation', 'output-analysis', 'final-attribution', 'contamination-detection', 'post-safety-check', 'monetization-validation']);
      } else {
        addStep(3, 'ID Safety Check (Pre-Gen)', 'No safety violations detected in prompt', 'Passed', ['Checked against 3 IP safety rules']);
      }

      // Step 4: Content Retrieval (maps to Analysis Step 3: Business model validation)
      setProcessingStepIndex(3);
      addStep(4, 'Content Retrieval', 'Retrieved relevant IP sources', 'Running');
      await new Promise(resolve => setTimeout(resolve, stepDelays[3]));
      const ipSources = matchedExample.results.retrieved_context.retrieved_ips;
      addStep(4, 'Content Retrieval', 'Retrieved relevant IP sources', 'Complete', [
        `Retrieved ${ipSources.length} relevant IP sources`,
        ...ipSources.map(ip => `${ip.owner}: ${formatPercentage(ip.relevance_score)}% relevance`),
      ]);

      // Step 5: Initial Attribution (maps to Analysis Step 4: Revenue projections)
      setProcessingStepIndex(4);
      addStep(5, 'Initial Attribution', 'Pre-generation attribution calculated', 'Running');
      await new Promise(resolve => setTimeout(resolve, stepDelays[4]));
      const initialAttributions = Object.entries(matchedExample.results.initial_attribution.ip_attributions);
      addStep(5, 'Initial Attribution', 'Pre-generation attribution calculated', 'Complete', [
        'Pre-generation attribution calculated',
        ...initialAttributions.map(([owner, score]) => `${owner}: ${formatPercentage(Number(score))}%`),
      ]);

      // Step 6: Prompt Augmentation (maps to Analysis Step 5: Risk assessment)
      setProcessingStepIndex(5);
      addStep(6, 'Prompt Augmentation', 'Prompt enhanced with IP-specific guidance', 'Running');
      await new Promise(resolve => setTimeout(resolve, stepDelays[5]));
      addStep(6, 'Prompt Augmentation', 'Prompt enhanced with IP-specific guidance', 'Complete', [
        'Prompt enhanced with IP-specific guidance',
        'Added cinematic lighting, composition, and style directives based on retrieved content',
      ]);

      // Step 7: Video Generation (maps to Analysis Step 6: Project timeline)
      setProcessingStepIndex(6);
      addStep(7, 'Video Generation', 'AI model executed with augmented prompt', 'Running');
      await new Promise(resolve => setTimeout(resolve, stepDelays[6]));
      
      if (generationBlocked) {
        addStep(7, 'Video Generation', 'Generation blocked due to IP conflict', 'Blocked', [
          'Generation blocked',
          'IP universe conflict detected - cannot generate video',
          matchedExample.results.pre_gen_safety.details?.generation_blocked_reason as string || 'IP conflict between competing studios',
        ]);
        
        // Show subsequent steps one by one with delays, marked as skipped
        // Step 8: Output Analysis
        setProcessingStepIndex(7);
        addStep(8, 'Output Analysis', 'Cannot analyze - no video generated', 'Running');
        await new Promise(resolve => setTimeout(resolve, 800));
        addStep(8, 'Output Analysis', 'Skipped - no video generated', 'Skipped', [
          'Step skipped due to generation failure',
          'No video was generated to analyze',
        ]);
        
        // Step 9: Final Attribution
        setProcessingStepIndex(8);
        addStep(9, 'Final Attribution', 'Cannot verify - no video generated', 'Running');
        await new Promise(resolve => setTimeout(resolve, 800));
        addStep(9, 'Final Attribution', 'Skipped - no video generated', 'Skipped', [
          'Step skipped due to generation failure',
          'Attribution analysis requires generated video',
        ]);
        
        // Step 10: Contamination Detection
        setProcessingStepIndex(9);
        addStep(10, 'Contamination Detection', 'Cannot detect - no video generated', 'Running');
        await new Promise(resolve => setTimeout(resolve, 800));
        // Still show contamination from pre-gen analysis
        const contamination = matchedExample.results.post_gen_safety.contamination_score * 100;
        addStep(10, 'Contamination Detection', 'Skipped - no video generated', 'Skipped', [
          'Step skipped due to generation failure',
          `Pre-gen contamination detected: ${formatPercentageValue(contamination)}%`,
          'High contamination was a factor in blocking generation',
        ]);
        
        // Step 11: IP Safety Check (Post-Gen)
        setProcessingStepIndex(10);
        addStep(11, 'IP Safety Check (Post-Gen)', 'Cannot validate - no video generated', 'Running');
        await new Promise(resolve => setTimeout(resolve, 800));
        addStep(11, 'IP Safety Check (Post-Gen)', 'Skipped - no video generated', 'Skipped', [
          'Step skipped due to generation failure',
          'Post-generation safety check requires generated video',
        ]);
        
        // Step 12: Monetization Validation
        setProcessingStepIndex(11);
        addStep(12, 'Monetization Validation', 'Evaluating monetization status', 'Running');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check monetization status from analysis
        const postGenSafety = matchedExample.results.post_gen_safety;
        const finalAttribution = matchedExample.results.final_attribution;
        const monetizationVerdict = finalAttribution.details?.monetization_verdict as string | undefined;
        const isMonetizationBlocked = monetizationVerdict && (
          monetizationVerdict.includes('IMPOSSIBLE') || 
          monetizationVerdict.includes('EXTREME RISK') || 
          monetizationVerdict.includes('BLOCKED') ||
          monetizationVerdict.includes('RESTRICTED')
        );
        
        if (isMonetizationBlocked) {
          addStep(12, 'Monetization Validation', 'Monetization blocked due to IP conflicts', 'Blocked', [
            'Monetization blocked',
            monetizationVerdict || 'IP conflicts prevent commercial use',
            ...(finalAttribution.details?.mandatory_actions ? [finalAttribution.details.mandatory_actions as string] : []),
          ]);
        } else {
          addStep(12, 'Monetization Validation', 'Monetization not approved', 'Complete', [
            'Monetization status: Not approved',
            'Content cannot be monetized due to generation failure',
            'IP conflicts prevent commercial use',
          ]);
        }
        
        // Execute pipeline to get results (it will handle the failure)
        const finalResult = await pipeline.execute(inputPrompt);
        finalResult.total_duration_ms = Date.now() - processingStartTime;
        setResult(finalResult);
        
        // Show failure state briefly, then transition to results
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPageState('results');
        setIsRunning(false);
        return; // Exit early - don't continue with subsequent steps
      } else {
        addStep(7, 'Video Generation', 'AI model executed with augmented prompt', 'Complete', [
          'AI model executed with augmented prompt',
          `Model: Mochi-1 | Duration: ${matchedExample.results.generated_video.duration} seconds | Resolution: ${matchedExample.results.generated_video.resolution}`,
        ]);

        // Step 8: Output Analysis (maps to Analysis Step 7: Go-to-market strategy)
        setProcessingStepIndex(7);
        addStep(8, 'Output Analysis', 'Generated video analyzed frame-by-frame', 'Running');
        await new Promise(resolve => setTimeout(resolve, stepDelays[7]));
        const framesAnalyzed = matchedExample.results.video_metrics?.frames_analyzed || 240;
        const embeddingMatches = matchedExample.results.video_metrics?.embedding_matches || 238;
        addStep(8, 'Output Analysis', 'Generated video analyzed frame-by-frame', 'Complete', [
          'Generated video analyzed frame-by-frame',
          `Processed ${framesAnalyzed} frames | Extracted embeddings for comparison`,
        ]);

        // Step 9: Final Attribution (maps to Analysis Step 8: Funding requirements)
        setProcessingStepIndex(8);
        addStep(9, 'Final Attribution', 'Post-generation attribution verified', 'Running');
        await new Promise(resolve => setTimeout(resolve, stepDelays[8]));
        const finalAttributions = Object.entries(matchedExample.results.final_attribution.ip_attributions);
        addStep(9, 'Final Attribution', 'Post-generation attribution verified', 'Complete', [
          'Post-generation attribution verified',
          ...finalAttributions.map(([owner, score]) => `${owner}: ${formatPercentage(Number(score))}%`),
        ]);

        // Step 10: Contamination Detection (maps to Analysis Step 9: Financial plan)
        setProcessingStepIndex(9);
        addStep(10, 'Contamination Detection', 'Model contamination checked', 'Running');
        await new Promise(resolve => setTimeout(resolve, stepDelays[9]));
        const contamination = matchedExample.results.post_gen_safety.contamination_score * 100;
        const contaminationThreshold = (matchedExample.results.post_gen_safety.contamination_threshold ?? 0.05) * 100;
        const contaminationPassed = contamination < contaminationThreshold;
        
        if (contaminationPassed) {
          addStep(10, 'Contamination Detection', 'Model contamination checked', 'Passed', [
            `Model contamination: ${formatPercentageValue(contamination)}%`,
            `Threshold: ${contaminationThreshold}%`,
            'Detected minimal influence from model training data. Within acceptable threshold.',
          ]);
        } else {
          addStep(10, 'Contamination Detection', 'High contamination detected', 'Failed', [
            `Model contamination: ${formatPercentageValue(contamination)}%`,
            `Threshold: ${contaminationThreshold}%`,
            'Contamination exceeds acceptable threshold.',
            'High reliance on protected IP detected.',
          ]);
        }

        // Step 11: IP Safety Check (maps to Analysis Step 10: Milestones)
        setProcessingStepIndex(10);
        addStep(11, 'IP Safety Check (Post-Gen)', 'Output validated against IP safety rules', 'Running');
        await new Promise(resolve => setTimeout(resolve, stepDelays[10]));
        
        const postGenSafetyPassed = matchedExample.results.post_gen_safety.passed;
        const violations = matchedExample.results.post_gen_safety.violations || [];
        
        if (postGenSafetyPassed && violations.length === 0) {
          addStep(11, 'IP Safety Check (Post-Gen)', 'Output validated against IP safety rules', 'Passed', [
            'Output validated against IP safety rules',
            'No violations detected in generated content.',
          ]);
        } else {
          addStep(11, 'IP Safety Check (Post-Gen)', 'IP safety violations detected', 'Failed', [
            'IP safety violations detected',
            ...violations,
            ...(matchedExample.results.post_gen_safety.violation_details?.map((v: any) => v.description || v.violation_type) || []),
          ]);
        }

        // Step 12: Monetization Validation
        setProcessingStepIndex(11); // 0-based index (12th step = index 11)
        addStep(12, 'Monetization Validation', 'Content approved for monetization', 'Running');
        await new Promise(resolve => setTimeout(resolve, stepDelays[11]));
        
        // Check actual monetization status from analysis
        const postGenSafety = matchedExample.results.post_gen_safety;
        const finalAttribution = matchedExample.results.final_attribution;
        const passed = postGenSafety.passed;
        const contaminationScore = postGenSafety.contamination_score ?? 1;
        const monetizationVerdict = finalAttribution.details?.monetization_verdict as string | undefined;
        
        const hasMonetizationRisk = monetizationVerdict && (
          monetizationVerdict.includes('IMPOSSIBLE') || 
          monetizationVerdict.includes('EXTREME RISK') || 
          monetizationVerdict.includes('HIGH RISK') ||
          monetizationVerdict.includes('UNLIKELY') ||
          monetizationVerdict.includes('BLOCKED') ||
          monetizationVerdict.includes('RESTRICTED')
        );
        
        const isActuallyApproved = passed && contaminationScore < 0.05 && !hasMonetizationRisk;
        
        if (isActuallyApproved) {
          addStep(12, 'Monetization Validation', 'Content approved for monetization', 'Approved', [
            'Content approved for monetization',
            'All safety checks passed | Attribution complete | Ready for release.',
            `Contamination: ${formatPercentage(contaminationScore)}% (within threshold)`,
          ]);
        } else if (hasMonetizationRisk) {
          addStep(12, 'Monetization Validation', 'Monetization blocked due to IP conflicts', 'Blocked', [
            'Monetization blocked',
            monetizationVerdict || 'IP conflicts prevent commercial use',
            `Contamination: ${formatPercentage(contaminationScore)}% (exceeds threshold)`,
            ...(finalAttribution.details?.mandatory_actions ? [finalAttribution.details.mandatory_actions as string] : []),
          ]);
        } else {
          addStep(12, 'Monetization Validation', 'Monetization not approved', 'Complete', [
            'Monetization not approved',
            `Contamination: ${formatPercentage(contaminationScore)}%`,
            'Review required before monetization',
          ]);
        }
      }

      // Execute pipeline
      const finalResult = await pipeline.execute(inputPrompt);
      
      // Calculate actual processing time (this will match the sum of step delays)
      const processingEndTime = Date.now();
      const actualProcessingTime = processingEndTime - processingStartTime;
      
      // Update result with actual processing time (this will be the real time taken)
      finalResult.total_duration_ms = actualProcessingTime;
      
      setResult(finalResult);
      
      // Ensure processing step index is at max for 100% progress
      setProcessingStepIndex(11);
      
      // Small delay to show 100% completion, then switch to results
      await new Promise(resolve => setTimeout(resolve, 500));
      setPageState('results');
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      // On error, still show results page with error state
      setPageState('results');
    } finally {
      setIsRunning(false);
    }
  };

  // Render based on current page state
  if (pageState === 'landing') {
    return <LandingPage onStartAnalysis={handleStartAnalysis} />;
  }

  if (pageState === 'processing') {
    return (
      <ProcessingPage
        prompt={prompt}
        currentStepIndex={processingStepIndex}
        totalSteps={TOTAL_PROCESSING_STEPS}
        onComplete={() => {
          // This will be called when processing completes
          // The actual transition happens in handleRunPipeline
        }}
        generationBlocked={generationBlocked}
        failedSteps={failedSteps}
      />
    );
  }

  if (pageState === 'results' && result) {
    return (
      <ResultsPage
        result={result}
        prompt={prompt}
        processSteps={processSteps}
        matchedExampleData={matchedExampleData}
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  // Fallback to landing page
  return <LandingPage onStartAnalysis={handleStartAnalysis} />;
}
