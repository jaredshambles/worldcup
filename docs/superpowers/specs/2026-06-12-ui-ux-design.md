# WC 2026 Bracket Challenge — UI/UX Design Specification

**Date:** 2026-06-12  
**Version:** 1.0  
**Design Philosophy:** Jony Ive (minimalism, precision) + Nir Eyal (engagement hooks)  
**Target Platform:** Mobile-first (iPhone 12+), responsive desktop (1920px max)  
**Theme:** Light mode (ESPN-inspired)  

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Design System](#design-system)
3. [Mobile-First Architecture](#mobile-first-architecture)
4. [Page Specs](#page-specs)
5. [Component Library](#component-library)
6. [Interaction Patterns](#interaction-patterns)
7. [Animation & Haptics](#animation--haptics)
8. [Data Visualization](#data-visualization)
9. [Responsive Behavior](#responsive-behavior)
10. [Implementation Checklist](#implementation-checklist)

---

## Design Philosophy

### Jony Ive Principles
This design follows Apple's design principles as codified by Jony Ive:

- **Hierarchy through restraint:** Visual weight comes from size, spacing, and typography—not color. Colors are used strategically to guide attention.
- **Whitespace is a feature:** Every element has breathing room. Sections are distinct; the eye can rest between zones.
- **Precision in typography:** Every font size, weight, and color is intentional. Small caps for labels. Consistent weight relationships.
- **Remove decoration:** No gradients, shadows, or glows unless they serve a functional purpose (depth, elevation, affordance).
- **Frictionless paths:** The user's next action is always obvious. No friction between intent and action.

### Nir Eyal Engagement Hooks
Behavioral design ensures users return daily and stay engaged:

- **Trigger:** Time-bound deadlines ("2h 15m remaining") create urgency without notification spam.
- **Action:** Obvious next step (big red "Make Prediction" button). Minimal cognitive load.
- **Reward:** Variable and quantified. "7 pts from 1st place" shows the gap. "+3 pts possible" shows what's at stake.
- **Investment:** Progress visibility (streaks, achievements, rank climbs). Users internalize sunk cost.
- **Social proof:** Real-time leaderboard with visible competitors. Competitive comparison drives engagement.
- **Loop:** Every match completion changes rank. Every deadline passes. The loop never gets stale.

---

## Design System

### Color Palette

#### Light Theme (ESPN-inspired)

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Background** | Clean white | `#ffffff` | Primary page background |
| **Surface** | Light gray | `#f9fafb` | Cards, elevated surfaces |
| **Surface Hover** | Slightly darker gray | `#f3f4f6` | Card hover states, secondary background |
| **Border** | Neutral gray | `#e5e7eb` | Card borders, dividers |
| **Text Primary** | Dark gray | `#1f2937` | Headlines, body text |
| **Text Secondary** | Medium gray | `#6b7280` | Labels, supporting text |
| **Text Tertiary** | Light gray | `#9ca3af` | Disabled, muted text |
| **Accent Primary** | ESPN Red | `#ef4444` | Primary CTA, urgent actions |
| **Accent Secondary** | Sports Blue | `#3b82f6` | Links, secondary accents |
| **Success** | Green | `#34d399` | User position highlight, positive outcomes |
| **Warning** | Amber | `#fbbf24` | First place medal, ranking badges |
| **Danger** | Red | `#dc2626` | Errors, critical info |
| **Info** | Light blue | `#dbeafe` | Information boxes, micro-interactions |

#### Semantic Colors

| State | Color | Hex | Context |
|-------|-------|-----|---------|
| **Your Rank Highlight** | Soft green BG + green border | `#f0fdf4` / `#86efac` | Your position in standings |
| **Medal 1st** | Gold | `#fbbf24` | 1st place badge |
| **Medal 2nd** | Silver** | `#e5e7eb` | 2nd place badge |
| **Medal 3rd** | Bronze** | `#fbbf24` (dimmed) | 3rd place badge |
| **Exact Score** | Gold | `#fbbf24` | Exact match prediction |
| **Correct Winner** | Blue | `#3b82f6` | Correct winner (wrong score) |
| **Streak Achievement** | Light blue | `#dbeafe` / `#93c5fd` | Streak badges |
| **Deadline Urgency** | Light amber BG | `#fef3c7` | Deadline countdown |
| **Error State** | Light red BG | `#fee2e2` | Input errors, warnings |

### Typography

#### Font Family
- **Sans-serif:** `Geist` (already in project) - Modern, clean, minimal weight variation
- **Monospace:** `Geist Mono` - Used only for match scores, match IDs (when needed)

#### Type Scale

| Use | Size | Weight | Line Height | Letter Spacing |
|-----|------|--------|-------------|-----------------|
| **Page Title** | 28px | 700 | 1.2 | -0.5px |
| **Section Header** | 20px | 600 | 1.3 | 0 |
| **Card Title** | 16px | 600 | 1.4 | 0 |
| **Body Text** | 14px | 400 | 1.6 | 0 |
| **Label (Small Caps)** | 11px | 500 | 1.2 | +0.5px |
| **Input Label** | 12px | 500 | 1.4 | 0 |
| **Rank Number (Hero)** | 28px | 300 | 1.0 | -0.5px |
| **Stat Value** | 20px | 300 | 1.0 | 0 |
| **Button Text** | 13px | 600 | 1.2 | 0 |
| **Helper Text** | 12px | 400 | 1.4 | 0 |
| **Tiny Text (Badges)** | 10px | 500 | 1.2 | +0.3px |

#### Font Weight Usage
- **300 (Light):** Hero numbers, stat values (creates minimalism)
- **400 (Regular):** Body text, body copy
- **500 (Medium):** Labels, small caps, secondary headers
- **600 (Semibold):** Section headers, card titles, button text
- **700 (Bold):** Page titles, emphasis text

### Spacing System

| Token | Size | Usage |
|-------|------|-------|
| `xs` | 4px | Small gaps between inline elements |
| `sm` | 8px | Padding within buttons, icon gaps |
| `md` | 12px | Card padding, standard spacing |
| `lg` | 16px | Section spacing, card margins |
| `xl` | 24px | Major section breaks |
| `2xl` | 32px | Page-level spacing |
| `3xl` | 48px | Full-screen spacing (desktop) |

### Border Radius

| Token | Size | Usage |
|-------|------|-------|
| `sm` | 4px | Small components (badges, small buttons) |
| `md` | 6px | Standard components (cards, inputs) |
| `lg` | 8px | Large cards, modals |
| `xl` | 12px | Phone frame corners, large sections |
| `full` | 9999px | Fully rounded (pills, circles) |

### Shadows

**Principle:** Minimal shadows. Elevation should be clear from spacing and borders, not depth.

| Level | Box Shadow | Usage |
|-------|-----------|-------|
| **None** | none | Flat surfaces (cards, sections) |
| **Hover** | `0 1px 3px rgba(0,0,0,0.08)` | On-hover elevation |
| **Modal** | `0 20px 25px rgba(0,0,0,0.1)` | Full-screen overlays only |

---

## Mobile-First Architecture

### Viewport Breakpoints

| Breakpoint | Width | Context |
|------------|-------|---------|
| **Mobile (iPhone)** | 320px–767px | Primary target (90% of traffic) |
| **Tablet** | 768px–1023px | Secondary responsive |
| **Desktop** | 1024px+ | Tertiary responsive |

### Safe Areas (iPhone)

- **Top:** 44px minimum (nav bar + status bar)
- **Bottom:** 34px minimum (home indicator, iPad)
- **Sides:** 16px minimum margin on mobile

### Touch Targets

- **Minimum hit area:** 44×44px (Apple HIG)
- **Recommended:** 48×48px for critical actions
- **Buttons:** 44px height minimum on mobile

---

## Page Specs

### 1. Home Page (Leaderboard Hero)

**Mobile Layout:**

```
[Status Bar 9:41]
[Nav Bar - WC 2026]

[Your Rank Card]
#2
You
238 pts
7 pts from 1st

[Deadline Badge - Urgency Trigger]
⏱ 2h 15m to deadline
1 match left in group stage

[Primary CTA Button]
Make Prediction
+3 pts possible

[Standings Section]
STANDINGS
🥇 Alex - 245
🥈 You - 238 (highlighted)
🥉 Sarah - 210

[Micro-Achievement Card]
⭐ 7-match streak intact

[Bottom Nav]
```

**Component Details:**

#### Your Rank Card
- **Container:** `16px` padding, `6px` radius, green highlight (`#f0fdf4` + `#86efac` border)
- **Layout:** Flex column, centered
- **#2 Rank:** `28px` light (300) weight, `-0.5px` letter-spacing, `#1f2937`
- **Label:** `11px` medium (500) weight, small caps, `#6b7280`, letter-spacing `+0.5px`
- **Name:** `13px` medium (500) weight, `#1f2937`
- **Points:** `16px` semibold (600), `#1f2937`
- **Gap:** `12px` medium (500), `#ef4444`, emoji prefix "📍"
- **Tap behavior:** Expands to show stage breakdown (Group, R32, R16, QF, SF, Final)

#### Deadline Badge
- **Container:** `12px` padding, `6px` radius, amber background (`#fef3c7` / `#fde047` border)
- **Text:** `12px` semibold (600), `#dc2626`, emoji prefix "⏱"
- **Subtext:** `10px` regular (400), `#78350f`
- **Tap behavior:** Deep link to next deadline's matches
- **Pulsing animation (final 30 min):** Subtle opacity pulse every 1.5 seconds

#### Primary CTA Button
- **Dimensions:** Full width (minus gutters), `48px` height (48×48 touch target)
- **Background:** `#ef4444` (ESPN Red)
- **Text:** `13px` semibold (600), white, centered
- **Subtext:** `10px` regular (400), light red (`#fee2e2`)
- **Border:** None
- **Radius:** `8px`
- **Tap feedback:** Haptic pulse (iOS), slight scale-down animation (0.1s)
- **States:**
  - Normal: Red background, white text
  - Hover: `#dc2626` (darker red)
  - Active: Scale to 0.98, haptic
  - Disabled: `#d1d5db` (gray), no hover

#### Standings Section
- **Header:** `11px` medium (500), small caps, `#6b7280`, letter-spacing `+0.5px`
- **Each row:**
  - Height: `30px`
  - Padding: `8px`
  - Radius: `6px`
  - Border: `1px` solid `#e5e7eb`
  - **Your row:** Highlight with `#ecfdf5` background + `#34d399` border (1.5px)
  - Medal emoji: `14px`
  - Name: `11px` medium (500), `#1f2937` (or `#059669` if your row)
  - Points: `11px` semibold (600), `#1f2937`, right-aligned
  - Tap: Navigate to H2H comparison with that player

#### Micro-Achievement Card
- **Container:** `12px` padding, `6px` radius, light blue (`#dbeafe` / `#93c5fd` border)
- **Icon:** `18px` emoji ("⭐")
- **Text:** `10px` semibold (600), `#0369a1`
- **Tap:** Expand to show all achievements, streak history
- **Animation on unlock:** Subtle confetti (0.5s, max 10 particles, no performance drag)

---

### 2. Predictions Page

**Mobile Layout:**

```
[Stage Tabs: Group | R32 | R16 | QF | SF | Final]

[Match Card]
Match: Mexico vs South Africa
Group A · Tue, Jun 10 · 2:00 PM
[Your Score Input] vs [Their Score Input]
Deadline: 2h 15m remaining
[Lock icon when locked]
[Submit / Save button]

[Next Match Card]
...

[Bonus Tab]
[Bonus Questions List]
Question: Which Americas team reaches QF?
[Text input]
[Submit]
```

**Component Details:**

#### Stage Tabs
- **Tab container:** Sticky, `12px` padding, light gray background (`#f3f4f6`)
- **Inactive tab:**
  - `8px` vertical, `12px` horizontal padding
  - `14px` regular (400), `#6b7280`
  - `6px` radius
  - Background: transparent
  - Tap: Scroll to that stage
- **Active tab:**
  - Background: `#ef4444` (red)
  - Text: white, semibold (600)
  - Bottom border: none (fill color is indicator)
  - Animation: Smooth slide (0.3s)

#### Match Card
- **Container:** `12px` padding, `6px` radius, white background, `1px` border `#e5e7eb`
- **Match Header:**
  - Team names: `13px` medium (500), `#1f2937`
  - Divider: " vs "
  - Stage/time: `10px` regular, `#6b7280`
  - Layout: 2-line (teams on line 1, stage/time on line 2)
- **Score Inputs:**
  - Layout: Flex row with center divider
  - Input width: 45% each, 20px height
  - Font: `16px` medium (500), monospace (Geist Mono), centered
  - Border: `1px` solid `#e5e7eb`
  - Radius: `4px`
  - Padding: `8px`
  - Tap: Full-screen number picker modal (iOS style)
  - Tap feedback: Haptic selection
- **Deadline indicator:**
  - `10px` regular, `#ef4444`
  - Icon: "⏱"
  - Updates every 1 second (real-time countdown)
- **Lock indicator:**
  - If locked: `12px` lock icon, `#9ca3af`
  - Text: "Locked", `10px` regular, `#6b7280`
- **Submit button:**
  - `44px` height, full width (minus padding)
  - Background: `#3b82f6` (blue)
  - Text: `13px` semibold, white, "Save Prediction"
  - States: Normal, hover (darker), disabled (gray if locked)

---

### 3. Bracket Page

**Mobile Layout:**

```
[View Toggle: Group Standings | Knockout Bracket]

[Group Standings View]
GROUP A
Pos | Team | W-D-L | GD | Pts
-----|------|-------|-----|-----
1 | Mexico | 3-0-0 | +5 | 9
...

[Knockout Bracket View]
[Round 32 Column]
[Match 1: 1E vs 3rd A/B/C/D/F]
[Your Prediction: 2-1]
[Actual: 2-1 ✓ +3pts]
...
```

**Component Details:**

#### Group Standings Table
- **Mobile-optimized grid:** Simplified columns (Pos, Team, Pts only; hide W-D-L on mobile)
- **Team names:** `12px` medium (500)
- **Points:** `14px` semibold (600)
- **Position badges:** 1-4 highlighted in light colors
- **Tap team row:** Show detail modal (full record, stats)

#### Knockout Bracket (Mobile)
- **Layout:** Horizontal scroll (not vertical tree)
- **Match card:** Compact, `10px` padding
  - Teams: `11px` medium (500)
  - Your prediction: `11px` semibold, blue
  - Actual result: `11px` semibold, green if correct
  - Points earned: `12px` bold, accent color
- **Tap match:** Expand to full match detail (teams, flags, time, your prediction, actual result, points)

---

### 4. Head-to-Head Comparison Page

**Mobile Layout:**

```
[Player Picker: Search / Dropdown]
Select opponent

[Comparison Card - You vs Alex]

YOUR STATS | ALEX'S STATS
238 pts | 245 pts
18 exact | 19 exact
52 winners | 55 winners
71% accuracy | 72% accuracy

[Stage-by-Stage Breakdown]
GROUP STAGE
You: 120 | Alex: 125
R32: 52 | R32: 55
...

[Head-to-Head Prediction Diff]
[Your Prediction vs Their Prediction, side-by-side for recent matches]
```

**Component Details:**

#### Comparison Container
- **Two-column layout (mobile: stacked):** Yours on left, opponent on right
- **Stats:** Bold centered values, labels below
- **Color coding:** Your stats in blue (`#3b82f6`), opponent in neutral gray
- **Tap:** Show detailed comparison for that stat

---

### 5. Chat Page

**Mobile Layout:**

```
[Message List - Scrollable]
[User Avatar] [Message] [Time]

[Input Area - Sticky]
[Text input + Send button]
```

**Component Details:**

#### Message Card
- **Layout:** Flex row with avatar
- **Avatar:** `32px` circle, user initials or color
- **Message bubble:**
  - Max width: 85% of viewport
  - Padding: `8px` left, `12px` right/top/bottom
  - Radius: `12px` (slightly more rounded for conversational feel)
  - Background: Light gray (`#f3f4f6`) for others, blue (`#dbeafe`) for you
  - Text: `14px` regular, black for others / `#1e40af` for yours
  - Timestamp: `10px` right-aligned below message

#### Input Area
- **Background:** White with top border `#e5e7eb`
- **Input field:**
  - Height: `44px`
  - Padding: `8px 12px`
  - Radius: `6px`
  - Border: `1px solid #e5e7eb`
  - Font: `14px` regular
  - Placeholder: `#9ca3af`
- **Send button:**
  - `44×44px` (square, right of input)
  - Icon: "→" or send icon
  - Background: `#ef4444`
  - Tap: Send, clear input, animate upward

---

### 6. Admin Page

**Mobile Layout:**

```
[Admin Panel Tabs: Matches | Players | Bonus]

[Matches Tab]
[Match Cards - Editable]
[Score Input Fields - Numbers]
[Status Dropdown: Scheduled | Live | Finished]
[Save Button]

[Players Tab]
[Player List with Email]
[Edit / Delete buttons]

[Bonus Tab]
[Bonus Question Cards]
[Mark Resolved]
```

**Component Details:**

#### Match Admin Card
- **Layout:** Similar to predictions page, but inputs are larger and always visible
- **Score inputs:** `48px` height, `20px` font, monospace
- **Status dropdown:**
  - `44px` height, full width
  - Background: Light gray (`#f3f4f6`)
  - Border: `1px #e5e7eb`
  - Options: Scheduled | Live | Finished
- **Save button:**
  - `48px` height, full width
  - Background: `#34d399` (green, indicates "saved")
  - Text: white, semibold, "Save Match"
- **Tap feedback:** On success, button flashes green, shows "✓ Saved" for 1.5s

---

## Component Library

### Button Variants

#### Primary Button (Red CTA)
```
Background: #ef4444
Hover: #dc2626
Active: Scale 0.98, haptic pulse
Disabled: #d1d5db
Height: 48px
Padding: 0 16px
Border radius: 8px
Font: 13px semibold white
Min width: 120px
```

#### Secondary Button (Blue)
```
Background: #3b82f6
Hover: #2563eb
Active: Scale 0.98
Disabled: #9ca3af
Height: 44px
```

#### Tertiary Button (Gray)
```
Background: #f3f4f6
Text: #1f2937
Border: 1px #e5e7eb
Hover: Background #e5e7eb
```

#### Ghost Button (Transparent)
```
Background: transparent
Text: #3b82f6
Border: none
Hover: Background #ecfdf5 (very light)
```

### Input Fields

#### Number Input (Score)
```
Type: number
Height: 48px (mobile) / 40px (desktop)
Font: 16px monospace medium
Text align: center
Border: 1px solid #e5e7eb
Radius: 4px
Padding: 8px
Focus: Border #3b82f6 (2px), shadow: 0 0 0 3px rgba(59,130,246,0.1)
Disabled: Background #f3f4f6, cursor: not-allowed
```

#### Text Input
```
Type: text
Height: 44px
Font: 14px regular
Padding: 8px 12px
Border: 1px solid #e5e7eb
Radius: 6px
Focus: Border #3b82f6 (2px), shadow: 0 0 0 3px rgba(59,130,246,0.1)
Placeholder: #9ca3af
```

### Cards

#### Standard Card
```
Background: #ffffff
Border: 1px solid #e5e7eb
Border radius: 6px
Padding: 12px
Box shadow: none (flat)
Hover: Background #f9fafb, shadow: 0 1px 3px rgba(0,0,0,0.08)
```

#### Highlighted Card (Your Position, Achievement)
```
Background: #f0fdf4 (light green)
Border: 1px solid #86efac (green)
Border radius: 6px
Padding: 12px
```

#### Alert Card (Deadline, Urgency)
```
Background: #fef3c7 (light amber)
Border: 1px solid #fde047 (amber)
Padding: 12px
Text: #78350f (dark brown)
```

### Badges

#### Rank Badge
```
Display: Inline-flex, items-center, gap-1
Padding: 4px 8px
Border radius: 4px
Font: 10px semibold
Background: Light gray (#f3f4f6)
Text: #1f2937
```

#### Achievement Badge
```
Background: #dbeafe (light blue)
Border: 1px solid #93c5fd
Border radius: 4px
Padding: 6px 10px
Font: 10px semibold
Text: #0369a1
Icon: 18px emoji
```

---

## Interaction Patterns

### Tap Interactions

#### Rank Card (Homepage)
- **Tap:** Expands to show stage breakdown
- **Animation:** Smooth slide-down, 0.3s ease-in-out
- **Breakdown display:** Grid of stage names + points earned
- **Tap again:** Collapses

#### Leaderboard Row
- **Tap:** Navigate to H2H comparison page with that player
- **Animation:** Push transition (iOS standard)
- **Data:** Pre-populate player name, fetch their stats

#### Match Card (Predictions)
- **Tap on score input:** Open full-screen number picker
- **Animation:** Slide-up modal (iOS style, 0.3s)
- **Picker:** Large touch targets, haptic feedback on selection
- **Confirm:** Haptic pulse, return to predictions list

#### Deadline Badge
- **Tap:** Show which matches are closing soon
- **Deep link:** Scroll to first closing match, highlight it
- **Pulsing animation:** Final 30 minutes, opacity pulse every 1.5s

#### Achievement Badge
- **Tap:** Show streak history or achievement details modal
- **Animation:** Expand/pop animation (0.4s)

### Long Press (Future)
- **Match card:** Preview full match details (team logos, time, stadium)
- **Player name:** Quick actions menu (compare, message, block)

### Pull-to-Refresh
- **Trigger:** Scroll to top, pull down
- **Animation:** Standard iOS momentum
- **Haptic:** Pulse when released
- **Duration:** 0.5–1s to refresh leaderboard + matches
- **Success indicator:** Green checkmark, then fade

### Swipe Navigation (Future)
- **Between pages:** Swipe left/right to navigate to next page
- **Example:** Swipe from Home to Bracket, or Bracket to Chat
- **Animation:** Push/pop transition

---

## Animation & Haptics

### Haptic Feedback (iOS)

| Interaction | Haptic | Intensity |
|-------------|--------|-----------|
| Button tap | Light impact | 0.5 |
| Number picker selection | Selection | 0.3 |
| Rank climb/drop | Light impact | 0.7 |
| Achievement unlock | Medium impact | 1.0 |
| Prediction submitted | Light notification | 0.6 |
| Deadline in final 30min pulse | Light impact every 1.5s | 0.3 |
| Pull-to-refresh trigger | Light impact | 0.5 |

### Micro-Animations

#### Number Counter (Rank, Score, Points)
```
Trigger: Value changes (rank climbs/drops, points earned)
Animation: Smooth number counter from old → new value
Duration: 1–2 seconds
Easing: ease-in-out
Example: Points go from 235 → 238 (counter animates through each number)
```

#### Achievement Unlock
```
Trigger: User achieves milestone (7-match streak, first exact score, etc.)
Animation: Confetti (subtle, not overwhelming)
Particles: ~10 particles, 0.5s duration
Easing: ease-out
Position: Above achievement card
```

#### Button Press Feedback
```
Trigger: User taps button
Animation: Scale down to 0.98, then back to 1.0
Duration: 0.1s
Easing: ease-out cubic
Feedback: Haptic light impact
```

#### Deadline Pulse (Final 30 Min)
```
Trigger: Deadline within 30 minutes
Animation: Opacity pulse on deadline badge
Duration: Opacity 1.0 → 0.6 → 1.0 every 1.5s
Easing: ease-in-out sine
Haptic: Light impact every pulse
```

#### Tab Slide
```
Trigger: Switch between stage tabs
Animation: Smooth slide of underline indicator
Duration: 0.3s
Easing: ease-in-out
Content: Crossfade (0.2s) or push (0.3s)
```

#### Expand/Collapse Card
```
Trigger: Tap rank card, achievement badge, etc.
Animation: Height change (0 → full height)
Duration: 0.3s
Easing: ease-in-out
Content: Fade in (staggered by 50ms per child)
```

### Performance Considerations
- All animations run on 60 FPS (0.016s per frame)
- Haptics are non-blocking (do not delay UI)
- Confetti uses canvas (not DOM elements) for performance
- Disable animations on low-power mode (`prefers-reduced-motion`)

---

## Data Visualization

### Leaderboard Table

**Mobile:**
- Simplified columns: Rank | Name | Exact | Winner | Bonus | Total
- Exact scores, winner counts, bonus points shown as numbers with color coding
- Gold dot for exact scores
- Blue dot for winner-only
- Tap row to expand full breakdown

**Desktop:**
- Full width table with all columns visible
- Sortable by any column
- Hover rows to show quick H2H comparison

### Stage Breakdown Grid

**Display format:**
```
GROUP | R32 | R16 | QF | SF | FINAL
  120 |  52 |  35 | 18 |  10 |  3
```

- Each stage is a card with stage label + points
- Tap to see matches for that stage
- Color intensity shows relative performance (better stages = more saturated)

### Bracket Visualization

**Mobile (Horizontal Scroll):**
- Each round as a vertical column
- Match cards show: Team | Your Prediction | Actual | Points
- Color coding: Green (correct), Red (incorrect), Blue (pending)

**Desktop (Tree Layout):**
- Full knockout tree with connected lines
- Hover to see match details
- Click to expand and edit

### Accuracy Meter

**Display:**
```
Your Accuracy: 71%
[████████░] 8/10 this week
```

- Horizontal bar with percentage
- Shows recent accuracy trend
- Color: Green if improving, orange if stable, red if declining

---

## Responsive Behavior

### Mobile (320–767px)

**Homepage:**
- Full-screen rank card
- Single-column layout
- Sticky deadline badge
- Full-width buttons

**Predictions:**
- Single-column match cards
- Sticky stage tabs
- Full-width score inputs

**Bracket:**
- Horizontal scroll for knockout rounds
- Simplified group tables (hide columns)

### Tablet (768–1023px)

**Homepage:**
- Rank card: 60% width, left side
- Leaderboard: 60% width, right side
- Two-column layout

**Predictions:**
- Two columns of match cards

### Desktop (1024px+)

**Homepage:**
- Three-column layout: Rank (left), Leaderboard (center-right), stats (right)
- Full standings with all data
- Sidebar navigation

**Bracket:**
- Full knockout tree visible (no horizontal scroll)
- Group standings in a resizable panel

---

## Implementation Checklist

### Phase 1: Foundation (Design System)
- [ ] Set up Tailwind theme variables (colors, typography, spacing)
- [ ] Create CSS custom properties for consistent application
- [ ] Build component library (buttons, inputs, cards, badges)
- [ ] Implement dark mode toggle (prep for future, use light as default)

### Phase 2: Mobile Pages (MVP)
- [ ] Home page with rank card, deadline badge, CTA, leaderboard
- [ ] Predictions page with stage tabs and match cards
- [ ] Bracket page with group standings
- [ ] Chat page with message list
- [ ] Admin page with match editor

### Phase 3: Interactions & Polish
- [ ] Implement all tap interactions (expand cards, navigate)
- [ ] Add haptic feedback (iOS)
- [ ] Implement animations (number counter, achievement unlock, pulses)
- [ ] Pull-to-refresh functionality
- [ ] Deep linking (deadline badge → match)

### Phase 4: Responsive & Desktop
- [ ] Tablet optimizations (two-column layouts)
- [ ] Desktop optimizations (three-column, sidebar nav)
- [ ] Test on all breakpoints
- [ ] Verify touch targets on mobile (48×48 minimum)

### Phase 5: Polish & Optimization
- [ ] Performance audit (Lighthouse, Core Web Vitals)
- [ ] Accessibility audit (a11y, color contrast, ARIA labels)
- [ ] Edge case testing (network failures, empty states)
- [ ] Animation performance (60 FPS validation)
- [ ] Haptic testing on real iPhone devices

### Phase 6: Launch
- [ ] Final QA on iOS Safari, Chrome, Firefox
- [ ] Monitor analytics for engagement metrics
- [ ] Iterate based on user feedback

---

## Notes for Developers

1. **Tailwind Configuration:**
   - Extend Tailwind theme with custom colors and typography
   - Use CSS variables for semantic colors (accessible, easy to theme)
   - Avoid hardcoding colors; use tokens

2. **Component Structure:**
   - Build reusable components (Button, Card, Input, Badge)
   - Props: variant (primary, secondary, tertiary), size (sm, md, lg), state (disabled, loading)
   - Use TypeScript for props validation

3. **Animations:**
   - Use Framer Motion or CSS transitions for simplicity
   - Keep animations under 0.5s (feels snappy)
   - Respect `prefers-reduced-motion` (disable animations for accessibility)

4. **Haptics:**
   - Use `navigator.vibrate()` for Android
   - Use Webkit haptics for iOS (requires native bridge or custom integration)
   - Gracefully degrade if haptics unavailable

5. **Testing:**
   - Test on iPhone 12, 14, 15 (various screen sizes)
   - Test on iPad (responsive behavior)
   - Test touch performance (ensure 60 FPS)
   - Test accessibility (color contrast, touch targets, screen readers)

6. **Future Enhancements:**
   - Dark mode (toggle in settings, use same component library)
   - Notifications (deadline reminders, rank changes)
   - Share predictions (social links, brackets)
   - Offline support (show cached data, sync when online)

---

## References

- **Design System:** Jony Ive's design principles (minimalism, precision, restraint)
- **Behavioral Design:** Nir Eyal's "Hooked" framework (triggers, action, reward, investment, social proof)
- **Mobile Design:** Apple Human Interface Guidelines (HIG)
- **Accessibility:** WCAG 2.1 AA standards
- **Performance:** Lighthouse, Core Web Vitals

---

**Design Locked:** 2026-06-12  
**Next Step:** Implementation plan (writing-plans skill)
