# Design Rules

> Visual and UX standards. All UI work must follow these before handoff to frontend.

## Principles (in priority order)

1. **Mobile-first** — Design for 375px first; desktop is an enhancement
2. **Single focus per screen** — Every page has ONE primary goal
3. **Conversion over aesthetics** — Beautiful means nothing if it doesn't convert
4. **Accessible by default** — Not a legal checkbox; a quality signal
5. **Performance as design** — Fast IS a design decision (lazy images, skeleton states)

## Typography Scale
```css
/* Use consistently — no ad-hoc sizes */
--text-xs:   12px / 1.4
--text-sm:   14px / 1.5
--text-base: 16px / 1.6   /* minimum body text */
--text-lg:   18px / 1.6
--text-xl:   20px / 1.5
--text-2xl:  24px / 1.3
--text-3xl:  30px / 1.2
```

## Spacing System (4px base unit)
```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px   /* paragraph spacing */
--space-6:  24px   /* section padding */
--space-8:  32px
--space-12: 48px   /* section separation */
--space-16: 64px   /* major sections */
```

## Color System
```css
/* Core */
--color-primary:    hsl(217, 51%, 25%)   /* Navy — trust */
--color-accent:     hsl(142, 71%, 45%)   /* Green — action */
--color-danger:     hsl(0, 84%, 60%)      /* Red — errors */
--color-warning:    hsl(38, 92%, 50%)     /* Amber — caution */
--color-surface:    hsl(0, 0%, 98%)       /* Near-white */
--color-text:       hsl(220, 9%, 11%)     /* Near-black */
```

## Accessibility Requirements (WCAG AA minimum)

| Type | Minimum Ratio |
|------|---------------|
| Normal text (<18px) | 4.5:1 |
| Large text (>=18px bold) | 3.0:1 |
| UI components | 3.0:1 |

- Touch targets: 44×44px minimum
- Focus indicators: visible (2px outline, 2px offset)
- Keyboard navigation: all interactive elements accessible

## Component States (ALL must be designed)
```
Default, Hover, Focus (keyboard), Active/Pressed,
Disabled (cursor: not-allowed), Loading (spinner/skeleton),
Error (red border + message), Success (green confirmation)
```

## Conversion Design Patterns

### Landing Page Structure
```
1. NAV         — Logo + single CTA
2. HERO        — H1 (fear/problem) + H2 (solution) + CTA + social proof
3. HOW IT WORKS — 3 steps max
4. BENEFITS    — 3-4 benefits with icons
5. SOCIAL PROOF — Testimonials with photo/name/title
6. PRICING     — Simple, one recommended option highlighted
7. FAQ         — 5-7 questions
8. FINAL CTA   — Repeat hero CTA
```

### Form UX Rules
- Max 5 fields above the fold
- Inline validation (error when field loses focus, not on submit)
- Progress indicator for multi-step forms
- Never disable submit button silently — show validation errors

## Responsive Breakpoints
```css
/* Mobile: 0-767px (design first) */
/* Tablet: 768-1023px */
@media (min-width: 768px) { ... }
/* Desktop: 1024px+ */
@media (min-width: 1024px) { ... }
```

## Handoff Checklist (Designer → Frontend Dev)
```
□ All states designed (default, hover, focus, error, loading, disabled)
□ Design tokens exported (colors, spacing, typography)
□ Component props defined
□ Mobile version reviewed
□ Accessibility checked
□ Copy finalized (no Lorem Ipsum)
```