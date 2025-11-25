import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Subscription } from "@/app/payment/SubscriptionModel";
import { MyPick } from "../../myPick/MyPickModel";
import { PaymentHistory } from "../history/PaymentHistoyModel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  await dbConnect();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,   // ✅ Remove Buffer.from() - use rawBody directly
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("❌ Signature failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log("🔔 Stripe Event:", event.type);

    // ===============================
    // Checkout Completed
    // ===============================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, type, pickId, amount, packageName } = session.metadata || {};

      console.log("📦 Session Metadata:", { userId, type, pickId, packageName });

      // ✅ SINGLE PICK PURCHASE
      if (type === "pick" && pickId) {
        try {
          // 1. Create MyPick record
          const myPick = await MyPick.create({
            userId,
            pickId,
            amount,
            status: "paid",
            stripeSessionId: session.id,
          });
          console.log("✅ Pick purchase recorded:", myPick._id);

          // 2. Update PaymentHistory with stripeSessionId
          const updatedHistory = await PaymentHistory.findOneAndUpdate(
            { 
              userId: userId,
              stripeSessionId: session.id // ✅ Use stripeSessionId for exact match
            },
            { 
              $set: { 
                status: "paid",
                paidAt: new Date()
              } 
            },
            { new: true }
          );

          if (updatedHistory) {
            console.log("✅ PaymentHistory updated for pick:", updatedHistory._id);
          } else {
            console.log("❌ No PaymentHistory found for session:", session.id);
          }

        } catch (error) {
          console.error("❌ Error in pick purchase:", error);
        }
      }

      // ✅ SUBSCRIPTION
      if (type === "subscription") {
        try {
          let sub = await Subscription.findOne({ stripeSessionId: session.id });

          if (!sub) {
            // Create new subscription
            sub = await Subscription.create({
              userId,
              packageName,
              amount,
              status: "active",
              available: true,
              stripeSessionId: session.id,
              stripeSubscriptionId: session.subscription, // ✅ Store this for future webhooks
            });
            console.log("✅ New subscription created:", sub._id);

            // Update PaymentHistory for subscription
            const updatedHistory = await PaymentHistory.findOneAndUpdate(
              { 
                userId: userId,
                stripeSessionId: session.id // ✅ Use stripeSessionId
              },
              { 
                $set: { 
                  status: "paid",
                  paidAt: new Date()
                } 
              },
              { new: true }
            );

            if (updatedHistory) {
              console.log("✅ PaymentHistory updated for subscription:", updatedHistory._id);
            } else {
              console.log("❌ No PaymentHistory found for subscription session:", session.id);
            }

          } else {
            // Update existing subscription
            sub.status = "active";
            sub.available = true;
            await sub.save();
            console.log("✅ Subscription updated:", sub._id);
          }
        } catch (error) {
          console.error("❌ Error in subscription:", error);
        }
      }
    }

    // ===============================
    // Handle Other Important Events
    // ===============================
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      console.log("✅ Invoice payment succeeded:", invoice.id);
      
      if (invoice.subscription) {
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: invoice.subscription },
          { 
            status: "active", 
            available: true,
            lastPaymentDate: new Date()
          }
        );
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      console.log("❌ Invoice payment failed:", invoice.id);
      
      if (invoice.subscription) {
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: invoice.subscription },
          { 
            status: "past_due", 
            available: false 
          }
        );
      }
    }

    return NextResponse.json({ received: true, status: "success" });

  } catch (error) {
    console.error("❌ General webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}