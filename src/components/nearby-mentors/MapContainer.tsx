"use client";

import { NearbyMentorsList } from "@/components/map";
import dynamic from "next/dynamic";
import React from "react";

const MapWithMentors = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

interface MapLoaderProps {
  nearbyMentors: NearbyMentorsList;
  school: { name?: string } | null;
  schoolCoords: { lat: number; lng: number };
}

export default function MapContainer({
  nearbyMentors,
  school,
  schoolCoords,
}: MapLoaderProps) {
  return (
    <div className="max-w-3xl mx-auto mb-10 h-96 relative z-10">
      <MapWithMentors
        mentors={nearbyMentors}
        schoolName={school?.name || "Selected Location"}
        schoolCoords={schoolCoords}
      />
    </div>
  );
}
