'use client';

import { useEffect, useState } from 'react';
import { RiCheckLine, RiLoader4Line, RiTimeLine, RiErrorWarningLine } from 'react-icons/ri';

interface Step {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const PIPELINE_STEPS: Omit<Step, 'status'>[] = [
  { id: 1, name: 'Prompt Input', description: 'Process and validate input prompt' },
  { id: 2, name: 'Vector Retrieval', description: 'Retrieve relevant IP context from vector DB' },
  { id: 3, name: 'Initial Attribution', description: 'Calculate expected IP usage' },
  { id: 4, name: 'Pre-Gen Safety', description: 'Validate prompt against safety rules' },
  { id: 5, name: 'Prompt Augmentation', description: 'Enhance prompt with IP context' },
  { id: 6, name: 'Video Generation', description: 'Generate video using AI model' },
  { id: 7, name: 'Post-Gen Safety', description: 'Validate generated content' },
  { id: 8, name: 'Final Attribution', description: 'Calculate actual IP usage' },
  { id: 9, name: 'Video Analysis', description: 'Analyze video content and features' },
  { id: 10, name: 'Logging & Display', description: 'Format and display results' },
];

export default function PipelineSteps({ isRunning }: { isRunning: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>(
    PIPELINE_STEPS.map(step => ({ ...step, status: 'pending' as const }))
  );

  useEffect(() => {
    if (!isRunning) {
      setCurrentStep(0);
      setSteps(PIPELINE_STEPS.map(step => ({ ...step, status: 'pending' as const })));
      return;
    }

    // Simulate step progression
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < PIPELINE_STEPS.length) {
        setCurrentStep(stepIndex);
        setSteps(prev =>
          prev.map((step, idx) => {
            if (idx < stepIndex) {
              return { ...step, status: 'completed' as const };
            }
            if (idx === stepIndex) {
              return { ...step, status: 'running' as const };
            }
            return step;
          })
        );
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Pipeline Execution</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
              step.status === 'running'
                ? 'border-primary-500 bg-primary-50'
                : step.status === 'completed'
                ? 'border-green-200 bg-green-50'
                : step.status === 'failed'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {step.status === 'completed' && (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <RiCheckLine className="w-5 h-5 text-white" />
                </div>
              )}
              {step.status === 'running' && (
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <RiLoader4Line className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
              {step.status === 'failed' && (
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <RiErrorWarningLine className="w-5 h-5 text-white" />
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <RiTimeLine className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500">Step {step.id}</span>
                <h3 className="text-base font-semibold text-gray-900">{step.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

