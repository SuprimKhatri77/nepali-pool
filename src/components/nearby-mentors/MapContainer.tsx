"use client";

import { NearbyMentorsList } from "@/components/map";
import dynamic from "next/dynamic";
import React from "react";
import { SchoolSelectType } from "../../../lib/db/schema";

const MapWithMentors = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

interface MapLoaderProps {
  nearbyMentors: NearbyMentorsList;
  schoolCoords: { lat: number; lng: number };
   school: SchoolSelectType,
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
        school={school}
        schoolCoords={schoolCoords}
      />
    </div>
  );
}
