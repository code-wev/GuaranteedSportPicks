
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Subscription } from "@/app/payment/SubscriptionModel";
import { MyPick } from "../../myPick/MyPickModel";
import { buffer } from "micro";

export const config = {
  api: {
    bodyParser: false, // Stripe needs RAW BODY
  },
};

export const POST = async (req) => {
  await dbConnect();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Get raw body buffer
  const buf = await buffer(req);
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Stripe Webhook Signature Error:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log("🔔 Stripe Event Received:", event.type);

  // ===============================
  //  MAIN EVENT HANDLER
  // ===============================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const {
      userId,
      type, // "subscription" or "pick"
      pickId,
      amount,
      packageName,
    } = session.metadata || {};

    console.log("📦 Metadata:", session.metadata);

    // -----------------------------------
    //  CASE: USER BOUGHT A SINGLE PICK
    // -----------------------------------
    if (type === "pick" && pickId) {
      console.log("🎯 Saving PICK purchase...");

      await MyPick.create({
        userId,
        pickId,
        amount,
        status: "paid",
        stripeSessionId: session.id,
      });

      console.log(`✅ Pick purchase saved for user ${userId}`);
    }

    // -----------------------------------
    //  CASE: USER BOUGHT A SUBSCRIPTION
    // -----------------------------------
    if (type === "subscription") {
      console.log("💎 Activating subscription...");

      const sub = await Subscription.findOne({
        stripeSessionId: session.id,
      });

      if (sub) {
        sub.status = "active";
        sub.available = true;
        sub.packageName = packageName || sub.packageName;
        sub.amount = amount || sub.amount;
        await sub.save();
      } else {
        // If not found → create new subscription entry
        await Subscription.create({
          userId,
          packageName,
          amount,
          status: "active",
          available: true,
          stripeSessionId: session.id,
        });
      }

      console.log(`✅ Subscription activated for user ${userId}`);
    }
  }

  // Unhandled events (logging only)
  else {
    console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
};
