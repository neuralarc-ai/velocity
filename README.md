# Velocity - IP Attribution & Safety Platform

A Next.js application for IP attribution and safety platform, converted from a vanilla HTML/CSS/JS prototype.

## Features

- **Prompt Input**: Enter creative prompts for content generation
- **Real-time Processing**: Simulated content generation with process tracing
- **Attribution Tracking**: Pre and post-generation IP attribution analysis
- **Safety Checks**: Pre and post-generation IP safety validation
- **Contamination Detection**: Model contamination analysis
- **Compliance Reports**: Comprehensive compliance and monetization status
- **Process Tracing**: Real-time sidebar showing generation process steps
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Chart.js** - Data visualization for attribution reports
- **Lucide React** - Icon library
- **CSS Modules** - Scoped styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
velocity/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── header.tsx           # Header component
│   ├── footer.tsx           # Footer component
│   ├── main-panel.tsx       # Main content panel
│   ├── input-section.tsx    # Prompt input section
│   ├── output-section.tsx   # Generated output section
│   ├── status-grid.tsx      # Status cards grid
│   ├── reports-section.tsx  # Detailed reports
│   ├── attribution-chart.tsx # Attribution pie chart
│   ├── relevance-chart.tsx  # Relevance bar chart
│   └── sidebar.tsx          # Process trace sidebar
├── package.json
├── tsconfig.json
└── next.config.js
```

## Usage

1. Enter a creative prompt in the input field
2. Click "Generate" to start the content generation process
3. View the process trace in the sidebar (right side on desktop, toggle button on mobile)
4. Review the generated output, status cards, and detailed reports
5. Use "Clear" to reset and start over

## Features in Detail

### Attribution Analysis
- Pre-generation attribution based on relevance scores
- Post-generation attribution based on frame-by-frame analysis
- Visual charts showing attribution percentages

### Safety & Compliance
- Pre-generation prompt safety validation
- Post-generation content analysis
- IP mythology rule compliance
- Character behavior validation

### Contamination Detection
- Model contamination percentage tracking
- Licensed content percentage
- Threshold compliance checking

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint configured for Next.js
- Functional components with hooks
- Type-safe props and state

### Adding New Features
1. Create new components in `components/` directory
2. Use TypeScript for all new files
3. Follow existing component patterns
4. Update this README if adding major features

## License

Copyright © 2025 Velocity. All rights reserved.

