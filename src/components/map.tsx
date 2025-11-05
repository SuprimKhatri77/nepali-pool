"use client";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer, LayersControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { UserSelectType } from "../../lib/db/schema";
import { capitalizeFirstLetter } from "better-auth";
import Link from "next/link";
import Image from "next/image";

// Fix marker icons (Next.js + Leaflet issue)
// Tell TypeScript to ignore the type check
(delete (L.Icon.Default.prototype as any)._getIconUrl);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
  schoolCoords: { lat: number; lng: number };
  schoolName?: string;
  mentors?:NearbyMentorsList
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
  resume: string | null;
  citizenshipPhotoUrl: string | null;
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
  schoolName = "Selected School",
  mentors = [],
}: MapProps) {
    const seenCoords = new Set<string>();

const adjustedMentors = mentors.map((m) => {
  const key = `${m.lat},${m.lng}`;
  if (seenCoords.has(key)) {
    // Shift duplicates slightly
    const offsetLat = m.lat! + (1 - 0.5) * 0.001;
    const offsetLng = m.lng! + (1 - 0.5) * 0.001;
    return { ...m, lat: offsetLat, lng: offsetLng };
  }
  seenCoords.add(key);
  return m;
});

    // console.log(mentors)
    const [activePosition, setActivePosition] = React.useState<[number, number] | null>(null);
    // console.log(mentors)
  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg z-0">
      <MapContainer
        center={[schoolCoords.lat, schoolCoords.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/*  Map Layers (Normal + Satellite Switcher) */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Normal View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri — Source: Esri, USGS, GeoEye"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/*  School Marker */}
        <Marker position={[schoolCoords.lat, schoolCoords.lng]}>
          <Popup>
            <strong>{schoolName}</strong>
            <br />
            School Location
          </Popup>
        </Marker>

        {/*  Mentor Markers */}
        {adjustedMentors
          .map((m) => (
            <Marker key={m.userId} position={[m.lat!, m.lng!]} 
            eventHandlers={{
              click: () => setActivePosition([m.lat!, m.lng!]),
            }}>
         <Popup>
  <div className="p-3 rounded-lg bg-white shadow-md min-w-[160px] text-center">
    {/*  Profile Image */}
    <div className="flex justify-center mb-2">
      <Image
       width={16}
       height={16}
        src={m.user.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
        alt={m.user.name}
        className="w-12 h-12 rounded-full object-cover border border-gray-300"
      />
    </div>

    {/*  Mentor Info */}
    <strong>{capitalizeFirstLetter(m.user.name) ?? "Mentor"}</strong>
    <br />
    <span className="text-sm text-gray-600">
      {capitalizeFirstLetter(m.city ?? "City")}, {capitalizeFirstLetter(m.country ?? "Country")}
    </span>
    <br />
    {m.distance && (
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
          {/*  Trigger zoom on click on mapp icon */}
      {activePosition && <ZoomOnClick position={activePosition} />}
      </MapContainer>
    </div>
  );
}
