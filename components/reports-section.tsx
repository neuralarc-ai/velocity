'use client'

import { 
  RiBarChartLine, 
  RiPieChartLine, 
  RiErrorWarningLine, 
  RiShieldCheckLine, 
  RiFileCheckLine, 
  RiVideoLine, 
  RiMoneyDollarCircleLine, 
  RiCheckboxCircleLine, 
  RiInformationLine, 
  RiCheckLine, 
  RiPercentLine, 
  RiShieldLine 
} from 'react-icons/ri'
import AttributionChart from './attribution-chart'
import RelevanceChart from './relevance-chart'

export default function ReportsSection() {
  const retrievedContent = [
    { title: "Casablanca", relevance: 0.85, attribution: 38 },
    { title: "The Maltese Falcon", relevance: 0.72, attribution: 32 },
    { title: "Double Indemnity", relevance: 0.68, attribution: 30 }
  ]

  const finalAttribution = [
    { title: "Casablanca", percentage: 37 },
    { title: "The Maltese Falcon", percentage: 33 },
    { title: "Double Indemnity", percentage: 30 }
  ]

  return (
    <div className="reports-section" id="reportsSection">
      <div className="reports-grid">
        <div className="bento-card report-card">
          <div className="section-header">
            <RiBarChartLine />
            <h2>Initial Attribution (Pre-Generation)</h2>
          </div>
          <div className="chart-container">
            <RelevanceChart data={retrievedContent} />
          </div>
          <div className="report-summary">
            <div className="summary-item">
              <span className="summary-label">Total Sources:</span>
              <span className="summary-value">3</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Calculation Method:</span>
              <span className="summary-value">Relevance Score Based</span>
            </div>
          </div>
        </div>

        <div className="bento-card report-card">
          <div className="section-header">
            <RiPieChartLine />
            <h2>Final Attribution (Post-Generation)</h2>
          </div>
          <div className="chart-container">
            <AttributionChart data={finalAttribution} />
          </div>
          <div className="report-summary">
            <div className="summary-item">
              <span className="summary-label">Frames Analyzed:</span>
              <span className="summary-value">240</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Embedding Matches:</span>
              <span className="summary-value">238</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bento-card report-card full-width">
        <div className="section-header">
          <RiErrorWarningLine />
          <h2>Contamination Analysis Report</h2>
        </div>
        <div className="report-content">
          <div className="contamination-overview">
            <div className="contamination-metric">
              <div className="metric-icon">
                <RiPercentLine />
              </div>
              <div className="metric-content">
                <div className="metric-value">0.5%</div>
                <div className="metric-label">Model Contamination</div>
              </div>
            </div>
            <div className="contamination-metric">
              <div className="metric-icon">
                <RiCheckboxCircleLine />
              </div>
              <div className="metric-content">
                <div className="metric-value">99.5%</div>
                <div className="metric-label">Licensed Content</div>
              </div>
            </div>
            <div className="contamination-metric">
              <div className="metric-icon">
                <RiShieldLine />
              </div>
              <div className="metric-content">
                <div className="metric-value">Passed</div>
                <div className="metric-label">Threshold Check</div>
              </div>
            </div>
          </div>
          <div className="contamination-details">
            <h4>Detection Summary</h4>
            <ul className="detail-list">
              <li>
                <RiCheckLine />
                <span>Contamination level within acceptable threshold (&lt; 2%)</span>
              </li>
              <li>
                <RiCheckLine />
                <span>No unlicensed IP detected in output</span>
              </li>
              <li>
                <RiCheckLine />
                <span>Model influence properly tracked and documented</span>
              </li>
              <li>
                <RiInformationLine />
                <span>Minimal training data influence from base model</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bento-card report-card full-width">
        <div className="section-header">
          <RiShieldCheckLine />
          <h2>IP Safety & Compliance Report</h2>
        </div>
        <div className="report-content">
          <div className="compliance-grid">
            <div className="compliance-section">
              <h4>
                <RiFileCheckLine />
                Pre-Generation Checks
              </h4>
              <div className="check-item passed">
                <RiCheckboxCircleLine />
                <div className="check-content">
                  <div className="check-title">Prompt Safety Validation</div>
                  <div className="check-detail">No IP safety rule violations detected</div>
                </div>
              </div>
              <div className="check-item passed">
                <RiCheckboxCircleLine />
                <div className="check-content">
                  <div className="check-title">Usage Rights Verification</div>
                  <div className="check-detail">All retrieved content properly licensed</div>
                </div>
              </div>
            </div>

            <div className="compliance-section">
              <h4>
                <RiVideoLine />
                Post-Generation Checks
              </h4>
              <div className="check-item passed">
                <RiCheckboxCircleLine />
                <div className="check-content">
                  <div className="check-title">Visual Content Analysis</div>
                  <div className="check-detail">Output complies with IP mythology rules</div>
                </div>
              </div>
              <div className="check-item passed">
                <RiCheckboxCircleLine />
                <div className="check-content">
                  <div className="check-title">Character Behavior Validation</div>
                  <div className="check-detail">No prohibited actions detected</div>
                </div>
              </div>
            </div>

            <div className="compliance-section">
              <h4>
                <RiMoneyDollarCircleLine />
                Monetization Status
              </h4>
              <div className="check-item passed">
                <RiCheckboxCircleLine />
                <div className="check-content">
                  <div className="check-title">Attribution Complete</div>
                  <div className="check-detail">All IP sources properly attributed</div>
                </div>
              </div>
              <div className="check-item passed">
                <RiCheckboxCircleLine />
                <div className="check-content">
                  <div className="check-title">Release Approved</div>
                  <div className="check-detail">Content cleared for monetization</div>
                </div>
              </div>
            </div>
          </div>

          <div className="compliance-summary">
            <div className="summary-badge success">
              <RiShieldCheckLine />
              <span>All Compliance Checks Passed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

