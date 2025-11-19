'use client'

import { useState } from 'react'
import InputSection from './input-section'
import OutputSection from './output-section'
import StatusGrid from './status-grid'
import ReportsSection from './reports-section'

export default function MainPanel() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const [outputStatus, setOutputStatus] = useState('')

  const handleGenerate = async () => {
    const promptValue = prompt.trim()
    
    if (!promptValue) {
      alert('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setShowOutput(false)
    setShowStatus(false)
    setShowReports(false)

    // Simulate processing delay
    setTimeout(() => {
      setShowOutput(true)
      setShowStatus(true)
      setShowReports(true)
      
      setOutputStatus(`
        <strong>Status:</strong> Generation complete<br>
        <strong>Processing Time:</strong> 3.2 seconds<br>
        <strong>Timestamp:</strong> ${new Date().toLocaleString()}
      `)

      // Trigger process trace update via custom event
      const event = new CustomEvent('processTraceUpdate', { detail: promptValue })
      window.dispatchEvent(event)

      setIsGenerating(false)

      // Scroll to output
      setTimeout(() => {
        const outputSection = document.getElementById('outputSection')
        if (outputSection) {
          outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }, 2000)
  }

  const handleClear = () => {
    setPrompt('')
    setShowOutput(false)
    setShowStatus(false)
    setShowReports(false)
    setOutputStatus('')
    
    // Clear process trace
    const event = new CustomEvent('processTraceUpdate', { detail: '' })
    window.dispatchEvent(event)
  }

  return (
    <div className="main-panel">
      <InputSection
        prompt={prompt}
        onPromptChange={setPrompt}
        onGenerate={handleGenerate}
        onClear={handleClear}
        isGenerating={isGenerating}
      />
      
      {showOutput && (
        <OutputSection outputStatus={outputStatus} />
      )}

      {showStatus && <StatusGrid />}

      {showReports && <ReportsSection />}
    </div>
  )
}

