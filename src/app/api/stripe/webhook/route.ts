import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../../lib/db";
import {
  payment,
  chatSubscription,
  videoCall,
} from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      webhookSecret
    );
  } catch (error) {
    console.error(`Webhook signature verification failed:`, error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleCustomerSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const { paymentType, userId, mentorId } = session.metadata || {};

  if (!paymentType || !userId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  const [paymentRecord] = await db
    .insert(payment)
    .values({
      userId,
      type: paymentType as "chat_subscription" | "video_call",
      amount: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || "USD",
      status: "paid",
      stripePaymentId: session.payment_intent as string,
      stripeSubscriptionId: session.subscription as string,
    })
    .returning();

  if (paymentType === "chat_subscription" && mentorId) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await db.insert(chatSubscription).values({
      studentId: userId,
      mentorId,
      paymentId: paymentRecord.id,
      startDate,
      endDate,
      status: "active",
    });
  } else if (paymentType === "video_call" && mentorId) {
    await db.insert(videoCall).values({
      studentId: userId,
      mentorId,
      paymentId: paymentRecord.id,
      status: "pending",
    });
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.id as string;

  if (subscriptionId) {
    await db
      .update(payment)
      .set({
        status: "paid",
        updatedAt: new Date(),
      })
      .where(eq(payment.stripeSubscriptionId, subscriptionId));
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const [paymentRecord] = await db
    .select()
    .from(payment)
    .where(eq(payment.stripeSubscriptionId, subscription.id));
  if (!paymentRecord) {
    console.error("No payment found for subscription: ", subscription.id);
    return;
  }
  await db
    .update(chatSubscription)
    .set({
      status: "cancelled",
      updatedAt: new Date(),
    })
    .where(eq(chatSubscription.paymentId, paymentRecord.id));
}

async function handleCustomerSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const [paymentRecord] = await db
    .select()
    .from(payment)
    .where(eq(payment.stripeSubscriptionId, subscription.id));

  if (!paymentRecord) {
    console.error("No payment found for subscription:", subscription.id);
    return;
  }

  const statusMap: Record<string, "active" | "expired" | "cancelled"> = {
    active: "active",
    trialing: "active",
    past_due: "expired",
    unpaid: "expired",
    cancelled: "cancelled",
    incomplete: "expired",
    incomplete_expired: "expired",
  };

  const newStatus = statusMap[subscription.status] || "expired";

  const endDate = new Date(
    subscription.items.data[0].current_period_end * 1000
  );

  await db
    .update(chatSubscription)
    .set({
      status: newStatus,
      endDate,
      updatedAt: new Date(),
    })
    .where(eq(chatSubscription.paymentId, paymentRecord.id));

  console.log(
    `Updated subscription ${subscription.id} to status: ${newStatus}, end date: ${endDate}`
  );
}
