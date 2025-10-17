# DXC247 Monorepo

This is a monorepo containing three packages: shared, user, and admin applications.

## Architecture

```
/var/www/dxc247-vite/
├── packages/
│   ├── shared/          # Shared components, casino games, utilities
│   ├── user/            # User-facing application (port 3001)
│   └── admin/           # Admin application (port 3002)
├── package.json         # Root workspace configuration
└── README.md
```

## Quick Start

### Install Dependencies

```bash
npm install
```

This will install dependencies for all workspace packages and create symlinks between them.

### Start User Application

```bash
npm run start:user
```

The user app will run on http://localhost:3001

### Start Admin Application

```bash
npm run start:admin
```

The admin app will run on http://localhost:3002

### Start Both Applications

```bash
npm run dev
```

This will start both user and admin apps concurrently.

### Build Applications

```bash
# Build all packages
npm run build:all

# Build user only
npm run build:user

# Build admin only
npm run build:admin
```

## Package Structure

### Shared Package (`@dxc247/shared`)

Contains all shared code including:
- **72 casino games** (`casino-games/`)
- **Utilities** (`utils/`) - Constants, casino utils, last results
- **Contexts** (`contexts/`) - Sports, Auth, Casino, Stake contexts
- **Redux Store** (`store/`) - All slices and provider
- **Hooks** (`hooks/`) - Custom React hooks
- **Components** (`components/`)
  - `ui/` - Reusable UI components
  - `common/` - Common components
  - `providers/` - Context providers
  - `hoc/` - Higher-order components
  - `casino/` - Casino-specific components (including CasinoLayout)
  - `middleware/` - Middleware components
  - `admin/` - Admin-specific shared components

### User Package (`@dxc247/user`)

User-facing application containing:
- **Layouts** (`src/layouts/`) - Header, Footer, Sidebar
- **Pages** (`src/pages/`) - Home, Account Statement, Bet History, etc.
- **Sports Pages** (`src/pages/sports/`) - Cricket, Tennis, Soccer
- **Routing** - User-specific routes
- **Public Assets** - User-facing assets

**Port:** 3001

### Admin Package (`@dxc247/admin`)

Admin application containing:
- **Layouts** (`src/layouts/`) - AdminLayout
- **Pages** (`src/pages/`) - All admin pages (60+ files)
- **Components** (`src/components/`) - Admin-specific components
- **Routes** - Admin routing with permissions
- **Utils** - Admin API utilities

**Port:** 3002

## Key Features

### Casino Games Sharing

All 72 casino games are in the shared package and can be used by both user and admin apps. The `CasinoLayout` component accepts an `isAdmin` prop to conditionally render different layouts:

```javascript
// User context
<CasinoLayout isAdmin={false}>
  <GameComponent />
</CasinoLayout>

// Admin context
<CasinoLayout isAdmin={true}>
  <GameComponent />
</CasinoLayout>
```

### Independent Deployments

- User and admin apps can be built and deployed independently
- Shared package is source-only (no build step required)
- Each app has its own environment variables and configuration

### Admin CSS Loading

Admin app loads CSS files directly in `index.html` instead of dynamically:
- Faster initial load
- No CSS loading state management required
- All admin stylesheets included at build time

## Import Patterns

### Importing from Shared Package

```javascript
// In user or admin apps
import { Component } from '@dxc247/shared/components/ui/Component';
import { constants } from '@dxc247/shared/utils/constants';
import { store } from '@dxc247/shared/store';
import CasinoLayout from '@dxc247/shared/components/casino/CasinoLayout';
```

### Path Aliases

Both Vite configs include aliases:
```javascript
'@shared': path.resolve(__dirname, '../shared'),
'@': path.resolve(__dirname, './src'),
```

## Environment Variables

Each package has its own `.env` file:
- `packages/user/.env` - User-specific variables
- `packages/admin/.env` - Admin-specific variables

All environment variables use `VITE_` prefix:
```
VITE_MAIN_URL=http://admin.dxc247.com/
VITE_API_URL=http://admin.dxc247.com/api
```

## Development Status

### ✅ Completed
- [x] Monorepo structure with npm workspaces
- [x] Shared package with 72 casino games
- [x] User package setup and configuration
- [x] Admin package setup and configuration
- [x] CasinoLayout updated to accept isAdmin prop
- [x] Admin CSS loading moved to index.html
- [x] Both apps running successfully (user on 3001, admin on 3002)
- [x] Dependencies installed and workspaces linked

### 🔄 In Progress
- [ ] Update all import paths in shared package files
- [ ] Fix relative imports to use package structure
- [ ] Test casino games in both contexts
- [ ] Verify all routes work correctly

## Common Commands

### Using Helper Scripts (Recommended)

```bash
# Check status of both apps
./check-apps.sh

# Start both apps
./start-apps.sh

# Stop both apps
./stop-apps.sh
```

### Using npm Commands

```bash
# Install dependencies
npm install

# Start user app
npm run start:user

# Start admin app
npm run start:admin

# Start both apps
npm run dev

# Build all
npm run build:all

# Build user
npm run build:user

# Build admin
npm run build:admin
```

### View Logs

```bash
# User app logs
tail -f /tmp/user-app.log

# Admin app logs
tail -f /tmp/admin-app.log
```

## Troubleshooting

### Import Errors

If you encounter import errors, ensure:
1. Dependencies are installed: `npm install`
2. Path aliases are configured in vite.config.js
3. Imports use correct package syntax: `@dxc247/shared/...`

### Port Conflicts

- User app: 3001
- Admin app: 3002

If ports are in use, update in respective `vite.config.js` files.

### CSS Not Loading (Admin)

Admin CSS is loaded from `index.html`. Ensure all CSS URLs are correct and accessible.

## Next Steps

1. Fix remaining import paths in shared package
2. Test all casino games in both user and admin contexts
3. Verify routing works correctly in both apps
4. Test production builds
5. Update deployment scripts for independent deployments
