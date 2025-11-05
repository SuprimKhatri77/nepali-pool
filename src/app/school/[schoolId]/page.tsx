
import { db } from "../../../../lib/db";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye,  Heart,  MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { geocodeAddress } from "../../../../hooks/useGeoCode";
import { capitalizeFirstLetter } from "better-auth";
import { z } from "zod/v4";
import MapWithMentors from "@/components/map";
import { getDistance } from "../page";


const uuidCheck = z.string().uuid();
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ schoolId: string,}>
  searchParams: Promise<{ lat: string, lon:string }>
  ;
}) {
  //  Extract and validate school idd
  const { schoolId } = await params;
  const {lat, lon}= await searchParams
  console.log(lat,lon)
  const parsed = uuidCheck.safeParse(schoolId);
  if (!parsed.success) return <p>Invalid school ID</p>;

  //  Fetch school
  const school = await db.query.school.findFirst({
    where: (s, { eq }) => eq(s.id, schoolId),
  });
  if (!school) return <p>School not found</p>;

  //  Geocode school address
  const schoolCoords = await geocodeAddress(school.address ?? "");
  if (!schoolCoords) return <p>Could not determine school location</p>;

  //  Fetch mentors with accepted status
  const mentors = await db.query.mentorProfile.findMany({
    where: (m, { eq }) => eq(m.verifiedStatus, "accepted"),
    with: { user: true },
  });

  //  Geocode mentors (city, country)
  const mentorsWithCoords = await Promise.all(
    mentors.map(async (mentor) => {
      const coords = await geocodeAddress(`${mentor.city}, ${mentor.country}`);
      return { ...mentor, ...coords };
    })
  );

  //  Find nearby mentors under 10 km 
  const nearbyMentors = mentorsWithCoords
    .filter((m) => m.lat && m.lng) // ignore mentors without coords
    .map((m) => ({
      ...m,
      distance: getDistance(
        schoolCoords.lat,
        schoolCoords.lng,
        m.lat!,
        m.lng!
      ),
    }))
    .filter((m) => m.distance <= 10) // only within 10 km
    .sort((a, b) => a.distance - b.distance);

  //  Render school + nearby mentors
 return (
  <div className="min-h-screen bg-white text-black p-6 md:p-12 font-sans">
    {/* School Card */}
    <div className="max-w-3xl mx-auto bg-emerald-50 border border-emerald-300 rounded-xl shadow-lg p-6 mb-10">
      <h1 className="text-3xl font-bold text-emerald-800 mb-2">{school.name}</h1>
      <p className="text-gray-700 mb-4">{school.address}</p>

      <div className="flex flex-wrap gap-4">
        <a
          href={school.websiteUrl ?? "https://nepalipool.com"}
          target="_blank"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Visit Website
        </a>
        <a
          href={`mailto:${school.email}`}
          className="bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg shadow transition"
        >
          Email
        </a>
      </div>
    </div>

    {/* map */}
    <div className="max-w-3xl mx-auto mb-10 h-96 relative z-10">
         <MapWithMentors mentors={nearbyMentors} schoolName={school?.name ?? "School Name"} schoolCoords={schoolCoords} />
        </div>

    {/* Nearby Mentors */}
    <div className="max-w-3xl mx-auto mt-60">
      <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Nearby Mentors</h2>

      {nearbyMentors.length === 0 ? (
        <p className="text-gray-500">No mentors nearby.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nearbyMentors.map((mentor) => (
       <Card
  key={mentor.userId}
  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl"
>
  {/* Decorative background elements */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
  <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/30 rounded-full blur-2xl translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500" />
  
  <CardHeader className="relative z-10 pb-3">
    <div className="flex justify-between items-start">
      {/* Mentor Info */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="relative h-20 w-20">
            <Image
              src={mentor.imageUrl ?? "/placeholder.svg"}
              alt={mentor.user.name ?? "Mentor"}
              fill
              className="rounded-2xl object-cover shadow-lg"
            />
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow-md" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
            {capitalizeFirstLetter(mentor.user.name)}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{capitalizeFirstLetter(mentor.country ?? "")}</span>
          </div>
          {mentor.distance !== null && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {mentor.distance.toFixed(1)} km away
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 items-start">
        {/* Favorite */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-rose-50 hover:scale-110 transition-all rounded-xl"
        >
          <Heart className="w-5 h-5 text-rose-400 hover:text-rose-500" />
        </Button>

        {/* View Profile */}
        <Link href={`/mentors/${mentor.userId}`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-emerald-600 hover:bg-emerald-50 hover:scale-110 transition-all rounded-xl"
          >
            <Eye className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  </CardHeader>

  {/* Bio */}
  <CardContent className="relative z-10 px-6 pt-2 pb-4">
    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
      {capitalizeFirstLetter(mentor.bio?.slice(0, 150) ?? "No Bio")}...
    </p>
  </CardContent>

  <CardFooter className="relative z-10 px-6 pb-6">
    {/* Chat Button */}
    <Link
      href={`/chats/${mentor.userId}`}
      className="w-full group/btn"
    >
      <Button className="w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 h-11 px-6 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 transition-all duration-300 hover:-translate-y-0.5">
        <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
        Start Conversation
      </Button>
    </Link>
  </CardFooter>
</Card>

          ))}
        </div>
      )}
    </div>

    
  </div>
);

}






