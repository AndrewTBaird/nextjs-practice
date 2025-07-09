# HVAC Quote Wizard Backend

A NestJS-powered backend API for the HVAC quote wizard application.

## Architecture & Design Decisions

### Framework Choice: NestJS

**Why NestJS?**
- **TypeScript First**: Built with TypeScript from the ground up, providing excellent type safety and developer experience
- **Enterprise-Grade**: Modular architecture with dependency injection, decorators, and clear separation of concerns
- **Scalable**: Built-in support for microservices, guards, interceptors, and pipes
- **Developer Productivity**: Excellent CLI tools, auto-generated OpenAPI documentation, and extensive ecosystem

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

#### Error Handling
- **Global Exception Filter**: Consistent error responses across all endpoints
- **Validation Pipes**: Automatic request validation using class-validator
- **HTTP Status Codes**: Proper use of 400, 404, 500 status codes

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

### Performance Optimizations

#### Database
- **Connection Pool**: Efficient connection management
- **Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: TypeORM query builder for complex queries

#### Caching Strategy
- **Session Caching**: In-memory session state for faster lookups
- **Static Content**: CDN-ready for static assets

### Monitoring & Observability

#### Logging
- **Structured Logging**: JSON-formatted logs for easier parsing
- **Log Levels**: Configurable logging levels (error, warn, info, debug)
- **Request Tracking**: Correlation IDs for request tracing

#### Health Checks
- **Database Health**: Endpoint to verify database connectivity
- **Application Health**: Memory usage and uptime monitoring

### Testing Strategy

#### Unit Tests
- **Service Layer**: Business logic validation
- **Controller Layer**: HTTP request/response handling
- **Repository Layer**: Database interaction testing

#### Integration Tests
- **End-to-End**: Full wizard flow testing
- **API Testing**: Request/response validation
- **Database Testing**: Transaction and rollback testing

### Deployment Considerations

#### Environment Configuration
- **Config Module**: Centralized configuration management
- **Environment Variables**: Secure credential management
- **Multi-Environment**: Development, staging, production configs

#### Database Migration
- **Version Control**: All schema changes tracked in migrations
- **Rollback Support**: Safe deployment with rollback capabilities
- **Production Ready**: Easy migration to PostgreSQL/MySQL

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

# Run tests
npm run test

# Run migrations
npm run migration:run
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json

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

## Future Enhancements

### Scalability Improvements
- **Database Migration**: Move to PostgreSQL for production
- **Caching Layer**: Redis for session management
- **Rate Limiting**: Protect against abuse
- **Queue System**: Background job processing

### Feature Additions
- **Email Notifications**: Automated quote delivery
- **PDF Generation**: Formatted quote documents
- **CRM Integration**: Lead management system
- **Analytics**: User behavior tracking

### Security Enhancements
- **Authentication**: JWT-based user sessions
- **Authorization**: Role-based access control
- **Input Sanitization**: Enhanced XSS protection
- **API Rate Limiting**: DDoS protection

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update documentation for API changes
4. Use conventional commit messages
5. Ensure all tests pass before submitting PRs

## License

MIT License - see LICENSE file for details