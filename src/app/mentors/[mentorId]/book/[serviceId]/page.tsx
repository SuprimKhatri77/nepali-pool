import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { ArrowLeft, Clock, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClickableImage } from "@/components/ClickableImage";
import BookServiceForm from "@/components/mentor-services/BookServiceForm";
import { formatDuration, formatNpr } from "@/components/mentor-services/format";
import { db } from "../../../../../../lib/db";
import {
  mentorService,
  serviceBooking,
  studentProfile,
} from "../../../../../../lib/db/schema";
import { auth } from "../../../../../../server/lib/auth/auth";
import { requireUser } from "../../../../../../server/lib/auth/helpers/requireUser";

// Onboarding stores local numbers like "9812345678"; WhatsApp links need the
// country code, so prefill Nepali mobile numbers as +977… and leave anything
// we can't interpret for the student to fill in.
function toWhatsappPrefill(phone: string | null): string {
  const compact = phone?.replace(/[\s()-]/g, "") ?? "";
  if (/^\+[1-9]\d{6,14}$/.test(compact)) return compact;
  if (/^9\d{9}$/.test(compact)) return `+977${compact}`;
  return "";
}

export const metadata = {
  title: "Book a Service | NepaliPool",
};

function Notice({
  title,
  children,
  backHref,
  backLabel,
}: {
  title: string;
  children: React.ReactNode;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Card className="max-w-md w-full border-slate-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <div className="text-slate-600">{children}</div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ mentorId: string; serviceId: string }>;
}) {
  const { mentorId, serviceId } = await params;
  if (!z.uuid().safeParse(serviceId).success) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?message=Please+login+to+book+a+service");

  const userRecord = await requireUser();
  if (userRecord.role !== "student") {
    return (
      <Notice
        title="Students only"
        backHref={`/mentors/${mentorId}`}
        backLabel="Back to mentor"
      >
        Only student accounts can book mentor services.
      </Notice>
    );
  }
  const student = await db.query.studentProfile.findFirst({
    where: eq(studentProfile.userId, userRecord.id),
  });
  if (!student) {
    redirect(
      "/onboarding/student?message=Please+complete+your+profile+before+booking",
    );
  }

  const service = await db.query.mentorService.findFirst({
    where: and(
      eq(mentorService.id, serviceId),
      eq(mentorService.mentorId, mentorId),
    ),
    with: { mentorProfile: { with: { user: true, paymentDetails: true } } },
  });
  const mentor = service?.mentorProfile;
  if (!service || !service.isActive || mentor?.verifiedStatus !== "accepted") {
    return (
      <Notice title="Service unavailable" backHref="/mentors" backLabel="Browse mentors">
        This service doesn&apos;t exist or is no longer offered.
      </Notice>
    );
  }
  const payment = mentor.paymentDetails;
  if (!payment?.instructions && !payment?.qrUrl) {
    return (
      <Notice
        title="Not taking bookings"
        backHref={`/mentors/${mentorId}`}
        backLabel="Back to mentor"
      >
        {mentor.user.name} isn&apos;t accepting bookings right now. You can still
        message them from their profile.
      </Notice>
    );
  }

  const pendingBooking = await db.query.serviceBooking.findFirst({
    where: and(
      eq(serviceBooking.studentId, student.userId),
      eq(serviceBooking.serviceId, service.id),
      eq(serviceBooking.status, "pending"),
    ),
  });
  if (pendingBooking) {
    return (
      <Notice
        title="Already booked"
        backHref="/bookings"
        backLabel="View my bookings"
      >
        You already have a pending booking ({pendingBooking.referenceCode}) for
        this service. {mentor.user.name} will verify your payment soon.
      </Notice>
    );
  }

  const duration = formatDuration(service.durationMinutes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href={`/mentors/${mentorId}#services`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to <span className="capitalize">{mentor.user.name}</span>
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-6">
            <Card className="border-emerald-100 shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Booking with {mentor.user.name}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900 break-words">
                  {service.title}
                </h1>
                <p className="mt-3 text-sm text-gray-600 whitespace-pre-line break-words">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
                  <span className="text-xl font-bold text-gray-900">
                    {formatNpr(service.priceNpr)}
                  </span>
                  {duration && (
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" /> {duration}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Step 1: Pay {formatNpr(service.priceNpr)}
                </h2>
                {payment.instructions && (
                  <p className="text-sm text-gray-700 whitespace-pre-line break-words rounded-md bg-gray-50 border border-gray-100 p-3">
                    {payment.instructions}
                  </p>
                )}
                {payment.qrUrl && (
                  <ClickableImage
                    src={payment.qrUrl}
                    alt={`Payment QR code for ${mentor.user.name}`}
                    width={220}
                    height={220}
                    className="rounded-md border border-gray-200 object-contain bg-white"
                  />
                )}
                <p className="flex gap-2 text-xs text-gray-500">
                  <Info className="w-4 h-4 shrink-0" />
                  You pay the mentor directly. NepaliPool doesn&apos;t process
                  this payment. Your booking is confirmed once the mentor
                  verifies it.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-emerald-100 shadow-sm h-fit">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Step 2: Upload proof &amp; your details
              </h2>
              <BookServiceForm
                serviceId={service.id}
                defaults={{
                  fullName: userRecord.name,
                  email: userRecord.email,
                  whatsappNumber: toWhatsappPrefill(student.phoneNumber),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
