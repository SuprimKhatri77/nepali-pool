import { desc, eq } from "drizzle-orm";
import { CheckCircle2 } from "lucide-react";
import { db } from "../../../lib/db";
import { chats, mentorEnquiry, serviceBooking } from "../../../lib/db/schema";
import { requireStudent } from "../../../server/lib/auth/guards";
import StudentBookings from "@/components/mentor-services/StudentBookings";
import StudentEnquiries from "@/components/mentor-services/StudentEnquiries";

export const metadata = {
  title: "My Bookings | NepaliPool",
};

function SuccessBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 mb-6 text-emerald-900">
      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
      <p className="text-sm">{children}</p>
    </div>
  );
}

export default async function StudentBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ booked?: string; enquired?: string }>;
}) {
  const { studentRecord } = await requireStudent();
  const { booked, enquired } = await searchParams;
  const studentId = studentRecord.userId;
  const mentorName = {
    mentorProfile: { with: { user: { columns: { name: true } } } },
  } as const;

  const [bookings, enquiries, chatRows] = await Promise.all([
    db.query.serviceBooking.findMany({
      where: eq(serviceBooking.studentId, studentId),
      with: mentorName,
      orderBy: desc(serviceBooking.createdAt),
    }),
    db.query.mentorEnquiry.findMany({
      where: eq(mentorEnquiry.studentId, studentId),
      with: mentorName,
      orderBy: desc(mentorEnquiry.createdAt),
    }),
    db
      .select({ id: chats.id, mentorId: chats.mentorId })
      .from(chats)
      .where(eq(chats.studentId, studentId)),
  ]);
  const chatIdByMentor = Object.fromEntries(
    chatRows.map((row) => [row.mentorId, row.id]),
  );

  // Banners only match the student's own records, so a crafted URL shows nothing.
  const justBooked = bookings.some((b) => b.referenceCode === booked)
    ? booked
    : undefined;
  const justEnquired = enquiries.some((e) => e.referenceCode === enquired)
    ? enquired
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1 mb-6">
          Services you&apos;ve booked and questions you&apos;ve asked mentors.
        </p>

        {justBooked && (
          <SuccessBanner>
            Booking submitted! Your reference is{" "}
            <span className="font-mono font-semibold">{justBooked}</span>. The
            mentor will verify your payment and you&apos;ll get an email once
            it&apos;s confirmed.
          </SuccessBanner>
        )}
        {justEnquired && (
          <SuccessBanner>
            Enquiry sent! Your reference is{" "}
            <span className="font-mono font-semibold">{justEnquired}</span>.
            You&apos;ll get an email when the mentor replies.{" "}
            <a href="#enquiries" className="font-semibold underline">
              View enquiry ↓
            </a>
          </SuccessBanner>
        )}

        <div className="space-y-10">
          <StudentBookings
            bookings={bookings.map(({ mentorProfile, ...booking }) => ({
              ...booking,
              mentorName: mentorProfile.user.name,
            }))}
            chatIdByMentor={chatIdByMentor}
          />
          <StudentEnquiries
            enquiries={enquiries.map(({ mentorProfile, ...enquiry }) => ({
              ...enquiry,
              mentorName: mentorProfile.user.name,
            }))}
            chatIdByMentor={chatIdByMentor}
          />
        </div>
      </main>
    </div>
  );
}
