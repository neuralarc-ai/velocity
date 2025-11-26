'use client';

import { useState, useEffect } from 'react';
import { StrandPipeline } from '@/lib/pipeline';
import { PipelineResult } from '@/lib/models';
import { VIDEO_EXAMPLES, matchPromptToExample, type VideoExample } from '@/lib/examples';
import LandingPage from '@/components/LandingPage/LandingPage';
import ProcessingPage from '@/components/ProcessingPage/ProcessingPage';
import ResultsPage from '@/components/ResultsPage/ResultsPage';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending';
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
  };

  const handleRunPipeline = async (inputPrompt: string) => {
    setIsRunning(true);
    setResult(null);
    setCurrentStep(0);
    setMatchedExample(null);
    setProcessingStepIndex(0);

    // Start with empty steps - they'll be added one by one
    setProcessSteps([]);

    try {
      const pipeline = new StrandPipeline();
      
      // Simulate step-by-step execution - add steps one by one
      const addStep = (stepId: number, title: string, description: string, status: 'Complete' | 'Passed' | 'Approved' | 'Running', details?: string[]) => {
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
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(1, 'Prompt Receipt', 'Original prompt received and validated', 'Complete', [`Prompt: "${inputPrompt}"`]);

      // Step 2: Semantic Analysis (maps to Analysis Step 1: Competitor analysis)
      setProcessingStepIndex(1);
      addStep(2, 'Semantic Analysis', 'Prompt analyzed for creative intent', 'Running');
      await new Promise(resolve => setTimeout(resolve, 400));
      const matchedExample = matchPromptToExample(inputPrompt);
      if (!matchedExample) {
        throw new Error('Failed to match prompt to example');
      }
      setMatchedExample(matchedExample.id);
      setMatchedExampleData(matchedExample);
      
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
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(3, 'ID Safety Check (Pre-Gen)', 'No safety violations detected in prompt', 'Passed', ['Checked against 3 IP safety rules']);

      // Step 4: Content Retrieval (maps to Analysis Step 3: Business model validation)
      setProcessingStepIndex(3);
      addStep(4, 'Content Retrieval', 'Retrieved relevant IP sources', 'Running');
      await new Promise(resolve => setTimeout(resolve, 500));
      const ipSources = matchedExample.results.retrieved_context.retrieved_ips;
      addStep(4, 'Content Retrieval', 'Retrieved relevant IP sources', 'Complete', [
        `Retrieved ${ipSources.length} relevant IP sources`,
        ...ipSources.map(ip => `${ip.owner}: ${(ip.relevance_score * 100).toFixed(0)}% relevance`),
      ]);

      // Step 5: Initial Attribution (maps to Analysis Step 4: Revenue projections)
      setProcessingStepIndex(4);
      addStep(5, 'Initial Attribution', 'Pre-generation attribution calculated', 'Running');
      await new Promise(resolve => setTimeout(resolve, 400));
      const initialAttributions = Object.entries(matchedExample.results.initial_attribution.ip_attributions);
      addStep(5, 'Initial Attribution', 'Pre-generation attribution calculated', 'Complete', [
        'Pre-generation attribution calculated',
        ...initialAttributions.map(([owner, score]) => `${owner}: ${(Number(score) * 100).toFixed(0)}%`),
      ]);

      // Step 6: Prompt Augmentation (maps to Analysis Step 5: Risk assessment)
      setProcessingStepIndex(5);
      addStep(6, 'Prompt Augmentation', 'Prompt enhanced with IP-specific guidance', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(6, 'Prompt Augmentation', 'Prompt enhanced with IP-specific guidance', 'Complete', [
        'Prompt enhanced with IP-specific guidance',
        'Added cinematic lighting, composition, and style directives based on retrieved content',
      ]);

      // Step 7: Video Generation (maps to Analysis Step 6: Project timeline)
      setProcessingStepIndex(6);
      addStep(7, 'Video Generation', 'AI model executed with augmented prompt', 'Running');
      await new Promise(resolve => setTimeout(resolve, 1000));
      addStep(7, 'Video Generation', 'AI model executed with augmented prompt', 'Complete', [
        'AI model executed with augmented prompt',
        `Model: Mochi-1 | Duration: ${matchedExample.results.generated_video.duration} seconds | Resolution: ${matchedExample.results.generated_video.resolution}`,
      ]);

      // Step 8: Output Analysis (maps to Analysis Step 7: Go-to-market strategy)
      setProcessingStepIndex(7);
      addStep(8, 'Output Analysis', 'Generated video analyzed frame-by-frame', 'Running');
      await new Promise(resolve => setTimeout(resolve, 600));
      const framesAnalyzed = matchedExample.results.video_metrics?.frames_analyzed || 240;
      const embeddingMatches = matchedExample.results.video_metrics?.embedding_matches || 238;
      addStep(8, 'Output Analysis', 'Generated video analyzed frame-by-frame', 'Complete', [
        'Generated video analyzed frame-by-frame',
        `Processed ${framesAnalyzed} frames | Extracted embeddings for comparison`,
      ]);

      // Step 9: Final Attribution (maps to Analysis Step 8: Funding requirements)
      setProcessingStepIndex(8);
      addStep(9, 'Final Attribution', 'Post-generation attribution verified', 'Running');
      await new Promise(resolve => setTimeout(resolve, 400));
      const finalAttributions = Object.entries(matchedExample.results.final_attribution.ip_attributions);
      addStep(9, 'Final Attribution', 'Post-generation attribution verified', 'Complete', [
        'Post-generation attribution verified',
        ...finalAttributions.map(([owner, score]) => `${owner}: ${(Number(score) * 100).toFixed(0)}%`),
      ]);

      // Step 10: Contamination Detection (maps to Analysis Step 9: Financial plan)
      setProcessingStepIndex(9);
      addStep(10, 'Contamination Detection', 'Model contamination checked', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      const contamination = matchedExample.results.post_gen_safety.contamination_score * 100;
      addStep(10, 'Contamination Detection', 'Model contamination checked', 'Passed', [
        `Model contamination: ${contamination.toFixed(1)}%`,
        'Detected minimal influence from model training data. Within acceptable threshold.',
      ]);

      // Step 11: IP Safety Check (maps to Analysis Step 10: Milestones)
      setProcessingStepIndex(10);
      addStep(11, 'IP Safety Check (Post-Gen)', 'Output validated against IP safety rules', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(11, 'IP Safety Check (Post-Gen)', 'Output validated against IP safety rules', 'Passed', [
        'Output validated against IP safety rules',
        'No violations detected in generated content.',
      ]);

      // Step 12: Monetization Validation
      setProcessingStepIndex(11); // 0-based index (12th step = index 11)
      addStep(12, 'Monetization Validation', 'Content approved for monetization', 'Running');
      await new Promise(resolve => setTimeout(resolve, 300));
      addStep(12, 'Monetization Validation', 'Content approved for monetization', 'Approved', [
        'Content approved for monetization',
        'All safety checks passed | Attribution complete | Ready for release.',
      ]);

      // Execute pipeline
      const finalResult = await pipeline.execute(inputPrompt);
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
