# Toyify (Buzzy Muzzy) - Architecture Documentation

## Project Overview

**Project Name:** Toyify (Buzzy Muzzy)  
**Live URL:** https://buzzymuzzy.netlify.app/  
**Repository:** https://github.com/Mehredad/Toyify  
**Description:** A web application that transforms children's drawings into real, 3D-printed toys using AI-powered image generation.

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Status:** Active Development

---

## Deployment

### Build Process

```bash
# Install dependencies
npm install
# or
bun install

# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [images/fonts]
└── [other static files]
```

### Netlify Configuration

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# Optional: Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in Netlify
- [ ] OpenAI calls moved to Supabase Edge Functions
- [ ] Supabase RLS policies enabled and tested
- [ ] Stripe webhook endpoint configured
- [ ] Google OAuth configured in Supabase
- [ ] Storage buckets created with correct policies
- [ ] Database tables created with indexes
- [ ] Test payment flow in Stripe test mode
- [ ] Error tracking configured (Sentry, optional)
- [ ] Analytics configured (optional)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Build passes without errors
- [ ] Type checking passes
- [ ] Critical user flows tested manually

### Continuous Deployment

Netlify automatically deploys when:

1. Code pushed to `main` branch (production)
2. Pull request opened (preview deployment)
3. Manual trigger from Netlify dashboard

### Rollback Strategy

If deployment fails:

```bash
# In Netlify dashboard
1. Go to Deploys
2. Find last working deployment
3. Click "Publish deploy"
```

Or use Netlify CLI:

```bash
netlify rollback
```

---

## Known Limitations

Document current constraints and planned improvements:

### Current Version (v1.0.0)

1. **Security**

   - ⚠️ OpenAI API keys exposed in frontend code (must move to Edge Functions)
   - Limited rate limiting on API calls

2. **Features Not Yet Implemented**

   - Email service for password recovery (using Supabase defaults)
   - UK Postcode automatic address lookup
   - Order status tracking for users
   - User dashboard with order history
   - Image content validation (checking if drawing is appropriate)
   - 3D preview of toys
   - Social sharing features
   - Admin panel for order management

3. **Technical Debt**

   - Cart items need metadata storage solution (toy_type, pricing snapshot)
   - No automated testing suite
   - No error monitoring/logging service
   - No performance monitoring
   - No A/B testing framework

4. **Business Logic**

   - Single currency (GBP) only
   - Fixed shipping cost (currently free)
   - Limited to UK postcodes for address lookup
   - No international shipping options
   - No bulk order discounts
   - Manual fulfillment process

5. **UX Improvements Needed**
   - Loading states could be more informative
   - Better error messages for API failures
   - Offline mode not supported
   - No progress indicators for multi-step processes
   - Mobile UX needs optimization

### Planned Improvements

See `openspec/spec/changes/` for detailed specifications of upcoming features.

**High Priority:**

- Move OpenAI to Edge Functions (security critical)
- Implement proper cart metadata storage
- Add comprehensive error handling
- Set up email service

**Medium Priority:**

- User dashboard
- Order tracking
- Address lookup integration
- Image validation

**Low Priority:**

- 3D preview
- Social sharing
- Admin panel
- Analytics

---

## Future Improvements

### Phase 1: Security & Stability (Q1 2026)

1. **Move to Server-Side AI Processing**

   - Implement Supabase Edge Functions for OpenAI calls
   - Example: `/supabase/functions/generate-toy/index.ts`
   - Keeps API keys secure
   - Enables rate limiting

2. **Enhanced Error Handling**n

   - Implement Sentry for error tracking
   - Add retry logic for failed API calls
   - Implement exponential backoff
   - User-friendly error pages

3. **Email Service Integration**
   - Options: SendGrid (free tier), Resend (free tier)
   - Automated order confirmations
   - Password recovery emails
   - Order status updates

### Phase 2: Feature Enhancements (Q2 2026)

1. **User Dashboard**

   - Order history
   - Saved designs
   - Reorder functionality
   - Profile management

