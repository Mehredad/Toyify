# Design Guidelines - Toyify Project

This document defines the technical standards, code conventions, and design patterns that ALL code in this repository must follow. These guidelines ensure consistency, maintainability, and quality across all contributions from human developers and AI agents.

---

## Purpose

This document defines the technical standards, code conventions, and design patterns that ALL code in this repository must follow. These guidelines ensure consistency, maintainability, and quality across all contributions from human developers and AI agents.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Code Style & Conventions](#code-style--conventions)
3. [Component Architecture](#component-architecture)
4. [State Management Patterns](#state-management-patterns)
5. [API Integration Patterns](#api-integration-patterns)
6. [Error Handling](#error-handling)
7. [Performance Guidelines](#performance-guidelines)
8. [Security Best Practices](#security-best-practices)
9. [Accessibility Standards](#accessibility-standards)
10. [Testing Guidelines](#testing-guidelines)

---

## 1. Technology Stack

### Mandatory Technologies

These are non-negotiable and form the core of the application:

```yaml
Frontend Framework: React 18+
Language: TypeScript 5+
Build Tool: Vite
Styling: Tailwind CSS 3+
UI Components: shadcn/ui (Radix UI primitives)
Routing: React Router v6+
Backend: Supabase (PostgreSQL, Auth, Storage)
AI Services: OpenAI API
Payment: Stripe
Hosting: Netlify
```

### Allowed Libraries

Only these libraries can be used without approval:

```typescript
// State Management
import { useState, useEffect, useContext } from "react";

// HTTP Requests
fetch(); // Native browser API

// Forms & Validation
// (To be added as needed)

// Date/Time
// (To be added as needed)

// Utilities
// (To be added as needed)
```

### Forbidden Libraries

❌ Do NOT add these without explicit approval:

- Redux / MobX / Zustand (we use Context API)
- Axios (we use fetch)
- jQuery
- Bootstrap / Material-UI (we use Tailwind + shadcn/ui)
- Any CSS-in-JS libraries (styled-components, emotion)

### Adding New Dependencies

If a new library is needed:

1. Create a spec proposing the addition
2. Justify why existing tools are insufficient
3. Show bundle size impact
4. Get human approval
5. Update this document

---

## 2. Code Style & Conventions

### TypeScript Standards

#### ✅ DO: Use Explicit Types

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): Promise<User | null> {
  // ...
}

// Bad
function getUser(id: any): Promise<any> {
  // ...
}
```

#### ✅ DO: Define Component Props

```typescript
// Good
interface ImageUploaderProps {
  onUpload: (file: File) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export function ImageUploader({
  onUpload,
  maxSizeMB = 5,
  acceptedTypes = ["image/png", "image/jpeg"],
}: ImageUploaderProps) {
  // ...
}

// Bad
export function ImageUploader(props: any) {
  // ...
}
```

#### ✅ DO: Use Enums or Union Types for Fixed Values

```typescript
// Good - Union Type
type ToyType = "fully_crafted" | "diy";
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

// Good - Enum
enum ToyType {
  FullyCrafted = "fully_crafted",
  DIY = "diy",
}

// Bad
const toyType = "some_string"; // No type safety
```

#### ❌ DON'T: Use `any` Type

```typescript
// Bad
const data: any = await response.json();

// Good
interface ApiResponse {
  success: boolean;
  data: User;
  error?: string;
}

const data: ApiResponse = await response.json();
```

### React Component Patterns

#### ✅ DO: Use Functional Components with Hooks

```typescript
// Good
import { useState, useEffect } from "react";

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Side effects here
  }, []);

  return <div>...</div>;
}

// Bad - Class components
export class ProductCard extends React.Component {
  // Don't use class components
}
```

#### ✅ DO: Keep Components Small and Focused

```typescript
// Good - Single responsibility
function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="flex items-center gap-4">
      <img src={item.image} alt={item.name} />
      <div className="flex-1">
        <h3>{item.name}</h3>
        <p>£{item.price}</p>
      </div>
      <QuantitySelector value={item.quantity} onChange={onUpdateQuantity} />
      <Button onClick={onRemove} variant="destructive">
        Remove
      </Button>
    </div>
  );
}

// Bad - Too many responsibilities
function CartItem() {
  // 200 lines of code doing everything
}
```

#### ✅ DO: Extract Reusable Logic to Custom Hooks

```typescript
// Good
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth logic
  }, []);

  return { user, loading, signIn, signOut };
}

// Usage
function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return <div>Welcome {user?.name}</div>;
}
```

### Naming Conventions

| Type             | Convention                | Example                        |
| ---------------- | ------------------------- | ------------------------------ |
| React Components | PascalCase                | `ImageUploader`, `ProductCard` |
| Functions        | camelCase                 | `uploadImage`, `formatPrice`   |
| Variables        | camelCase                 | `isLoading`, `userEmail`       |
| Constants        | UPPER_SNAKE_CASE          | `MAX_FILE_SIZE`, `API_URL`     |
| Interfaces/Types | PascalCase                | `UserProfile`, `CartItem`      |
| CSS Classes      | kebab-case (via Tailwind) | `bg-blue-500`, `text-lg`       |
| Files            | Match component name      | `ImageUploader.tsx`            |
| Folders          | lowercase                 | `components/`, `services/`     |

### File Organization

#### ✅ DO: One Component Per File

```typescript
// src/components/features/ImageUploader.tsx
export function ImageUploader() {
  // ...
}

