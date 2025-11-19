'use client'

import { useEffect, useState } from 'react'
import { Activity, X, Info } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface ProcessStep {
  title: string
  status: string
  content: string
  detail: string
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
          detail: `Prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`
        },
        {
          title: "2. Semantic Analysis",
          status: "Complete",
          content: "Prompt analyzed for creative intent",
          detail: `Intent: ${mockData.promptAnalysis.intent}<br>
                   Characters: ${mockData.promptAnalysis.characters.join(', ')}<br>
                   Objects: ${mockData.promptAnalysis.objects.join(', ')}<br>
                   Actions: ${mockData.promptAnalysis.actions.join(', ')}`
        },
        {
          title: "3. IP Safety Check (Pre-Gen)",
          status: "Passed",
          content: "No safety violations detected in prompt",
          detail: `Checked against ${mockData.retrievedContent.length} IP safety rules`
        },
        {
          title: "4. Content Retrieval",
          status: "Complete",
          content: `Retrieved ${mockData.retrievedContent.length} relevant IP sources`,
          detail: mockData.retrievedContent.map(item => 
            `${item.title}: ${(item.relevance * 100).toFixed(0)}% relevance`
          ).join('<br>')
        },
        {
          title: "5. Initial Attribution",
          status: "Complete",
          content: "Pre-generation attribution calculated",
          detail: `<ul class="attribution-list">
              ${mockData.retrievedContent.map(item => 
                `<li class="attribution-item">
                    <span class="attribution-name">${item.title}</span>
                    <span class="attribution-percent">${item.attribution}%</span>
                </li>`
              ).join('')}
          </ul>`
        },
        {
          title: "6. Prompt Augmentation",
          status: "Complete",
          content: "Prompt enhanced with IP-specific guidance",
          detail: "Added cinematic lighting, composition, and style directives based on retrieved content"
        },
        {
          title: "7. Video Generation",
          status: "Complete",
          content: "AI model executed with augmented prompt",
          detail: "Model: Mochi-1 | Duration: 8 seconds | Resolution: 720p"
        },
        {
          title: "8. Output Analysis",
          status: "Complete",
          content: "Generated video analyzed frame-by-frame",
          detail: "Processed 240 frames | Extracted embeddings for comparison"
        },
        {
          title: "9. Final Attribution",
          status: "Complete",
          content: "Post-generation attribution verified",
          detail: `<ul class="attribution-list">
              ${mockData.finalAttribution.map(item => 
                `<li class="attribution-item">
                    <span class="attribution-name">${item.title}</span>
                    <span class="attribution-percent">${item.percentage}%</span>
                </li>`
              ).join('')}
          </ul>`
        },
        {
          title: "10. Contamination Detection",
          status: "Passed",
          content: `Model contamination: ${mockData.contamination.percentage}%`,
          detail: "Detected minimal influence from model training data. Within acceptable threshold."
        },
        {
          title: "11. IP Safety Check (Post-Gen)",
          status: "Passed",
          content: "Output validated against IP safety rules",
          detail: "No violations detected in generated content"
        },
        {
          title: "12. Monetization Validation",
          status: "Approved",
          content: "Content approved for monetization",
          detail: "All safety checks passed | Attribution complete | Ready for release"
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
          <Activity />
          Process Trace
        </h2>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
          <X />
        </button>
      </div>

      <div className="sidebar-content" id="sidebarContent">
        {processSteps.length === 0 ? (
          <div className="empty-state">
            <Info />
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
                <div
                  className="step-detail"
                  dangerouslySetInnerHTML={{ __html: step.detail }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