2. **Design Editor**

   - Basic drawing tools before upload
   - Color adjustment
   - Crop and rotate
   - Drawing templates

3. **Order Tracking**

   - Real-time status updates
   - Estimated delivery tracking
   - Notification system
   - Cancellation/modification window

4. **Address Lookup Integration**
   - Free API: Postcodes.io (UK)
   - Auto-fill address from postcode
   - Address validation

### Phase 3: Advanced Features (Q3 2026)

1. **3D Preview**

   - Three.js integration
   - Interactive 3D model viewer
   - Rotate, zoom, pan
   - Material preview

2. **Social Features**

   - Share designs on social media
   - Public gallery of toys
   - Like and comment system
   - Featured designs

3. **Admin Panel**n

   - Order management dashboard
   - User management
   - Analytics and reporting
   - Discount code management
   - Content moderation

4. **Advanced AI Features**
   - Multiple concept generation (A/B options)
   - Style transfer options
   - Background removal
   - Auto-enhancement

### Phase 4: Scale & Optimization (Q4 2026)

1. **Alternative Free Services**

   - **Image Generation:** Hugging Face (free models), Stability AI (free tier)
   - **Storage:** Cloudinary (free tier for images)
   - **CDN:** Cloudflare (free tier)
   - **Email:** SendGrid/Resend (free tiers)

2. **Caching Strategy**

   - Cache AI-generated images in Supabase Storage
   - Implement Redis for API response caching
   - CDN for static assets
   - Service worker for offline support

3. **Performance Optimization**

   - Code splitting by route
   - Image optimization and lazy loading
   - Compression (Brotli/Gzip)
   - Tree shaking unused code

4. **Internationalization**n
   - Multi-language support
   - Multi-currency support
   - Regional pricing
   - International shipping

---

## Development Guidelines

### Code Style & Quality

- ✅ **Use TypeScript** for all new files (no plain JavaScript)
- ✅ **Follow React best practices** - functional components with hooks
- ✅ **Use Tailwind utility classes** - avoid custom CSS
- ✅ **Implement error boundaries** - graceful error handling
- ✅ **Add loading states** - for all async operations
- ✅ **Write meaningful comments** - for complex logic
- ✅ **Keep functions small** - single responsibility principle
- ✅ **Follow naming conventions** - see `openspec/design-guideline.md`

For detailed code standards, see: `openspec/design-guideline.md`

### Component Structure Best Practices

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (DON'T MODIFY DIRECTLY)
│   ├── layout/          # App-wide layout (Navbar, Footer)
│   ├── features/        # Feature components with business logic
│   └── shared/          # Reusable utility components
├── pages/               # Route/page components (composition only)
├── contexts/            # React Context providers (global state)
├── services/            # External API integrations
├── hooks/               # Custom React hooks (reusable logic)
├── utils/               # Pure helper functions
├── types/               # TypeScript type definitions
└── constants/           # App constants and configuration
```

### Testing Strategy

**Currently:** Manual QA testing

**Planned Testing Stack:**

```typescript
// Unit Tests
import { describe, it, expect } from "vitest";

// Component Tests
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// E2E Tests
import { test, expect } from "@playwright/test";
```

**Test Priorities:**

1. Authentication flows
2. Image upload and validation
3. Cart operations
4. Checkout process
5. Payment integration
6. API service layer

### Git Workflow

See `openspec/rules.md` for detailed workflow.

**Branch Naming:**

```
main                           # Production
feature/YYYYMMDD-feature-name  # New features
fix/YYYYMMDD-bug-description   # Bug fixes
docs/YYYYMMDD-doc-update       # Documentation
```

**Commit Messages:**

```bash
feat: add image upload validation [spec: 20260107-image-upload]
fix: handle upload timeout errors [spec: 20260107-image-upload]
docs: update architecture with new components
chore: update dependencies
```

---

## Code Patterns Reference

For implementation details and code examples of common patterns, see:
