"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StartChatButton } from "@/components/chat/start-chat-button";
import { cn } from "@/components/lib/utils";
import { useSetFavoriteMentor } from "@/modules/student-dashboard/queries";
import type { StudentMentorCard as StudentMentorCardData } from "../../../../server/actions/student-dashboard/mentors";

export function StudentMentorCard({ mentor }: { mentor: StudentMentorCardData }) {
  const setFavorite = useSetFavoriteMentor();
  const location = [mentor.city, mentor.country].filter(Boolean).join(", ");

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden border-slate-200 py-0 transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-emerald-100">
            {mentor.imageUrl ? (
              <Image
                src={mentor.imageUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-lg font-semibold text-emerald-700">
                {mentor.user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold capitalize text-gray-900">
              {mentor.user.name}
            </h3>
            {location && (
              <p className="mt-0.5 flex items-center gap-1 text-sm capitalize text-gray-500">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={mentor.isFavorite}
            aria-label={
              mentor.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={() =>
              setFavorite.mutate({
                mentorId: mentor.userId,
                favorite: !mentor.isFavorite,
              })
            }
            className="shrink-0 hover:bg-rose-50"
          >
            <Heart
              className={cn(
                "size-5",
                mentor.isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-gray-400",
              )}
            />
          </Button>
        </div>
        <p className="line-clamp-3 text-sm text-gray-600">
          {mentor.bio?.trim() || "This mentor hasn't added a bio yet."}
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t p-4">
        <Button asChild variant="outline">
          <Link href={`/mentors/${mentor.userId}`}>
            <Eye className="size-4" />
            Profile
          </Link>
        </Button>
        <StartChatButton
          mentorId={mentor.userId}
          className="border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
        />
      </CardFooter>
    </Card>
  );
}
