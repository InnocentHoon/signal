# SIGNAL
**FIND THE SIGNAL. IGNORE THE NOISE.**

## Overview
SIGNAL is a comprehensive social media intelligence and analytics SaaS platform designed for creators, agencies, and brands. It cuts through the noise of social media data to deliver actionable insights, deterministic scoring, and AI-powered recommendations. By connecting your Instagram professional accounts, SIGNAL provides a strategic command center for content planning, audience analysis, and growth trajectory.

## Features
- Profile Intelligence (Score 0-10, health 0-100)
- Account Analytics (real data from Instagram)
- Content Library & Performance Scoring
- Content Radar (opportunity scoring)
- Content Gap Finder
- AI-powered: Ideas, Hooks, Captions, Repurposing
- SIGNAL Strategist (AI chat)
- Trend Intelligence (YouTube-powered)
- Audio Intelligence (architecture ready)
- Content Calendar
- Weekly Strategy Reports
- CSV Import
- Smart Alerts
- Competitor Analysis
- Growth Projections

## Architecture
```text
├── Next.js 14 App Router
│   ├── (marketing)/   # Landing, legal pages
│   ├── (auth)/        # Login, register
│   └── (app)/         # Protected application
│       └── api/       # Server-side API routes
├── lib/
│   ├── analytics/     # Deterministic calculations
│   ├── ai/            # Gemini AI provider
│   ├── instagram/     # Meta Graph API client
│   ├── providers/     # TrendProvider, AudioProvider
│   ├── scoring/       # Profile/health/performance scores
│   └── recommendations/ # Rules-based engine
└── prisma/            # Database schema (22 models)
```

## Tech Stack
| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 |
| UI Components | Radix UI, Lucide React |
| Validation | Zod |
| AI Provider | Google Gemini API |
| Social API | Meta Graph API (Instagram) |
| Trend API | YouTube Data API v3 |

## Database Setup
1. Install PostgreSQL on your local machine or use a hosted provider.
2. Create database: `createdb signal`
3. Copy `.env.example` to `.env`
4. Set the `DATABASE_URL` in your `.env` file to your PostgreSQL connection string.
5. Run `npx prisma migrate dev --name init` to apply the schema.
6. Run `npx prisma generate` to generate the Prisma Client.

## Authentication Setup
- NextAuth.js v5 with credentials + JWT
- Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- Configure `NEXTAUTH_URL` to your domain (e.g., `http://localhost:3000` for local dev)

## Meta/Instagram API Setup
1. Go to [Facebook Developers Console](https://developers.facebook.com)
2. Create a Meta App (Type: Business or None)
3. Add Instagram Graph API product
4. Add Facebook Login product
5. Configure OAuth redirect URI: `{APP_URL}/api/instagram/callback`
6. Required permissions: `instagram_basic`, `instagram_manage_insights`, `instagram_manage_comments`, `pages_show_list`, `pages_read_engagement`
7. **Development Mode**: In dev mode, you can only test with accounts that have an active Role (Admin, Developer, Tester) in the Meta App.
8. **App Review**: To switch to Live Mode and allow public users, you must submit the app for review for permissions like `instagram_manage_insights`.
9. **Account Requirement**: Only Instagram Professional accounts (Business or Creator) linked to a Facebook Page are supported by the Graph API.
10. Copy your App ID and App Secret to the `.env` file as `META_CLIENT_ID` and `META_CLIENT_SECRET`.

## Google Gemini API Setup
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Note free tier limits: 15 RPM (Requests Per Minute), 1500 RPD (Requests Per Day)
4. **Data Usage Warning**: Free tier usage may be logged and used to train Google's models. Ensure you are comfortable with this or use a paid tier for sensitive data.
5. Add `GEMINI_API_KEY` to `.env`

## YouTube API Setup (Optional - Trend Intelligence)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create API Key
4. Note quota: 10,000 units/day, 1 search = 100 units
5. Attribution requirement: UI must state 'Powered by YouTube' when displaying data.
6. Add `YOUTUBE_API_KEY` to `.env`

## Local Development
```bash
git clone <repository-url>
cd signal
npm install
cp .env.example .env
# Fill in .env values
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

## Environment Variables
| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js sessions | Yes |
| `NEXTAUTH_URL` | Base URL of the application | Yes |
| `META_CLIENT_ID` | Meta App ID | Yes |
| `META_CLIENT_SECRET`| Meta App Secret | Yes |
| `GEMINI_API_KEY` | Google Gemini API Key | Yes |
| `YOUTUBE_API_KEY` | YouTube Data API Key | No (Trend feature degrades gracefully) |
| `ENCRYPTION_KEY` | 32-byte hex string for AES-256-GCM token encryption | Yes |

## Testing
```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
```

## Production Build
```bash
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

## Deployment

### Vercel (Recommended)
1. Push your repository to GitHub/GitLab.
2. Import the project in Vercel.
3. Configure the Environment Variables in the Vercel dashboard.
4. Add a build step for prisma: `npx prisma generate && npx prisma migrate deploy && next build`.
5. Deploy!

### Environment Variables for Production
Ensure all variables marked as 'Required' in the Environment Variables table are set in your production environment (e.g., Vercel Environment Variables settings). Replace `NEXTAUTH_URL` with your actual production domain.

### OAuth Callback Configuration
In your Meta Developer Console, update the Valid OAuth Redirect URIs under Facebook Login > Settings to include your production callback: `https://yourdomain.com/api/instagram/callback`.

## Known API Limitations
- Instagram Insights require App Review for `instagram_manage_insights` permission before public users can connect.
- Personal Instagram accounts cannot use Graph API (Business/Creator required).
- Audio trend data: no free commercial API exists; shown as 'Unavailable' in the UI.
- YouTube trend data: 10,000 unit/day quota (resets daily).
- Public profile analysis requires Business Discovery API (connected account needed).

## Privacy Considerations
- **Stored Data**: User profile metadata, post performance metrics, and analytics history.
- **Token Security**: OAuth access tokens are encrypted at rest using AES-256-GCM.
- **Data Deletion**: Users can delete their account and all associated data via `DELETE /api/auth/delete-account`.
- **No Passwords**: No Instagram passwords are ever stored or requested.
- **Revocation**: Users can disconnect their Instagram account at any time, which purges the stored access tokens.

## Security
- All API routes operate server-side to protect credentials.
- JWT session tokens are stored in HttpOnly cookies to mitigate XSS.
- OAuth state validation uses HMAC-signed tokens to prevent CSRF attacks.
- Input validation is strictly enforced with Zod on all API routes.
- Row-level ownership checks are implemented on all database queries.
- Audit logging tracks important user actions and system events.
- No secrets (API keys, DB URLs) are exposed in client-side code.
