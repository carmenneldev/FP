# FlightPlan - Angular Financial Advisory Application

## Overview
FlightPlan is a comprehensive Angular application for managing clients, policies, and related data in the financial advisory domain. This is a freshly imported GitHub project that has been configured to run in the Replit environment.

## Project Status
- **Last Updated**: September 26, 2025
- **Status**: Azure SQL-only conversion complete - ready for Azure deployment
- **Frontend**: Angular 19.x with PrimeNG components
- **Backend**: Express.js API with Azure SQL Database integration only

## Recent Changes
### Azure SQL-Only Conversion (Sept 26, 2025)
- **COMPLETE POSTGRESQL REMOVAL**: Eliminated all PostgreSQL dependencies and packages per user requirement
  - Removed postgresql, pg, drizzle-orm, and all related packages from package.json
  - Converted database service to use ONLY Azure SQL adapter (no PostgreSQL fallback)
  - Updated schema.ts to provide TypeScript interfaces only (all Drizzle table definitions removed)
- **DRIZZLE ORM ELIMINATION**: Removed all Drizzle ORM function calls from server code
  - Eliminated and, eq, gte, lte, desc, sql operators from server/index.ts
  - Converted all database queries to use Azure SQL adapter exclusively
  - Fixed all TypeScript compilation issues - build now passes with zero errors
- **AZURE SQL INFRASTRUCTURE**: Application now operates exclusively with Azure SQL Database
  - Database service uses mssql package for Azure SQL connectivity only
  - Categorization service adapted for Azure SQL mode
  - Seed functionality appropriately disabled for production Azure SQL environment
- **DEPLOYMENT READY**: Application configured for Azure App Service with Azure SQL only
  - Environment variables: DB_TYPE=azure-sql, AZURE_SQL_SERVER, AZURE_SQL_DATABASE, AZURE_SQL_USER, AZURE_SQL_PASSWORD
  - No PostgreSQL dependencies or configurations remain in codebase

## Recent Changes
### Azure App Service Port Fix (Sept 22, 2025)
- **CRITICAL FIX**: Updated server port configuration for Azure App Service compatibility
  - server/index.ts: Now uses `PORT || WEBSITES_PORT || 8080` instead of hardcoded 3001
  - server.js: Now uses `PORT || WEBSITES_PORT || 8080` instead of hardcoded 3000
  - **Issue**: Azure App Service expects apps to run on port 8080, but app was defaulting to wrong ports
  - **Result**: Fixed "Container didn't respond to HTTP pings on port: 8080" startup failure

### Azure Deployment Configuration (Sept 22, 2025)
- **Production Build System**: Created comprehensive Azure deployment configuration
  - Updated package.json with Azure-compatible build scripts and Node.js 20.x engine specification
  - Created production server.js entry point for single Azure App Service deployment
  - Fixed build pipeline to include devDependencies for Angular CLI compilation
  - Added tsconfig.server.json for proper TypeScript server compilation
- **Azure App Service Configuration**: Created complete deployment configuration files
  - web.config: IISNode configuration with Angular routing and static file handling
  - deploy.cmd: Custom Azure deployment script with proper build sequence
  - iisnode.yml: Performance and security configuration for production
  - startup.txt: Node.js startup command for Azure App Service
- **Environment Management**: Enhanced environment configuration for dual deployment
  - Updated environment.prod.ts for Azure deployment with relative API URLs
  - Added database configuration for both PostgreSQL (dev) and Azure SQL (prod) support
  - Implemented environment-specific CORS and security configurations
  - Added JWT secret enforcement for production security
- **Production Optimizations**: Implemented production-ready features
  - Cache headers for static assets (1-year cache in production)
  - Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
  - Router export functionality for single-service deployment approach
  - Proper static file serving for Angular application in production

### Initial Setup (Sept 19, 2025)
- Installed all npm dependencies successfully
- Configured Angular development server for Replit environment:
  - Host: 0.0.0.0
  - Port: 5000
  - Allowed hosts: all (for proxy compatibility)
- Updated environment configuration to use Replit domain
- Set up workflow for Angular development server

## Current Architecture
### Frontend Structure
- **Framework**: Angular 19.x with TypeScript
- **UI Components**: PrimeNG with custom styling
- **State Management**: NgRx (store, effects, selectors)
- **Styling**: SCSS with global themes

### Key Directories
- `src/app/pages/` - Main application pages and components
- `src/app/services/` - API and business logic services
- `src/app/models/` - TypeScript interfaces and models
- `src/app/store/` - NgRx state management
- `src/app/shared/` - Shared utilities and helpers

### Key Features
- Client Management (add, view, edit clients)
- Policy Management (insurance policies and types)
- Data Management (tabbed interface for various data types)
- File Upload functionality using PrimeNG
- Form validation with custom validators
- Responsive UI with PrimeNG components

## Configuration
### Environment Variables
- **Development**: Uses Replit domain for API calls
- **Production**: Same configuration (can be updated for production deployment)

### Angular Configuration
- Analytics disabled
- Host verification bypassed for Replit proxy compatibility
- Cache control configured for development

### Workflow
- **Angular Dev Server**: Runs on port 5000, serves the application

## API Integration Notes
The application is configured to connect to a backend API at `/api` endpoint. Currently using placeholder configuration:
- API Base URL: `https://[replit-domain]/api`
- The application includes services for all major entities (clients, policies, etc.)
- Data cleaning helper included for .NET backend compatibility

## Known Considerations
- The application includes several unused component imports (warnings in build)
- Backend API integration will need to be configured when backend is available
- File upload functionality expects backend API endpoints
- Application uses advanced PrimeNG components requiring proper backend data

## Azure Deployment Configuration
### Production Deployment Ready
- **Single-Service Architecture**: Configured for Azure App Service deployment
  - server.js serves both Angular frontend and Express.js backend API
  - Production build creates optimized Angular bundle and compiled TypeScript server
  - Environment-specific configurations for development (PostgreSQL) and production (Azure SQL)
  
### Deployment Commands
- **Build**: `npm run build` (builds both frontend and backend)
- **Start**: `node server.js` (production server entry point)
- **Development**: `npm run start:dev` (Angular dev server) + `npm run server:dev` (API server)

### Environment Variables Required for Azure
- **Database**: AZURE_SQL_SERVER, AZURE_SQL_DATABASE, AZURE_SQL_USER, AZURE_SQL_PASSWORD
- **Security**: JWT_SECRET (enforced in production)
- **App**: AZURE_APP_URL, FRONTEND_URL (for CORS configuration)

### Replit Deployment
- Configured for Replit's autoscale deployment target
- Build command: `npm run build`
- Run command: `node server.js`

## Next Steps for Full Azure Deployment
1. Create Azure App Service instance
2. Configure Azure SQL Database (or continue with PostgreSQL)
3. Set up environment variables in Azure App Service configuration
4. Deploy using Azure DevOps pipeline or direct deployment
5. Configure custom domain and SSL certificate