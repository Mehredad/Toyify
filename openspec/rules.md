# Rules for AI-Human Collaboration - Toyify Project

## 1. Purpose

All development in this repository follows a **structured specification-driven approach** coordinated through OpenSpec. This ensures consistent, traceable, and high-quality code across all contributions from both human developers and AI agents.

The OpenSpec system lives in the project root under `openspec/`, acting as the single source of truth for all architectural decisions, feature specifications, and development guidelines.


## 2. Required Context Files

Before writing ANY code, every AI assistant and developer **MUST** read and understand the following documents in this order:

### Primary Documentation (Read First)

1. **`openspec/use_case.md`** → Complete user flows and business requirements
2. **`openspec/architecture.md`** → System architecture, tech stack, data models, and API integrations
3. **`openspec/design-guideline.md`** → Technical standards, code conventions, and component patterns
4. **`openspec/rules.md`** → Collaboration workflow and principles (this file)

### Supporting Documentation

5. **`README.md`** → Project setup, dependencies, and quick start guide
6. **`openspec/design-guideline.md`** → Supplementary design patterns (if differs from openspec version)
7. **`openspec/rules.md`** → Additional project-specific rules (if differs from openspec version)

### Active Specifications

8. **`openspec/spec/changes/`** → All pending feature specifications (read ALL before coding)
9. **`openspec/spec/archived/`** → Completed features (reference only, immutable)

**Golden Rule:** These documents together define how the application must be built and maintained. Code that violates these documents will be rejected.


## 3. Core Principles

### Specification-Driven Development

1. ✅ **Every feature begins as an OpenSpec change file** under `openspec/spec/changes/`
2. ✅ **Code must implement ONLY what is defined** in the corresponding spec
3. ✅ **Before coding, read ALL active specs** in `changes/` to understand current work
4. ✅ **Humans validate and approve specs** before implementation begins
5. ✅ **Archived specs are immutable** - they document completed work

## Architecture Consistency

1. Follow the **React + TypeScript + Tailwind CSS + Supabase** stack defined in `openspec/architecture.md`
2. Use **shadcn/ui components** for all UI elements
3. Respect the **component hierarchy** and folder structure
4. Implement **proper error handling** and loading states
5. Follow **security best practices** (no exposed API keys, use RLS policies)

### Communication First

1. **Ask questions** before making assumptions
2. **Propose solutions** in specs before coding
3. **Document decisions** that affect architecture
4. **Humans have final authority** on all design decisions

---

## 4. Development Workflow

### Step 1: Feature Request

- **Human** or **AI** identifies a new feature or change needed
- Discuss requirements in chat or issue tracker
- Confirm the feature aligns with product roadmap in `openspec/use_case.md`

### Step 2: Create Specification

```bash
# Create new spec file
touch openspec/spec/changes/YYYYMMDD-feature-name.md
```

The spec file must include:

- **Summary**: One-line description
- **Context**: Why this change is needed
- **User Story**: As a [user], I want [feature] so that [benefit]
- **Requirements**: Detailed functional requirements
- **Technical Approach**: Components, APIs, data flow
- **Acceptance Criteria**: How to validate the feature works
- **Files Affected**: List of files to be created/modified
- **Dependencies**: External services, libraries, or other specs

Example spec template:

```markdown
# Add User Image Upload Feature

**Status:** Draft | In Progress | Under Review | Completed  
**Created:** 2026-01-07  
**Owner:** [Developer Name or AI Agent ID]  
**Related Specs:** None

## Summary

Enable users to upload drawings via drag-and-drop on the home page.

## Context

Currently, users cannot upload images. This is the first critical step in the toy creation flow.

## User Story

As a user, I want to drag and drop my child's drawing onto the website so that I can start creating a toy.

## Requirements

1. Drag-and-drop zone on home page below hero text
2. Support PNG, JPG, JPEG files only
3. Max file size: 5MB
4. Show preview after upload
5. Display error for invalid files
6. Redirect to /preview/:toyId after successful upload

## Technical Approach

- Component: `src/components/features/ImageUploader.tsx`
- Service: `src/services/supabase.ts` (uploadDrawing function)
- Storage: Supabase Storage bucket "drawings"
- State: Local useState for file preview
- Validation: File type and size checks

## Acceptance Criteria

- [ ] User can drag and drop image files
- [ ] User can click to select files
- [ ] Invalid files show error message
- [ ] Valid files are uploaded to Supabase
- [ ] User is redirected to preview page
- [ ] Loading spinner shows during upload

## Files Affected

- CREATE: `src/components/features/ImageUploader.tsx`
- MODIFY: `src/pages/Home.tsx`
- MODIFY: `src/services/supabase.ts`
- MODIFY: `openspec/architecture.md` (update component list)

## Dependencies

- Supabase Storage bucket must be created
- Supabase RLS policy must allow authenticated uploads
```

### Step 3: Review & Approval

- **AI** drafts the spec and presents it to **Human**
- **Human** reviews requirements and technical approach
- Iterate on spec until both parties agree
- Change status to "In Progress"

### Step 4: Implementation

- **AI** or **Human** implements the code following the spec
- Code must respect all guidelines in `openspec/design-guideline.md`
- Reference the spec file in all commits
- Create tests for critical functionality

### Step 5: Validation

- Run through acceptance criteria in the spec
- Test manually in browser
- Check console for errors
- Run `npm run build` to verify TypeScript compilation
- Verify mobile responsiveness

