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
    // Add 1 to currentStepIndex for display (0-indexed to 1-indexed)
    const displayStep = isComplete ? totalSteps : currentStepIndex + 1;
    const calculatedProgress = Math.min((displayStep / totalSteps) * 100, 100);
    setProgress(calculatedProgress);

    // Update step statuses
    setSteps((prevSteps) =>
      prevSteps.map((step, index) => {
        if (isComplete) {
          // All steps completed
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
      // Small delay before calling onComplete to show final state
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, totalSteps, onComplete]);

  const getStepCardClass = (status: 'active' | 'completed' | 'pending') => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-2 border-green-500';
      case 'completed':
        return 'bg-white border border-gray-200';
      case 'pending':
        return 'bg-gray-100 border border-gray-200';
      default:
        return 'bg-gray-100 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <RiSearchLine className="w-5 h-5 text-gray-600" />
            <h1 className="text-2xl font-semibold text-gray-900">IP Attribution Analysis in Progress</h1>
          </div>
          <p className="text-sm text-gray-500">Analyzing content, detecting IP elements, and performing safety checks...</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-black rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Velocity is analyzing your content</span>
            <span className="text-white font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
            <div
              className="h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #ec4899 0%, #3b82f6 100%)',
              }}
            />
          </div>
        </div>

        {/* Analysis Steps Grid */}
        <div className="grid grid-cols-2 gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`rounded-lg p-4 transition-all duration-300 ${getStepCardClass(step.status)}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    step.status === 'active'
                      ? 'bg-green-500 text-white'
                      : step.status === 'completed'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`font-medium ${
                    step.status === 'active'
                      ? 'text-green-700'
                      : step.status === 'completed'
                      ? 'text-gray-700'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

