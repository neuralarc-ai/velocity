'use client'

import { RiEditLine, RiPlayLine, RiCloseLine, RiLoader4Line } from 'react-icons/ri'

interface InputSectionProps {
  prompt: string
  onPromptChange: (value: string) => void
  onGenerate: () => void
  onClear: () => void
  isGenerating: boolean
}

export default function InputSection({
  prompt,
  onPromptChange,
  onGenerate,
  onClear,
  isGenerating
}: InputSectionProps) {
  return (
    <section className="input-section bento-card">
      <div className="section-header">
        <RiEditLine />
        <h2>Prompt Input</h2>
      </div>
      <div className="input-group">
        <label htmlFor="promptInput">Enter your creative prompt:</label>
        <textarea
          id="promptInput"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Example: Create a film noir scene in which two men fight in a detective's office. One man has a gun."
          rows={4}
        />
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? <RiLoader4Line className="animate-spin" /> : <RiPlayLine />}
            {isGenerating ? 'Processing...' : 'Generate'}
          </button>
          <button className="btn btn-secondary" onClick={onClear}>
            <RiCloseLine />
            Clear
          </button>
        </div>
      </div>
    </section>
  )
}

