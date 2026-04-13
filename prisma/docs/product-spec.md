HPR Journey — Updated Product & Technical Specification

1. Product Overview

HPR Journey is a mobile-first web application designed for participants in a pregnancy research study.

The app provides:
• Daily breathing exercises
• Weekly audio guidance
• Pregnancy test preparation content
• A doctor request form for sensitive care needs
• Personalized content based on pregnancy week and study timeline

Participants access the app via a personal URL token with no username/password login.

The system also includes an admin area in future phases for:
• Creating participants
• Managing content
• Viewing analytics and logs

⸻

2. Authentication Model

Participants access the app using a personal token URL:

/t/{token}

Token properties:
• Random
• Permanent unless revoked
• Unique per participant link
• Stored hashed in the database
• Creates a participant session cookie

There is no password-based participant login.

⸻

3. Two Independent Timelines

The app operates on two separate time systems.

3.1 Pregnancy Week

Based on:
• gestationalAnchorDate

Used for:
• UI header display
• Test preparation visibility
• Event logging context

Displayed to the user as:
• “You’re in week X”

The user can edit the pregnancy week. Editing the week updates the underlying canonical anchor date.

3.2 Study Week

Based on:
• studyStartedAt

This is set when onboarding is completed.

Study week rules:
• Week 1 starts when onboarding completes
• Study week increments every Friday at 18:00 Boston time

Example:
• Participant finishes onboarding on Monday
• Monday until Friday 17:59 Boston → study week 1
• Friday 18:00 Boston → study week 2
• Next Friday 18:00 Boston → study week 3

Used for:
• Weekly task selection
• Past tasks list
• Event logging context

⸻

4. Home Screen Layout

The home screen contains these sections: 1. Greeting + current pregnancy week 2. Daily breathing cards 3. Current weekly task 4. Test preparations

The home screen should remain focused on current content. Past weekly tasks are not shown there.

⸻

5. Daily Breathing Activities

There are exactly two shared breathing activities for all users:
• Morning breathing
• Evening breathing

These are permanent activities, although an admin should later be able to replace their media.

Completion Rules

A breathing activity is considered completed when either:
• The user presses the completion button
• The user reaches at least 80% media playback

What is tracked

For breathing activities, the system should track:
• Activity started/opened
• Playback started
• Playback reached 80%
• Completion
• Completion method

Completion source values currently used:
• FINISHED_BUTTON
• AUTO_PLAYBACK_END

Daily Reset

Daily breathing completion resets at Boston midnight.

Behavior:
• The UI shows completion only for the current Boston date
• Historical completions remain in the database
• A new completion can be created on the next day

This reset is UI/data-query based and does not delete historical rows.

⸻

6. Weekly Task

Weekly task content is:
• Audio-based
• One task per study week
• Shared across participants by study week number

Example mapping:
• Study week 1 → Task 1
• Study week 2 → Task 2
• Study week 3 → Task 3

Completion Rules

A weekly task is considered completed when either:
• The user presses the completion button
• The user reaches at least 80% playback

Weekly Completion Data

The system stores:
• assignedStudyWeek
• completedStudyWeek
• completionSource
• completedAt

This allows analysis of:
• On-time completion
• Late completion
• Re-completion of past tasks

⸻

7. Past Tasks

Past weekly tasks are accessed from the weekly task activity page via a button.

Behavior:
• Past tasks are not displayed on the home screen
• On a weekly activity page, the user sees a button: View Past Tasks
• That button opens a dedicated past tasks page

The past tasks page shows:
• All previous weekly tasks
• Only tasks with studyWeek < currentStudyWeek
• Sorted from most recent to oldest

The user can:
• Open any past task
• Replay the audio
• Complete the task again

Current product choice:
• Past tasks page shows all previous weeks, not only completed tasks
• No completion indicator is currently required in the list

⸻

8. Test Preparation

Test preparation content is based on pregnancy week.

Rules:
• Some pregnancy weeks have no test preparation content
• Some weeks may have more than one relevant test explanation
• Once the relevant week passes, the content no longer needs to appear in the main current flow

A test preparation activity can contain:
• Title
• Text
• Optional audio

The doctor request form should be accessible from the relevant test flow.

⸻

9. Doctor Request Form

Purpose

The doctor request form allows a participant to create a trauma-informed care request related to prior sexual assault.

It is intended to generate a doctor-facing summary of care preferences.

Fields

Current fields:
• Explain before touching
• Avoid touching sensitive areas
• Prefer female clinician
• Allow support person
• Additional notes

Behavior
• First open: empty form
• Later open: loads previously saved values
• One saved form per participant
• The user can save and edit later
• Save redirects to a printable doctor-facing version

Storage

Stored on the Participant model as:
• doctorFormJson

Form Actions

Doctor form page actions:
• Save
• Preview

Printable page actions:
• Edit
• Print
• Save PDF
• Share PDF

⸻

10. Printable Doctor Request Page

A doctor-facing printable page is generated from the saved doctor form.

Purpose

To provide a clean summary that can be:
• Printed
• Saved as PDF
• Shared as a PDF file

Content

Includes:
• Patient care request title
• Selected preferences
• Additional notes if present
• Generated date
• Closing thank-you sentence

Buttons on Printable Page

Bottom action row:
• Edit
• Print
• Save PDF
• Share PDF

Print

Uses a client-side print button that triggers window.print().

Save PDF

Uses client-side PDF generation.

Share PDF

Should share the generated PDF file, not the app link.

Desired behavior:
• On supported mobile browsers/devices, use native file sharing
• On unsupported environments, fall back to download

⸻

11. Media Handling

