# AI Development Instructions & Project Rules

**IMPORTANT:** This file acts as the permanent AI memory and core instruction set for all future development tasks on this project. 
**AI ASSISTANT INSTRUCTION:** You MUST read and follow these rules meticulously before generating any code or proposing any architecture for this project.

This project is a large-scale SaaS-based Task, SOP, Ticksheet, Form Builder, Workflow, Reporting, and Management Web App. It is designed for massive future scalability, real-time synchronization, and enterprise-grade performance.

---

## 1. Modular Architecture
- **Keep everything modular:** Every feature, component, and utility must be self-contained and independently testable.
- **Avoid large files:** No monolithic files. If a file exceeds ~300 lines, carefully consider if it should be refactored into smaller sub-components or utility functions.
- **Split logic properly:** Strictly separate concerns:
  - UI (Presentation Layer)
  - Business Logic
  - Services (API / External communication)
  - Hooks (React custom hooks for state and side effects)
  - Validations (Zod/Yup schemas)
  - Types/Interfaces (TypeScript definitions)
  - Constants
  - Utilities/Helpers

## 2. File Structure Rules
- **One page/module = Multiple small files:** Do not cram all logic for a single page into one file. Break it down into logical pieces within a dedicated folder for that page/module.
- **Create reusable shared folders:** Common components, utilities, and types must live in centralized, easily accessible directories (e.g., `src/components/shared`, `src/utils`, `src/types`).
- **Maintain scalable folder structure:** Structure the app by feature/domain when possible, rather than purely by technical type, to keep related files co-located as the app grows.

