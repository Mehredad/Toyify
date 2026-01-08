# PRD: Preview & Story Editor (prd.1.3)

1. Overview

One-paragraph summary:
Provide a Preview page where users can compare their original uploaded image with AI-generated concept images, edit the toy name and short 'Toy's story', and select product options (Fully Crafted / DIY). The user must consent to the name/story/style before continuing to add the toy to cart.

Problem Statement:
Users need a clear way to evaluate generated concepts, pick a final option, and provide a toy name/story before purchasing.

Goal:
Increase conversion from preview to add-to-cart by making selection and editing straightforward and trustworthy.

2. Scope & Out of Scope

In Scope:

- Preview page showing Original and Generated images side-by-side
- Story editor with inline editing and save
- Product option cards: Fully Crafted and DIY with detailed specs and price
- Consent checkbox: "I am happy with the selected name, story, and style to continue"
- Navigation: Back to upload or Forward to cart

Out of Scope:

- Generating multiple variations in the UI (may be added later)
- In-depth image editing tools beyond story and name

3. User Personas & Use Cases

Personas:

- Parent: compares images and chooses product type

Use Case: UC-PRE-001
Title: Review and select concept
Description: User reviews generated concept next to original image, edits name/story, selects product type, and proceeds
Pre-conditions: User has a toy draft with original and generated images
Post-conditions: Selected option saved to toy draft and user can add to cart
Main Flow:

1. User sees Original and Generated images side-by-side
2. User edits toy name and story in Story Editor
3. User chooses Fully Crafted or DIY option
4. User checks consent checkbox
5. User clicks "Add to Cart" and is redirected to Cart
   Alternate/Error Flows:

- Consent not checked — disable "Add to Cart"
- Save fails — show error and retry

4. Functional Requirements

FR-1: Display original and generated images clearly.
FR-2: Allow inline editing of name and story with autosave.
FR-3: Show product option cards (Fully Crafted / DIY) with price and details.
FR-4: Require consent checkbox to enable Add to Cart.
FR-5: Save selections to toy draft and return validation responses.

5. Non-Functional Requirements

Performance:

- Preview must render quickly; lazy-load generated images if necessary.

Security:

- No sensitive data in story text; user-submitted text should be sanitized server-side.

UX & Accessibility:

- Story editor should be keyboard accessible and support screen readers
- Product cards must be selectable via keyboard and provide clear focus states

6. Integration & API Hints

Endpoints:

- GET /api/toys/:toyId
- PATCH /api/toys/:toyId (to update name, story, selected product option)

Dependencies:

- Supabase DB for toy draft storage
- Edge function / worker that holds generated images

7. Analytics & Success Metrics

Metrics:

- Preview-to-cart conversion rate
- Time spent on Preview page
- Frequency of edits to story/name

KPIs:

- > 40% conversion from preview to cart

8. Risks & Open Questions

Risks:

- Users may be confused by difference between original and generated image
- Story editor could be misused to add inappropriate content

Open Questions:

- Should we autosuggest stories via AI on this screen?

9. Acceptance Criteria

- [ ] Original and Generated images are shown
- [ ] Inline editing works and persists changes
- [ ] Product option selection saved to toy draft
- [ ] Consent checkbox required to enable Add to Cart
- [ ] Redirects correctly to Cart on Add to Cart
