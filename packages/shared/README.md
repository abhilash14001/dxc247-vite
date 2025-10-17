# DXC247 Shared Package

Shared components, utilities, and casino games used by both user and admin applications.

## Package Name

`@dxc247/shared`

## Contents

### Casino Games (72 files)
Located in `casino-games/`:
- 69 main casino games (Aaa, Baccarat, Lucky7, Teen Patti, Poker, etc.)
- Virtual casino games subdirectory
- All games work with both user and admin contexts via `isAdmin` prop

### Components
Located in `components/`:
- `ui/` - Reusable UI components
- `common/` - Common components shared across apps
- `providers/` - Context providers (Auth, Sports, Casino, Common, Theme)
- `hoc/` - Higher-order components (withPageLoading, withAdminPasswordProtection)
- `casino/` - Casino-specific components
  - `CasinoLayout.js` - Main casino layout (accepts `isAdmin` prop)
  - `CasinoMain.js` - Casino main component
  - `CasinoVideo.js`, `CasinoRules.js`, etc.
- `middleware/` - Middleware components (LiveModeGuard, BlockUrlMiddleware)
- `admin/` - Admin-specific shared components

### Utilities
Located in `utils/`:
- `constants.js` - Constants and helper functions
- `lastresults.js` - Last results utilities
- `casinoUtils.js` - Casino-specific utilities

### Contexts
Located in `contexts/`:
- `SportsContext.js` - Sports context
- `AuthContext.js` - Authentication context
- `CasinoContext.js` - Casino context
- `StakeContext.js` - Stake management context

### Redux Store
Located in `store/`:
- All Redux slices (userSlice, adminSlice, casinoSlice, rouletteSlice, etc.)
- Provider.js - Redux provider
- Store configuration

### Hooks
Located in `hooks/`:
- Custom React hooks used across applications

## Usage

### Importing from Shared Package

```javascript
// In user or admin apps
import { Component } from '@dxc247/shared/components/ui/Component';
import { constants } from '@dxc247/shared/utils/constants';
import { store } from '@dxc247/shared/store';
import CasinoLayout from '@dxc247/shared/components/casino/CasinoLayout';
import Lucky7 from '@dxc247/shared/casino-games/Lucky7';
```

### Using CasinoLayout

The `CasinoLayout` component accepts an `isAdmin` prop to conditionally render different layouts:

```javascript
// In user app
<CasinoLayout isAdmin={false} {...props}>
  <GameComponent />
</CasinoLayout>

// In admin app
<CasinoLayout isAdmin={true} {...props}>
  <GameComponent />
</CasinoLayout>
```

When `isAdmin={true}`:
- Header is hidden
- Sidebar is hidden
- Footer is hidden
- Only casino game content is rendered

When `isAdmin={false}`:
- Full user layout with Header, Sidebar, and Footer

## Package Exports

The package exports are configured in `package.json`:

```json
{
  "exports": {
    ".": "./index.js",
    "./casino-games/*": "./casino-games/*.js",
    "./components/*": "./components/*.js",
    "./utils/*": "./utils/*.js",
    "./store": "./store/index.js",
    "./hooks/*": "./hooks/*.js",
    "./contexts/*": "./contexts/*.js"
  }
}
```

## Dependencies

This is a source-only package (no build step). It has peer dependencies:
- `react` - UI library
- `react-dom` - React DOM
- `react-redux` - State management
- `react-router-dom` - Routing

And regular dependencies for shared utilities:
- `@reduxjs/toolkit` - Redux toolkit
- `axios` - HTTP client
- `bootstrap` - UI framework
- `react-toastify` - Toast notifications
- `socket.io-client` - WebSocket client
- Many other UI and utility libraries

## Key Features

### Casino Games Sharing
All 72 casino games are in one place and can be used by both user and admin apps without duplication.

### Context-Aware Components
Components like `CasinoLayout` can adapt their behavior based on context (user vs admin).

### Shared State Management
Redux store is shared, ensuring consistent state management across apps.

### Reusable Utilities
Common functions and constants are centralized and maintained in one place.

## No Build Step

This package is source-only - it doesn't require a build step. The parent applications (user and admin) will transpile and bundle the code as needed.

