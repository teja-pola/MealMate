-- Step 1 & 2: Modify existing users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' NOT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Comment to explain the table's purpose (assuming it might not have one)
COMMENT ON TABLE public.users IS 'Stores user profile information, extending auth.users.';

-- Enable RLS for users table if not already (good practice)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 7: Create Triggers for updated_at Columns (part 1 - function)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER handle_users_update
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 3: Create providers Table
CREATE TABLE IF NOT EXISTS public.providers (
    provider_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone_contact TEXT,
    email_contact TEXT UNIQUE,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.providers IS 'Stores information about food providers (hotels, restaurants, PGs).';
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER handle_providers_update BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 4: Create meal_plans Table
CREATE TABLE IF NOT EXISTS public.meal_plans (
    meal_plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.providers(provider_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('breakfast', 'lunch', 'dinner', 'combo', 'other')),
    dietary_preferences TEXT[], -- Array of strings like {'vegetarian', 'vegan', 'gluten-free'}
    menu_items JSONB, -- Example: [{"item": "Roti", "quantity": 2}, {"item": "Dal Makhani", "notes": "Spicy"}]
    price_daily NUMERIC(10, 2),
    price_weekly NUMERIC(10, 2),
    price_monthly NUMERIC(10, 2),
    is_trial_available BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.meal_plans IS 'Details about meal offerings from providers.';
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER handle_meal_plans_update BEFORE UPDATE ON public.meal_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 5: Create subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(meal_plan_id) ON DELETE RESTRICT, -- Prevent deleting meal plan if active subs exist
    stripe_subscription_id TEXT UNIQUE, -- From Stripe, essential for webhook mapping
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled', 'trial', 'past_due', 'pending_payment')),
    delivery_dine_in_preference TEXT CHECK (delivery_dine_in_preference IN ('delivery', 'dine_in')),
    delivery_address TEXT, -- Relevant if preference is 'delivery'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE public.subscriptions IS 'User subscriptions to meal plans.';
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER handle_subscriptions_update BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 6: Create reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.providers(provider_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_provider_review UNIQUE (user_id, provider_id)
);
COMMENT ON TABLE public.reviews IS 'User reviews and ratings for providers.';
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER handle_reviews_update BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Note: The handle_new_user function and its trigger are NOT created because we are modifying an existing 'users' table
-- which is already populated by the application's signUp process.
-- The existing signUp process in AuthContext.tsx already handles inserting the id and email.
-- Other fields (first_name, last_name, etc.) are also inserted by AuthContext.tsx.
-- The 'role' and 'updated_at' columns have default values specified.
-- If the 'users' table was 'profiles' and linked to 'auth.users' via a trigger,
-- then 'handle_new_user' would be relevant for copying 'id' and 'email'.
-- However, in this case, 'users' IS the profile table.

-- Final check on RLS for all tables:
-- public.users: ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; (done above)
-- public.providers: ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY; (done above)
-- public.meal_plans: ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY; (done above)
-- public.subscriptions: ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY; (done above)
-- public.reviews: ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY; (done above)

-- All necessary fields from AuthContext.tsx (id, email, first_name, last_name, phone_number, address)
-- are assumed to be present in the 'users' table as per the AuthContext.tsx logic.
-- The SQL adds 'role' and 'updated_at'.
-- The 'id' column is confirmed as UUID and PK via AuthContext.tsx usage (references session.user.id).
-- The 'email' column is confirmed as TEXT and UNIQUE (implicitly by auth.users.email unique constraint).
-- The 'updated_at' trigger is applied to all tables.
-- Foreign keys reference public.users(id).
-- All tables have RLS enabled.
-- All comments are added.
-- All CHECK constraints and DEFAULT values are set.
-- The schema should now be complete based on the requirements.