// Bad - Multiple exports from one file
// src/components/features/stuff.tsx
export function ImageUploader() {}
export function ProductCard() {}
export function CartItem() {}
```

#### ✅ DO: Colocate Related Files

```
src/components/features/ImageUploader/
├── ImageUploader.tsx       # Main component
├── ImageUploader.test.tsx  # Tests
├── useImageUpload.ts       # Custom hook
└── types.ts                # Type definitions
```

### Import Organization

#### ✅ DO: Group Imports Logically

```typescript
// 1. External libraries
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Internal services
import { uploadDrawing } from "@/services/supabase";
import { generateToyImage } from "@/services/openai";

// 3. Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. Types
import type { User, Toy } from "@/types";

// 5. Constants
import { MAX_FILE_SIZE } from "@/constants/validation";
```

---

## 3. Component Architecture

### Component Hierarchy

```
App.tsx
├── AuthProvider (Context)
├── CartProvider (Context)
└── Router
		├── Navbar (Layout)
		├── Routes
		│   ├── Home (Page)
		│   │   └── ImageUploader (Feature)
		│   ├── Preview (Page)
		│   │   ├── ImagePreview (Feature)
		│   │   ├── ProductSelector (Feature)
		│   │   └── StoryEditor (Feature)
		│   ├── Cart (Page)
		│   │   └── CartItem (Feature) [repeated]
		│   └── Billing (Page)
		│       └── AddressForm (Feature)
		└── Footer (Layout)
```

### Component Categories

#### 1. Page Components (`src/pages/`)

- **Purpose:** Top-level route components
- **Responsibility:** Layout and composition of features
- **Rules:**
  - One per route
  - Minimal logic (delegate to features)
  - Handle route parameters
  - Manage page-level state

```typescript
// src/pages/Preview.tsx
export function PreviewPage() {
  const { toyId } = useParams();
  const navigate = useNavigate();
  const [toy, setToy] = useState<Toy | null>(null);

  // Compose features
  return (
    <div className="container mx-auto py-8">
      <ImagePreview toy={toy} />
      <ProductSelector onSelect={handleSelect} />
      <StoryEditor story={toy?.story} onSave={handleSave} />
    </div>
  );
}
```

#### 2. Feature Components (`src/components/features/`)

- **Purpose:** Self-contained features with business logic
- **Responsibility:** Handle user interactions, API calls
- **Rules:**
  - Single feature per component
  - Can use multiple UI components
  - Handle own loading/error states
  - Accept data via props

```typescript
// src/components/features/ImageUploader.tsx
export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = async (file: File) => {
    // Validation, upload, error handling
  };

  return <Card>{/* UI implementation */}</Card>;
}
```

#### 3. UI Components (`src/components/ui/`)

- **Purpose:** Reusable, styled UI primitives (shadcn/ui)
- **Responsibility:** Visual presentation only
- **Rules:**
  - ❌ NO business logic
  - ❌ NO API calls
  - ❌ NO side effects
  - ✅ Only props and rendering

```typescript
// src/components/ui/button.tsx (from shadcn)
// DON'T modify these files directly
```
