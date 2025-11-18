import Stripe from "stripe";
import { dbConnect } from "@/utils/dbConnect";
import { Subscription } from "@/models/subscription";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async(req, res) =>{
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, priceId, packageName, amount, currency, successUrl, cancelUrl } = req.body;

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
      metadata: { userId, packageName },
    });

    // Save a placeholder subscription in DB (optional)
    const startDate = new Date();
    const endDate = new Date();
    if (packageName.toLowerCase() === "daily pick package") endDate.setDate(endDate.getDate() + 1);
    else if (packageName.toLowerCase() === "weekly pick package") endDate.setDate(endDate.getDate() + 7);
    else if (packageName.toLowerCase() === "monthly pick package") endDate.setMonth(endDate.getMonth() + 1);
    else if (packageName.toLowerCase() === "seasonal pick package") endDate.setMonth(endDate.getMonth() + 3);

    await Subscription.create({
      userId,
      priceId,
      packageName,
      amount,
      currency,
      startDate,
      endDate,
      status: "active",
      available: true,
      stripeSessionId: session.id,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}


export const GET = async()=>{
    return NextResponse.json({
        message:"success"
    })
}