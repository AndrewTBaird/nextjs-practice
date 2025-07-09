# HVAC Quote Wizard Frontend

A Next.js-powered frontend application for the HVAC quote wizard, providing an intuitive multi-step form experience for users to request HVAC system quotes.

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Architecture & Design Decisions

### Component Library: shadcn/ui

**Why shadcn/ui?**
- **Accessibility**: WAI-ARIA compliant components out of the box
- **Customizable**: Copy-paste components that can be fully customized
- **TypeScript**: Built with TypeScript for type safety
- **Tailwind Integration**: Seamlessly integrates with Tailwind CSS
- **Modern Design**: Beautiful, modern component designs
- **No Bundle Size**: Only includes components you actually use

### State Management: React Context

**Why React Context?**
- **Built-in**: No additional dependencies required
- **Simplicity**: Perfect for wizard-like forms with sequential steps
- **Local State**: Wizard state is contained and doesn't need global persistence
- **TypeScript Support**: Excellent type safety with TypeScript
- **Performance**: Optimized for this use case with minimal re-renders

**Alternative Considered:**
- **Redux/Zustand**: Overkill for this application's state management needs
- **React Query**: Not needed since we're not doing complex server state management

### Form Management Strategy

#### Progressive Enhancement
- **Step-by-Step Validation**: Each step validates independently
- **Local Storage Persistence**: Form data persists across browser sessions
- **Resumable Sessions**: Users can return to incomplete forms
- **Client-Side Validation**: Immediate feedback with TypeScript validation

#### Error Handling
- **Field-Level Validation**: Real-time validation on blur
- **Form-Level Validation**: Comprehensive validation before step progression
- **User-Friendly Messages**: Clear, actionable error messages
- **Accessibility**: Screen reader compatible error announcements

### User Experience Design

#### Wizard Flow
- **Linear Progression**: Clear step-by-step flow
- **Progress Indication**: Visual progress bar and step indicators
- **Back Navigation**: Users can return to previous steps
- **Conditional Logic**: Dynamic step routing based on user selections

#### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Progressive Enhancement**: Enhanced experience on larger screens
- **Touch-Friendly**: Appropriate touch targets and gestures
- **Accessibility**: Keyboard navigation and screen reader support

### Performance Optimizations

#### Code Splitting
- **Dynamic Imports**: Step components loaded on demand
- **Route-Based Splitting**: Each wizard step is a separate chunk
- **Tree Shaking**: Unused code automatically removed

### Accessibility Features

#### WCAG Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Proper focus handling throughout the wizard

### API Integration

#### HTTP Client: Axios
- **Request/Response Interceptors**: Centralized error handling
- **Timeout Configuration**: Prevents hanging requests
- **TypeScript Support**: Typed request/response interfaces

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   └── wizard/            # Wizard pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── wizard/           # Wizard-specific components
├── contexts/             # React context providers
├── services/             # API services
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions
```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Development
NODE_ENV=development
PORT=3001
```

## Component Architecture

### Wizard Context
- **Global State**: Manages wizard state across all steps
- **Step Navigation**: Handles step progression and validation
- **Form Data**: Centralizes form data management
- **Session Management**: Handles session persistence

### Step Components
- **Isolated Logic**: Each step manages its own validation
- **Reusable UI**: Consistent UI patterns across steps
- **Accessibility**: Built-in accessibility features
- **Error Handling**: Comprehensive error states

## API Integration

### Endpoints
- **GET /api/wizard/session/:sessionId** - Retrieve session state
- **POST /api/wizard/next-step** - Progress to next step
- **POST /api/wizard/submit** - Submit final quote request

## License

MIT License - see LICENSE file for details