## 3. Reusable Component Rules
- **Create reusable components wherever possible:** If a UI element or logic block appears more than once (or is likely to), it must be a reusable component.
- **Avoid duplicate code:** Adhere to the DRY (Don't Repeat Yourself) principle rigorously.
- **Centralize shared components:** Keep generic UI components (buttons, inputs, cards) separated from domain-specific components.
- **Extract shared logic:** Reusable logic should live in custom hooks or pure utility functions.

## 4. Coding Standards
- **Clean and readable code:** Write code that is easy for other developers (and AI) to read and understand. Favor clarity over cleverness.
- **Proper naming conventions:** 
  - PascalCase for components and interfaces (e.g., `TaskCard.tsx`, `UserData`).
  - camelCase for variables, functions, and hooks (e.g., `formatDate`, `useAuth`).
  - UPPER_SNAKE_CASE for constants (e.g., `MAX_RETRY_COUNT`).
- **Consistent structure:** Follow a predictable pattern for organizing imports, component definitions, hooks usage, and exports.
- **Avoid unnecessary comments:** Code should be self-documenting through clear naming and structure. Only comment on *why* complex or non-obvious logic was implemented a certain way.
- **Keep functions small and focused:** A function should do one thing and do it well (Single Responsibility Principle).

## 5. Frontend Rules
- **Tech Stack:** Next.js + React + TypeScript. Strictly adhere to these technologies.
- **Styling:** Use Tailwind CSS for all styling. Avoid custom CSS files unless absolutely necessary for complex animations or overrides.
- **UI Library:** Use `shadcn/ui` for foundational UI components. Customize them using Tailwind.
- **Responsiveness:** Always follow a **Mobile-First** approach. Ensure perfect responsiveness across:
  - Mobile screens
  - Tablet screens
  - Desktop screens

## 6. Supabase Rules
- **Existing Database:** A Supabase database already exists. **Do not create new schema or modify existing schema unless explicitly instructed by the user.**
- **Configuration:** Supabase URLs and Keys will be provided later. Set up the architecture to accept these via environment variables.
- **Centralized Logic:** Keep all Supabase interaction logic centralized in dedicated service files (e.g., `src/services/supabase/`).
- **Reusable Service Layers:** Create reusable database service layers for CRUD operations to abstract away the direct Supabase SDK calls from the UI components.
- **No Direct Queries in UI:** Never write direct Supabase queries inside React components. Always call a service function or a custom hook.

## 7. Authentication Rules
- **No Supabase Auth:** **Do NOT** use Supabase Auth for user management.
- **Custom System:** Implement a custom User ID + Password based login system.
- **Backend Credentials:** Credentials and session management will be handled by the backend architecture.
- **Modular Auth Architecture:** Keep the authentication state, logic, and UI completely modular and decoupled from core business logic, allowing for easy replacement or upgrades later.

## 8. Realtime Rules
- **Realtime-Ready Architecture:** The entire app must be architected from day one to support real-time data synchronization.
- **Supabase Realtime:** Utilize Supabase Realtime capabilities for syncing state across clients.
- **Clean Listeners:** Separate real-time listeners and subscription services cleanly from UI components. Manage subscriptions carefully to prevent memory leaks.
- **Loose Coupling:** Avoid tightly coupled real-time code. The UI should react to state changes, regardless of whether that change came from a local action or a real-time event.

## 9. Form Builder Rules
- **Architecture:** Design the form builder with a Card-based question system.
- **Conditional Logic:** Support conditional questions (skip logic, branch logic) natively.
- **Drafting:** Implement robust draft saving mechanisms for in-progress forms.
- **Drag & Drop:** Build a scalable Drag-and-Drop architecture for reordering and placing elements.
- **Reorderable Elements:** Ensure all questions and sections are easily reorderable.
- **Modular Types:** Design question types (text, multiple choice, file upload, etc.) as highly modular, plug-and-play components.
- **Future Scalability:** Architect the form engine to easily accept new, complex question types in the future without rewriting core logic.

## 10. Reporting Rules
- **Spreadsheet Approach:** Design the reporting interface with an Excel/Google-Sheet-like paradigm (data grids, pivot tables).
- **Conditional Formatting:** Implement an architecture that supports robust conditional formatting rules on data cells.
- **Saved Views:** Allow users to save filters, sorts, and specific column configurations as custom views.
- **Modular Engine:** Build a modular reporting engine that separates data fetching, data processing/aggregation, and data visualization.
- **Scalable Analytics:** Ensure the architecture can handle aggregating and displaying large datasets without performance degradation.

## 11. Performance Rules
- **Lazy Loading:** Implement lazy loading for images, off-screen components, and heavy routes.
- **Dynamic Imports:** Use dynamic imports for large libraries or components that are not immediately needed on initial page load.
- **Render Optimization:** Aggressively avoid unnecessary re-renders using `React.memo`, `useMemo`, `useCallback`, and efficient state management.
- **Large-Scale Focus:** Always optimize with the assumption that the app will handle massive amounts of data and concurrent users.

## 12. State Management Rules
- **Modularity:** Keep state modular and close to where it is used. Don't put everything in a global store if it's only needed locally.
- **Avoid Prop Drilling:** Prevent deeply nested prop drilling.
- **Scalable Patterns:** Use scalable state management patterns (e.g., Context API for themed/global data, Zustand/Redux for complex shared state, React Query/SWR for server state). Clearly separate UI state from Server state.

## 13. SaaS Architecture Rules
- **Multi-tenant Ready:** Architect the database queries and routing to support multi-organization (multi-tenant) data segregation from the start.
- **White-label Ready:** Ensure the platform can be white-labeled (custom domains, custom logos).
- **Theme Customization:** Build the styling architecture (via Tailwind configs/CSS variables) to support extensive theme customization.
- **Branding:** Make branding elements dynamic and configurable per organization.

## 14. AI Development Behavior Rules
- **Ask Before Coding:** Before writing code, explicitly ask for missing details, requirements, or design decisions if anything is ambiguous.
- **Never Assume:** Do not assume business logic. If the user hasn't specified how a specific edge case should be handled, ask.
- **No Temporary Hacks:** Write production-ready code. Avoid "temporary hacks" or "TODO" workarounds unless explicitly told to build a quick prototype.
- **Prefer Scalability:** Always choose the more scalable and robust architectural pattern, even if it requires slightly more initial setup.
- **Future Expansion:** Keep future expansion in mind. Leave clean interfaces and hooks where future features are likely to be attached.

## 15. Git Workflow & Synchronization Rules
- **Always Pull Before Push:** Because this is a shared project with concurrent developers, you MUST run `git pull origin main` to fetch and merge the latest remote changes before attempting to push any local modifications. 
- **Global Sync Principle:** The remote server and local environment must remain perfectly synchronized. If conflicts arise, resolve them according to standard Git timeline principles before committing and pushing.
