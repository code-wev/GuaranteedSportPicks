import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Subscription } from "./SubscriptionModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  console.log("HIT");
  
  try {
    await dbConnect();

    const { userId, priceId, packageName, amount, currency, category } = await req.json();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://yourdomain.com/dashboard/purchase/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://yourdomain.com/dashboard/purchase/cancel",
      metadata: { userId, packageName, type: "subscription", category },
    });

    console.log(session, "baler session");

    // Save a placeholder subscription in DB (optional)
    const startDate = new Date();
    const endDate = new Date();
    
    if (packageName.toLowerCase().includes("daily")) endDate.setDate(endDate.getDate() + 1);
    else if (packageName.toLowerCase().includes("weekly")) endDate.setDate(endDate.getDate() + 7);
    else if (packageName.toLowerCase().includes("monthly")) endDate.setMonth(endDate.getMonth() + 1);
    else if (packageName.toLowerCase().includes("seasonal")) endDate.setMonth(endDate.getMonth() + 3);

    await Subscription.create({
      userId,
      priceId,
      packageName,
      amount,
      currency,
      startDate,
      endDate,
      type: "subscription",
      status: "active",
      available: true,
      stripeSessionId: session.id,
    });

    return NextResponse.json({ 
      success: true,
      url: session.url,
      sessionId: session.id
    }, { status: 200 });

  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Payment session creation failed"
    }, { status: 500 });
  }
}

export const GET = async () => {
  return NextResponse.json({
    message: "success - OP"
  });
}