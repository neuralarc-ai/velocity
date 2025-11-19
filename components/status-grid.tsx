'use client'

import { PieChart, ShieldCheck, AlertTriangle, DollarSign } from 'lucide-react'

export default function StatusGrid() {
  return (
    <div className="status-grid" id="statusGrid">
      <div className="bento-card status-card">
        <div className="card-icon">
          <PieChart />
        </div>
        <h3>Attribution</h3>
        <div className="status-value" id="attributionStatus">
          <span className="status-badge status-success">Complete</span>
        </div>
        <p className="status-detail">IP sources tracked</p>
      </div>

      <div className="bento-card status-card">
        <div className="card-icon">
          <ShieldCheck />
        </div>
        <h3>Safety Check</h3>
        <div className="status-value" id="safetyStatus">
          <span className="status-badge status-success">Passed</span>
        </div>
        <p className="status-detail">No violations detected</p>
      </div>

      <div className="bento-card status-card">
        <div className="card-icon">
          <AlertTriangle />
        </div>
        <h3>Contamination</h3>
        <div className="status-value" id="contaminationStatus">
          <span className="status-badge status-info">0.5%</span>
        </div>
        <p className="status-detail">Model influence detected</p>
      </div>

      <div className="bento-card status-card">
        <div className="card-icon">
          <DollarSign />
        </div>
        <h3>Monetization</h3>
        <div className="status-value" id="monetizationStatus">
          <span className="status-badge status-success">Approved</span>
        </div>
        <p className="status-detail">Ready for release</p>
      </div>
    </div>
  )
}

