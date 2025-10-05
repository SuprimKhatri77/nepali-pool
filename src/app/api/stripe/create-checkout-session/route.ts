import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../lib/db";
import { chatSubscription, videoCall } from "../../../../../lib/db/schema";
import { and, eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { paymentType, userId, mentorId, userEmail } = await request.json();

    if (!paymentType || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://nepali-pool-raw.vercel.app");

    if (paymentType === "chat_subscription") {
      const [chatSubscriptionRecord] = await db
        .select()
        .from(chatSubscription)
        .where(
          and(
            eq(chatSubscription.studentId, userId),
            eq(chatSubscription.mentorId, mentorId)
          )
        );
      if (chatSubscription && chatSubscriptionRecord.status === "active") {
        return NextResponse.json(
          {
            error: "You already have an active subscription with this mentor.",
          },
          { status: 400 }
        );
      }
    }

    if (paymentType === "video_call") {
      const [videoCallRecord] = await db
        .select()
        .from(videoCall)
        .where(
          and(eq(videoCall.mentorId, mentorId), eq(videoCall.studentId, userId))
        );

      if (
        videoCallRecord &&
        (videoCallRecord.status === "pending" ||
          videoCallRecord.status === "scheduled")
      ) {
        return NextResponse.json(
          {
            error: `You already have a ${videoCallRecord.status} video call  with this mentor.`,
          },
          { status: 400 }
        );
      }
    }

    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    if (paymentType === "chat_subscription") {
      sessionConfig = {
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Chat Subscription with Mentor",
                description: "Monthly subscription to chat with your mentor",
              },
              unit_amount: 1000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          paymentType: "chat_subscription",
          userId,
          mentorId: mentorId || "",
        },
        success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&payment_type=${paymentType}`,
        cancel_url: `${baseUrl}/payment/cancel`,
      };
    } else if (paymentType === "video_call") {
      sessionConfig = {
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Video Call with Mentor",
                description: "One-time video call session with your mentor",
              },
              unit_amount: 500,
            },
            quantity: 1,
          },
        ],
        metadata: {
          paymentType: "video_call",
          userId,
          mentorId: mentorId || "",
        },
        success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&payment_type=${paymentType}`,
        cancel_url: `${baseUrl}/payment/cancel`,
      };
    } else {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
