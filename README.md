# Strand AI PoC - Milestone 1 (Next.js/React)

## Overview
Proof-of-Concept demonstration of Strand AI's core capabilities for tracking licensed IP usage in AI-generated video content. This is the Milestone 1 implementation built with Next.js and React.

## Features
- ✅ **User Prompt Input** - Enter any prompt (not hardcoded)
- ✅ **5 Distinct Video Examples** - Each with unique hardcoded outputs
- ✅ **Smart Prompt Matching** - Automatically matches prompts to examples
- ✅ **Database Integration** - Real-time data storage and statistics
- ✅ **Pipeline execution framework** - All 10 steps with hardcoded results
- ✅ **Real-time execution logging** - Complete audit trail
- ✅ **Attribution score display** - Initial and final attribution
- ✅ **Safety check visualization** - Pre and post-generation checks
- ✅ **Modern, responsive UI** - Beautiful Tailwind CSS interface

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Demo
1. Enter a prompt (e.g., "athlete wearing Nike shoes" or "people drinking Coca-Cola")
2. Click "Run Pipeline" button
3. System matches your prompt to one of 5 video examples
4. Watch the 10-step pipeline execute in real-time
5. View hardcoded results specific to your matched example
6. Check database statistics and execution history

## Project Structure
```
strand-ai-poc/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main demo page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── Pipeline/          # Pipeline components
│   ├── Results/           # Results display
│   └── UI/                # Shared UI components
├── lib/                    # Core logic
│   ├── pipeline.ts        # Pipeline execution
│   ├── models.ts          # TypeScript models
│   └── logger.ts          # Logging system
├── data/                   # Data directory
│   └── preloaded/         # Pre-loaded assets
└── public/                 # Static assets
```

## Milestone 1 Deliverables
- ✅ Working pipeline with all 10 steps
- ✅ User prompt input (not hardcoded)
- ✅ 5 distinct video examples with unique hardcoded outputs
- ✅ Smart prompt matching system
- ✅ Database integration for real-time data
- ✅ Execution logging system
- ✅ Results display UI
- ✅ Statistics and execution history

## Documentation
See the documentation files in the root directory for detailed information.

## License
Proprietary - Neural Arc Inc.

