# Optimization Tasks - Vainilla y Miel

## Priority Legend
🔥 = CRITICAL - High Lighthouse/Bundle impact
⚡ = HIGH - Measurable performance gain
📐 = MEDIUM - Cleanup/Structure
♿ = MEDIUM - Accessibility
🔍 = LOW - Nice to have

## Phase 1: Bundle & Critical Path (🔥)
- [ ] 🟢 Fix Google Fonts - move from CSS @import to <link> preload with font-display:swap
- [ ] 🟢 Remove console.warn in api.ts (DEV check) & console.error in production stores
- [ ] 🟢 Add lazy loading import() for modals: RecommendationModal, NewSaleModal, ProductCreateModal, ProductEditModal
- [ ] 🟢 Add dompurify for security

## Phase 2: CSS Optimization (🔥)
- [ ] 🟢 Reduce style.css by 60% - remove duplicate animations, consolidate, deduplicate
- [ ] 🟢 Remove duplicated CSS classes (badge, badge--primary, base-badge, etc.)
- [ ] 🟢 Consolidate duplicate keyframes (fadeUp, fadeLeft, shine, pulse)
- [ ] 🟢 Remove unused utility classes
- [ ] 🟢 Merge responsive breakpoints

## Phase 3: Image Optimization (🔥)
- [ ] 🟢 Add width/height to all images for CLS prevention
- [ ] 🟢 Add loading="lazy" to below-fold images
- [ ] 🟢 Add fetchpriority="high" to LCP image (hero)

## Phase 4: Accessibility (♿)
- [ ] 🟢 Add aria-labels to icon buttons (icon-btn, btn-fav, close-btn)
- [ ] 🟢 Add aria-labels to navigation links
- [ ] 🟢 Add aria-labels to search input
- [ ] 🟢 Add aria-live regions for dynamic content
- [ ] 🟢 Add role="banner" to navbar, role="contentinfo" to footer

## Phase 5: SEO (📐)
- [ ] 🟢 Add canonical URL
- [ ] 🟢 Add JSON-LD structured data
- [ ] 🟢 Add hreflang for es-pe

## Phase 6: DOM & Render Optimization (⚡)
- [ ] 🟢 Remove sticky duplicate in .navbar
- [ ] 🟢 Optimize watchers in stores
- [ ] 🟢 Add shallowRef where applicable

## Phase 7: Best Practices (📐)
- [ ] 🟢 Remove debug logs
- [ ] 🟢 Add proper CSP meta tag
- [ ] 🟢 Fix any TypeScript strict errors

## Phase 8: Final Build & Verify
- [ ] 🟢 Build & verify no errors
- [ ] 🟢 Verify Lighthouse scores