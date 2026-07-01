# Task List: Onboarding & Brand Profile Deep Revamp

- `[x]` Update `src/lib/db.ts` to support version history, `getBrandHistory`, and `restoreBrandVersion`
- `[x]` Create API routes `/api/brands/history` for retrieving history and restoring versions
- `[x]` Create API route `/api/generate/audit` for AI Strategic Audit & Recommendations Challenge
- `[x]` Enhance `/api/generate/tone` to include slider splits, regions, and platform formats
- `[x]` Rewrite Onboarding sequence `src/app/onboarding/page.tsx` with:
  - `[x]` Reordered steps (Tone of voice at Step 5, Audit Challenge at Step 6)
  - `[x]` Step 2 (Target Audience): Hierarchical region/country selector, gender slider, and socio-economic cards grid
  - `[x]` Step 4 (Content Verticals): Detailed descriptions and example posts per vertical
  - `[x]` Step 6 (Review & AI Strategy Audit): Audit button and recommendations modal
- `[x]` Rewrite Brand Guidelines page `src/app/dashboard/brand/page.tsx` with:
  - `[x]` Interactive split visualization (Gender bar, socio-economic cards)
  - `[x]` Extended platform formats grid with best practices
  - `[x]` Timeline/Version History panel at the bottom with detailed modals and "Restore past version" button
- `[x]` Run build verification (`npm run build`)
- `[x]` Copy updated files to `G:` drive workspace, commit and push to GitHub
