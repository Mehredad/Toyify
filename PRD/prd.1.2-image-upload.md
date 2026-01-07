# PRD: Image Upload Feature (prd.1.2)

1. Overview

One-paragraph summary:
Allow users to upload an image (drawing, scribble, painting) via drag-and-drop or file select from the Home page. The image is validated (type and size), previewed, and sent to the server for processing (AI-based concept generation). This feature is the entry point to the toy creation flow.

Problem Statement:
Users need a clear, reliable way to provide their drawings so the service can generate toy concepts.

Goal:
Increase successful upload rate and reduce user friction in the create-toy flow.

2. Scope & Out of Scope

In Scope:
- Drag-and-drop and click-to-select upload UI on Home page
- Client-side validation: PNG/JPG/JPEG only, max 5MB
- Immediate preview of selected image
- Upload to backend (storage) and create a toy draft entry
- Show upload progress and error states
- Show success state and navigate to Preview page

Out of Scope:
- AI image generation (handled by backend service)
- Advanced image editing (crop/rotate) — may be added in later phases

3. User Personas & Use Cases

Personas:
- Parent: wants to quickly turn a drawing into a toy
- Admin: internal user validating uploaded files (not in first release)

Use Case: UC-IMG-001
Title: Upload Drawing
Description: User uploads a drawing from the Home page and is redirected to Preview
Pre-conditions: User is on Home page
Post-conditions: Toy draft created with uploaded image, user is on Preview page
Main Flow:
  1. User clicks "Get started for free" or drags an image into the drop zone
  2. Client validates file type and size
  3. Client shows preview and upload progress
  4. Server stores image and returns toy draft id
  5. Client navigates to `/preview/:toyId`
Alternate/Error Flows:
  - Invalid file type — show error message
  - File too large — show error message
  - Upload failure — retry option and clear error message

4. Functional Requirements

FR-1: Support drag-and-drop and file select upload on Home page.
FR-2: Validate file types: PNG, JPG, JPEG.
FR-3: Enforce max file size: 5MB.
FR-4: Show client-side preview before upload.
FR-5: Upload file to backend and create toy draft (return toyId).
FR-6: Show progress and friendly error messages for failures.
FR-7: Navigate to `/preview/:toyId` on success.

5. Non-Functional Requirements

Performance:
- Upload should complete within reasonable time for 5MB files (server dependent).

Security:
- Do not expose API keys in frontend; server-side upload endpoints must be used
- Sanitize filenames and validate content on server

Reliability & Monitoring:
- Track upload failures and error codes

UX & Accessibility:
- Drop zone should be keyboard accessible and screen-reader friendly
- Provide clear accessible error messages

6. Integration & API Hints

Endpoints (high-level):
- POST /api/uploads (multipart/form-data) -> { toyId, uploadUrl }
- GET /api/toys/:toyId -> toy draft (images, status)

Important inputs/outputs:
- Input: image file
- Output: toyId and stored image URL

Dependencies:
- Supabase Storage or alternative object storage
- Supabase functions or Edge Functions to process/generate concepts

7. Analytics & Success Metrics

Metrics:
- Upload success rate (%)
- Time to upload (median)
- Conversion from upload -> add-to-cart

KPIs:
- 95% successful uploads for valid files
- Median upload time < 3s (subject to infra)

8. Risks & Open Questions

Risks:
- Large files causing timeouts
- Malicious uploads or invalid images

Open Questions:
- Should we reject animated GIFs or accept them?
- Will we allow client-side resizing/compression?

9. Acceptance Criteria

- [ ] Drag-and-drop and click-select work
- [ ] Client-side validation for type and size enforced
- [ ] Preview shown before upload
- [ ] Upload creates toy draft and navigates to Preview
- [ ] Accessibility checks for drop zone passed
