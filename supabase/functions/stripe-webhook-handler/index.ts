import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@11.16.0"; // Use a specific version

console.log("stripe-webhook-handler function invoked");

// Required Environment Variables:
// - SUPABASE_URL: Your Supabase project URL
// - SUPABASE_SERVICE_ROLE_KEY: Essential for updating DB from webhook
// - STRIPE_SECRET_KEY: Your Stripe secret key (used by Stripe SDK)
// - STRIPE_WEBHOOK_SECRET: Stripe webhook signing secret (for verifying events)

const supabaseAdminClient = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const relevantEvents = new Set([
  'checkout.session.completed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  // 'customer.subscription.trial_will_end', // Example: for trial reminders
]);

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text(); // Raw body needed for verification

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 });
  }

  if (!signature) {
    console.error("Stripe-Signature header missing");
    return new Response(JSON.stringify({ error: "Stripe-Signature header missing" }), { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
    console.log(`Received Stripe event: ${event.type}, ID: ${event.id}`);
  } catch (err) {
    console.error(`Error verifying webhook signature: ${err.message}`);
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
      status: 400,
    });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const { supabase_user_id, meal_plan_id } = session.metadata || {};
          const stripeSubscriptionId = session.subscription as string;
          const stripeCustomerId = session.customer as string;

          if (!supabase_user_id || !meal_plan_id || !stripeSubscriptionId || !stripeCustomerId) {
            console.error("Missing metadata or IDs in checkout.session.completed", session.metadata);
            return new Response(JSON.stringify({ error: "Missing critical data in event." }), { status: 400 });
          }

          console.log(`Processing checkout.session.completed for user ${supabase_user_id}, meal_plan ${meal_plan_id}`);

          // Update user with stripe_customer_id if not already set
          const { error: userUpdateError } = await supabaseAdminClient
            .from("users")
            .update({ stripe_customer_id: stripeCustomerId })
            .eq("id", supabase_user_id)
            .is("stripe_customer_id", null); // Only update if null

          if (userUpdateError) console.error("Error updating user with stripe_customer_id:", userUpdateError.message);

          // Create new subscription record
          // Stripe's current_period_start and current_period_end are Unix timestamps
          const subscriptionDetails = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const startDate = new Date(subscriptionDetails.current_period_start * 1000).toISOString();
          const endDate = new Date(subscriptionDetails.current_period_end * 1000).toISOString();

          const { error: subInsertError } = await supabaseAdminClient
            .from("subscriptions")
            .insert({
              user_id: supabase_user_id,
              meal_plan_id: meal_plan_id,
              stripe_subscription_id: stripeSubscriptionId,
              status: subscriptionDetails.status, // e.g., 'active', 'trialing'
              start_date: startDate,
              end_date: endDate,
              // delivery_dine_in_preference: can be set later by user or default
            });

          if (subInsertError) {
            console.error("Error inserting subscription:", subInsertError.message);
            return new Response(JSON.stringify({ error: "Failed to create subscription record." }), { status: 500 });
          }
          console.log(`Subscription ${stripeSubscriptionId} created for user ${supabase_user_id}`);
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object as Stripe.Invoice;
          const stripeSubscriptionId = invoice.subscription as string;
          if (!stripeSubscriptionId) break; // Not a subscription invoice

          console.log(`Processing invoice.payment_succeeded for subscription ${stripeSubscriptionId}`);
          const subscriptionDetails = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const newEndDate = new Date(subscriptionDetails.current_period_end * 1000).toISOString();

          const { error } = await supabaseAdminClient
            .from("subscriptions")
            .update({ status: "active", end_date: newEndDate })
            .eq("stripe_subscription_id", stripeSubscriptionId);
          if (error) console.error("Error updating subscription on payment_succeeded:", error.message);
          else console.log(`Subscription ${stripeSubscriptionId} updated to active, end_date: ${newEndDate}`);
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const stripeSubscriptionId = invoice.subscription as string;
          if (!stripeSubscriptionId) break;

          console.log(`Processing invoice.payment_failed for subscription ${stripeSubscriptionId}`);
          const { error } = await supabaseAdminClient
            .from("subscriptions")
            .update({ status: "past_due" }) // Or 'inactive', 'unpaid' depending on your logic
            .eq("stripe_subscription_id", stripeSubscriptionId);
          if (error) console.error("Error updating subscription on payment_failed:", error.message);
          else console.log(`Subscription ${stripeSubscriptionId} status updated to past_due.`);
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`Processing customer.subscription.updated for ${subscription.id}`);
          const newEndDate = new Date(subscription.current_period_end * 1000).toISOString();
          // Handle plan changes, cancellations at period end (status might be 'active' but cancel_at_period_end is true)
          const status = subscription.cancel_at_period_end ? "cancelled" : subscription.status;

          const { error } = await supabaseAdminClient
            .from("subscriptions")
            .update({
              status: status,
              end_date: newEndDate,
              // meal_plan_id: if you allow plan changes, update it here based on subscription.items.data[0].price.product
            })
            .eq("stripe_subscription_id", subscription.id);
          if (error) console.error("Error updating subscription on customer.subscription.updated:", error.message);
          else console.log(`Subscription ${subscription.id} status updated to ${status}, end_date: ${newEndDate}`);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`Processing customer.subscription.deleted for ${subscription.id}`);
          const { error } = await supabaseAdminClient
            .from("subscriptions")
            .update({ status: "cancelled" }) // Or mark as inactive
            .eq("stripe_subscription_id", subscription.id);
          if (error) console.error("Error updating subscription on customer.subscription.deleted:", error.message);
          else console.log(`Subscription ${subscription.id} status updated to cancelled.`);
          break;
        }
        default:
          console.log(`Unhandled relevant event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing event ${event.type}:`, error.message);
      // Do not return 500 to Stripe if it's a business logic error,
      // unless it's a critical failure in your system.
      // Stripe will retry if it gets a 5xx.
      // A 4xx error might be appropriate if the event data is malformed for your needs.
      // For now, acknowledge receipt to prevent retries for handled errors.
    }
  } else {
    console.log(`Ignoring irrelevant event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

/*
Deployment command (run in terminal from the project root):
supabase functions deploy stripe-webhook-handler --no-verify-jwt
// --no-verify-jwt is crucial here as Stripe calls this endpoint without a Supabase JWT.

Ensure Environment Variables are set in Supabase project settings:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Webhook Endpoint URL in Stripe:
<YOUR_SUPABASE_PROJECT_URL>/functions/v1/stripe-webhook-handler
*/
