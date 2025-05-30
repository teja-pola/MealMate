# MealMate Backend Documentation

Welcome to the backend documentation for MealMate, a platform connecting users with meal providers.

This backend is built using [Supabase](https://supabase.io/) and integrates with [Stripe](https://stripe.com/) for payment processing. Key Supabase features utilized include:
- **PostgreSQL Database:** For storing all application data.
- **Supabase Auth:** For user authentication and management.
- **Supabase Edge Functions:** For serverless backend logic, including Stripe integration and custom business operations.

This document provides a high-level overview. For more detailed information, please refer to the following sections:

- **[Database Schema & Policies](./docs/database.md):** Detailed information about database tables, columns, relationships, Row Level Security (RLS) policies, and triggers.
- **[Edge Functions](./docs/edge-functions.md):** Comprehensive documentation for each serverless function, including purpose, endpoints, request/response details, and environment variables.
- **[Setup and Configuration Guide](./docs/setup.md):** Instructions for setting up the Supabase project, managing environment variables, and configuring Stripe.

## Project Structure (Backend Relevant)

```
.
├── supabase/
│   ├── functions/                # Supabase Edge Functions
│   │   ├── create-checkout-session/
│   │   │   └── index.ts
│   │   ├── stripe-webhook-handler/
│   │   │   └── index.ts
│   │   └── list-property/
│   │       └── index.ts
│   ├── migrations/               # Database schema migrations
│   │   ├── 001_initial_schema.sql
│   │   └── 002_rls_policies.sql
│   └── config.toml               # Supabase project configuration
├── docs/                         # Documentation files
│   ├── database.md
│   ├── edge-functions.md
│   └── setup.md
└── README.md                     # This file
```

We aim to provide clear and concise documentation to facilitate development and maintenance of the MealMate backend.
