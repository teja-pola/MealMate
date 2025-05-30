# Edge Functions Documentation

This document provides details for the Supabase Edge Functions used in the MealMate backend. Each function is responsible for specific server-side logic, often involving interactions with third-party services like Stripe or privileged database operations.

## General Notes
- **Authentication:** Functions requiring user authentication expect a JWT in the `Authorization: Bearer <token>` header. This token is typically obtained from `supabase.auth.getSession()`.
- **Error Handling:** Functions return appropriate HTTP status codes for errors (e.g., 400 for bad input, 401 for unauthorized, 404 for not found, 500 for server errors).
- **Deployment:** Functions are deployed using the Supabase CLI. Ensure you are logged in (`supabase login`) and have linked your local project (`supabase link --project-ref <your-project-ref>`).
- **CORS:** HTTP-invoked functions include CORS headers (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers`) to allow requests from any origin. For production, you might want to restrict this to your frontend's domain.

## Function Index
1.  [`create-checkout-session`](#1-create-checkout-session)
2.  [`stripe-webhook-handler`](#2-stripe-webhook-handler)
3.  [`list-property`](#3-list-property)

---

## 1. `create-checkout-session`

- **Purpose:** Securely creates a Stripe Checkout session for a user subscribing to a specific meal plan.
- **Endpoint URL:** `/functions/v1/create-checkout-session`
- **Trigger:** HTTP POST
- **Request Details:**
    - **Method:** `POST`
    - **Headers:**
        - `Authorization: Bearer <SUPABASE_USER_JWT>` (Required)
        - `Content-Type: application/json`
    - **Body Schema (JSON):**
      ```json
      {
        "meal_plan_id": "uuid_of_the_meal_plan"
      }
      ```
- **Response Details:**
    - **Success (200 OK):**
      ```json
      {
        "sessionId": "stripe_checkout_session_id"
      }
      ```
    - **Common Errors:**
        - `400 Bad Request`: If `meal_plan_id` is missing or invalid (e.g., plan has no price).
        - `401 Unauthorized`: If the JWT is missing or invalid.
        - `404 Not Found`: If the specified `meal_plan_id` or the authenticated user is not found in the database.
        - `500 Internal Server Error`: For Stripe API errors or other unexpected server issues.
- **Required Environment Variables:**
    - `SUPABASE_URL`: Your Supabase project URL.
    - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for admin-level database operations.
    - `STRIPE_SECRET_KEY`: Your Stripe secret API key.
    - `SITE_URL`: Base URL of your frontend application (used for Stripe success/cancel redirect URLs).
- **Deployment Command:** `supabase functions deploy create-checkout-session --no-verify-jwt`
    *(Note: `--no-verify-jwt` is used because the function manually verifies the JWT using the Supabase client library. If Supabase's built-in JWT verification is preferred for the gateway, this flag can be omitted, but the function's internal auth handling might need adjustment.)*
- **Core Logic Summary:**
    1.  Authenticates the user via JWT.
    2.  Validates the incoming `meal_plan_id`.
    3.  Fetches meal plan details (name, price) from the `meal_plans` table.
    4.  Fetches the user's details (email, existing `stripe_customer_id`) from the `users` table.
    5.  If the user doesn't have a `stripe_customer_id`, creates a new customer in Stripe and updates the `users` table with the new ID.
    6.  Constructs `line_items` for the Stripe Checkout session using the meal plan's price and name.
    7.  Creates a Stripe Checkout Session with `mode: 'subscription'`, setting success and cancel URLs, and including `supabase_user_id` and `meal_plan_id` in metadata.
    8.  Returns the Stripe Checkout session ID to the client.

---

## 2. `stripe-webhook-handler`

- **Purpose:** Handles incoming webhook events from Stripe to update subscription statuses and other relevant data in the Supabase database.
- **Endpoint URL:** `/functions/v1/stripe-webhook-handler`
- **Trigger:** HTTP POST (from Stripe)
- **Request Details:**
    - **Method:** `POST`
    - **Headers:**
        - `Stripe-Signature`: (Required, provided by Stripe for signature verification)
        - `Content-Type: application/json` (Typically, Stripe sends JSON)
    - **Body Schema (JSON):** Varies depending on the Stripe event type. The function parses the raw request body.
- **Response Details:**
    - **Success (200 OK):**
      ```json
      {
        "received": true
      }
      ```
      (This acknowledges receipt of the event to Stripe. Actual processing happens server-side.)
    - **Common Errors:**
        - `400 Bad Request`: If the `Stripe-Signature` is missing or verification fails.
        - `500 Internal Server Error`: If there's an issue processing the event or updating the database (though the function aims to return 200 to Stripe quickly if the error is not related to the event construction itself).
- **Required Environment Variables:**
    - `SUPABASE_URL`: Your Supabase project URL.
    - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (essential for database updates triggered by Stripe).
    - `STRIPE_SECRET_KEY`: Your Stripe secret API key.
    - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret (obtained from Stripe dashboard when configuring the webhook endpoint).
- **Deployment Command:** `supabase functions deploy stripe-webhook-handler --no-verify-jwt`
    *(Note: `--no-verify-jwt` is crucial as this endpoint is called by Stripe, not a Supabase-authenticated user.)*
- **Core Logic Summary:**
    1.  Verifies the incoming event's signature using `stripe.webhooks.constructEventAsync` and the `STRIPE_WEBHOOK_SECRET`.
    2.  Handles a set of relevant Stripe event types using a `switch` statement:
        - **`checkout.session.completed`**: Retrieves `supabase_user_id` and `meal_plan_id` from session metadata. Updates the `users` table with `stripe_customer_id`. Inserts a new record into the `subscriptions` table with details from the Stripe session and subscription objects (start/end dates, status).
        - **`invoice.payment_succeeded`**: Updates the corresponding subscription in `subscriptions` to 'active' and refreshes the `end_date`.
        - **`invoice.payment_failed`**: Updates the subscription status (e.g., to 'past_due').
        - **`customer.subscription.updated`**: Updates subscription status, end date, or plan details in `subscriptions`. Handles cancellations set for period end.
        - **`customer.subscription.deleted`**: Updates subscription status to 'cancelled' in `subscriptions`.
    3.  Returns a 200 OK response to Stripe promptly. Database updates are performed directly.

---

## 3. `list-property`

- **Purpose:** Allows an authenticated user to submit their property details to be listed as a provider. The property is initially unverified.
- **Endpoint URL:** `/functions/v1/list-property`
- **Trigger:** HTTP POST
- **Request Details:**
    - **Method:** `POST`
    - **Headers:**
        - `Authorization: Bearer <SUPABASE_USER_JWT>` (Required)
        - `Content-Type: application/json`
    - **Body Schema (JSON):**
      ```json
      {
        "name": "string",         // Property name
        "address": "string",      // Property address
        "phone_contact": "string",
        "email_contact": "string", // Contact email for the property
        "description": "string"   // Optional
        // "latitude": number,    // Optional
        // "longitude": number    // Optional
      }
      ```
- **Response Details:**
    - **Success (201 Created):**
      ```json
      {
        "success": true,
        "providerId": "new_provider_uuid",
        "message": "Property listed successfully. It will be reviewed by an admin."
      }
      ```
    - **Common Errors:**
        - `400 Bad Request`: If required fields are missing from the request body.
        - `401 Unauthorized`: If the JWT is missing or invalid.
        - `409 Conflict`: If a provider with the same `email_contact` already exists (due to unique constraint).
        - `500 Internal Server Error`: For database errors or other unexpected server issues.
- **Required Environment Variables:**
    - `SUPABASE_URL`: Your Supabase project URL.
    - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for inserting into `providers` and potentially updating `users` role.
- **Deployment Command:** `supabase functions deploy list-property --no-verify-jwt`
    *(Note: Similar to `create-checkout-session`, this function manually verifies the JWT.)*
- **Core Logic Summary:**
    1.  Authenticates the user via JWT.
    2.  Validates the incoming property details.
    3.  Inserts a new record into the `providers` table with the provided details and `is_verified: false`. The `user_id` is set to the authenticated user's ID.
    4.  Attempts to update the user's role in the `public.users` table to 'provider'.
        *(Note: There's a potential RLS dependency here. If the RLS policy for inserting into `providers` requires the user to already *be* a 'provider', this step might need to occur before the insert, or the RLS policy adjusted. The current implementation attempts role update *after* provider insert, which assumes either an admin sets the role first, or the RLS is permissive for the user inserting their own provider record before their role is formally 'provider'.)*
    5.  Returns a success message with the new provider ID.

---
This documentation should provide a good starting point for understanding and working with the MealMate Edge Functions.
For the actual code, refer to the `supabase/functions/<function-name>/index.ts` files.Successfully created the `docs/edge-functions.md` file.

Next, I will create the Setup and Configuration Guide: `docs/setup.md`.
