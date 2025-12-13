# App Requirements

## UI Description

### Style Inspiration

- RTutor.ai
- Julius.ai
- DeepNote

### Layout

#### Input Panel

Left side, text area where user enters a prompt. Allow for multiple languages (e.g., English, Spanish).

#### Output Panel

Right side, shows AI-generated output.

#### Header

Clean header with branding and optional login/logout button.

#### Footer

Basic footer with contact/info (optional).

### Device Responsiveness

Should work on desktop and mobile (basic responsiveness).

### Theme

Simple, clean UI (light/dark mode), professional but minimal.

## User Flow

### Step 1: Landing

User lands on homepage and sees two-panel interface (input/output).

### Step 2: First Interaction

User enters prompt and submits request.

### Step 3: Limited Access

Up to 2 responses are allowed before login is required.

### Step 4: Authentication Prompt

On 3rd request, user is shown a Firebase-powered login modal.

### Step 5: Authenticated Access

After login, user may continue using app with expanded limits.

### Step 6: Backend Validation

Each request is routed through a GCP Cloud Function backend that checks Firebase ID token.

## Stretch Goals

### 1. History Tab

Add history tab to show previous inputs/outputs per user.

### 2. Rate Limiting / Usage Quotas

Add rate limiting / usage quotas to encourage upgrade.

### 3. User Profiles

Store user profiles and preferences in Firestore.

### 4. Share/Export Functionality

Add share/export output functionality (e.g., copy to clipboard or download).

### 5. UI Polish

Loading animations, error messages, etc.
