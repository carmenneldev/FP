# FlightPlan

FlightPlan is a comprehensive Angular application for managing clients, policies, and related data in the financial advisory domain. It features modular data management, file uploads, advanced UI components, robust form validation, and clean data handling.

---


## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Server](#development-server)
- [Building](#building)
- [Testing](#testing)
- [Features](#features)
- [Configuration](#configuration)
- [File Uploads](#file-uploads)
- [Data Management](#data-management)
- [Styling](#styling)
- [Services & Data Handling](#services--data-handling)
- [Contributing](#contributing)
- [Additional Resources](#additional-resources)

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   ng serve
   ```
   Visit [http://localhost:4200](http://localhost:4200) in your browser.

---

## Project Structure

- `src/app/pages/`  
  Main application pages (Clients, Policies, Data Management, Registration, etc.)

- `src/app/pages/data-management/`  
  Modular management for policies, provinces, policy types, languages, marital status, and qualifications.

- `src/app/services/`  
  API and business logic services.

- `src/app/shared/`  
  Shared helpers and utilities.

- `src/app/models/`  
  TypeScript interfaces and models.

- `src/styles.scss`  
  Global styles and theme overrides.

---

## Development Server

To start a local development server, run:

```bash
ng serve
```

The app will reload automatically when you modify source files.

---

## Building

To build the project for production:

```bash
ng build
```

Build artifacts are stored in the `dist/` directory.

---

## Testing

### Unit Tests

Run unit tests with [Karma](https://karma-runner.github.io):

```bash
ng test
```

### End-to-End Tests

For e2e testing (setup required):

```bash
ng e2e
```

---

## Features

- **Client Management:** Add, edit, view, and filter clients.
- **Policy Management:** Manage insurance policies and types.
- **Data Management:** Tabbed interface for managing provinces, languages, marital statuses, and qualifications.
- **File Uploads:** Upload documents (e.g., bank statements) as blobs using PrimeNG's file upload.
- **Form Validation:** Includes custom validators (e.g., South African ID number).
- **Responsive UI:** Uses PrimeNG components for tables, dialogs, dropdowns, tabs, and more.
- **Custom Styling:** Primary and secondary button styles, global theme overrides.

---

## Configuration

- **API Endpoints:**  
  Update API URLs in service files as needed for your backend.

- **Environment Variables:**  
  Use `environment.ts` for environment-specific settings.

---

## File Uploads

File uploads are handled using PrimeNG's `<p-fileUpload>` with custom upload logic.  
Files are sent as blobs using `FormData` to the backend.

Example usage:
```typescript
onTemplatedUpload(event: any) {
  const formData = new FormData();
  event.files.forEach(file => formData.append('files', file, file.name));
  this.http.post('/api/upload', formData).subscribe();
}
```

---

## Data Management

The `DataManagement` component provides a tabbed interface for managing:

- Policies
- Policy Types
- Provinces
- Preferred Languages
- Marital Statuses
- Qualifications

Each tab loads its respective management component.

---

## Styling

Global styles are in `src/styles.scss`.  
Primary and secondary button styles are defined for consistent UI.

---

## Services & Data Handling

### Services

All API communication is handled through Angular services located in `src/app/services/`.  
Each service (e.g., `ClientService`, `PolicyService`, `ProvinceService`, etc.) uses Angular's `HttpClient` to interact with backend endpoints.

Example service usage:
```typescript
constructor(private clientService: ClientService) {}

loadClients() {
  this.clientService.getAll().subscribe({
    next: (data) => { /* handle data */ },
    error: (err) => { /* handle error */ }
  });
}
```

### Database Connection

Backend API endpoints are configured in the service files.  
Update the URLs to match your backend server (e.g., Node.js, .NET, etc.).  
The backend is responsible for connecting to the database and returning data in JSON format.

### Data Cleaning

Backend responses (especially from .NET) will include metadata like `$id`, `$values`, and `$ref`.  
To clean this data, the project uses a helper class (`DataCleanerHelper`) in `src/app/shared/data-cleaner.helper.ts`:

```typescript
stripReferenceProps(obj: any): any {
  if (obj && typeof obj === 'object' && Array.isArray(obj.$values)) {
    return obj.$values.map(item => this.stripReferenceProps(item));
  }
  if (Array.isArray(obj)) {
    return obj.map(item => this.stripReferenceProps(item));
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      if (key !== '$id' && key !== '$ref') {
        result[key] = this.stripReferenceProps(obj[key]);
      }
    }
    return result;
  }
  return obj;
}
```
Use this helper to ensure your frontend only works with clean, usable data.

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Submit a pull request.

---

## Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [PrimeNG Documentation](https://primeng.org/documentation)
- [Angular Documentation](https://angular.dev/)

---

**For questions or support, please contact the project maintainers.**

<!-- Azure deployment fix: Optimized startup command to prevent timeout loops (Sept 25, 2025) -->
