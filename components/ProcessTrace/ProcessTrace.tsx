'use client';

import { useState, useEffect, useRef } from 'react';
import { RiTimeLine, RiCheckboxCircleLine, RiLoader4Line, RiErrorWarningLine, RiFileTextLine, RiLightbulbLine, RiShieldCheckLine, RiDatabaseLine, RiBarChartLine, RiRefreshLine, RiVideoLine, RiEyeLine, RiAlertLine, RiMoneyDollarCircleLine } from 'react-icons/ri';

interface ProcessStep {
  id: number;
  title: string;
  status: 'Complete' | 'Passed' | 'Approved' | 'Running' | 'Pending';
  description: string;
  details?: string[];
  icon?: React.ReactNode;
}

interface ProcessTraceProps {
  steps: ProcessStep[];
  currentStep?: number;
}

export default function ProcessTrace({ steps, currentStep }: ProcessTraceProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousStepsRef = useRef<ProcessStep[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrolledStepRef = useRef<number | null>(null);
  const getStepIcon = (stepId: number, status: string) => {
    const iconClass = "w-5 h-5";
    
    if (status === 'Complete' || status === 'Passed' || status === 'Approved') {
      return <RiCheckboxCircleLine className={`${iconClass} text-green-600`} />;
    }
    if (status === 'Running') {
      return <RiLoader4Line className={`${iconClass} text-blue-600 animate-spin`} />;
    }
    
    // Default icons for each step
    const stepIcons: Record<number, React.ReactNode> = {
      1: <RiFileTextLine className={`${iconClass} text-gray-400`} />,
      2: <RiLightbulbLine className={`${iconClass} text-gray-400`} />,
      3: <RiShieldCheckLine className={`${iconClass} text-gray-400`} />,
      4: <RiDatabaseLine className={`${iconClass} text-gray-400`} />,
      5: <RiBarChartLine className={`${iconClass} text-gray-400`} />,
      6: <RiRefreshLine className={`${iconClass} text-gray-400`} />,
      7: <RiVideoLine className={`${iconClass} text-gray-400`} />,
      8: <RiEyeLine className={`${iconClass} text-gray-400`} />,
      9: <RiBarChartLine className={`${iconClass} text-gray-400`} />,
      10: <RiAlertLine className={`${iconClass} text-gray-400`} />,
      11: <RiShieldCheckLine className={`${iconClass} text-gray-400`} />,
      12: <RiMoneyDollarCircleLine className={`${iconClass} text-gray-400`} />,
    };
    
    return stepIcons[stepId] || <RiTimeLine className={`${iconClass} text-gray-400`} />;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-semibold transition-all";
    
    switch (status) {
      case 'Complete':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700 border border-green-200`}>
            Complete
          </span>
        );
      case 'Passed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700 border border-green-200`}>
            Passed
          </span>
        );
      case 'Approved':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`}>
            Approved
          </span>
        );
      case 'Running':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-700 border border-blue-200 animate-pulse`}>
            Running...
          </span>
        );
      case 'Pending':
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-500 border border-gray-200`}>
            Pending
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-500 border border-gray-200`}>
            {status}
          </span>
        );
    }
  };

  const isStepCompleted = (status: string) => {
    return status === 'Complete' || status === 'Passed' || status === 'Approved';
  };

  const isStepRunning = (status: string) => {
    return status === 'Running';
  };

  // Auto-scroll effect: scroll completed steps up (streaming effect)
  useEffect(() => {
    if (!scrollContainerRef.current || steps.length === 0) {
      previousStepsRef.current = [...steps];
      return;
    }

    // Check for newly completed steps
    const newlyCompleted = steps.filter(
      (step, index) => {
        const prevStep = previousStepsRef.current[index];
        return prevStep && 
               !isStepCompleted(prevStep.status) && 
               isStepCompleted(step.status);
      }
    );

    // Update previous steps reference immediately to prevent loops
    previousStepsRef.current = [...steps];

    if (newlyCompleted.length > 0) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Wait a bit for the completion animation, then scroll
      scrollTimeoutRef.current = setTimeout(() => {
        if (!scrollContainerRef.current) return;
        
        const container = scrollContainerRef.current;
        const stepElements = container.querySelectorAll('[data-step-id]');
        
        // Find the first running or pending step (current active step)
        const activeStepIndex = steps.findIndex(step => 
          isStepRunning(step.status) || (!isStepCompleted(step.status) && !isStepRunning(step.status))
        );

        if (activeStepIndex >= 0 && stepElements[activeStepIndex]) {
          const activeStepId = steps[activeStepIndex].id;
          
          // Only scroll if we haven't already scrolled to this step
          if (lastScrolledStepRef.current !== activeStepId) {
            // Scroll the active step to near the top of visible area
            const targetElement = stepElements[activeStepIndex] as HTMLElement;
            const containerRect = container.getBoundingClientRect();
            const elementRect = targetElement.getBoundingClientRect();
            
            // Calculate scroll position to show active step near the top (100px from top)
            const scrollOffset = elementRect.top - containerRect.top - 100;
            
            container.scrollTo({
              top: container.scrollTop + scrollOffset,
              behavior: 'smooth'
            });
            
            lastScrolledStepRef.current = activeStepId;
          }
        } else {
          // If all steps are completed, scroll to the bottom to show the last step fully
          const allCompleted = steps.every(step => isStepCompleted(step.status));
          if (allCompleted && stepElements.length > 0) {
            const lastElement = stepElements[stepElements.length - 1] as HTMLElement;
            if (lastElement) {
              // Scroll to show the last step fully at the bottom
              container.scrollTo({
                top: container.scrollHeight - container.clientHeight,
                behavior: 'smooth'
              });
            }
          }
        }
      }, 600); // Wait 600ms after completion to show the checkmark
    }

    // Cleanup timeout on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [steps]);

  // Scroll to current step when it changes (for running steps)
  useEffect(() => {
    if (!scrollContainerRef.current || !currentStep) return;

    const container = scrollContainerRef.current;
    const currentStepData = steps.find(s => s.id === currentStep);
    
    // Check if all steps are completed
    const allCompleted = steps.length > 0 && steps.every(step => isStepCompleted(step.status));
    
    if (allCompleted) {
      // If all steps are completed, scroll to the bottom to show the last step fully
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight,
            behavior: 'smooth'
          });
        }
      }, 300);
      return;
    }

    // Only auto-scroll if the step is running and we haven't already scrolled to it
    if (!currentStepData || !isStepRunning(currentStepData.status)) return;
    
    // Prevent scrolling if we already scrolled to this step
    if (lastScrolledStepRef.current === currentStep) return;

    const activeElement = container.querySelector(`[data-step-id="${currentStep}"]`) as HTMLElement;
    
    if (activeElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      // Only scroll if element is not already in view
      const isInView = elementRect.top >= containerRect.top && 
                      elementRect.bottom <= containerRect.bottom;
      
      if (!isInView) {
        // Scroll to show active step near the top of visible area (100px from top)
        const scrollOffset = elementRect.top - containerRect.top - 100;
        
        container.scrollTo({
          top: container.scrollTop + scrollOffset,
          behavior: 'smooth'
        });
        
        lastScrolledStepRef.current = currentStep;
      }
    }
  }, [currentStep, steps]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-[calc(100vh-200px)] flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
            <RiTimeLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Process Trace</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {steps.length > 0 ? `${steps.filter(s => isStepCompleted(s.status)).length} of ${steps.length} completed` : 'Real-time execution tracking'}
            </p>
          </div>
        </div>
      </div>

      {/* Steps Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <RiTimeLine className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Process Started</h4>
            <p className="text-sm text-gray-500 max-w-xs">
              Enter a prompt and click Generate to begin the pipeline execution. Steps will appear here in real-time.
            </p>
          </div>
          ) : (
            <div className="relative">

            {/* Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = isStepCompleted(step.status);
                const isRunning = isStepRunning(step.status);
                const isActive = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    data-step-id={step.id}
                    className={`relative pl-14 transition-all duration-300 ${
                      isActive ? 'scale-[1.02]' : ''
                    }`}
                  >
                    {/* Step Card */}
                    <div
                      className={`bg-white rounded-xl border-2 p-5 shadow-sm transition-all duration-300 ${
                        isRunning
                          ? 'border-blue-300 bg-blue-50 shadow-md'
                          : isCompleted
                          ? 'border-green-200 bg-green-50/30'
                          : 'border-gray-200 bg-white'
                      } ${isActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                    >
                      {/* Step Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Step Info */}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-gray-400 block mb-1">STEP {step.id}</span>
                            <h4 className="text-base font-bold text-gray-900 mb-2">{step.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0 ml-4">
                          {getStatusBadge(step.status)}
                        </div>
                      </div>

                      {/* Step Details */}
                      {step.details && step.details.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                                <p className="text-xs text-gray-600 leading-relaxed">{detail}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 top-6 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 shadow-lg shadow-green-200'
                          : isRunning
                          ? 'bg-blue-500 shadow-lg shadow-blue-200 animate-pulse'
                          : 'bg-gray-300'
                      }`}
                    >
                      {isCompleted && (
                        <RiCheckboxCircleLine className="w-6 h-6 text-white" />
                      )}
                      {isRunning && (
                        <RiLoader4Line className="w-6 h-6 text-white animate-spin" />
                      )}
                      {!isCompleted && !isRunning && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {steps.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600">
                  Completed: <span className="font-semibold text-gray-900">
                    {steps.filter(s => isStepCompleted(s.status)).length}
                  </span>
                </span>
              </div>
              {steps.some(s => isStepRunning(s.status)) && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-gray-600">
                    Running: <span className="font-semibold text-gray-900">1</span>
                  </span>
                </div>
              )}
            </div>
            <span className="text-gray-500">
              Total: <span className="font-semibold text-gray-700">{steps.length}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
