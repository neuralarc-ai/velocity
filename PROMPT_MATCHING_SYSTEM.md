# Prompt Matching System with Hardcoded Outputs

## Overview

The system now uses **user-provided prompts** that are matched to **5 pre-defined video examples**, each with **distinct hardcoded outputs**. All results are stored in a database for real-time tracking.

## How It Works

### 1. User Input
- User enters any prompt in the text area
- No hardcoded prompts - fully user-driven

### 2. Prompt Matching
The system matches user prompts to one of 5 examples using keyword matching:
- **Example 1**: Nike Athletic Video (keywords: athlete, running, nike, shoes, track, sport)
- **Example 2**: Coca-Cola Commercial (keywords: cola, coca, drink, beverage, soda, refreshment)
- **Example 3**: Apple Product Showcase (keywords: apple, iphone, technology, device, smartphone, tech)
- **Example 4**: McDonald's Food Ad (keywords: mcdonald, burger, fast food, fries, restaurant, mcd)
- **Example 5**: Samsung Galaxy Ad (keywords: samsung, galaxy, android, phone, smartphone)

### 3. Hardcoded Outputs
Each example has completely distinct hardcoded results:
- Different IP owners (Nike, Coca-Cola, Apple, McDonald's, Samsung)
- Different attribution scores (ranging from 76% to 91%)
- Different video analysis results
- Different safety check scores
- Different detected objects and brands

### 4. Database Integration
All executions are saved to a database (localStorage for now, easily swappable):
- Execution history
- Statistics (total executions, average duration, by example)
- Recent executions display
- Real-time data tracking

## The 5 Video Examples

### Example 1: Nike Athletic Video
- **Prompt Pattern**: athlete, running, sport, nike, shoes, track
- **Video**: Professional athlete wearing Nike shoes
- **IP**: Nike Logo (95% relevance), Nike Running Shoes (88% relevance)
- **Initial Attribution**: 87% (Nike)
- **Final Attribution**: 86% (Nike)
- **Variance**: -1%
- **Detected**: person, running_shoes, track, logo, athletic_apparel

### Example 2: Coca-Cola Commercial
- **Prompt Pattern**: cola, drink, beverage, coca, soda, refreshment
- **Video**: People enjoying Coca-Cola drinks at a party
- **IP**: Coca-Cola Logo (92% relevance), Coca-Cola Bottle (85% relevance)
- **Initial Attribution**: 78% (Coca-Cola)
- **Final Attribution**: 76% (Coca-Cola)
- **Variance**: -2%
- **Detected**: person, bottle, can, logo, party, table

### Example 3: Apple Product Showcase
- **Prompt Pattern**: apple, iphone, technology, device, smartphone, tech
- **Video**: Apple iPhone being showcased with Apple logo
- **IP**: Apple Logo (96% relevance), iPhone (91% relevance)
- **Initial Attribution**: 91% (Apple)
- **Final Attribution**: 90% (Apple)
- **Variance**: -1%
- **Detected**: smartphone, logo, screen, device, hand

### Example 4: McDonald's Food Ad
- **Prompt Pattern**: mcdonald, burger, fast food, fries, restaurant, mcd
- **Video**: McDonald's burger and fries with golden arches logo
- **IP**: Golden Arches (93% relevance), Big Mac (87% relevance)
- **Initial Attribution**: 82% (McDonald's)
- **Final Attribution**: 80% (McDonald's)
- **Variance**: -2%
- **Detected**: burger, fries, logo, packaging, food, restaurant

### Example 5: Samsung Galaxy Ad
- **Prompt Pattern**: samsung, galaxy, android, phone, smartphone
- **Video**: Samsung Galaxy smartphone with Samsung branding
- **IP**: Samsung Logo (90% relevance), Galaxy Phone (86% relevance)
- **Initial Attribution**: 84% (Samsung)
- **Final Attribution**: 83% (Samsung)
- **Variance**: -1%
- **Detected**: smartphone, logo, screen, device, technology

## Database Features

### Storage
- All executions saved with:
  - User prompt
  - Matched example ID
  - Complete results
  - Execution logs
  - Timestamps

### Statistics
- Total executions count
- Executions by example
- Average execution duration
- Recent executions (last 5)

### Real-time Updates
- Database updates after each execution
- Statistics refresh automatically
- Recent executions displayed in UI

## Usage

1. **Enter a Prompt**: Type any prompt related to the 5 examples
2. **System Matches**: Automatically matches to best example
3. **View Matched Example**: Shows which example was selected
4. **See Results**: Displays hardcoded results for that specific example
5. **Check Database**: View execution history and statistics

## Example Prompts to Try

- "A professional athlete wearing Nike shoes running on a track"
- "People enjoying Coca-Cola drinks at a party"
- "Apple iPhone being showcased with Apple logo"
- "McDonald's burger and fries with golden arches logo"
- "Samsung Galaxy smartphone with Samsung branding"

Or any variation with the keywords above!

## Technical Details

### Matching Algorithm
- Keyword-based matching
- Scores each example based on keyword presence
- Returns highest scoring example
- Defaults to first example if no match

### Database Structure
- Uses localStorage (client-side)
- Easily swappable with real database (PostgreSQL, MongoDB, etc.)
- Structured for easy migration

### Output Uniqueness
- Each example has completely distinct:
  - IP owners
  - Attribution scores
  - Video analysis
  - Safety check results
  - Detected objects/brands

