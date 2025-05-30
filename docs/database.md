# Database Documentation

This document details the database schema, Row Level Security (RLS) policies, and triggers for the MealMate application, powered by Supabase PostgreSQL.

## Table of Contents
- [Tables](#tables)
  - [1. `public.users`](#1-publicusers)
  - [2. `public.providers`](#2-publicproviders)
  - [3. `public.meal_plans`](#3-publicmeal_plans)
  - [4. `public.subscriptions`](#4-publicsubscriptions)
  - [5. `public.reviews`](#5-publicreviews)
- [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
- [Database Triggers](#database-triggers)
- [Migrations](#migrations)

## Tables

### 1. `public.users`
- **Purpose:** Stores user profile information, extending the `auth.users` table from Supabase Auth.
- **Columns:**
    | Column           | Data Type     | Constraints                                          | Default Value        | Description                                      |
    |------------------|---------------|------------------------------------------------------|----------------------|--------------------------------------------------|
    | `id`             | `UUID`        | `PRIMARY KEY`, `REFERENCES auth.users(id) ON DELETE CASCADE` (implicitly via AuthContext) |                      | Foreign key to `auth.users.id`.                  |
    | `updated_at`     | `TIMESTAMPTZ` |                                                      | `now()`              | Timestamp of the last update.                    |
    | `email`          | `TEXT`        | `UNIQUE` (implicitly managed by `auth.users`)        |                      | User's email address.                            |
    | `first_name`     | `TEXT`        |                                                      | `NULL`               | User's first name.                               |
    | `last_name`      | `TEXT`        |                                                      | `NULL`               | User's last name.                                |
    | `phone_number`   | `TEXT`        |                                                      | `NULL`               | User's phone number.                             |
    | `address`        | `TEXT`        |                                                      | `NULL`               | User's address (could be JSONB for structure).   |
    | `role`           | `TEXT`        | `NOT NULL`                                           | `'customer'`         | User role (`customer`, `provider`, `admin`).     |
    | `stripe_customer_id`| `TEXT`     | `UNIQUE`                                             | `NULL`               | Stripe Customer ID for payment processing.       |
- **Notes:** The `id` and `email` fields are primarily managed by Supabase Auth. The `AuthContext.tsx` in the frontend handles insertion of user details into this table upon signup.

### 2. `public.providers`
- **Purpose:** Stores information about food providers (hotels, restaurants, PGs).
- **Columns:**
    | Column           | Data Type        | Constraints                               | Default Value        | Description                                       |
    |------------------|------------------|-------------------------------------------|----------------------|---------------------------------------------------|
    | `provider_id`    | `UUID`           | `PRIMARY KEY`                             | `gen_random_uuid()`  | Unique identifier for the provider.               |
    | `user_id`        | `UUID`           | `REFERENCES public.users(id) ON DELETE SET NULL` | `NULL`            | Links to the user who owns/manages this provider. |
    | `name`           | `TEXT`           | `NOT NULL`                                |                      | Name of the provider establishment.               |
    | `address`        | `TEXT`           | `NOT NULL`                                |                      | Physical address of the provider.                 |
    | `latitude`       | `DOUBLE PRECISION`|                                           | `NULL`               | Geographical latitude.                            |
    | `longitude`      | `DOUBLE PRECISION`|                                           | `NULL`               | Geographical longitude.                           |
    | `phone_contact`  | `TEXT`           |                                           | `NULL`               | Contact phone number for the provider.            |
    | `email_contact`  | `TEXT`           | `UNIQUE`                                  | `NULL`               | Contact email for the provider.                   |
    | `description`    | `TEXT`           |                                           | `NULL`               | Detailed description of the provider.             |
    | `is_verified`    | `BOOLEAN`        |                                           | `FALSE`              | Whether the provider has been verified by admin.  |
    | `created_at`     | `TIMESTAMPTZ`    |                                           | `now()`              | Timestamp of creation.                            |
    | `updated_at`     | `TIMESTAMPTZ`    |                                           | `now()`              | Timestamp of the last update.                     |
- **Foreign Keys:**
    - `user_id` references `public.users(id)`.

### 3. `public.meal_plans`
- **Purpose:** Details about meal offerings from providers.
- **Columns:**
    | Column                | Data Type     | Constraints                                          | Default Value        | Description                                                     |
    |-----------------------|---------------|------------------------------------------------------|----------------------|-----------------------------------------------------------------|
    | `meal_plan_id`        | `UUID`        | `PRIMARY KEY`                                        | `gen_random_uuid()`  | Unique identifier for the meal plan.                            |
    | `provider_id`         | `UUID`        | `NOT NULL`, `REFERENCES public.providers(provider_id) ON DELETE CASCADE` |       | Links to the provider offering this meal plan.                |
    | `name`                | `TEXT`        | `NOT NULL`                                           |                      | Name of the meal plan (e.g., "Weekly Veg Lunch").             |
    | `description`         | `TEXT`        |                                                      | `NULL`               | Detailed description of the meal plan.                          |
    | `type`                | `TEXT`        | `CHECK (type IN ('breakfast', 'lunch', 'dinner', 'combo', 'other'))` | `NULL` | Type of meal.                                                 |
    | `dietary_preferences` | `TEXT[]`      |                                                      | `NULL`               | Array of dietary tags (e.g., `{'vegetarian', 'vegan'}`).      |
    | `menu_items`          | `JSONB`       |                                                      | `NULL`               | Example: `[{"item": "Roti", "quantity": 2}, {"item": "Dal"}]` |
    | `price_daily`         | `NUMERIC(10,2)`|                                                      | `NULL`               | Daily price.                                                    |
    | `price_weekly`        | `NUMERIC(10,2)`|                                                      | `NULL`               | Weekly price.                                                   |
    | `price_monthly`       | `NUMERIC(10,2)`|                                                      | `NULL`               | Monthly price (used for subscriptions).                         |
    | `is_trial_available`  | `BOOLEAN`     |                                                      | `FALSE`              | Whether a trial is available.                                   |
    | `is_active`           | `BOOLEAN`     |                                                      | `TRUE`               | Whether the meal plan is currently active and available.        |
    | `created_at`          | `TIMESTAMPTZ` |                                                      | `now()`              | Timestamp of creation.                                          |
    | `updated_at`          | `TIMESTAMPTZ` |                                                      | `now()`              | Timestamp of the last update.                                   |
- **Foreign Keys:**
    - `provider_id` references `public.providers(provider_id)`.

### 4. `public.subscriptions`
- **Purpose:** User subscriptions to meal plans.
- **Columns:**
    | Column                        | Data Type     | Constraints                                          | Default Value        | Description                                                     |
    |-------------------------------|---------------|------------------------------------------------------|----------------------|-----------------------------------------------------------------|
    | `subscription_id`             | `UUID`        | `PRIMARY KEY`                                        | `gen_random_uuid()`  | Unique identifier for the subscription.                         |
    | `user_id`                     | `UUID`        | `NOT NULL`, `REFERENCES public.users(id) ON DELETE CASCADE` |                    | Links to the subscribing user.                                  |
    | `meal_plan_id`                | `UUID`        | `NOT NULL`, `REFERENCES public.meal_plans(meal_plan_id) ON DELETE RESTRICT` | | Links to the subscribed meal plan.                            |
    | `stripe_subscription_id`      | `TEXT`        | `UNIQUE`                                             | `NULL`               | Stripe Subscription ID for managing payments.                   |
    | `start_date`                  | `DATE`        | `NOT NULL`                                           |                      | Date when the subscription starts.                              |
    | `end_date`                    | `DATE`        | `NOT NULL`                                           |                      | Date when the subscription ends or needs renewal.               |
    | `status`                      | `TEXT`        | `NOT NULL`, `CHECK (status IN ('active', 'inactive', 'cancelled', 'trial', 'past_due', 'pending_payment'))` | | Current status of the subscription.                           |
    | `delivery_dine_in_preference` | `TEXT`        | `CHECK (delivery_dine_in_preference IN ('delivery', 'dine_in'))` | `NULL`        | User's preference for this subscription.                        |
    | `delivery_address`            | `TEXT`        |                                                      | `NULL`               | Delivery address if preference is 'delivery'.                   |
    | `created_at`                  | `TIMESTAMPTZ` |                                                      | `now()`              | Timestamp of creation.                                          |
    | `updated_at`                  | `TIMESTAMPTZ` |                                                      | `now()`              | Timestamp of the last update.                                   |
- **Foreign Keys:**
    - `user_id` references `public.users(id)`.
    - `meal_plan_id` references `public.meal_plans(meal_plan_id)`.

### 5. `public.reviews`
- **Purpose:** User reviews and ratings for providers.
- **Columns:**
    | Column        | Data Type     | Constraints                                          | Default Value        | Description                                       |
    |---------------|---------------|------------------------------------------------------|----------------------|---------------------------------------------------|
    | `review_id`   | `UUID`        | `PRIMARY KEY`                                        | `gen_random_uuid()`  | Unique identifier for the review.                 |
    | `user_id`     | `UUID`        | `NOT NULL`, `REFERENCES public.users(id) ON DELETE CASCADE` |                    | Links to the user who wrote the review.           |
    | `provider_id` | `UUID`        | `NOT NULL`, `REFERENCES public.providers(provider_id) ON DELETE CASCADE` | | Links to the provider being reviewed.           |
    | `rating`      | `INT`         | `NOT NULL`, `CHECK (rating >= 1 AND rating <= 5)`    |                      | Rating given by the user (1-5 stars).             |
    | `review_text` | `TEXT`        |                                                      | `NULL`               | Text content of the review.                       |
    | `created_at`  | `TIMESTAMPTZ` |                                                      | `now()`              | Timestamp of creation.                            |
    | `updated_at`  | `TIMESTAMPTZ` |                                                      | `now()`              | Timestamp of the last update.                     |
    |               |               | `CONSTRAINT unique_user_provider_review UNIQUE (user_id, provider_id)` | | Ensures a user can review a provider only once. |
- **Foreign Keys:**
    - `user_id` references `public.users(id)`.
    - `provider_id` references `public.providers(provider_id)`.

## Row Level Security (RLS) Policies

Row Level Security is enabled for all tables listed above (`users`, `providers`, `meal_plans`, `subscriptions`, `reviews`) to ensure that users can only access and modify data they are permitted to.

The general RLS strategy includes:
- Users can manage their own profile data in the `users` table.
- Users with the 'provider' role can manage their provider entries and associated meal plans.
- Users can manage their own subscriptions and reviews.
- Public read access is granted to verified providers and their active meal plans.
- Admins (users with `role = 'admin'` in the `users` table) have full access to all tables.

For detailed policy definitions, please refer to the migration file:
- `supabase/migrations/002_rls_policies.sql`

## Database Triggers

1.  **`public.update_updated_at_column()` Trigger Function:**
    - **Purpose:** This function is designed to automatically update the `updated_at` column of a row to the current timestamp (`now()`) whenever that row is updated.
    - **Application:** It is applied as a `BEFORE UPDATE` trigger to the following tables:
        - `public.users` (Trigger name: `handle_users_update`)
        - `public.providers` (Trigger name: `handle_providers_update`)
        - `public.meal_plans` (Trigger name: `handle_meal_plans_update`)
        - `public.subscriptions` (Trigger name: `handle_subscriptions_update`)
        - `public.reviews` (Trigger name: `handle_reviews_update`)

2.  **Population of `public.users` Table:**
    - Unlike a traditional trigger-based copy from `auth.users`, the `public.users` table is populated directly by the frontend application logic.
    - The `AuthContext.tsx` file contains the `signUp` function, which, after successfully creating a user in `auth.users` via Supabase Auth, inserts relevant details (id, email, first_name, etc.) into the `public.users` table.
    - Default values for `role` ('customer') and `updated_at` (`now()`) are set at the column level in `public.users`.

## Migrations

The database schema and RLS policies are managed through SQL migration files located in the `supabase/migrations/` directory. Apply these migrations in order to set up the database correctly.

- **`001_initial_schema.sql`:** Defines the structure for all tables (`users`, `providers`, `meal_plans`, `subscriptions`, `reviews`), including columns, constraints, default values, and foreign key relationships. It also creates the `update_updated_at_column()` trigger function and applies it to the `users` table.
- **`002_rls_policies.sql`:** Implements all Row Level Security policies for the tables mentioned above, controlling access and modification permissions for different user roles and scenarios.

It is recommended to use the Supabase CLI to manage and apply migrations: `supabase db push` (for local dev, after schema changes) or `supabase migration up` (for linked projects).
