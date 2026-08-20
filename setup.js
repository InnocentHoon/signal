#!/usr/bin/env node
/**
 * SIGNAL Setup Wizard
 * Guides you through getting all required credentials and writes .env
 */

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')

const GREEN  = (s) => `\x1b[32m${s}\x1b[0m`
const YELLOW = (s) => `\x1b[33m${s}\x1b[0m`
const CYAN   = (s) => `\x1b[36m${s}\x1b[0m`
const BOLD   = (s) => `\x1b[1m${s}\x1b[0m`
const DIM    = (s) => `\x1b[2m${s}\x1b[0m`
const RED    = (s) => `\x1b[31m${s}\x1b[0m`
const RESET  = '\x1b[0m'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (question) => new Promise(resolve => rl.question(question, resolve))
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function openBrowser(url) {
  try {
    const cmd = process.platform === 'win32' ? `start "" "${url}"` :
                process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`
    execSync(cmd, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function separator() {
  console.log(DIM('─'.repeat(60)))
}

async function main() {
  console.clear()
  console.log()
  console.log(BOLD(CYAN('  ███████╗██╗ ██████╗ ███╗   ██╗ █████╗ ██╗')))
  console.log(BOLD(CYAN('  ██╔════╝██║██╔════╝ ████╗  ██║██╔══██╗██║')))
  console.log(BOLD(CYAN('  ███████╗██║██║  ███╗██╔██╗ ██║███████║██║')))
  console.log(BOLD(CYAN('  ╚════██║██║██║   ██║██║╚██╗██║██╔══██║██║')))
  console.log(BOLD(CYAN('  ███████║██║╚██████╔╝██║ ╚████║██║  ██║███████╗')))
  console.log(BOLD(CYAN('  ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝')))
  console.log()
  console.log(BOLD('  Setup Wizard — Guided credential configuration'))
  console.log(DIM('  This will generate secrets and guide you to get free API keys'))
  console.log()
  separator()

  const env = {}

  // ─── STEP 1: Auto-generate secrets ─────────────────────────────────
  console.log()
  console.log(BOLD('  Step 1/6 — Generating secrets') + DIM(' (no accounts needed)'))
  console.log()

  env.NEXTAUTH_SECRET = crypto.randomBytes(32).toString('hex')
  env.TOKEN_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex')

  console.log(`  ${GREEN('✓')} NEXTAUTH_SECRET     ${DIM('generated')}`)
  console.log(`  ${GREEN('✓')} TOKEN_ENCRYPTION_KEY ${DIM('generated')}`)
  console.log()

  // ─── STEP 2: Database ───────────────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Step 2/6 — Database URL'))
  console.log()
  console.log('  SIGNAL needs a PostgreSQL database. Free options:')
  console.log()
  console.log(`  ${CYAN('1')} Neon (recommended) → https://neon.tech`)
  console.log(`     Free tier, no credit card, instant setup`)
  console.log()
  console.log(`  ${CYAN('2')} Supabase           → https://supabase.com`)
  console.log(`     Free tier, 500MB storage`)
  console.log()
  console.log(`  ${CYAN('3')} Local PostgreSQL    → already running on your machine`)
  console.log(`     Format: postgresql://user:pass@localhost:5432/signal`)
  console.log()

  const dbChoice = await ask('  Which option? (1/2/3, or paste your own URL): ')

  if (dbChoice === '1') {
    openBrowser('https://neon.tech/signup')
    console.log()
    console.log(`  ${YELLOW('→')} Browser opened to Neon signup`)
    console.log(`  ${DIM('  Sign up → Create project → Copy the connection string')}`)
    console.log()
  } else if (dbChoice === '2') {
    openBrowser('https://supabase.com/dashboard/sign-up')
    console.log()
    console.log(`  ${YELLOW('→')} Browser opened to Supabase signup`)
    console.log(`  ${DIM('  Sign up → New project → Settings → Database → Connection string')}`)
    console.log()
  } else if (dbChoice === '3') {
    console.log()
    console.log(`  ${DIM('  Using local PostgreSQL')}`)
    console.log(`  ${DIM('  Make sure PostgreSQL is running and database "signal" exists:')}`)
    console.log(`  ${DIM('  > createdb signal')}`)
    console.log()
  }

  let dbUrl = ''
  if (dbChoice.startsWith('postgresql://') || dbChoice.startsWith('postgres://')) {
    dbUrl = dbChoice.trim()
  } else {
    dbUrl = await ask(`  Paste your database URL: `)
  }

  if (!dbUrl.trim()) {
    dbUrl = 'postgresql://postgres:password@localhost:5432/signal'
    console.log(`  ${YELLOW('!')} Using default local URL — update it in .env if needed`)
  }

  env.DATABASE_URL = dbUrl.trim()
  console.log(`  ${GREEN('✓')} DATABASE_URL set`)
  console.log()

  // ─── STEP 3: NEXTAUTH_URL ───────────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Step 3/6 — App URL'))
  console.log()
  const appUrl = await ask(`  Your app URL (press Enter for http://localhost:3000): `)
  env.NEXTAUTH_URL = appUrl.trim() || 'http://localhost:3000'
  console.log(`  ${GREEN('✓')} NEXTAUTH_URL = ${env.NEXTAUTH_URL}`)
  console.log()

  // ─── STEP 4: Gemini API Key ─────────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Step 4/6 — Gemini API Key') + CYAN(' (free, takes ~2 min)'))
  console.log()
  console.log('  Powers: AI Strategist, idea generator, hooks, captions')
  console.log()
  console.log(`  ${CYAN('→')} Get your free key at: https://aistudio.google.com/apikey`)
  console.log()

  const openGemini = await ask('  Open browser to Google AI Studio? (Y/n): ')
  if (openGemini.toLowerCase() !== 'n') {
    openBrowser('https://aistudio.google.com/apikey')
    console.log(`  ${YELLOW('→')} Browser opened`)
    console.log(`  ${DIM('  Sign in with Google → "Create API Key" → Copy it')}`)
    console.log()
    await pause(2000)
  }

  const geminiKey = await ask('  Paste your Gemini API key (or press Enter to skip): ')
  if (geminiKey.trim()) {
    env.GEMINI_API_KEY = geminiKey.trim()
    console.log(`  ${GREEN('✓')} GEMINI_API_KEY set`)
  } else {
    env.GEMINI_API_KEY = ''
    console.log(`  ${YELLOW('!')} Skipped — AI features will show "Configure API" prompt`)
  }
  console.log()

  // ─── STEP 5: YouTube API Key ────────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Step 5/6 — YouTube API Key') + CYAN(' (free, 10,000 req/day)'))
  console.log()
  console.log('  Powers: Trends page (currently trending topics)')
  console.log()
  console.log(`  ${CYAN('→')} Get your free key at: https://console.cloud.google.com`)
  console.log(`     1. Create/select a project`)
  console.log(`     2. Enable "YouTube Data API v3"`)
  console.log(`     3. Create credentials → API Key`)
  console.log()

  const openYT = await ask('  Open browser to Google Cloud Console? (Y/n): ')
  if (openYT.toLowerCase() !== 'n') {
    openBrowser('https://console.cloud.google.com/apis/library/youtube.googleapis.com')
    console.log(`  ${YELLOW('→')} Browser opened to YouTube Data API page`)
    console.log()
    await pause(2000)
  }

  const ytKey = await ask('  Paste your YouTube API key (or press Enter to skip): ')
  if (ytKey.trim()) {
    env.YOUTUBE_API_KEY = ytKey.trim()
    console.log(`  ${GREEN('✓')} YOUTUBE_API_KEY set`)
  } else {
    env.YOUTUBE_API_KEY = ''
    console.log(`  ${YELLOW('!')} Skipped — Trends page will show setup instructions`)
  }
  console.log()

  // ─── STEP 6: Meta / Instagram ───────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Step 6/6 — Meta / Instagram') + DIM(' (optional, requires App Review)'))
  console.log()
  console.log('  Powers: Connect Instagram account, sync posts, real metrics')
  console.log()
  console.log(`  ${YELLOW('!')} Note: Meta requires App Review (1–4 weeks) before live use`)
  console.log(`     The app is fully built and wired — just needs your credentials`)
  console.log()

  const doMeta = await ask('  Do you have a Meta Developer App already? (y/N): ')
  if (doMeta.toLowerCase() === 'y') {
    env.META_APP_ID = (await ask('  META_APP_ID: ')).trim()
    env.META_APP_SECRET = (await ask('  META_APP_SECRET: ')).trim()
    env.INSTAGRAM_REDIRECT_URI = `${env.NEXTAUTH_URL}/api/instagram/callback`
    console.log(`  ${GREEN('✓')} Meta credentials set`)
    console.log(`  ${DIM(`  Redirect URI: ${env.INSTAGRAM_REDIRECT_URI}`)}`)
    console.log(`  ${DIM('  Add this redirect URI in your Meta App → Instagram → OAuth')}`)
  } else {
    env.META_APP_ID = ''
    env.META_APP_SECRET = ''
    env.INSTAGRAM_REDIRECT_URI = `${env.NEXTAUTH_URL}/api/instagram/callback`
    openBrowser('https://developers.facebook.com/apps/')
    console.log()
    console.log(`  ${YELLOW('→')} Browser opened to Meta Developer Apps`)
    console.log(`  ${DIM('  When ready: Create App → Instagram → Set redirect URI:')}`)
    console.log(`  ${DIM(`  ${env.NEXTAUTH_URL}/api/instagram/callback`)}`)
    console.log(`  ${YELLOW('!')} Skipped for now — Instagram features will show "Connect" prompt`)
  }
  console.log()

  // ─── Write .env ─────────────────────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Writing .env file...'))
  console.log()

  const envContent = `# =============================================
# SIGNAL — Environment Configuration
# Generated by setup wizard on ${new Date().toISOString()}
# =============================================

# ─── Database ───────────────────────────────
DATABASE_URL="${env.DATABASE_URL}"

# ─── NextAuth ───────────────────────────────
NEXTAUTH_SECRET="${env.NEXTAUTH_SECRET}"
NEXTAUTH_URL="${env.NEXTAUTH_URL}"

# ─── Security ───────────────────────────────
# AES-256-GCM key for encrypting Instagram OAuth tokens
TOKEN_ENCRYPTION_KEY="${env.TOKEN_ENCRYPTION_KEY}"

# ─── Gemini AI ──────────────────────────────
# Get free key: https://aistudio.google.com/apikey
GEMINI_API_KEY="${env.GEMINI_API_KEY}"

# ─── YouTube Trends ─────────────────────────
# Get free key: https://console.cloud.google.com
YOUTUBE_API_KEY="${env.YOUTUBE_API_KEY}"

# ─── Meta / Instagram ───────────────────────
# Get from: https://developers.facebook.com/apps/
META_APP_ID="${env.META_APP_ID}"
META_APP_SECRET="${env.META_APP_SECRET}"
INSTAGRAM_REDIRECT_URI="${env.INSTAGRAM_REDIRECT_URI}"

# ─── Optional ───────────────────────────────
# NODE_ENV="production"
`

  const envPath = path.join(__dirname, '.env')
  const backupPath = path.join(__dirname, '.env.backup')

  // Back up existing .env if present
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, backupPath)
    console.log(`  ${DIM('  Backed up existing .env → .env.backup')}`)
  }

  fs.writeFileSync(envPath, envContent, 'utf8')
  console.log(`  ${GREEN('✓')} .env written successfully`)
  console.log()

  // ─── Summary ────────────────────────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Configuration Summary'))
  console.log()

  const checkmark = (val) => val ? GREEN('✓') : YELLOW('○')

  console.log(`  ${checkmark(env.DATABASE_URL)}  Database URL`)
  console.log(`  ${checkmark(env.NEXTAUTH_SECRET)}  NextAuth Secret      ${DIM('(auto-generated)')}`)
  console.log(`  ${checkmark(env.TOKEN_ENCRYPTION_KEY)}  Encryption Key       ${DIM('(auto-generated)')}`)
  console.log(`  ${checkmark(env.GEMINI_API_KEY)}  Gemini API Key       ${env.GEMINI_API_KEY ? DIM('AI features enabled') : DIM('skipped — AI features limited')}`)
  console.log(`  ${checkmark(env.YOUTUBE_API_KEY)}  YouTube API Key      ${env.YOUTUBE_API_KEY ? DIM('Trends enabled') : DIM('skipped — Trends limited')}`)
  console.log(`  ${checkmark(env.META_APP_ID)}  Meta App ID          ${env.META_APP_ID ? DIM('Instagram enabled') : DIM('skipped — needs App Review')}`)
  console.log()

  // ─── Next steps ─────────────────────────────────────────────────────
  separator()
  console.log()
  console.log(BOLD('  Next Steps'))
  console.log()
  console.log(`  ${CYAN('1')}  Run database migrations:`)
  console.log(`     ${BOLD('npx prisma migrate dev --name init')}`)
  console.log()
  console.log(`  ${CYAN('2')}  Start the development server:`)
  console.log(`     ${BOLD('npm run dev')}`)
  console.log()
  console.log(`  ${CYAN('3')}  Open in browser:`)
  console.log(`     ${BOLD(env.NEXTAUTH_URL)}`)
  console.log()

  const runNow = await ask('  Run migrations and start the server now? (Y/n): ')
  if (runNow.toLowerCase() !== 'n') {
    console.log()
    console.log(`  ${CYAN('→')} Running: npx prisma generate`)
    try {
      execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname })
    } catch (e) {
      console.log(`  ${RED('!')} prisma generate failed — check your DATABASE_URL`)
    }

    console.log()
    console.log(`  ${CYAN('→')} Running: npx prisma migrate dev --name init`)
    try {
      execSync('npx prisma migrate dev --name init', { stdio: 'inherit', cwd: __dirname })
      console.log(`  ${GREEN('✓')} Migrations complete`)
    } catch (e) {
      console.log(`  ${RED('!')} Migration failed — check your DATABASE_URL in .env`)
      console.log(`  ${DIM('  You can retry with: npx prisma migrate dev --name init')}`)
    }

    console.log()
    console.log(`  ${CYAN('→')} Starting: npm run dev`)
    console.log()
    console.log(BOLD(GREEN('  SIGNAL is starting...')))
    console.log(`  ${DIM('  Open: ' + env.NEXTAUTH_URL)}`)
    console.log()
    rl.close()
    try {
      execSync('npm run dev', { stdio: 'inherit', cwd: __dirname })
    } catch {
      // Dev server exits when user stops it
    }
  } else {
    console.log()
    console.log(BOLD(GREEN('  Setup complete!')))
    console.log()
    rl.close()
  }
}

main().catch(err => {
  console.error(RED('\n  Error: ' + err.message))
  process.exit(1)
})
