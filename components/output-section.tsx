'use client'

import { Video, Film } from 'lucide-react'

interface OutputSectionProps {
  outputStatus: string
}

export default function OutputSection({ outputStatus }: OutputSectionProps) {
  return (
    <section className="output-section bento-card" id="outputSection">
      <div className="section-header">
        <Video />
        <h2>Generated Output</h2>
      </div>
      <div className="video-placeholder">
        <Film />
        <p>Video output will appear here</p>
      </div>
      {outputStatus && (
        <div
          className="output-status"
          id="outputStatus"
          dangerouslySetInnerHTML={{ __html: outputStatus }}
        />
      )}
    </section>
  )
}