Activities may include:
• Image
• Audio
• Video
• Text

Currently media is stored as URLs/paths and served from the app.

Typical development pattern:
• Files in public/audio, public/video, etc.
• Database stores the relative URL

Future phase:
• Admin upload flow
• Dedicated media storage provider

Expected scale at initial production:
• 20–30 weekly audio files
• ~20 test-related audio files
• ~4 videos

⸻

12. Event Logging

The system records user actions for research tracking.

Purpose

To support:
• Research analytics
• Adherence tracking
• Completion analysis
• Funnel/drop-off analysis
• Doctor form engagement analysis

EventLog Model

Current model:

model EventLog {
id String @id @default(uuid())
participantId String
activityId String?

eventType EventType
pregnancyWeek Int?
occurredAt DateTime @default(now())

metadata Json?

participant Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)
activity Activity? @relation(fields: [activityId], references: [id], onDelete: SetNull)

@@index([participantId])
@@index([activityId])
@@index([eventType])
@@index([occurredAt])
}

Final EventType Enum

enum EventType {
PAGE_OPEN
ONBOARDING_STARTED
ONBOARDING_COMPLETED

ACTIVITY_STARTED
ACTIVITY_COMPLETED
PLAYBACK_STARTED
PLAYBACK_80

TEST_PREP_VIEWED

PAST_TASKS_VIEWED
PAST_TASK_OPENED

PREGNANCY_WEEK_EDITED

DOCTOR_FORM_VIEWED
DOCTOR_FORM_PREVIEWED
DOCTOR_FORM_SAVED
DOCTOR_FORM_EDITED
DOCTOR_FORM_PRINTED
DOCTOR_FORM_PDF_SAVED
DOCTOR_FORM_PDF_SHARED
}

Event Data Collected Per Event

Each event includes:
• Internal participant identifier
• Event time
• Event type
• Activity identifier when relevant
• Pregnancy week

Additional context is stored in metadata, for example:
• Completion source
• Study week
• Boston timestamp string
• UTC timestamp string

Current Event Intent

The system should track these user actions:
• PAGE_OPEN
• ONBOARDING_STARTED
• ONBOARDING_COMPLETED
• ACTIVITY_STARTED
• ACTIVITY_COMPLETED
• PLAYBACK_STARTED
• PLAYBACK_80
• TEST_PREP_VIEWED
• PAST_TASKS_VIEWED
• PAST_TASK_OPENED
• PREGNANCY_WEEK_EDITED
• DOCTOR_FORM_VIEWED
• DOCTOR_FORM_PREVIEWED
• DOCTOR_FORM_SAVED
• DOCTOR_FORM_EDITED
• DOCTOR_FORM_PRINTED
• DOCTOR_FORM_PDF_SAVED
• DOCTOR_FORM_PDF_SHARED

⸻

13. Logging Rules by Feature

Home / General
• PAGE_OPEN when a major page is opened

Onboarding
• ONBOARDING_STARTED when onboarding begins
• ONBOARDING_COMPLETED when onboarding is successfully saved

Activities
• ACTIVITY_STARTED when an activity page is opened
• ACTIVITY_COMPLETED when completion is recorded
• PLAYBACK_STARTED when audio/video begins
• PLAYBACK_80 when playback reaches 80%

Test Prep
• TEST_PREP_VIEWED when a test preparation activity is opened

Past Tasks
• PAST_TASKS_VIEWED when the past tasks page is opened
• PAST_TASK_OPENED when a past weekly task is opened

Pregnancy Week Editing
• PREGNANCY_WEEK_EDITED when participant changes pregnancy week manually

Doctor Form
• DOCTOR_FORM_VIEWED when doctor form page is opened
• DOCTOR_FORM_PREVIEWED when printable page is opened
• DOCTOR_FORM_SAVED on first save
• DOCTOR_FORM_EDITED on later save/update
• DOCTOR_FORM_PRINTED when print action is triggered
• DOCTOR_FORM_PDF_SAVED when PDF file is downloaded/saved
• DOCTOR_FORM_PDF_SHARED when PDF file is shared

⸻

14. Core Database Models

Participant

Stores:
• Pregnancy timing data
• Study timing data
• Doctor form JSON
• Sessions and tokens

Important fields include:
• gestationalAnchorDate
• onboardingCompletedAt
• studyStartedAt
• doctorFormJson

Activity

Represents content items of type:
• BREATHING
• WEEKLY
• TEST_PREP

Important fields include:
• title
• subtitle
• contentText
• audioUrl
• videoUrl
• imageUrl
• breathingSlot
• studyWeek
• minPregnancyWeek
• maxPregnancyWeek
• isActive
• orderIndex

ActivityProgress

Tracks participant interaction/completion with activities.

Important fields include:
• participantId
• activityId
• progressDate
• pregnancyWeek
• assignedStudyWeek
• completedStudyWeek
• startedAt
• completedAt
• completionSource

EventLog

Stores research event tracking rows.

⸻

15. User Flows

Primary Participant Flow 1. Participant opens personal token link 2. Session is created 3. Participant completes onboarding 4. studyStartedAt is set 5. Home screen is shown 6. Participant uses breathing / weekly / test content 7. Participant may create doctor request form 8. Participant may preview, print, save PDF, or share PDF

Weekly Task Flow 1. Home screen shows current weekly task 2. User opens weekly task 3. User can complete it by button or 80% playback 4. User can access past tasks from weekly task page 5. Past tasks page lists all earlier weekly tasks

Doctor Form Flow 1. User opens doctor form 2. Completes preferences and notes 3. Saves form 4. Redirects to printable page 5. Can Edit / Print / Save PDF / Share PDF
