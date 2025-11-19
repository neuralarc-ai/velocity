'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface RelevanceData {
  title: string
  relevance: number
  attribution: number
}

interface RelevanceChartProps {
  data: RelevanceData[]
}

export default function RelevanceChart({ data }: RelevanceChartProps) {
  const chartData = {
    labels: data.map(item => item.title),
    datasets: [
      {
        label: 'Attribution %',
        data: data.map(item => item.attribution),
        backgroundColor: '#000000',
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#666666',
          font: {
            size: 12
          },
          callback: function(value: number | string) {
            return value + '%'
          }
        },
        grid: {
          color: '#e5e5e5',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: '#666666',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            const value = context.parsed.y
            if (value === null) return 'Attribution: 0%'
            return 'Attribution: ' + value + '%'
          }
        }
      }
    }
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  )
}

