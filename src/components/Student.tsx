"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { startTransition,  useOptimistic, useState } from "react";
import type { FavoriteSelectType } from "../../lib/db/schema";
import Image from "next/image";
import {
  addToFavorite,
  type FormState,
} from "../../server/actions/add-remove-favorite/addToFavorite";
import { EyeIcon, HeartIcon } from "lucide-react";
import { removeFavorite } from "../../server/actions/add-remove-favorite/removeFavorite";
import Link from "next/link";
import { toast } from "sonner";
import type {
  MentorProfileWithUserAndChat,
  StudentProfileWithUser,
} from "../../types/all-types";
import { capitalizeFirstLetter } from "better-auth";
import { getOrCreateChat } from "../../server/lib/auth/helpers/free/get-or-create-chat";
import { Spinner } from "./ui/spinner";

export default function StudentPage({
  matchingMentors,
  studentRecordWithUser,
  favoriteMentor,
}: {
  matchingMentors: MentorProfileWithUserAndChat[];
  studentRecordWithUser: StudentProfileWithUser;
  favoriteMentor: FavoriteSelectType[];
}) {
  const [isFavoritesShown, setIsFavoriteShown] = useState<boolean>(false);
  const router = useRouter();
  const [loadingChatMentorId, setLoadingChatMentorId] = useState<string | null>(
    null
  );

  const initialFavorites = favoriteMentor
    .map((fav) => fav.mentorId)
    .filter((id): id is string => id !== null);

  const [optimisticFavorites, setOptimisticFavorites] = useOptimistic(
    initialFavorites,
    (currentFavorite: string[], mentorId: string) => {
      if (currentFavorite.includes(mentorId)) {
        return currentFavorite.filter((id) => id !== mentorId);
      }

      return [...currentFavorite, mentorId];
    }
  );

  const handleClick = async (mentorId: string) => {
    startTransition(async () => {
      setOptimisticFavorites(mentorId);

      try {
        const formData = new FormData();
        formData.append("mentorId", mentorId);
        formData.append("studentId", studentRecordWithUser.userId);

        const initialState: FormState = { errors: {} } as FormState;
        await addToFavorite(initialState, formData);
      } catch (error) {
        console.error("Failed to add to favorite: ", error);
      }
    });
  };

  const handleRemoveFavorite = async (mentorId: string) => {
    // console.log("clicked on remove favorite");
    startTransition(async () => {
      setOptimisticFavorites(mentorId);
      try {
        const formData = new FormData();
        formData.append("mentorId", mentorId);
        formData.append("studentId", studentRecordWithUser.userId);
        const initialState: FormState = { errors: {} } as FormState;
        await removeFavorite(initialState, formData);
      } catch (error) {
        console.error("Failed to remove to favorite: ", error);
      }
    });
  };

  const isFavorited = (mentorId: string) =>
    optimisticFavorites.includes(mentorId);

  const handleChat = async (mentorId: string) => {
    setLoadingChatMentorId(mentorId);
    const result = await getOrCreateChat(mentorId);

    if (!result.success) {
      toast.error("Unable to start chat. Please try again.");
      return;
    }

    router.push(`/chats/${result.chatId}`);
    setLoadingChatMentorId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Student Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/video-call?status=pending">
              <Button
                variant="outline"
                className="border-emerald-200 hover:bg-emerald-50 bg-transparent"
              >
                Video Calls
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              disabled={click}
              variant="ghost"
              className="hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 mb-8 border-b">
            <button
              onClick={() => setIsFavoriteShown(false)}
              className={`px-6 py-3 font-medium transition-all relative ${
                !isFavoritesShown
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Matching Mentors
            </button>
            <button
              onClick={() => setIsFavoriteShown(true)}
              className={`px-6 py-3 font-medium transition-all relative ${
                isFavoritesShown
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        {!isFavoritesShown && (
          <div>
            {matchingMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingMentors.map((mentor) => {
                  return (
                    <Card
                      key={mentor.userId}
                      className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200"
                    >
                      <CardHeader className="flex justify-between items-start">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex flex-1 items-center gap-2">
                            <div className="relative h-16 sm:h-20 w-16 sm:w-20">
                              <Image
                                src={mentor.imageUrl! || "/placeholder.svg"}
                                alt={mentor.user.name || "Mentor"}
                                fill
                                className="rounded-full object-cover ring-2 ring-emerald-100"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-base md:text-lg text-gray-900">
                                {capitalizeFirstLetter(mentor.user.name)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {capitalizeFirstLetter(mentor.country ?? "")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 pt-1">
                          {isFavorited(mentor.userId) ? (
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveFavorite(mentor.userId)
                              }
                              className="hover:bg-emerald-50"
                            >
                              <HeartIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleClick(mentor.userId)}
                              className="hover:bg-emerald-50"
                            >
                              <HeartIcon className="w-5 h-5 text-gray-400" />
                            </Button>
                          )}
                          <input
                            type="hidden"
                            name="mentorId"
                            value={mentor.userId}
                          />
                          <input
                            type="hidden"
                            name="studentId"
                            value={studentRecordWithUser.userId}
                          />
                          <Link href={`/mentors/${mentor.userId}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-emerald-700 hover:bg-emerald-100"
                            >
                              <EyeIcon className="w-5 h-5" />{" "}
                              {/* from lucide-react */}
                            </Button>
                          </Link>
                        </div>
                      </CardHeader>

                      <CardContent className="px-6">
                        <p className="text-sm text-gray-600 mb-6 line-clamp-3 mt-auto">
                          {capitalizeFirstLetter(
                            mentor.bio?.slice(0, 150) ?? "No Bio"
                          )}
                          ...
                        </p>
                      </CardContent>
                      <CardFooter className="mt-auto flex flex-col gap-y-4">
                        <div className="grid grid-cols-2 gap-4 justify-center  mb-0">
                          <Button
                            onClick={() => handleChat(mentor.userId)}
                            disabled={loadingChatMentorId === mentor.userId}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-2 sm:px-4 py-2 transition-colors"
                          >
                            {loadingChatMentorId === mentor.userId ? (
                              <Spinner />
                            ) : (
                              "Chat"
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No mentors found for your provided favorite destination.
                </p>
              </div>
            )}
          </div>
        )}

        {isFavoritesShown && (
          <div>
            {favoriteMentor.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteMentor.map((favMentor) => {
                  const matchedMentor = matchingMentors.find(
                    (mentor) => mentor.userId === favMentor.mentorId
                  );
                  return matchedMentor ? (
                    <Card
                      key={favMentor.mentorId}
                      className="overflow-hidden border-emerald-200 bg-emerald-50/50"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-4">
                          <Image
                            src={matchedMentor.imageUrl! || "/placeholder.svg"}
                            alt={matchedMentor.user.name || "Mentor"}
                            width={80}
                            height={80}
                            className="rounded-full object-cover ring-2 ring-emerald-200"
                          />
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {capitalizeFirstLetter(matchedMentor.user.name)}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {capitalizeFirstLetter(
                                matchedMentor.country ?? "No Country"
                              )}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {capitalizeFirstLetter(
                              matchedMentor.bio?.slice(0, 150) ??
                                "No Bio For This Mentor"
                            )}
                            ...
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className=" bg-emerald-700 mx-auto">
                          <Link href={`/mentors/${matchedMentor.userId}`}>
                            View Profile
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No favorite mentors yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
