'use client';

import { useEffect, useState, useRef } from 'react';
import {
  RiSearchLine,
  RiRefreshLine,
  RiBarChartLine,
  RiShieldCheckLine,
  RiMoneyDollarCircleLine,
  RiFileTextLine,
  RiVideoLine,
  RiCheckLine,
  RiLoader4Line,
  RiCloseLine,
  RiForbidLine,
} from 'react-icons/ri';

interface AnalysisStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'active' | 'completed' | 'pending' | 'failed' | 'skipped';
}

interface ProcessingPageProps {
  prompt: string;
  currentStepIndex: number;
  totalSteps: number;
  onComplete: () => void;
  failedSteps?: string[]; // Array of step IDs that failed
  generationBlocked?: boolean; // Whether generation was blocked
}

const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: 'prompt-receipt', title: 'Prompt Receipt', icon: <RiFileTextLine className="w-5 h-5" />, status: 'pending' },
  { id: 'semantic-analysis', title: 'Semantic Analysis', icon: <RiSearchLine className="w-5 h-5" />, status: 'pending' },
  { id: 'safety-check', title: 'Pre-Gen Safety Check', icon: <RiShieldCheckLine className="w-5 h-5" />, status: 'pending' },
  { id: 'content-retrieval', title: 'IP Content Retrieval', icon: <RiSearchLine className="w-5 h-5" />, status: 'pending' },
  { id: 'initial-attribution', title: 'Initial Attribution', icon: <RiBarChartLine className="w-5 h-5" />, status: 'pending' },
  { id: 'prompt-augmentation', title: 'Prompt Augmentation', icon: <RiRefreshLine className="w-5 h-5" />, status: 'pending' },
  { id: 'video-generation', title: 'Video Generation', icon: <RiVideoLine className="w-5 h-5" />, status: 'pending' },
  { id: 'output-analysis', title: 'Output Analysis', icon: <RiSearchLine className="w-5 h-5" />, status: 'pending' },
  { id: 'final-attribution', title: 'Final Attribution', icon: <RiBarChartLine className="w-5 h-5" />, status: 'pending' },
  { id: 'contamination-detection', title: 'Contamination Detection', icon: <RiShieldCheckLine className="w-5 h-5" />, status: 'pending' },
  { id: 'post-safety-check', title: 'Post-Gen Safety Check', icon: <RiShieldCheckLine className="w-5 h-5" />, status: 'pending' },
  { id: 'monetization-validation', title: 'Monetization Validation', icon: <RiMoneyDollarCircleLine className="w-5 h-5" />, status: 'pending' },
];

