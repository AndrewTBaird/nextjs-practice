# HVAC Quote Wizard Backend

A NestJS-powered backend API for the HVAC quote wizard application.
## Project Setup

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the server
npm start

# Development mode with hot reload
npm run start:dev
```

## Environment Variables

```env
# Database
DATABASE_URL=./db.sqlite

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3001
```

## Architecture & Design Decisions

### Database Choice: SQLite

**Why SQLite?**
- **Simplicity**: Zero-configuration database that runs in-process without requiring a separate server
- **Portability**: Single file database that's easy to backup, move, and version control
- **Performance**: Excellent for read-heavy workloads and small to medium datasets
- **Development Efficiency**: No need to set up external database servers during development
- **ACID Compliance**: Full transaction support with rollback capabilities
- **Perfect for MVP**: Ideal for proof-of-concept and early-stage applications

**Trade-offs Considered**:
- Limited concurrent write performance (acceptable for form submissions)
- No built-in replication (can migrate to PostgreSQL/MySQL later if needed)
- File-based storage (suitable for this use case)

### ORM Choice: TypeORM

**Why TypeORM?**
- **TypeScript Integration**: Native TypeScript support with decorators and type safety
- **Active Record Pattern**: Simple entity definitions with built-in repository methods
- **Migration Support**: Database schema versioning and migration capabilities
- **Multi-Database Support**: Easy to switch from SQLite to PostgreSQL/MySQL in production
- **Relationships**: Clean handling of entity relationships and foreign keys

### API Design Patterns

#### RESTful Endpoints
- **GET /api/wizard/session/:sessionId** - Retrieve wizard session state
- **POST /api/wizard/next-step** - Determine next step and save progress
- **POST /api/wizard/submit** - Submit final quote request

#### Session Management
- **Stateless API**: Each request includes session ID for state tracking
- **Progressive Persistence**: Form data is saved at each step transition
- **Resumable Sessions**: Users can return to incomplete wizard sessions

### Data Model Design

#### Entities

**WizardSession**
- Tracks user progress through the wizard
- Stores current step and completion status
- Links to the final quote request

**QuoteRequest**
- Stores all collected user information
- Normalized address and contact information
- System preferences and requirements

#### Relationships
- One-to-One: WizardSession → QuoteRequest
- Ensures data integrity and prevents orphaned records

### Security Considerations

#### Input Validation
- **Class Validators**: All DTOs use validation decorators
- **Type Safety**: TypeScript prevents type-related vulnerabilities
- **Sanitization**: Automatic trimming and validation of user inputs

#### CORS Configuration
- **Development**: Permissive CORS for local development
- **Production Ready**: Easily configurable for specific origins

## License

MIT License - see LICENSE file for details