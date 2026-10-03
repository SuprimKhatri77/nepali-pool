import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../lib/db";
import { chatSubscription, videoCall } from "../../../../../lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import z from "zod";
import { getViewer } from "../../../../../server/lib/auth/viewer";

const checkoutBodySchema = z.object({
  paymentType: z.enum(["chat_subscription", "video_call"]),
  mentorId: z.string().min(1),
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    // The payer is always the signed-in student; ids and email sent in the
    // body are ignored.
    const viewer = await getViewer();
    if (viewer.status !== "student") {
      return NextResponse.json(
        { error: "Please log in as a student to continue" },
        { status: viewer.status === "anonymous" ? 401 : 403 }
      );
    }
    const userId = viewer.user.id;
    const userEmail = viewer.user.email;

    const body = checkoutBodySchema.safeParse(await request.json().catch(() => null));
    if (!body.success) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const { paymentType, mentorId } = body.data;

    const mentor = await db.query.mentorProfile.findFirst({
      columns: { userId: true },
      where: (fields, { and, eq }) =>
        and(eq(fields.userId, mentorId), eq(fields.verifiedStatus, "accepted")),
    });
    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
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
      if (
        chatSubscriptionRecord &&
        chatSubscriptionRecord.status === "active"
      ) {
        return NextResponse.json(
          {
            error: "You already have an active subscription with this mentor.",
          },
          { status: 400 }
        );
      }
    }

    if (paymentType === "video_call") {
      const videoCallRecord = await db.query.videoCall.findFirst({
        where: and(
          eq(videoCall.mentorId, mentorId),
          eq(videoCall.studentId, userId),
          inArray(videoCall.status, ["pending", "scheduled"])
        ),
      });
      if (videoCallRecord) {
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
          mentorId,
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
          mentorId,
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
