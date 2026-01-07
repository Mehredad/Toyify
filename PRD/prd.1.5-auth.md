# PRD: Authentication (Register, Login, Password Recovery) (prd.1.5)

1. Overview

One-paragraph summary:
Provide user authentication allowing sign up via email and password, Google OAuth, login, and password recovery flows. Users must have accounts to place orders and track purchases in later phases.

Problem Statement:
Users need to securely authenticate to make purchases and manage orders.

Goal:
Provide secure, accessible authentication aligned with Supabase Auth and the project security guidelines.

2. Scope & Out of Scope

In Scope:
- Email/password registration and login
- Google OAuth sign-in
- Password recovery (email reset)
- Basic user profile page (name, email)

Out of Scope:
- SSO for enterprise
- Advanced account settings (later phase)

3. User Personas & Use Cases

Personas:
- Parent (end user)

Use Case: UC-AUTH-001
Title: Register and login
Description: User creates an account or logs in using email/password or Google
Pre-conditions: User accesses login or registration pages
Post-conditions: User is authenticated and redirected to intended page
Main Flow:
  1. User opens login or register page
  2. User enters credentials or selects Google OAuth
  3. Upon success, user is redirected (home or intended page)
Alternate/Error Flows:
  - Invalid credentials — show error
  - OAuth denied — show error
  - Password reset failed — show error

4. Functional Requirements

FR-1: Allow registration with email and password
FR-2: Allow login with email/password and Google OAuth
FR-3: Implement password recovery via email
FR-4: Maintain session securely and support logout

5. Non-Functional Requirements

Security:
- Use Supabase Auth and follow RLS policies
- No sensitive tokens in frontend code
- Rate-limit login attempts

UX & Accessibility:
- Forms accessible and provide clear error messages

6. Integration & API Hints

Endpoints/Services:
- Use Supabase Auth SDK for registration, login, and password recovery
- User profile stored in Supabase users table

7. Analytics & Success Metrics

Metrics:
- Registration conversion rate
- Login success rate
- Password recovery success rate

KPIs:
- 95% successful registration flow for valid inputs

8. Risks & Open Questions

Risks:
- Fraudulent or bot registrations
- OAuth misconfiguration

Open Questions:
- Do we require email verification before purchase?

9. Acceptance Criteria

- [ ] Registration via email works and creates user in Supabase
- [ ] Google OAuth works and links to user profile
- [ ] Password recovery sends email with reset link
- [ ] Session persistence across browser reloads
