# Panchang Components

This folder contains all components related to the Panchang (Hindu calendar) feature.

## Components

### FloatingPanchang
A floating, expandable widget that displays daily Panchang information.

**Features:**
- Fixed position in bottom-right corner
- Expandable card with detailed Panchang data
- Glassmorphism design with spiritual theme
- Smooth animations using Framer Motion

**Usage:**
```tsx
import { FloatingPanchang } from "@/app/(components)/panchang";

<FloatingPanchang />
```

**Data Displayed:**
- Date
- Tithi (Lunar day)
- Nakshatra (Constellation)
- Yoga
- Karana
- Sunrise/Sunset times
- Moonrise
- Auspicious Muhurat timings

## Future Components
- PanchangCalendar - Full calendar view with Panchang details
- PanchangCard - Reusable card component for Panchang data
- PanchangAPI - Service for fetching live Panchang data
