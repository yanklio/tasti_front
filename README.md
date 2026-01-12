# Tasti

A modern, intuitive recipe management application built with **Angular 20** and **Material Design 3**.
Discover, organize, and share your favorite recipes with a beautiful, responsive interface that works seamlessly across all your devices.

## ✨ Features

- 📚 **Recipe Library** - Browse and organize your personal recipe collection
- 🔍 **Smart Search** - Find recipes by ingredients, cuisine, or cooking time
- 👤 **User Accounts** - Personalized experience with secure authentication
- 🎨 **Dynamic Theming** - Light/dark mode with custom Material Design 3 theming
- 📱 **Responsive Design** - Perfect experience on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - Safe and secure user management

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tasti_front
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to `http://localhost:4200`

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run watch` | Build and watch for changes |
| `npm test` | Run unit tests |
| `npm run lint` | Lint code with ESLint |

### Project Structure

```
src/
├── app/
│   ├── core/           # Core services (theme, session, favicon)
│   ├── features/       # Feature modules
│   │   ├── auth/       # Authentication flows
│   │   ├── recipes/    # Recipe management
│   │   ├── account/    # User account management
│   │   └── settings/   # App settings
│   ├── shared/         # Shared components and utilities
│   │   └── layout/     # Layout components (main shell)
│   └── constants.ts    # Global route constants
├── assets/             # Static assets
│   └── favicons/       # Theme-aware favicons
├── environments/       # Environment configurations
└── custom-theme.scss   # Material Design 3 custom theme
```

## 🎨 Design System

Tasti uses **Material Design 3** with a custom theme that includes:

- **Primary Colors**: Warm orange palette for appetizing visuals
- **Tertiary Colors**: Soft rose accents for visual hierarchy
- **Typography**: Roboto font family for excellent readability
- **Dark Mode**: Automatic theme switching with system preferences
- **Responsive Breakpoints**: Optimized for all screen sizes

### Theme Customization

The custom theme is defined in `src/custom-theme.scss` and includes:
- Dynamic color schemes for light/dark modes
- Custom component styling
- Accessibility-compliant color contrasts

## 🔧 Configuration

### Environment Settings

| Environment | File | Purpose |
|-------------|------|---------|
| Development | `environment.development.ts` | Local development settings |
| Production | `environment.prod.ts` | Production optimizations |

### Build Configurations

- **Development**: Fast builds with source maps and debugging
- **Production**: Optimized builds with minification and tree-shaking
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🧪 Testing Strategy

- **Unit Tests**: Jasmine + Karma for component and service testing
- **E2E Tests**: Angular testing utilities for integration testing
- **Coverage Reports**: Comprehensive test coverage tracking

## 🚀 Deployment

### Production Build

```bash
npm run build
```

Builds are optimized with:
- Tree-shaking for minimal bundle sizes
- Ahead-of-Time (AOT) compilation
- Lazy loading for optimal performance

### Performance

- **Bundle Size**: < 1MB initial bundle
- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience

### Code Standards

- **Prettier**: Automatic code formatting (100 char limit, single quotes)
- **ESLint**: TypeScript and Angular best practices
- **Conventional Commits**: Standardized commit messages
- **Angular Style Guide**: Following official Angular conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ♡ for food lovers everywhere
