import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@11.16.0"; // Use a specific version

console.log("create-checkout-session function invoked");

// Required Environment Variables:
// - SUPABASE_URL: Your Supabase project URL
// - SUPABASE_SERVICE_ROLE_KEY: For admin-level access to DB
// - STRIPE_SECRET_KEY: Your Stripe secret key
// - SITE_URL: Your application's base URL for success/cancel redirects

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16", // Use the latest API version
  httpClient: Stripe.createFetchHttpClient(), // Recommended for Deno
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    } });
  }

  try {
    const { meal_plan_id } = await req.json();
    console.log(`Received request for meal_plan_id: ${meal_plan_id}`);

    if (!meal_plan_id) {
      return new Response(JSON.stringify({ error: "meal_plan_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 1. Initialize Supabase Client (using service role for necessary operations)
    const supabaseAdminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 2. Authenticate user using JWT from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(token);

    if (userError || !user) {
      console.error("User authentication error:", userError);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    const userId = user.id;
    console.log(`User authenticated: ${userId}`);

    // 3. Fetch meal_plan details
    const { data: mealPlan, error: mealPlanError } = await supabaseAdminClient
      .from("meal_plans")
      .select("name, price_monthly, provider_id") // Assuming price_monthly exists
      .eq("meal_plan_id", meal_plan_id)
      .single();

    if (mealPlanError || !mealPlan) {
      console.error("Meal plan fetch error:", mealPlanError);
      return new Response(JSON.stringify({ error: "Meal plan not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    console.log(`Meal plan fetched: ${mealPlan.name}`);

    if (typeof mealPlan.price_monthly !== 'number' || mealPlan.price_monthly <= 0) {
        return new Response(JSON.stringify({ error: "Invalid meal plan price" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
    }

    // 4. Fetch user details (e.g., email, stripe_customer_id)
    const { data: userData, error: userDataError } = await supabaseAdminClient
      .from("users") // Assuming your user details table is 'users'
      .select("email, stripe_customer_id")
      .eq("id", userId)
      .single();

    if (userDataError || !userData) {
      console.error("User data fetch error:", userDataError);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    console.log(`User data fetched for: ${userData.email}`);

    // 5. Retrieve or create Stripe Customer
    let stripeCustomerId = userData.stripe_customer_id;
    if (!stripeCustomerId) {
      console.log(`No Stripe customer ID for user ${userId}, creating new one.`);
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: { supabase_user_id: userId },
      });
      stripeCustomerId = customer.id;
      console.log(`Stripe customer created: ${stripeCustomerId}`);

      // Store new stripe_customer_id in your users table
      const { error: updateError } = await supabaseAdminClient
        .from("users")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user with Stripe customer ID:", updateError);
        // Non-critical for this transaction, but log it.
      }
    } else {
      console.log(`Using existing Stripe customer ID: ${stripeCustomerId}`);
    }

    // 6. Create Stripe Checkout Session
    const siteUrl = Deno.env.get("SITE_URL")!;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "usd", // Or your preferred currency e.g. "inr"
            product_data: {
              name: mealPlan.name,
              images: [], // Optional: Add meal plan image URLs if available
            },
            unit_amount: Math.round(mealPlan.price_monthly * 100), // Price in smallest currency unit (e.g., cents)
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout-cancelled`, // Consider a more specific cancel page
      metadata: {
        supabase_user_id: userId,
        meal_plan_id: meal_plan_id,
        // You can add other relevant metadata here
      },
      // billing_address_collection: 'required', // If you need billing address
      // automatic_tax: { enabled: true }, // If using Stripe Tax
    });
    console.log(`Stripe checkout session created: ${session.id}`);

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});

/*
Deployment command (run in terminal from the project root):
supabase functions deploy create-checkout-session --no-verify-jwt

Ensure Environment Variables are set in Supabase project settings:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- SITE_URL
*/
`
