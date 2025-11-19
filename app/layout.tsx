import type { Metadata } from 'next'
import './globals.css'
import ErrorBoundaryWrapper from '@/components/error-boundary-wrapper'

export const metadata: Metadata = {
  title: 'Velocity - IP Attribution & Safety Platform',
  description: 'IP Attribution & Safety Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundaryWrapper>
          {children}
        </ErrorBoundaryWrapper>
      </body>
    </html>
  )
}

