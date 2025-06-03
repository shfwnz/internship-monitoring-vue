# SimPKL Frontend - Vue.js Interface

<p align="center">
  <img src="https://vuejs.org/images/logo.png" width="100" alt="Vue.js Logo">
  <img src="https://vitejs.dev/logo.svg" width="100" alt="Vite Logo">
</p>

SimPKL Frontend is the client-side interface for the comprehensive internship monitoring system. Built with Vue.js 3 and modern web technologies, it provides intuitive user interfaces for students, teachers, and administrators to interact with the internship monitoring system seamlessly.

## Features

- **Role-Based Interface**: Tailored dashboards for students, teachers, and administrators
- **Real-time Monitoring**: Live tracking of internship progress and updates
- **Responsive Design**: Mobile-first approach ensuring accessibility across all devices
- **Authentication System**: Secure JWT-based authentication with automatic token management
- **Document Management**: Easy upload and management of internship documents
- **Interactive Dashboard**: Comprehensive overview of internship activities and progress
- **API Integration**: Seamless communication with Laravel backend
- **Modern UI Components**: Beautiful, accessible components with Shadcn/ui
- **Toast Notifications**: Real-time user feedback and system notifications

## Tech Stack

### Frontend Technologies
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vite** - Fast build tool and development server  
- **Tailwind CSS 4** - Utility-first CSS framework with Vite plugin
- **Vue Router** - Official router for Vue.js with navigation guards
- **Axios** - HTTP client for API communication with interceptors

### UI & Components
- **Shadcn/ui (Vue)** - Beautiful UI components with New York style:
  - **Reka UI** - Headless UI components for Vue
  - **Class Variance Authority** - Component variant management
  - **Tailwind Merge & clsx** - Utility class management
  - **CSS Variables** - Dynamic theming support
- **TanStack Vue Table** - Powerful data tables and sorting
- **Vue Sonner** - Elegant toast notifications
- **VueUse Core** - Collection of Vue composition utilities
- **Lucide Vue Next** - Beautiful & consistent icon toolkit
- **Vaul Vue** - Smooth drawer/sheet components
- **TW Animate CSS** - Enhanced Tailwind animations

### Backend Integration
- **Laravel API** - RESTful API communication
- **Repository**: [Internship Monitoring Laravel](https://github.com/shfwnz/internship-monitoring-laravel.git)

## Prerequisites

- Node.js >= 18.0.0
- NPM or Yarn
- Running SimPKL Backend (Laravel API)
- Git

## Installation

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shfwnz/internship-monitoring-vue.git frontend
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   
   Update the API base URL in `src/api/index.js`:
   ```javascript
   const api = axios.create({
     baseURL: 'http://your-backend-url:8000/api', // Change this to your backend URL
   });
   
   const LARAVEL_BASE_URL = 'http://your-backend-url:8000'; // Change this to your backend URL
   ```

   Or create a `.env` file for environment-specific configuration:
   ```env
   VITE_API_BASE_URL=http://your-backend-url:8000/api
   VITE_LARAVEL_BASE_URL=http://your-backend-url:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Backend Setup
Make sure the Laravel backend is running. Follow the setup instructions in:
- **Backend Repository**: [Internship Monitoring Laravel](https://github.com/shfwnz/internship-monitoring-laravel.git)

## Usage

### Student Interface
- Access personal internship dashboard and progress tracking
- Submit reports, documents, and required internship materials
- View assigned tasks, deadlines, and supervisor feedback
- Track internship milestones and completion status
- Communicate with assigned teachers and supervisors

### Teacher Interface  
- Monitor and supervise assigned students' internship progress
- Review submitted documents, reports, and assignments
- Provide feedback, evaluations, and guidance to students
- Generate progress reports and assessment summaries
- Manage student assignments and deadlines

### Admin Interface
- Comprehensive system overview and management capabilities
- User management for students, teachers, and industry partners
- System configuration, settings, and role management
- Analytics dashboard with detailed reports and insights
- Audit logs and system monitoring tools

## API Integration

The frontend communicates with the Laravel backend through RESTful APIs:

- **Authentication**: Login, logout, token refresh, and user registration
- **Student Management**: CRUD operations for student profiles and data
- **Internship Tracking**: Real-time internship progress and status updates
- **File Management**: Document upload, download, and management
- **Teacher Operations**: Supervision assignments and student evaluations
- **Industry Management**: Partner information and business field data
- **Notifications**: Real-time system notifications and alerts

## Configuration

### API Configuration

The API configuration is located in `src/api/index.js`:

```javascript
import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: 'http://192.168.1.6:8000/api', // Update this URL
});

