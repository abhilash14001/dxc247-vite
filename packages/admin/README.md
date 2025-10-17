# DXC247 Admin Application

Admin panel for managing DXC247 betting platform.

## Quick Start

```bash
# From root directory
npm run start:admin

# Or from this directory
npm run dev
```

Application runs on http://localhost:3002

## Structure

```
src/
├── layouts/         # AdminLayout
├── pages/           # Admin pages (60+ files)
├── components/      # Admin-specific components
├── routes/          # Admin routing with permissions
├── utils/           # Admin API utilities
└── index.js         # Entry point
```

## Key Features

- User management
- Bet management
- Reports and analytics
- Casino game administration
- Sports market configuration
- System settings
- Transaction management
- IP blocking
- Market blocking
- Logs and monitoring

## CSS Loading

CSS files are loaded directly in `index.html` for better performance:
- Fontawesome
- jQuery DataTables
- jQuery UI
- Bootstrap DatePicker
- Color Picker
- Theme CSS
- Backend CSS
- Flipclock CSS

This eliminates the need for dynamic CSS loading and improves initial load time.

## Development

```bash
npm run dev      # Start development server (port 3002)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment Variables

Configure in `.env` file. All variables must use `VITE_` prefix:

```
VITE_MAIN_URL=http://admin.dxc247.com/
VITE_API_URL=http://admin.dxc247.com/api
# ... etc
```

## Routing

All admin routes are prefixed with `/admin`:
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard
- `/admin/users` - User management
- `/admin/bets` - Bet management
- `/admin/reports` - Reports
- `/admin/casino` - Casino management
- ... and many more

## Dependencies

This package depends on:
- `@dxc247/shared` - Shared components and utilities
- `react` - UI library
- `react-router-dom` - Routing
- `react-redux` - State management
- `vite` - Build tool

## Security

Admin routes are protected with:
- Authentication checks
- Permission/privilege system
- Admin-specific middleware
- Route guards

