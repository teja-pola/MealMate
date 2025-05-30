# Backend Setup and Configuration Guide

This guide provides instructions for setting up the MealMate backend environment, including Supabase project configuration, environment variable management, and Stripe integration.

## Table of Contents
- [Supabase Project Setup](#supabase-project-setup)
  - [Prerequisites](#prerequisites)
  - [Linking to Supabase Project](#linking-to-supabase-project)
  - [Database Migrations](#database-migrations)
  - [Local Development & Supabase Studio](#local-development--supabase-studio)
- [Environment Variables](#environment-variables)
  - [Consolidated List](#consolidated-list)
  - [Setting Environment Variables](#setting-environment-variables)
- [Stripe Configuration](#stripe-configuration)
  - [Obtaining API Keys](#obtaining-api-keys)
  - [Webhook Setup](#webhook-setup)

## Supabase Project Setup

### Prerequisites
- A Supabase account ([signup here](https://supabase.com/dashboard)).
- Supabase CLI installed locally. ([Installation Guide](https://supabase.com/docs/guides/cli/getting-started)).
- Git installed locally.
- Node.js and npm (or yarn/pnpm) for frontend development (if applicable, but good for context).

### Linking to Supabase Project
1.  **Login to Supabase CLI:**
    ```bash
    supabase login
    ```
    This will open a browser window for you to authenticate.

2.  **Navigate to your project directory:**
    ```bash
    cd path/to/your/mealmate-project
    ```

3.  **Link your local project to your Supabase project:**
    If you haven't initialized Supabase locally yet (e.g., cloned from a repo that already has the `supabase` directory):
    ```bash
    supabase init
    # This creates the ./supabase directory.
    ```
    Then, link:
    ```bash
    supabase link --project-ref <your-project-id>
    ```
    You can find `<your-project-id>` in your Supabase project's dashboard URL (e.g., `https://supabase.com/dashboard/project/<your-project-id>`).
    This command will also create a `supabase/.temp/project-ref` file.

### Database Migrations
The database schema and RLS policies are managed via SQL migration files located in `supabase/migrations/`.

- **Applying Migrations:**
    - **For a new Supabase project (after linking):**
      You'll need to manually run the SQL from `001_initial_schema.sql` and then `002_rls_policies.sql` in the Supabase SQL Editor to set up your remote database schema for the first time if you are not using `supabase db push` for a fresh project.
    - **For local development (Supabase local dev services):**
      When you start your local Supabase stack (`supabase start`), migrations in `supabase/migrations` are typically applied automatically.
    - **Pushing schema changes from local to remote (use with caution, especially on production):**
      If you've made schema changes locally (e.g., using Supabase Studio with local dev services, or by creating new migration files), you can push these to your linked Supabase project:
      ```bash
      supabase db push
      ```
      **Warning:** `db push` is powerful and can lead to data loss if not used carefully. It's generally for prototyping or early development. For production, prefer creating and managing discrete migration files.
    - **Creating new migrations:**
      If you make schema changes directly on your remote Supabase project (e.g., via the Dashboard SQL Editor), you can pull these changes down as a new migration file:
      ```bash
      supabase db remote commit -m "Descriptive name for your migration"
      ```
      Or, if you modify your local schema (e.g., via `supabase/seed.sql` or by editing a local DB directly) and want to create a new migration from these changes:
      ```bash
      supabase db diff -f name_of_new_migration_file
      ```

### Local Development & Supabase Studio
- **Start local development services:**
  ```bash
  supabase start
  ```
  This spins up local instances of Supabase services (Postgres, Auth, Storage, Edge Functions). It will output local Supabase URLs and keys.
- **Access Supabase Studio locally:**
  Once services are running, you can usually access a local version of Supabase Studio at `http://localhost:54323` (or the port shown in `supabase start` output).

## Environment Variables

### Consolidated List
These are the backend-related environment variables required by the MealMate application, primarily for Edge Functions:

- **`SUPABASE_URL`**: Your Supabase project's public URL.
- **`SUPABASE_ANON_KEY`**: Your Supabase project's public anonymous key (used by frontend, sometimes by functions if not using service role).
- **`SUPABASE_SERVICE_ROLE_KEY`**: Your Supabase project's service role key (provides admin-level access, **keep this secret**).
- **`STRIPE_SECRET_KEY`**: Your Stripe secret API key (e.g., `sk_test_...` or `sk_live_...`). **Keep this secret.**
- **`STRIPE_WEBHOOK_SECRET`**: Your Stripe webhook signing secret for the `stripe-webhook-handler` function (e.g., `whsec_...`). **Keep this secret.**
- **`SITE_URL`**: The base URL of your frontend application (e.g., `http://localhost:3000` for local dev, or your production site URL). Used for Stripe Checkout redirects.

### Setting Environment Variables
- **For Supabase Edge Functions (deployed):**
    Set these in your Supabase project dashboard:
    1.  Go to `Project Settings` -> `Edge Functions`.
    2.  Add each variable as a new secret. These are injected into your deployed functions at runtime.
- **For Local Development (Supabase CLI):**
    When you run `supabase start`, the CLI uses the Supabase URL and keys specific to the local services.
    For custom variables like Stripe keys used by functions during local testing (`supabase functions serve`):
    1.  Create a file `supabase/.env.local`.
    2.  Add your variables to this file (e.g., `STRIPE_SECRET_KEY=sk_test_...`). This file is gitignored by default.
    When using `supabase functions serve <function-name> --env-file ./supabase/.env.local`, it will load these variables.

## Stripe Configuration

### Obtaining API Keys
1.  Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2.  Navigate to `Developers` -> `API keys`.
3.  You will find your **Publishable key** (e.g., `pk_test_...`) and **Secret key** (e.g., `sk_test_...`).
    - Use `sk_test_...` for `STRIPE_SECRET_KEY` during development/testing.
    - Use `sk_live_...` for `STRIPE_SECRET_KEY` in production (ensure your Supabase project also has live keys).
    - The publishable key is used on the frontend when integrating with Stripe.js.

### Webhook Setup
The `stripe-webhook-handler` Edge Function needs to be registered as a webhook endpoint in Stripe.

1.  **Deploy `stripe-webhook-handler`:**
    Make sure the function is deployed to your Supabase project:
    ```bash
    supabase functions deploy stripe-webhook-handler --no-verify-jwt
    ```

2.  **Get the Endpoint URL:**
    The URL will be: `<YOUR_SUPABASE_PROJECT_URL>/functions/v1/stripe-webhook-handler`
    Replace `<YOUR_SUPABASE_PROJECT_URL>` with your actual Supabase project URL (e.g., `https://<project-ref>.supabase.co`).

3.  **Configure in Stripe Dashboard:**
    1.  Go to `Developers` -> `Webhooks`.
    2.  Click `+ Add endpoint`.
    3.  **Endpoint URL:** Paste the URL obtained in the previous step.
    4.  **Listen to:** `Events on your account` or `Select events`.
    5.  **Select events to listen to:**
        At a minimum, for the `stripe-webhook-handler` as implemented, you need:
        - `checkout.session.completed`
        - `invoice.payment_succeeded`
        - `invoice.payment_failed`
        - `customer.subscription.updated`
        - `customer.subscription.deleted`
        You can add more specific events as needed.
    6.  Click `Add endpoint`.

4.  **Get Webhook Signing Secret:**
    - After the endpoint is created, Stripe will show a **Signing secret** (e.g., `whsec_...`).
    - Copy this value and set it as the `STRIPE_WEBHOOK_SECRET` environment variable in your Supabase project settings for the Edge Functions.

This setup guide should help you get the MealMate backend operational. Always ensure your API keys and secrets are kept confidential.
