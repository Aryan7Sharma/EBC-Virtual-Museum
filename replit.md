# Meridian Museum - 3D Museum Platform

## Overview

A full-stack web-based 3D museum platform that allows users to browse artifacts, view interactive 3D models, and access curated information. The platform features a dark, sophisticated museum aesthetic with an admin CMS for content management. Users can explore artifact collections with filtering, search, and interactive 3D viewing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Wouter for client-side routing
- **Styling**: TailwindCSS with CSS variables for theming, shadcn/ui component library (New York style)
- **State Management**: TanStack React Query for server state, React Context for theme management
- **3D Viewing**: Three.js integration for 3D model rendering
- **File Uploads**: Uppy with AWS S3 integration for artifact images and 3D models
- **Design System**: Dark theme default with museum-quality aesthetics, Playfair Display serif headings, Inter sans-serif body text

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful API with JSON responses
- **Authentication**: Connect, session-based using connect-pg-simple
- **Authorization**: Role-based access control (user/admin roles, active/blocked status)
- **File Storage**: Google Cloud Storage with custom ACL policy system for object permissions

### Database Design
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Key Entities**: 
  - Users (with roles and status)
  - Artifacts (with 3D model support, images, categories, tags)
  - Categories (hierarchical with parent references)
  - Comments (with moderation status)
  - Sessions (for authentication)

### Build System
- **Development**: Vite with HMR for frontend, tsx for backend
- **Production**: esbuild for server bundling, Vite for client build
- **Path Aliases**: `@/` for client source, `@shared/` for shared code, `@assets/` for attached assets

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/` directory used by both frontend and backend
- **Storage Abstraction**: `IStorage` interface in server for data access operations
- **Component Architecture**: Compound components with shadcn/ui primitives
- **API Client**: Centralized query client with automatic error handling

## External Dependencies

### Database
- PostgreSQL via `DATABASE_URL` environment variable
- Drizzle ORM for type-safe queries and migrations

### Authentication
- 
- Session secret via `SESSION_SECRET` environment variable

### File Storage
- Google Cloud Storage endpoint (`http://127.0.0.1:1106`)
- Public object paths configured via `PUBLIC_OBJECT_SEARCH_PATHS` environment variable

### Frontend Libraries
- TanStack React Query for data fetching
- Radix UI primitives for accessible components
- Embla Carousel for image galleries
- react-day-picker for date selection
- Recharts for admin dashboard charts

### Development Tools
- R plugins for error overlay, cartographer, and dev banner
- drizzle-kit for database migrations (`npm run db:push`)