export default function ProcessingPage({ prompt, currentStepIndex, totalSteps, onComplete, failedSteps = [], generationBlocked = false }: ProcessingPageProps) {
  const [steps, setSteps] = useState<AnalysisStep[]>(ANALYSIS_STEPS);
  const [progress, setProgress] = useState(0);
  const [previousStepIndex, setPreviousStepIndex] = useState(-1);
  
  // Refs to track what has been logged to prevent duplicates
  const loggedStepsRef = useRef<Set<string>>(new Set());
  const loggedCompletionRef = useRef(false);
  const loggedInitialRef = useRef<string | null>(null);
  const firstFailedStepIndexRef = useRef<number | null>(null);

  // Console logging for step changes
  useEffect(() => {
    if (currentStepIndex !== previousStepIndex && currentStepIndex >= 0) {
      // Check if previous step failed
      if (previousStepIndex >= 0 && previousStepIndex < ANALYSIS_STEPS.length) {
        const previousStep = ANALYSIS_STEPS[previousStepIndex];
        const previousStepId = previousStep.id;
        const previousStepFailed = failedSteps.includes(previousStepId);
        
        if (previousStepFailed) {
          // Mark this as the first failed step
          if (firstFailedStepIndexRef.current === null) {
            firstFailedStepIndexRef.current = previousStepIndex;
            const previousFailedKey = `failed-${previousStepIndex}`;
            if (!loggedStepsRef.current.has(previousFailedKey)) {
              loggedStepsRef.current.add(previousFailedKey);
              console.log(`%c❌ STEP ${previousStepIndex + 1}/${totalSteps}: ${previousStep.title} - FAILED`, 
                'color: #FF4444; font-weight: bold; font-size: 14px;');
              console.log(`%c⚠️  Error: Step execution failed`, 'color: #FF6666;');
              console.log(`%c🛑 Pipeline stopped - no further steps will be executed`, 
                'color: #FF6B35; font-weight: bold;');
            }
          }
          // Don't log completion or continue - stop here
          setPreviousStepIndex(currentStepIndex);
          return;
        } else {
          // Previous step completed successfully
          const previousCompleteKey = `completed-${previousStepIndex}`;
          if (previousStep && !loggedStepsRef.current.has(previousCompleteKey)) {
            loggedStepsRef.current.add(previousCompleteKey);
            console.log(`%c✅ STEP ${previousStepIndex + 1}/${totalSteps}: ${previousStep.title} - COMPLETED`, 
              'color: #4ECDC4; font-weight: bold; font-size: 14px;');
            console.log(`%c✓ Step finished successfully`, 'color: #95E1D3;');
          }
        }
      }
      
      // Check if we should stop logging (a previous step failed)
      if (firstFailedStepIndexRef.current !== null && currentStepIndex > firstFailedStepIndexRef.current) {
        // A step has already failed, don't log subsequent steps
        setPreviousStepIndex(currentStepIndex);
        return;
      }
      
      // Check if current step is failed
      const currentStep = ANALYSIS_STEPS[currentStepIndex];
      if (currentStep) {
        const currentStepId = currentStep.id;
        const currentStepFailed = failedSteps.includes(currentStepId);
        
        if (currentStepFailed) {
          // Mark this as the first failed step
          if (firstFailedStepIndexRef.current === null) {
            firstFailedStepIndexRef.current = currentStepIndex;
            const currentFailedKey = `failed-${currentStepIndex}`;
            if (!loggedStepsRef.current.has(currentFailedKey)) {
              loggedStepsRef.current.add(currentFailedKey);
              console.log(`%c❌ STEP ${currentStepIndex + 1}/${totalSteps}: ${currentStep.title} - FAILED`, 
                'color: #FF4444; font-weight: bold; font-size: 14px;');
              console.log(`%c⚠️  Error: Step execution failed`, 'color: #FF6666;');
              console.log(`%c🛑 Pipeline stopped - no further steps will be executed`, 
                'color: #FF6B35; font-weight: bold;');
            }
          }
          setPreviousStepIndex(currentStepIndex);
          return;
        }
      }
      
      // Then, log start of new step (only if no failure occurred)
      const stepStartKey = `start-${currentStepIndex}`;
      
      // Only log if we haven't logged this step start before and no step has failed
      if (currentStep && !loggedStepsRef.current.has(stepStartKey) && firstFailedStepIndexRef.current === null) {
        loggedStepsRef.current.add(stepStartKey);
        
        console.log(`%c🚀 STEP ${currentStepIndex + 1}/${totalSteps}: ${currentStep.title}`, 
          'color: #FF6B35; font-weight: bold; font-size: 14px;');
        console.log(`%c📝 Status: STARTING`, 'color: #4ECDC4; font-weight: bold;');
        
        // Log step-specific details
        switch (currentStep.id) {
          case 'prompt-receipt':
            console.log(`%c📋 Processing prompt: "${prompt}"`, 'color: #95E1D3;');
            console.log(`%c⏱️  Receiving and validating prompt input...`, 'color: #95E1D3;');
            break;
          case 'semantic-analysis':
            console.log(`%c🔍 Performing semantic analysis on prompt...`, 'color: #95E1D3;');
            console.log(`%c📊 Analyzing: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`, 'color: #95E1D3;');
            console.log(`%c🔎 Extracting semantic features and intent...`, 'color: #95E1D3;');
            break;
          case 'safety-check':
            console.log(`%c🛡️  Running pre-generation safety check...`, 'color: #95E1D3;');
            console.log(`%c🔒 Checking for IP conflicts and violations...`, 'color: #95E1D3;');
            console.log(`%c⚠️  Validating content safety before generation...`, 'color: #95E1D3;');
            break;
          case 'content-retrieval':
            console.log(`%c🔎 Searching IP content database...`, 'color: #95E1D3;');
            console.log(`%c📚 Retrieving relevant IP content based on prompt...`, 'color: #95E1D3;');
            console.log(`%c🎯 Matching prompt to existing IP sources...`, 'color: #95E1D3;');
            break;
          case 'initial-attribution':
            console.log(`%c📊 Calculating initial IP attribution scores...`, 'color: #95E1D3;');
            console.log(`%c📈 Analyzing IP relevance and confidence...`, 'color: #95E1D3;');
            console.log(`%c💯 Computing attribution percentages...`, 'color: #95E1D3;');
            break;
          case 'prompt-augmentation':
            console.log(`%c✨ Augmenting prompt with IP context...`, 'color: #95E1D3;');
            console.log(`%c🔧 Enhancing prompt with retrieved IP information...`, 'color: #95E1D3;');
            console.log(`%c📝 Generating augmented prompt for video generation...`, 'color: #95E1D3;');
            break;
          case 'video-generation':
            console.log(`%c🎬 Starting video generation process...`, 'color: #95E1D3;');
            console.log(`%c🎥 Generating video from augmented prompt...`, 'color: #95E1D3;');
            console.log(`%c⚙️  Processing video generation request...`, 'color: #95E1D3;');
            break;
          case 'output-analysis':
            console.log(`%c🔍 Analyzing generated video output...`, 'color: #95E1D3;');
            console.log(`%c👁️  Detecting objects and content in video...`, 'color: #95E1D3;');
            console.log(`%c📊 Extracting visual features and metadata...`, 'color: #95E1D3;');
            break;
          case 'final-attribution':
            console.log(`%c📊 Calculating final IP attribution scores...`, 'color: #95E1D3;');
            console.log(`%c📈 Comparing post-generation attribution...`, 'color: #95E1D3;');
            console.log(`%c💯 Finalizing attribution percentages...`, 'color: #95E1D3;');
            break;
          case 'contamination-detection':
            console.log(`%c🛡️  Detecting content contamination...`, 'color: #95E1D3;');
            console.log(`%c🔍 Scanning for unauthorized IP usage...`, 'color: #95E1D3;');
            console.log(`%c⚠️  Checking contamination thresholds...`, 'color: #95E1D3;');
            break;
          case 'post-safety-check':
            console.log(`%c🛡️  Running post-generation safety check...`, 'color: #95E1D3;');
            console.log(`%c🔒 Validating generated content safety...`, 'color: #95E1D3;');
            console.log(`%c✅ Final safety validation...`, 'color: #95E1D3;');
            break;
          case 'monetization-validation':
            console.log(`%c💰 Validating monetization eligibility...`, 'color: #95E1D3;');
            console.log(`%c💵 Checking monetization requirements...`, 'color: #95E1D3;');
            console.log(`%c✅ Final monetization validation...`, 'color: #95E1D3;');
            break;
        }
      }
      
      setPreviousStepIndex(currentStepIndex);
    }
  }, [currentStepIndex, totalSteps, prompt, failedSteps]);

  useEffect(() => {
    // Check if all steps are complete or if generation was blocked
    const isComplete = currentStepIndex >= totalSteps - 1 || generationBlocked;
    
    // Update progress based on current step
    const displayStep = isComplete ? totalSteps : currentStepIndex + 1;
    const calculatedProgress = Math.min((displayStep / totalSteps) * 100, 100);
    setProgress(calculatedProgress);

    // Map step IDs to indices
    const stepIdToIndex: Record<string, number> = {
      'prompt-receipt': 0,
      'semantic-analysis': 1,
      'safety-check': 2,
      'content-retrieval': 3,
      'initial-attribution': 4,
      'prompt-augmentation': 5,
      'video-generation': 6,
      'output-analysis': 7,
      'final-attribution': 8,
      'contamination-detection': 9,
      'post-safety-check': 10,
      'monetization-validation': 11,
    };

    // Update step statuses and log completions/failures
    setSteps((prevSteps) =>
      prevSteps.map((step, index) => {
        const stepId = step.id;
        const isFailed = failedSteps.includes(stepId);
        const wasCompleted = step.status === 'completed';
        const wasActive = step.status === 'active';
        
        // Only mark as failed if actually failed - don't mark as skipped based on generationBlocked
        // because the pipeline continues executing even when generation is blocked
        if (isFailed) {
          // Track the first failed step
          if (firstFailedStepIndexRef.current === null) {
            firstFailedStepIndexRef.current = index;
          }
          
          if (step.status !== 'failed' && !loggedStepsRef.current.has(`failed-${index}`)) {
            loggedStepsRef.current.add(`failed-${index}`);
            console.log(`%c❌ STEP ${index + 1}/${totalSteps}: ${step.title} - FAILED`, 
              'color: #FF4444; font-weight: bold; font-size: 14px;');
            console.log(`%c⚠️  Error: Step execution failed`, 'color: #FF6666;');
            // Only show stop message for the first failed step
            if (firstFailedStepIndexRef.current === index) {
              console.log(`%c🛑 Pipeline stopped - no further steps will be executed`, 
                'color: #FF6B35; font-weight: bold;');
            }
          }
          return { ...step, status: 'failed' };
        } else if (isComplete) {
          // Mark as completed if not failed
          if (!wasCompleted && step.status !== 'completed' && !loggedStepsRef.current.has(`completed-${index}`)) {
            console.log(`%c✅ STEP ${index + 1}/${totalSteps}: ${step.title} - COMPLETED`, 
              'color: #4ECDC4; font-weight: bold; font-size: 14px;');
            console.log(`%c✓ Step finished successfully`, 'color: #95E1D3;');
            loggedStepsRef.current.add(`completed-${index}`);
          }
          return { ...step, status: 'completed' };
        } else if (index < currentStepIndex) {
          // Completion logging is handled by the step change effect, just update status
          return { ...step, status: 'completed' };
        } else if (index === currentStepIndex) {
          // Don't log ACTIVE status here - it's already logged in the step change effect
          return { ...step, status: 'active' };
        } else {
          return { ...step, status: 'pending' };
        }
      })
    );

    // Call onComplete when all steps are done or generation is blocked
    if (isComplete && !loggedCompletionRef.current) {
      loggedCompletionRef.current = true;
      
      if (generationBlocked) {
        console.log(`%c⚠️  GENERATION BLOCKED`, 
          'color: #FF6B35; font-weight: bold; font-size: 16px; background: #FFF5E5; padding: 4px 8px; border-radius: 4px;');
        console.log(`%c🚫 Video generation was blocked due to safety check failure`, 'color: #FF6B35;');
        console.log(`%c📊 Analysis pipeline completed - all steps executed`, 'color: #95E1D3;');
        console.log(`%c📊 Progress: ${Math.round(calculatedProgress)}%`, 'color: #95E1D3;');
      } else {
        console.log(`%c🎉 PROCESSING COMPLETE`, 
          'color: #4ECDC4; font-weight: bold; font-size: 16px; background: #E5FFF5; padding: 4px 8px; border-radius: 4px;');
        console.log(`%c✅ All ${totalSteps} steps completed successfully`, 'color: #4ECDC4;');
        console.log(`%c📊 Progress: ${Math.round(calculatedProgress)}%`, 'color: #95E1D3;');
      }
      
      if (failedSteps.length > 0) {
        console.log(`%c⚠️  Failed Steps: ${failedSteps.length}`, 
          'color: #FF6B35; font-weight: bold;');
        failedSteps.forEach((stepId) => {
          const step = ANALYSIS_STEPS.find(s => s.id === stepId);
          if (step) {
            console.log(`%c  - ${step.title}`, 'color: #FF6666;');
          }
        });
      }
      
      const timer = setTimeout(() => {
        console.log(`%c🏁 Finalizing results and transitioning to results page...`, 
          'color: #4ECDC4; font-weight: bold;');
        onComplete();
      }, generationBlocked ? 1000 : 500); // Give a bit more time to see the failure
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, totalSteps, onComplete, failedSteps, generationBlocked]);

  // Initial logging when component mounts or prompt changes
  useEffect(() => {
    // Only log once per unique prompt/totalSteps combination
    const logKey = `${prompt}-${totalSteps}`;
    if (loggedInitialRef.current !== logKey) {
      console.log(`%c═══════════════════════════════════════════════════════`, 
        'color: #4ECDC4; font-weight: bold;');
      console.log(`%c🚀 VELOCITY PIPELINE STARTED`, 
        'color: #FF6B35; font-weight: bold; font-size: 18px;');
      console.log(`%c═══════════════════════════════════════════════════════`, 
        'color: #4ECDC4; font-weight: bold;');
      console.log(`%c📝 Prompt: "${prompt}"`, 'color: #95E1D3; font-weight: bold;');
      console.log(`%c📊 Total Steps: ${totalSteps}`, 'color: #95E1D3;');
      console.log(`%c⏱️  Starting pipeline execution...`, 'color: #95E1D3;');
      console.log(`%c═══════════════════════════════════════════════════════`, 
        'color: #4ECDC4; font-weight: bold;');
      loggedInitialRef.current = logKey;
      
      // Reset step tracking when starting a new pipeline
      loggedStepsRef.current.clear();
      loggedCompletionRef.current = false;
      firstFailedStepIndexRef.current = null;
    }
  }, [prompt, totalSteps]);

  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-mint-green/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-lime-green/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-mint-green/50 rounded-full border border-brand-lime-green/50 mb-6">
              <RiLoader4Line className="w-4 h-4 text-brand-orange animate-spin" />
              <span className="text-sm font-medium text-brand-dark-green">Analysis in Progress</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Processing Your Content
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Analyzing IP attribution, performing safety checks, and validating content for monetization
            </p>
          </div>

          {/* Progress Card */}
          <div className="mb-10 animate-fade-in-up">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-brand-mint-green/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-orange rounded-lg">
                    <RiBarChartLine className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Analysis Progress</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-brand-orange">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-brand-mint-green/30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden gradient-progress"
                  style={{
                    width: `${progress}%`,
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                {steps.find(s => s.status === 'active')?.title || 'Processing complete'}
              </p>
            </div>
          </div>

          {/* Analysis Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up delay-200">
            {steps.map((step, index) => {
              const isActive = step.status === 'active';
              const isCompleted = step.status === 'completed';
              const isPending = step.status === 'pending';
              const isFailed = step.status === 'failed';
              const isSkipped = step.status === 'skipped';

              return (
                <div
                  key={step.id}
                  className={`group relative rounded-xl p-5 transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-mint-green/50 border-2 border-brand-orange scale-105 shadow-md'
                      : isFailed
                      ? 'bg-red-50 border-2 border-red-300 opacity-75'
                      : isSkipped
                      ? 'bg-gray-100 border-2 border-gray-300 opacity-50'
                      : isCompleted
                      ? 'bg-white border border-brand-lime-green/50 hover:border-brand-mint-green'
                      : 'bg-brand-cream/30 border border-brand-mint-green/30 opacity-60'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-brand-orange text-white'
                          : isFailed
                          ? 'bg-red-500 text-white'
                          : isSkipped
                          ? 'bg-gray-400 text-white'
                          : isCompleted
                          ? 'bg-brand-lime-green text-brand-dark-green'
                          : 'bg-brand-mint-green/50 text-gray-400'
                      }`}
                    >
                      {isActive ? (
                        <RiLoader4Line className="w-5 h-5 animate-spin" />
                      ) : isFailed ? (
                        <RiCloseLine className="w-5 h-5" />
                      ) : isSkipped ? (
                        <RiForbidLine className="w-5 h-5" />
                      ) : isCompleted ? (
                        <RiCheckLine className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold mb-1 transition-colors ${
                          isActive
                            ? 'text-brand-orange'
                            : isFailed
                            ? 'text-red-600 line-through'
                            : isSkipped
                            ? 'text-gray-500 line-through'
                            : isCompleted
                            ? 'text-brand-dark-green'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </h3>
                      {isActive && (
                        <p className="text-xs text-brand-orange mt-1 animate-pulse">Processing...</p>
                      )}
                      {isFailed && (
                        <p className="text-xs text-red-600 mt-1">Failed</p>
                      )}
                      {isSkipped && (
                        <p className="text-xs text-gray-500 mt-1">Skipped</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

