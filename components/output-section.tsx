'use client'

import { RiVideoLine, RiFilmLine } from 'react-icons/ri'

interface OutputSectionProps {
  outputStatus: string
}

interface StatusData {
  status: string
  processingTime: string
  timestamp: string
}

function parseStatus(htmlString: string): StatusData | null {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlString, 'text/html')
    const text = doc.body.textContent || ''
    
    const statusMatch = text.match(/Status:\s*(.+?)(?:\n|$)/i)
    const timeMatch = text.match(/Processing Time:\s*(.+?)(?:\n|$)/i)
    const timestampMatch = text.match(/Timestamp:\s*(.+?)(?:\n|$)/i)
    
    if (statusMatch && timeMatch && timestampMatch) {
      return {
        status: statusMatch[1].trim(),
        processingTime: timeMatch[1].trim(),
        timestamp: timestampMatch[1].trim(),
      }
    }
    return null
  } catch {
    return null
  }
}

export default function OutputSection({ outputStatus }: OutputSectionProps) {
  const statusData = outputStatus ? parseStatus(outputStatus) : null

  return (
    <section className="output-section bento-card" id="outputSection">
      <div className="section-header">
        <RiVideoLine />
        <h2>Generated Output</h2>
      </div>
      <div className="video-placeholder">
        <RiFilmLine />
        <p>Video output will appear here</p>
      </div>
      {statusData && (
        <div className="output-status" id="outputStatus">
          <div className="status-item">
            <strong>Status:</strong> {statusData.status}
          </div>
          <div className="status-item">
            <strong>Processing Time:</strong> {statusData.processingTime}
          </div>
          <div className="status-item">
            <strong>Timestamp:</strong> {statusData.timestamp}
          </div>
        </div>
      )}
    </section>
  )
}

