# Pregnancy Research Intervention Web App -- Technical Blueprint

## Key Technical Decisions

### Token Policy

Permanent token per participant that can be revoked and regenerated.
Implementation: - Token appears only in first URL entry - Server
exchanges token for an httpOnly session cookie - Subsequent requests use
session cookie instead of token

### Link Sharing Mitigation

Light mitigation: - 32+ byte random token - rate limiting on token
endpoint - session cookie authentication - admin ability to
revoke/regenerate tokens

### Pregnancy Week Calculation

Use floor logic for week calculation.

week = floor(days_since_LMP / 7) + 1

Display: "You are in week X".

### Onboarding Data Input

Preferred: - Expected Due Date (EDD)

Optional future support: - pregnancy week + day at registration

### Activity Completion

Recommended v1 rule: - activity_started: when activity screen opens -
activity_completed: when user presses "Mark completed"

---

# Recommended Tech Stack

Frontend + Backend: - Next.js (App Router) - React - Mobile‑first
responsive UI

Database: - PostgreSQL

ORM: - Prisma

Hosting: - Vercel or Render

File hosting (images/audio): - external URLs (S3 / Supabase storage /
CDN)

---

# Core User Flow

## Entry

GET /t/`<token>`{=html}

Process: 1. Validate token 2. Create session cookie 3. Redirect to /app

Token no longer appears in URL after login.

---

# State Based Landing

GET /app

Logic: - If onboarding not completed → /app/onboarding - Else calculate
pregnancy week - Determine next activity not completed - Display current
activity card

---

# Database Model

## participants

Fields: - id (uuid) - status - created_at - last_seen_at -
onboarding_completed_at

Pregnancy data: - edd_date - registration_date -
preg_week_at_registration - preg_day_at_registration

---

## participant_tokens

Fields: - id - participant_id - token_hash - is_active - created_at -
revoked_at - replaced_by_token_id

---

## sessions

Fields: - id - participant_id - created_at - last_seen_at - user_agent -
ip_trunc

---

## activities

Fields: - id - title - type (TEXT / AUDIO) - content_text - audio_url -
image_url - min_week - order_index - is_active

Total activities expected: 100--150

---

## participant_activity

Tracks participant progress.

Fields: - participant_id - activity_id - started_at - completed_at

Unique index: (participant_id, activity_id)

---

## analytics_events

Fields: - id - participant_id - session_id - event_name - activity_id -
week_of_pregnancy - client_ts - server_ts - meta (json)

Event types: - page_open - onboarding_started - onboarding_completed -
activity_opened - activity_completed

---

# Pregnancy Week Calculation

Timezone: Eastern Time (ET)

EDD method:

gestation_days_today = 280 − (EDD − today) week =
floor(gestation_days_today / 7) + 1

Clamp range: 1--42 weeks.

---

# API Endpoints

## Public

GET /t/:token

Exchange token → create session.

---

## Participant API

GET /api/me\
Returns participant status, pregnancy week, next activity.

POST /api/onboarding/start

POST /api/onboarding/complete

POST /api/activities/:id/open

POST /api/activities/:id/complete

---

## Admin API

POST /api/admin/participants Create participant + generate link

POST /api/admin/participants/:id/disable-link

POST /api/admin/participants/:id/regenerate-link

GET /api/admin/participants

GET /api/admin/participants/:id

GET /api/admin/exports/events.csv

GET /api/admin/exports/progress.csv

POST /api/admin/activities/bulk-import

---

# UI Screens

## Participant

/app\

- pregnancy week display - current activity card - completed indicator

/app/onboarding\

- EDD input

/app/activity/:id\

- text view or audio player - complete button

---

## Admin

/admin/login

/admin/participants

/admin/participants/:id

/admin/activities

/admin/exports

---

# Analytics Strategy

Events stored internally in database.

Export via CSV.

Captured events: - page_open - onboarding_started -
onboarding_completed - activity_opened - activity_completed

---

# Implementation Roadmap

## Milestone 1 -- Foundation

- Next.js project
- Prisma + Postgres
- responsive layout
- activity seed import

## Milestone 2 -- Token access

- token hashing
- exchange route
- session cookie
- admin participant creation

## Milestone 3 -- Onboarding

- onboarding form
- pregnancy week calculation

## Milestone 4 -- Activities

- activity routing
- activity screen
- progress tracking

## Milestone 5 -- Analytics

- event logging
- CSV export
- participant timeline

## Milestone 6 -- Hardening

- HTTPS enforcement
- rate limiting
- database backups
