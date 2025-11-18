import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Subscription } from "@/app/payment/SubscriptionModel";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  await dbConnect();

  const data = await req.json();
  const {
    userId,
    priceId,
    packageName,
    amount,
    promocode,
    currency,
    successUrl,
    cancelUrl,
  } = data;

  try {
    // ---- STEP 1: Find Promotion Code ID by name ----
    let promoId = null;

    if (promocode) {
      const promoList = await stripe.promotionCodes.list({
        code: promocode,  // user typed code
        active: true,
      });

      if (promoList.data.length > 0) {
        promoId = promoList.data[0].id;  // actual ID
      } else {
        return NextResponse.json(
          { message: "Invalid promo code!" },
          { status: 400 }
        );
      }
    }

    // ---- STEP 2: Create checkout session ----
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId, packageName },

      discounts: promoId ? [{ promotion_code: promoId }] : [],
    });

    // ---- STEP 3: Save subscription ----
    const startDate = new Date();
    const endDate = new Date();

    if (packageName.toLowerCase() === "daily pick package")
      endDate.setDate(endDate.getDate() + 1);
    else if (packageName.toLowerCase() === "weekly pick package")
      endDate.setDate(endDate.getDate() + 7);
    else if (packageName.toLowerCase() === "monthly pick package")
      endDate.setMonth(endDate.getMonth() + 1);
    else if (packageName.toLowerCase() === "seasonal pick package")
      endDate.setMonth(endDate.getMonth() + 3);

    await Subscription.create({
      userId,
      priceId,
      packageName,
      amount,
      currency,
      startDate,
      endDate,
      status: "pending",
      available: false,
      stripeSessionId: session.id,
    });

    return NextResponse.json(
      { message: "Success", url: session.url },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error, message: error.message },
      { status: 500 }
    );
  }
};
