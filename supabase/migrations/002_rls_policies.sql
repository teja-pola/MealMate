-- RLS Policies for MealMate Application

-- Before applying new policies, it's good practice to ensure RLS is enabled.
-- This was done in the previous schema migration, but re-affirming for clarity.
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. `users` Table Policies
-----------------------------
-- Policy 1.1: Allow individual users to read their own profile data.
CREATE POLICY "Users: Allow individual read access to own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Policy 1.2: Allow individual users to update their own profile data.
CREATE POLICY "Users: Allow individual update to own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 1.3: Allow admin full access to users table.
CREATE POLICY "Users: Allow admin full access"
ON public.users FOR ALL
USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 2. `providers` Table Policies
-------------------------------
-- Policy 2.1: Allow public read access to verified providers.
CREATE POLICY "Providers: Allow public read access to verified"
ON public.providers FOR SELECT
USING (is_verified = TRUE);

-- Policy 2.2: Allow providers to read their own provider entry (verified or not).
CREATE POLICY "Providers: Allow providers to read their own entry"
ON public.providers FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2.3: Allow users with 'provider' role to insert their own provider entry.
CREATE POLICY "Providers: Allow 'provider' role to insert own entry"
ON public.providers FOR INSERT
WITH CHECK (auth.uid() = user_id AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider');

-- Policy 2.4: Allow providers to update their own provider entry.
CREATE POLICY "Providers: Allow providers to update own entry"
ON public.providers FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 2.5: Allow providers to delete their own provider entry.
CREATE POLICY "Providers: Allow providers to delete own entry"
ON public.providers FOR DELETE
USING (auth.uid() = user_id);

-- Policy 2.6: Allow admin full access to providers table.
CREATE POLICY "Providers: Allow admin full access"
ON public.providers FOR ALL
USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 3. `meal_plans` Table Policies
---------------------------------
-- Policy 3.1: Allow public read access to active meal plans from verified providers.
CREATE POLICY "MealPlans: Public read for active plans from verified providers"
ON public.meal_plans FOR SELECT
USING (
  is_active = TRUE AND
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.provider_id = meal_plans.provider_id AND p.is_verified = TRUE
  )
);

-- Policy 3.2: Allow providers to read all their own meal plans.
CREATE POLICY "MealPlans: Providers can read their own meal plans"
ON public.meal_plans FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.provider_id = meal_plans.provider_id AND p.user_id = auth.uid()
  )
);

-- Policy 3.3: Allow providers to insert meal plans for their provider entries.
CREATE POLICY "MealPlans: Providers can insert for their own provider entries"
ON public.meal_plans FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.provider_id = meal_plans.provider_id AND p.user_id = auth.uid()
  )
);

-- Policy 3.4: Allow providers to update their own meal plans.
CREATE POLICY "MealPlans: Providers can update their own meal plans"
ON public.meal_plans FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.provider_id = meal_plans.provider_id AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.provider_id = meal_plans.provider_id AND p.user_id = auth.uid()
  )
);

-- Policy 3.5: Allow providers to delete their own meal plans.
CREATE POLICY "MealPlans: Providers can delete their own meal plans"
ON public.meal_plans FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.provider_id = meal_plans.provider_id AND p.user_id = auth.uid()
  )
);

-- Policy 3.6: Allow admin full access to meal_plans table.
CREATE POLICY "MealPlans: Allow admin full access"
ON public.meal_plans FOR ALL
USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 4. `subscriptions` Table Policies
------------------------------------
-- Policy 4.1: Allow users to read their own subscriptions.
CREATE POLICY "Subscriptions: Users can read their own"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Policy 4.2: Allow providers to read subscriptions to their meal plans.
CREATE POLICY "Subscriptions: Providers can read for their meal plans"
ON public.subscriptions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meal_plans mp
    JOIN public.providers p ON mp.provider_id = p.provider_id
    WHERE mp.meal_plan_id = subscriptions.meal_plan_id AND p.user_id = auth.uid()
  )
);

-- Policy 4.3: Allow users to update limited fields of their own subscriptions.
-- (e.g., delivery preference, status to 'cancelled').
-- This is a broad update for now; specific column checks can be added if needed.
CREATE POLICY "Subscriptions: Users can update own limited fields"
ON public.subscriptions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Note on Inserts: Subscription inserts are expected to be handled by backend functions.
-- No general client-side insert policy for users is provided.

-- Policy 4.4: Allow admin full access to subscriptions table.
CREATE POLICY "Subscriptions: Allow admin full access"
ON public.subscriptions FOR ALL
USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- 5. `reviews` Table Policies
------------------------------
-- Policy 5.1: Allow public read access to reviews for verified providers.
CREATE POLICY "Reviews: Public read for verified providers"
ON public.reviews FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.providers p
    WHERE p.provider_id = reviews.provider_id AND p.is_verified = TRUE
  )
);

-- Policy 5.2: Allow authenticated users to insert a review for a provider.
-- (Constrained by UNIQUE(user_id, provider_id) in table schema).
CREATE POLICY "Reviews: Authenticated users can insert"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 5.3: Allow users to update their own review.
CREATE POLICY "Reviews: Users can update their own"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 5.4: Allow users to delete their own review.
CREATE POLICY "Reviews: Users can delete their own"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id);

-- Policy 5.5: Allow admin full access to reviews table.
CREATE POLICY "Reviews: Allow admin full access"
ON public.reviews FOR ALL
USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- End of RLS Policies
-- Note: The order of policy creation generally doesn't strictly matter for Supabase's evaluation
-- as permissive policies are combined. However, for FOR ALL policies like admin access,
-- they act as a broad permission grant. If an admin also has a user profile they edit,
-- the specific "Users: Allow individual update to own profile" would combine with the admin
-- policy. The WITH CHECK conditions are crucial for write operations.
-- All policies assume 'public.users' has an 'id' (UUID linked to auth.uid()) and a 'role' (TEXT) column.