const LARAVEL_BASE_URL = 'http://192.168.1.6:8000'; // Update this URL
```

### Development Server

The Vite configuration in `vite.config.js`:
- Host: `0.0.0.0` (accessible from other devices on network)
- Port: `3000`
- Path aliases: `@` points to `./src`
- Tailwind CSS 4 with Vite plugin integration

## Project Structure

```
src/
├── api/                    # API configuration and services
│   └── index.js           # Axios configuration with interceptors
├── components/            # Reusable Vue components
│   ├── layouts/           # Layout components (AppLayout, BaseLayout)
│   └── ui/                # Shadcn/ui components
├── views/                 # Page components
│   ├── auth/              # Authentication pages (Login, Register)
│   ├── dashboard/         # Dashboard pages (Student, Teacher)
│   └── ...                # Other view components (Industry, Profile)
├── router/                # Vue Router configuration
│   └── index.js           # Route definitions with guards
├── lib/                   # Utility functions
│   └── utils.js           # Helper functions for components
├── composables/           # Vue composables
├── assets/                # Static assets
├── style.css              # Global Tailwind CSS styles
└── App.vue               # Root component
```

## UI Components

This project uses **Shadcn/ui for Vue** with the **New York** style variant, which provides:

- **Consistent Design System**: Pre-built components following modern design principles
- **Accessibility**: All components are built with accessibility in mind using Reka UI primitives
- **Customizable**: Easy to customize with CSS variables and Tailwind utility classes
- **Gray Base Color**: Cohesive color scheme using gray as the base color
- **CSS Variables**: Dynamic theming support for easy customization

### Configuration

The project is configured with:
- **Style**: New York (clean, minimal design)
- **Base Color**: Gray
- **CSS Variables**: Enabled for dynamic theming
- **Icon Library**: Lucide icons
- **No TypeScript**: Pure JavaScript implementation

### Component Organization

```
@/components/ui/     # Shadcn/ui components
@/components/        # Custom components  
@/composables/       # Vue composables
@/lib/utils          # Utility functions
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Guidelines

1. **Component Structure**: Use Composition API with `<script setup>` syntax
2. **Styling**: Use Tailwind CSS 4 utility classes with Shadcn/ui components (New York style)
3. **State Management**: Use Vue's reactive system and composables from `@/composables/`
4. **API Calls**: Use the configured axios instance from `src/api/index.js`
5. **Routing**: Define routes in `src/router/index.js` with proper meta guards
6. **Icons**: Use Lucide Vue Next for consistent iconography
7. **Notifications**: Use Vue Sonner for user feedback and toast messages
8. **Animations**: Leverage TW Animate CSS for smooth transitions
9. **Path Aliases**: Use configured aliases (`@/components`, `@/lib/utils`, etc.)

### Component Development

When creating new components with Shadcn/ui:

```vue
<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Component logic here
const status = ref('active')
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Student Dashboard</CardTitle>
      <Badge :variant="status === 'active' ? 'default' : 'secondary'">
        {{ status }}
      </Badge>
    </CardHeader>
    <CardContent>
      <Button variant="default" size="sm">View Details</Button>
    </CardContent>
  </Card>
</template>
```

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   Deploy the `dist` folder to your web server or hosting platform.

## Role-Based Permissions

The frontend handles multiple user roles with appropriate interface restrictions:

- **Student**: Access to personal internship dashboard and document submission
- **Teacher**: Student supervision tools and evaluation interfaces  
- **Admin**: Full system management and configuration access
- **Custom Roles**: Flexible role-based interface customization

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your Laravel backend has CORS properly configured
2. **API Connection**: Verify the API base URL in `src/api/index.js`
3. **Authentication Issues**: Check if the backend JWT configuration is correct
4. **Build Issues**: Clear node_modules and reinstall dependencies
5. **Component Import Issues**: Ensure Shadcn/ui components are properly installed

### Network Access

The development server is configured to be accessible from other devices on your network by default. If you need to restrict access:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: 'localhost', // Change from true to 'localhost'
    port: 3000,
  },
});
```

### Tailwind CSS 4

This project uses Tailwind CSS 4 with the new Vite plugin. If you encounter styling issues:

1. Ensure `@tailwindcss/vite` is properly configured in `vite.config.js`
2. Check that component classes are being applied correctly
3. Verify Tailwind's new CSS imports are working

## Performance Optimization

- **Code Splitting**: Routes are automatically code-split for faster loading
- **Tree Shaking**: Unused code is automatically removed during build
- **Asset Optimization**: Vite optimizes all assets during production build
- **Component Lazy Loading**: Use dynamic imports for heavy components
- **API Caching**: Intelligent caching of API responses where appropriate

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow the coding standards and use Shadcn/ui components
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## Related Repositories

- **Backend (Laravel + Filament)**: [Internship Monitoring Laravel](https://github.com/shfwnz/internship-monitoring-laravel.git)

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**SimPKL Frontend** - Modern Vue.js interface for internship monitoring system.