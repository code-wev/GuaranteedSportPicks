import Stripe from "stripe";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { MyPick } from "../../myPick/MyPickModel";
import { PaymentHistory } from "../history/PaymentHistoyModel";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, pickId, amount, currency = "usd", successUrl, cancelUrl } = body;

    if (!userId || !pickId || !amount) {
      return NextResponse.json(
        { message: "Missing required fields: userId, pickId or amount" },
        { status: 400 }
      );
    }

    //---------------------------
    // 1️⃣ STRIPE CHECKOUT SESSION
    //---------------------------
    const session = await stripe.checkout.sessions.create({
      mode: "payment", // One-time payment
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Direct Pick Purchase",
            },
            unit_amount: amount * 100, // Stripe requires cents
          },
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        pickId,
        type: "pick" 
      },
    });

    //-----------------------------------------------
    // 2️⃣ SAVE INITIAL PURCHASE (pending) IN DATABASE
    //-----------------------------------------------
    // await MyPick.create({
    //   userId,
    //   pickId,
    //   amount,
    //   currency,
    //   status: "pending",
    //   available: false,
    //   stripeSessionId: session.id,
    // });


    await PaymentHistory.create({
      userId,
      pickId,
      amount,
      currency,
      type: "pick",
      status: "pending",
      stripeSessionId: session.id,
    });
    //-----------------------------------------------
    // 3️⃣ RETURN SESSION URL TO FRONTEND
    //-----------------------------------------------
    return NextResponse.json(
      {
        message: "Checkout session created!",
        url: session.url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Payment Error:", error);
    return NextResponse.json(
      { message: error.message, error },
      { status: 500 }
    );
  }
};
