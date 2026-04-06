# Marplacode Project Guidelines

## Project Overview
Marplacode is a modern landing page for a digital product agency. It's built with Next.js 14, React 18, and features advanced animations using GSAP, Three.js, and Splitting.js.

**Tech Stack:**
- Next.js 14.2.5 with App Router
- React 18 with "use client" components
- GSAP with ScrollTrigger for scroll animations
- Three.js with WebGL for visual effects
- Splitting.js for text animation
- Tailwind CSS for styling
- TypeScript with strict mode

## Key Components

### Animation Components
- **AnimatedHeadline.tsx**: Hero headline with GSAP scroll animations (Demo 10 - character scatter entry, Demo 9 - 3D dispersal on exit)
- **CursorTrail.tsx**: Interactive cursor trail effect using Three.js
- **DitherBg.tsx**: Dither background effect component
- **useAnimatedText.ts**: Custom hook for text animation on Intersection Observer trigger

### Page Sections
- **Hero.tsx**: Hero section with sticky scroll and parallax effects
- **Capabilities.tsx**: Horizontal gallery of capabilities (uses AnimatedHeadline)
- **Cases.tsx**: Case studies section (animated text)
- **Process.tsx**: Process explanation section (animated text)
- **Differentiator.tsx**: Comparison section with competitors (animated text + unescaped quotes fix)
- **CTA.tsx**: Call-to-action section (animated text)
- **Filter.tsx**: Interactive filter section
- **Navbar.tsx**: Navigation bar
- **Footer.tsx**: Footer content
- **ShrinkOnScroll.tsx**: Wrapper component with scroll-based shrinking effect

## Important Notes

### Development
- Run `npm run dev` to start the development server on http://localhost:3000
- The project uses dynamic imports for client components to prevent SSR "document is not defined" errors
- TypeScript strict mode is enabled - Three.js type mismatches often require `as any` casts

### Animations
- Animations trigger on scroll using GSAP ScrollTrigger
- Text animations use Intersection Observer with configurable threshold (currently 0.25 with 100ms delay)
- Character animations use Splitting.js to split text into individual elements
- Three.js components use shaders for complex visual effects

### Common Fixes
1. **TypeScript Three.js errors**: Cast Three.js objects to `any` when type definitions don't match runtime behavior
   - Example: `const camera = new THREE.OrthographicCamera(...) as any;`
   - Example: `const mesh = new THREE.Mesh(...) as any;`

2. **SSR "document is not defined"**: Use dynamic imports in page.tsx with `ssr: false`
   ```typescript
   const Component = dynamic(() => import("@/components/Component"), { ssr: false });
   ```

3. **Text cutoff in animations**: Adjust scale values (currently 1.15) and ensure no `overflow-hidden` on parent containers

4. **Unescaped quotes in JSX**: Replace double quotes with `&quot;` entity
   ```typescript
   // Bad: "No ejecutamos tickets..."
   // Good: &quot;No ejecutamos tickets...&quot;
   ```

## Deployment

### GitHub & Vercel
- Push changes to `main` branch: `git push origin main`
- Vercel auto-deploys on push to the `marplacode-project` production environment
- Project URL: https://marplacode.vercel.app

### Build
- Run `npm run build` to create production build
- Build must pass TypeScript strict checking
- No console errors or warnings in production build

## Development Workflow

1. **Make changes locally** in the appropriate component
2. **Test in dev server** - animations should trigger on scroll/interaction
3. **Run build test** - `npm run build` must pass
4. **Commit with meaningful message** - describe what and why
5. **Push to GitHub** - `git push origin main`
6. **Verify Vercel deployment** - check build logs and visit production URL

## Notes for Claude

- This is a high-fidelity design implementation with complex animations
- The user is a product designer focused on animation quality and visual effects
- Prioritize animation smoothness and performance over code simplicity
- Test all animations in different browsers and devices before pushing to prod
- Be cautious with Three.js code - type safety is less important than runtime behavior
- Always provide Vercel deployment link after pushing to prod
- The user prefers terse responses without trailing summaries
- Do not add unnecessary abstractions or utility functions - keep code focused on the task

## Last Updated
April 6, 2026
