'use client'

import { useEffect, useState, ReactNode } from 'react'
import { RiPulseLine, RiCloseLine, RiInformationLine } from 'react-icons/ri'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface ProcessStep {
  title: string
  status: string
  content: string
  detail: ReactNode
}

interface AttributionItem {
  title: string
  attribution?: number
  percentage?: number
  relevance?: number
}

function AttributionList({ items }: { items: AttributionItem[] }) {
  return (
    <ul className="attribution-list">
      {items.map((item, index) => (
        <li key={index} className="attribution-item">
          <span className="attribution-name">{item.title}</span>
          <span className="attribution-percent">
            {item.percentage !== undefined 
              ? `${item.percentage}%` 
              : item.attribution !== undefined 
              ? `${item.attribution}%` 
              : item.relevance !== undefined
              ? `${(item.relevance * 100).toFixed(0)}% relevance`
              : ''}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([])

  useEffect(() => {
    // Listen for process trace updates
    const handleProcessTrace = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      const prompt = customEvent.detail
      if (!prompt) {
        setProcessSteps([])
        return
      }

      const mockData = {
        promptAnalysis: {
          intent: "Film noir scene creation",
          characters: ["Two men"],
          objects: ["Gun", "Detective's office"],
          actions: ["Fight"],
          sentiment: "Tense, dramatic"
        },
        retrievedContent: [
          { title: "Casablanca", relevance: 0.85, attribution: 38 },
          { title: "The Maltese Falcon", relevance: 0.72, attribution: 32 },
          { title: "Double Indemnity", relevance: 0.68, attribution: 30 }
        ],
        finalAttribution: [
          { title: "Casablanca", percentage: 37 },
          { title: "The Maltese Falcon", percentage: 33 },
          { title: "Double Indemnity", percentage: 30 }
        ],
        contamination: {
          percentage: 0.5
        }
      }

      const steps: ProcessStep[] = [
        {
          title: "1. Prompt Receipt",
          status: "Complete",
          content: `Original prompt received and validated`,
          detail: (
            <div>
              Prompt: &quot;{prompt.substring(0, 100)}{prompt.length > 100 ? '...' : ''}&quot;
            </div>
          )
        },
        {
          title: "2. Semantic Analysis",
          status: "Complete",
          content: "Prompt analyzed for creative intent",
          detail: (
            <div>
              <div>Intent: {mockData.promptAnalysis.intent}</div>
              <div>Characters: {mockData.promptAnalysis.characters.join(', ')}</div>
              <div>Objects: {mockData.promptAnalysis.objects.join(', ')}</div>
              <div>Actions: {mockData.promptAnalysis.actions.join(', ')}</div>
            </div>
          )
        },
        {
          title: "3. IP Safety Check (Pre-Gen)",
          status: "Passed",
          content: "No safety violations detected in prompt",
          detail: (
            <div>
              Checked against {mockData.retrievedContent.length} IP safety rules
            </div>
          )
        },
        {
          title: "4. Content Retrieval",
          status: "Complete",
          content: `Retrieved ${mockData.retrievedContent.length} relevant IP sources`,
          detail: (
            <div>
              {mockData.retrievedContent.map((item, index) => (
                <div key={index}>
                  {item.title}: {(item.relevance * 100).toFixed(0)}% relevance
                </div>
              ))}
            </div>
          )
        },
        {
          title: "5. Initial Attribution",
          status: "Complete",
          content: "Pre-generation attribution calculated",
          detail: <AttributionList items={mockData.retrievedContent} />
        },
        {
          title: "6. Prompt Augmentation",
          status: "Complete",
          content: "Prompt enhanced with IP-specific guidance",
          detail: (
            <div>
              Added cinematic lighting, composition, and style directives based on retrieved content
            </div>
          )
        },
        {
          title: "7. Video Generation",
          status: "Complete",
          content: "AI model executed with augmented prompt",
          detail: (
            <div>
              Model: Mochi-1 | Duration: 8 seconds | Resolution: 720p
            </div>
          )
        },
        {
          title: "8. Output Analysis",
          status: "Complete",
          content: "Generated video analyzed frame-by-frame",
          detail: (
            <div>
              Processed 240 frames | Extracted embeddings for comparison
            </div>
          )
        },
        {
          title: "9. Final Attribution",
          status: "Complete",
          content: "Post-generation attribution verified",
          detail: <AttributionList items={mockData.finalAttribution} />
        },
        {
          title: "10. Contamination Detection",
          status: "Passed",
          content: `Model contamination: ${mockData.contamination.percentage}%`,
          detail: (
            <div>
              Detected minimal influence from model training data. Within acceptable threshold.
            </div>
          )
        },
        {
          title: "11. IP Safety Check (Post-Gen)",
          status: "Passed",
          content: "Output validated against IP safety rules",
          detail: (
            <div>
              No violations detected in generated content
            </div>
          )
        },
        {
          title: "12. Monetization Validation",
          status: "Approved",
          content: "Content approved for monetization",
          detail: (
            <div>
              All safety checks passed | Attribution complete | Ready for release
            </div>
          )
        }
      ]

      setProcessSteps(steps)
    }

    window.addEventListener('processTraceUpdate', handleProcessTrace)
    
    return () => {
      window.removeEventListener('processTraceUpdate', handleProcessTrace)
    }
  }, [])

  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <h2>
          <RiPulseLine />
          Process Trace
        </h2>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
          <RiCloseLine />
        </button>
      </div>

      <div className="sidebar-content" id="sidebarContent">
        {processSteps.length === 0 ? (
          <div className="empty-state">
            <RiInformationLine />
            <p>Generate content to view process trace</p>
          </div>
        ) : (
          processSteps.map((step, index) => (
            <div key={index} className="process-step fade-in">
              <div className="step-header">
                <span className="step-title">{step.title}</span>
                <span className="step-status">{step.status}</span>
              </div>
              <div className="step-content">{step.content}</div>
              {step.detail && (
                <div className="step-detail">
                  {step.detail}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
