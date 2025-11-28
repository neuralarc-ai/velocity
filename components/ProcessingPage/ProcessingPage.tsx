'use client';

import { useEffect, useState } from 'react';
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
} from 'react-icons/ri';

interface AnalysisStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'active' | 'completed' | 'pending';
}

interface ProcessingPageProps {
  prompt: string;
  currentStepIndex: number;
  totalSteps: number;
  onComplete: () => void;
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

export default function ProcessingPage({ prompt, currentStepIndex, totalSteps, onComplete }: ProcessingPageProps) {
  const [steps, setSteps] = useState<AnalysisStep[]>(ANALYSIS_STEPS);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if all steps are complete
    const isComplete = currentStepIndex >= totalSteps - 1;
    
    // Update progress based on current step
    const displayStep = isComplete ? totalSteps : currentStepIndex + 1;
    const calculatedProgress = Math.min((displayStep / totalSteps) * 100, 100);
    setProgress(calculatedProgress);

    // Update step statuses
    setSteps((prevSteps) =>
      prevSteps.map((step, index) => {
        if (isComplete) {
          return { ...step, status: 'completed' };
        } else if (index < currentStepIndex) {
          return { ...step, status: 'completed' };
        } else if (index === currentStepIndex) {
          return { ...step, status: 'active' };
        } else {
          return { ...step, status: 'pending' };
        }
      })
    );

    // Call onComplete when all steps are done
    if (isComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, totalSteps, onComplete]);

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

              return (
                <div
                  key={step.id}
                  className={`group relative rounded-xl p-5 transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-mint-green/50 border-2 border-brand-orange scale-105 shadow-md'
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
                          : isCompleted
                          ? 'bg-brand-lime-green text-brand-dark-green'
                          : 'bg-brand-mint-green/50 text-gray-400'
                      }`}
                    >
                      {isActive ? (
                        <RiLoader4Line className="w-5 h-5 animate-spin" />
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompt Display */}
          <div className="mt-10 animate-fade-in-up delay-300">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-brand-mint-green/40">
              <p className="text-sm font-medium text-brand-dark-green mb-2">Analyzing Prompt</p>
              <p className="text-gray-700 line-clamp-2">{prompt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

