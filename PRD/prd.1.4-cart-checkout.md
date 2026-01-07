# PRD: Cart & Checkout (Cart, Billing, Payment) (prd.1.4)

1. Overview

One-paragraph summary:
Implement a Shopping Cart page where users can review items, update quantities, apply discount codes, see cart totals, and proceed to Billing and Checkout which collects billing details and performs payment via Stripe.

Problem Statement:
Users need a reliable, trustable checkout flow that supports updating cart, entering billing details, and completing payment.

Goal:
Provide a smooth checkout flow that minimizes abandonment and supports required order metadata.

2. Scope & Out of Scope

In Scope:
- Cart page with item list, quantity update, delete
- Cart total calculation with subtotal, shipping, discount, and VAT
- Discount code input and apply flow (simple validation)
- Billing details page with address lookup by postcode (if available)
- Integration with Stripe for payment
- Terms checkbox before proceeding to payment

Out of Scope:
- Advanced promotions engine
- Order history / user dashboard (later phase)

3. User Personas & Use Cases

Personas:
- Parent (buyer)
- Admin (order management; out-of-scope for now)

Use Case: UC-CART-001
Title: Update Cart and Checkout
Description: User updates quantities, applies discount, enters billing details, and completes payment
Pre-conditions: User has item(s) in cart
Post-conditions: Order created and payment processed
Main Flow:
  1. User views cart items and updates quantity or removes item
  2. Cart total recalculates and shows discount and VAT
  3. User clicks Checkout and fills Billing Details
  4. User checks terms of service checkbox
  5. User is redirected to Stripe payment screen or inline payment modal
  6. After successful payment, order is created and user sees success page
Alternate/Error Flows:
  - Invalid discount code — show error
  - Payment failure — show error and allow retry
  - Address lookup fails — allow manual address entry

4. Functional Requirements

FR-1: Cart page shows all items with name, reference image, price, type, quantity, and subtotal.
FR-2: Users can change quantity and remove items; totals update accordingly.
FR-3: Discount code can be applied and validated.
FR-4: Billing details form collects required fields and supports postcode lookup.
FR-5: Terms checkbox required before proceeding to payment.
FR-6: Integrate with Stripe for payment processing and webhooks to update order status.

5. Non-Functional Requirements

Security:
- Payment handled by Stripe; no sensitive card data stored
- Use Stripe webhooks with signature verification

Reliability & Monitoring:
- Retry logic for failed payments or webhook delivery

UX & Accessibility:
- Form fields accessible and validated with clear error messages

6. Integration & API Hints

Endpoints:
- GET /api/cart
- POST /api/cart (add/update/remove)
- POST /api/discounts/apply
- POST /api/checkout (initiate checkout session)
- Webhook: /api/webhooks/stripe (process payments)

Dependencies:
- Stripe account and webhook configuration
- Supabase DB to store orders and cart metadata

7. Analytics & Success Metrics

Metrics:
- Cart abandonment rate
- Checkout completion rate
- Payment success rate

KPIs:
- Reduce checkout abandonment by 10% after improvements
- Payment success rate > 98%

8. Risks & Open Questions

Risks:
- Payment disputes or chargebacks
- Address lookup availability and accuracy

Open Questions:
- Use Stripe hosted checkout or inline payment? (preferred: hosted to reduce PCI scope)

9. Acceptance Criteria

- [ ] Cart allows item updates and removals with correct totals
- [ ] Billing form collects required fields and allows address lookup
- [ ] Terms checkbox required before checkout
- [ ] Payment via Stripe completes and order created on success
- [ ] Webhook updates order status reliably
