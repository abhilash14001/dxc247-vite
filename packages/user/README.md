# DXC247 User Application

User-facing application for DXC247 betting platform.

## Quick Start

```bash
# From root directory
npm run start:user

# Or from this directory
npm run dev
```

Application runs on http://localhost:3001

## Structure

```
src/
├── layouts/         # Header, Footer, Sidebar
├── pages/           # User pages
│   ├── sports/      # Sports pages (Cricket, Tennis, Soccer)
│   └── casino/      # Casino game pages
├── routes/          # User routing
└── index.js         # Entry point
```

## Key Pages

- `/` - Home
- `/login` - Login page
- `/casino/:match_id` - Casino games
- `/cricket/:match_id` - Cricket matches
- `/tennis/:match_id` - Tennis matches
- `/soccer/:match_id` - Soccer matches
- `/account-statement` - Account statement
- `/bet-history` - Bet history
- `/profit-loss` - Profit/loss report
- `/current-bets` - Current bets

## Development

```bash
npm run dev      # Start development server (port 3001)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment Variables

Configure in `.env` file. All variables must use `VITE_` prefix:

```
VITE_MAIN_URL=http://admin.dxc247.com/
VITE_API_URL=http://admin.dxc247.com/api
VITE_CASINO_VIDEO_URL=https://stream.formatfun.com/casino
# ... etc
```

## Dependencies

This package depends on:
- `@dxc247/shared` - Shared components and utilities
- `react` - UI library
- `react-router-dom` - Routing
- `react-redux` - State management
- `vite` - Build tool