### Step 6: Code Review

- **Human** reviews code changes
- Verify alignment with spec
- Check code quality and conventions
- Request changes if needed

### Step 7: Archive & Merge

```bash
# Move completed spec to archived
mv openspec/spec/changes/YYYYMMDD-feature-name.md openspec/spec/archived/

# Update status in archived file to "Completed"
# Add completion date
# Commit and merge
```

---

## 5. Behavioral Rules for AI Agents

### Before Starting Work

1. ✅ **Check if a spec already exists** for the requested feature
2. ✅ **Read ALL active specs** in `openspec/spec/changes/` to understand current work
3. ✅ **Read the full architecture** in `openspec/architecture.md`
4. ✅ **Confirm understanding** by summarizing the task back to the human

### During Implementation

1. ✅ **Follow the spec exactly** - don't add features not specified
2. ✅ **Use existing patterns** - check similar components first
3. ✅ **Respect the tech stack** - don't introduce new libraries without approval
4. ✅ **Write TypeScript** - no plain JavaScript files
5. ✅ **Use Tailwind classes** - no custom CSS unless necessary
6. ✅ **Import from `@/components/ui`** for shadcn components
7. ✅ **Handle errors gracefully** - show user-friendly messages
8. ✅ **Add loading states** - for all async operations

### What NOT to Do

1. ❌ **Don't modify other modules** unless the spec explicitly requires it
2. ❌ **Don't change architecture** without creating a spec first
3. ❌ **Don't skip error handling** or loading states
4. ❌ **Don't hardcode values** that should be in environment variables
5. ❌ **Don't use localStorage** for sensitive data
6. ❌ **Don't expose API keys** in frontend code
7. ❌ **Don't create duplicate components** - reuse existing ones

### After Completing Work

1. ✅ **Update `openspec/architecture.md`** if new components or patterns were added
2. ✅ **Update `README.md`** if dependencies changed
3. ✅ **List all files changed** in the spec completion notes
4. ✅ **Explain implementation decisions** that deviated from original plan

---

## 6. File Organization Standards

### Component Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (DON'T MODIFY)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── layout/          # App-wide layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── features/        # Feature-specific components
│   │   ├── ImageUploader.tsx
│   │   ├── ProductCard.tsx
│   │   └── CartItem.tsx
│   └── shared/          # Reusable utility components
│       └── LoadingSpinner.tsx
├── pages/               # Route/page components
│   ├── Home.tsx
│   ├── Preview.tsx
│   ├── Cart.tsx
│   └── Billing.tsx
├── contexts/            # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── services/            # External API integrations
│   ├── supabase.ts      # All Supabase operations
│   ├── openai.ts        # All OpenAI operations
│   └── stripe.ts        # All Stripe operations
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   └── useCart.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Helper/utility functions
│   └── validation.ts
└── constants/           # App-wide constants
	└── products.ts
```

### Naming Conventions

- **Components:** PascalCase (e.g., `ImageUploader.tsx`)
- **Utilities:** camelCase (e.g., `formatPrice.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Types/Interfaces:** PascalCase with descriptive names (e.g., `CartItem`, `UserProfile`)

---

## 7. Commit & Pull Request Policy

### Commit Messages

Format: `<type>: <description> [spec: YYYYMMDD-feature-name]`

Types:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:

```bash
git commit -m "feat: add image upload component [spec: 20260107-image-upload]"
git commit -m "fix: handle upload errors gracefully [spec: 20260107-image-upload]"
git commit -m "docs: update architecture with new component"
```

### Pull Request Template

```markdown
## Related Spec

`openspec/spec/changes/YYYYMMDD-feature-name.md`

## Summary

Brief description of what this PR does.

## Changes Made

- Added ImageUploader component
- Updated Home page to include uploader
- Added uploadDrawing function to supabase service

## Testing Done

- [x] Tested drag and drop
- [x] Tested file selection
- [x] Tested error handling
- [x] Tested on mobile
- [x] Ran `npm run build` successfully

## Screenshots

[If UI changes, include before/after screenshots]

## Notes

Any important implementation details or decisions made.
```

---

## 8. Communication & Conflict Resolution

### When AI Needs Clarification

**AI must pause and ask** when encountering:

- Ambiguous requirements in the spec
- Conflicts between spec and existing code
- Security concerns
- Performance implications
- Need for new dependencies

**Format for questions:**

```
🤔 Clarification Needed:

Context: [What I'm working on]
Issue: [What's unclear or conflicting]
Options: [Possible solutions I see]
Question: [Specific question for human]
```

### When Human Disagrees with AI Approach

- **Human has final authority** on all decisions
- AI should explain reasoning but accept human decision
- Update the spec to reflect the agreed approach
- Document the decision in spec notes

### Resolving Design Conflicts

1. Refer back to `openspec/use_case.md` for user requirements
2. Check `openspec/design-guideline.md` for established patterns
3. Review similar implementations in codebase
4. If still unclear, create a small proof-of-concept
5. Human makes final call

---

## 9. Quality Assurance Checklist

### Before Marking Spec as Complete

Every implementation must pass this checklist:

#### Functionality

- [ ] All acceptance criteria in spec are met
- [ ] Feature works as described in user story
- [ ] Edge cases are handled
- [ ] Error states show helpful messages
- [ ] Loading states are visible during async operations

#### Code Quality

- [ ] TypeScript types are properly defined (no `any` types)

