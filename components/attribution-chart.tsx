'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface AttributionData {
  title: string
  percentage: number
}

interface AttributionChartProps {
  data: AttributionData[]
}

export default function AttributionChart({ data }: AttributionChartProps) {
  const chartData = {
    labels: data.map(item => item.title),
    datasets: [
      {
        data: data.map(item => item.percentage),
        backgroundColor: [
          '#000000',
          '#404040',
          '#808080'
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#1a1a1a',
          padding: 15,
          font: {
            size: 13,
            weight: 500
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: number }) {
            return context.label + ': ' + context.parsed + '%'
          }
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

