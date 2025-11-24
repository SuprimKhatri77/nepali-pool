"use client";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import { SchoolSelectType, UserSelectType } from "../../lib/db/schema";
import { capitalizeFirstLetter } from "better-auth";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Fix marker icons (Next.js + Leaflet issue)
// delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
  schoolCoords: { lat: number; lng: number };
  mentors?: NearbyMentorsList;
  school: SchoolSelectType;
}

export type NearbyMentor = {
  distance?: number;
  lat?: number;
  lng?: number;
  sex: "male" | "female" | "other" | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  bio: string | null;
  phoneNumber: string | null;
  city: string | null;
  imageUrl: string | null;
  country: string | null;
  zipCode: string | null;
  nationality: string | null;
  zyroCard: string | null;
  verifiedStatus: "pending" | "accepted" | "rejected" | null;
  user: UserSelectType;
};

export type NearbyMentorsList = NearbyMentor[];

function ZoomOnClick({ position }: { position: [number, number] }) {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo(position, 15, {
      duration: 1.5,
    });
  }, [position, map]);

  return null;
}

export default function MapWithMentors({
  schoolCoords,
  school,
  mentors = [],
}: MapProps) {
  // Improved offset logic for overlapping markers
  const adjustedMentors = mentors.map((m, index) => {
    // Check if mentor is at the exact same location as school (0 km distance)
    const isAtSchool = m.distance !== undefined && m.distance < 0.1; // Less than 100 meters

    if (isAtSchool) {
      // Create a circle pattern around the school
      const angle = index * (360 / mentors.length) * (Math.PI / 180);
      const radius = 0.009; // ~900 meters offset

      const offsetLat = m.lat! + Math.cos(angle) * radius;
      const offsetLng = m.lng! + Math.sin(angle) * radius;

      return { ...m, lat: offsetLat, lng: offsetLng };
    }

    // For other duplicate coordinates
    const duplicates = mentors.filter(
      (other, otherIndex) =>
        otherIndex < index &&
        other.lat?.toFixed(6) === m.lat?.toFixed(6) &&
        other.lng?.toFixed(6) === m.lng?.toFixed(6)
    );

    if (duplicates.length > 0) {
      // Offset in a spiral pattern
      const offsetIndex = duplicates.length;
      const angle = offsetIndex * 90 * (Math.PI / 180); // 90 degrees apart
      const radius = 0.002 * (Math.floor(offsetIndex / 6) + 1);

      const offsetLat = m.lat! + Math.cos(angle) * radius;
      const offsetLng = m.lng! + Math.sin(angle) * radius;

      return { ...m, lat: offsetLat, lng: offsetLng };
    }

    return m;
  });

  const [activePosition, setActivePosition] = React.useState<
    [number, number] | null
  >(null);

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg z-0">
      <MapContainer
        center={[schoolCoords.lat, schoolCoords.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/*  Map Layers (Normal + Satellite Switcher) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* School Marker */}
        <Marker position={[schoolCoords.lat, schoolCoords.lng]}>
          <Popup maxWidth={300} minWidth={200}>
            <div className="space-y-2">
              {/* School Name */}
              <div className="font-bold text-lg text-blue-600">
                {school?.name || "School Name"}
              </div>

              {school?.city && school?.prefecture && (
                <div className="text-sm text-gray-600">
                  {school.city}, {school.prefecture}
                </div>
              )}

              {/* International Student Support */}
              {school?.supportInternationalStudents && (
                <div className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                  ✓ Supports International Students
                </div>
              )}

              {/* Website Link */}
              {school?.websiteUrl && (
                <a
                  href={school.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" text-sm text-blue-500 hover:underline inline-flex items-center gap-1"
                >
                  Visit Website <ArrowRight />
                </a>
              )}
            </div>
          </Popup>
        </Marker>

        {/*  Mentor Markers */}
        {adjustedMentors.map((m) => (
          <Marker
            key={m.userId}
            position={[m.lat!, m.lng!]}
            eventHandlers={{
              click: () => setActivePosition([m.lat!, m.lng!]),
            }}
          >
            <Popup>
              <div className="p-3 rounded-lg bg-white shadow-md min-w-[160px] text-center">
                {/*  Profile Image */}
                <div className="flex justify-center mb-2">
                  <Image
                    width={48}
                    height={48}
                    src={
                      m.user.image ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={m.user.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                </div>

                {/*  Mentor Info */}
                <strong>
                  {capitalizeFirstLetter(m.user.name) ?? "Mentor"}
                </strong>
                <br />
                <span className="text-sm text-gray-600">
                  {capitalizeFirstLetter(m.city ?? "City")},{" "}
                  {capitalizeFirstLetter(m.country ?? "Country")}
                </span>
                <br />
                {m.distance !== undefined && m.distance !== 0 && (
                  <span className="text-xs text-gray-500">
                    {m.distance.toFixed(2)} km away
                  </span>
                )}
                <br />

                {/*  View Profile */}
                <Link
                  href={`/mentors/${m.user.id}`}
                  className="inline-block mt-2 px-3 py-1 bg-emerald-600 !text-white text-sm rounded-md hover:bg-emerald-700 transition"
                >
                  View Profile
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {/*  Trigger zoom on click on map icon */}
        {activePosition && <ZoomOnClick position={activePosition} />}
      </MapContainer>
    </div>
  );
}
