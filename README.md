# Candy Blossom

A full-stack plant care management application — browse plants, build your personal collection, and receive smart watering reminders tailored to real-time weather.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | Symfony 8.0, API Platform 4.3, PHP 8.4+ |
| **Database** | MySQL 8.4 (via Doctrine ORM 3) |
| **Auth** | JWT (LexikJWTAuthenticationBundle) |
| **3D** | Three.js, React Three Fiber, Drei |
| **Animation** | Framer Motion |
| **Email** | Resend (transactional) |
| **External APIs** | Perenual (plant database), WeatherAPI.com (weather data) |

## Architecture

```
candyblossom/
├── backend/          # Symfony REST API (headless)
│   ├── src/
│   │   ├── Entity/        # User, Plant, UserPlant
│   │   ├── Controller/    # Auth, Plant, Weather
│   │   ├── Service/       # WateringCalculator, PerenualApi, WeatherApi, ResendMailer
│   │   ├── Repository/    # Doctrine repositories
│   │   └── Security/      # JWT auth utilities
│   ├── config/            # Symfony bundles, routes, services
│   ├── migrations/        # Doctrine migrations
│   └── public/            # Web root (index.php, uploads)
│
└── frontend/         # Next.js SPA
    ├── app/               # App Router pages
    │   ├── dashboard/     # Main dashboard (plants, watering, settings)
    │   ├── auth/          # Login / registration / email verification
    │   ├── features/      # Feature sub-pages
    │   └── docs/          # API documentation viewer
    ├── components/        # Shared components (Header, HeroScene, modals, providers)
    └── lib/               # API client (fetchApi.ts)
```

## Features

- **Plant Discovery** — Search the Perenual plant database or browse a curated local catalog
- **Personal Collection** — Add plants to your virtual garden with location and custom images
- **Smart Watering** — Automatic watering schedules adjusted by real-time weather (rain, temperature, humidity)
- **Weather Integration** — Live weather data by city via WeatherAPI
- **3D Visualizations** — Interactive 3D scenes for plants, sunlight, and water
- **JWT Authentication** — Register with email verification, secure login
- **Light/Dark Mode** — Theme toggle with CSS custom properties
- **Responsive Design** — Mobile-first with glassmorphism UI, inspired by Linear.app

## Smart Watering Logic

The `WateringCalculatorService` computes the next watering date by:

1. Determining the base interval from the plant's `watering_general_benchmark` or `watering` category (Frequent=2d, Average=7d, Minimum=14d, None=30d)
2. Fetching real-time weather for the user's city
3. Adjusting: **+2 days** if raining, **-2 days** if temp > 30°C, **-1 day** if humidity < 30%
4. Enforcing a minimum of 1 day between waterings

## Getting Started

### Prerequisites

- PHP 8.4+
- Composer
- Node.js 20+
- pnpm
- MySQL 8.4
- OpenSSL (for JWT keys)

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Configure database in .env.local
# DATABASE_URL="mysql://root:@127.0.0.1:3306/candyblossom?serverVersion=8.4.7"

# Create database and run migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Generate JWT keys
php bin/console lexik:jwt:generate-keypair

# Start the dev server
php -S 127.0.0.1:8000 -t public/
# Or using Symfony CLI:
symfony serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Configure API URL in .env.local
# NEXT_PUBLIC_API_URL=https://127.0.0.1:8000

# Start the dev server
pnpm dev
```

The frontend runs on `http://localhost:3000` and proxies API calls to `http://127.0.0.1:8000`.

### Docker (Optional)

A `compose.yaml` is provided with a PostgreSQL service (for dev/test — the active config uses MySQL).

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/initiate` | Start registration (sends verification email) |
| POST | `/register/complete` | Complete registration with password |
| POST | `/login` | JWT login |
| GET | `/verify-email?token=` | Verify email address |
| GET | `/user/me` | Get current user profile |
| PUT | `/user/me` | Update profile |
| PUT | `/user/password` | Change password |

### Plants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plants` | List all plants |
| GET | `/api/plants/{id}` | Get plant details |
| GET | `/api/plants/search/{name}/{page}` | Search Perenual plant database |
| GET | `/api/plant/name/{name}` | Get plant by common name |
| POST | `/api/plants` | Create a plant (authenticated) |
| DELETE | `/api/plant/{id}` | Delete a plant (authenticated) |
| POST | `/user/plant/{id}/image` | Upload plant image |
| GET | `/api/plants/next-watering` | Get scheduled waterings |

### User Collection

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/plants` | List user's plants |
| POST | `/user/plant` | Add plant to collection |

### Weather

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/weather/{city}` | Get current weather for a city |

API documentation is available at `/api/docs` with a customized Swagger UI.

## Environment Variables

### Backend (`backend/.env.local`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL DSN |
| `JWT_SECRET_KEY` | Path to JWT private key |
| `JWT_PUBLIC_KEY` | Path to JWT public key |
| `JWT_PASSPHRASE` | JWT key passphrase |
| `CORS_ALLOW_ORIGIN` | Allowed CORS origins |
| `APP_URL` | Backend base URL |
| `FRONTEND_URL` | Frontend base URL for CORS |
| `PERENUAL_API_KEY` | Perenual plant database API key |
| `WEATHER_API_KEY` | WeatherAPI.com API key |
| `RESEND_API_KEY` | Resend transactional email API key |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Data Model

- **User** — email, password, name, roles, email verification
- **Plant** — 50+ fields covering common/scientific name, watering, sunlight, care level, dimensions, hardiness, soil, propagation, medicinal/poisonous flags
- **UserPlant** — junction entity linking a user to a plant with city, image, and smart watering schedule

## License

Proprietary. All rights reserved.
