import Link from "next/link";
import { MentorProfileWithUser } from "../../types/all-types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

export default function MentorApplications({
  mentorProfileWithUser,
}: {
  mentorProfileWithUser: MentorProfileWithUser[];
}) {
  return (
      <div className="min-h-screen bg-white py-10 px-4 flex flex-col items-center">
      {mentorProfileWithUser.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
          <p className="text-lg">No pending requests for mentor applications!</p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Pending Mentor Applications
          </h1>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
            {mentorProfileWithUser.map((mentor) => (
              <Card
                key={mentor.userId}
                className="rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader className="flex flex-col items-center">
                  <Image
                    width={120}
                    height={120}
                    src={mentor.imageUrl  ?? ""}
                    alt={mentor.user?.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-emerald-400"
                  />
                  <CardTitle className="mt-3 text-lg font-semibold text-gray-800 text-center">
                    {mentor.user?.name}
                  </CardTitle>
                  <CardDescription className="text-gray-500 text-center mt-1 text-sm">
                    {mentor.city}, {mentor.country}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Email:</strong> {mentor.user?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {mentor.phoneNumber}
                  </p>
                  <p>
                    <strong>Nationality:</strong> {mentor.nationality}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-medium capitalize ${
                        mentor.verifiedStatus === "pending"
                          ? "text-yellow-500"
                          : mentor.verifiedStatus === "accepted"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {mentor.verifiedStatus}
                    </span>
                  </p>
                </CardContent>

                <CardFooter className="flex justify-center">
                  <Link
                    href={`/admin/mentor-applications/${mentor.userId}`}
                    className="bg-emerald-400 hover:bg-emerald-500 text-white font-medium rounded-xl px-5 py-2 transition-all"
                  >
                    View Details
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
