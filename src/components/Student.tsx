"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import type {
  ChatSubscriptionSelectType,
  FavoriteSelectType,
} from "../../lib/db/schema";
import Image from "next/image";
import {
  addToFavorite,
  type FormState,
} from "../../server/actions/add-remove-favorite/addToFavorite";
import { Star } from "lucide-react";
import { removeFavorite } from "../../server/actions/add-remove-favorite/removeFavorite";
import { PaymentButton } from "@/components/PaymentButton";
import Link from "next/link";
import ScheduleCall from "./ScheduleCall";
import { toast } from "sonner";
import {
  MentorProfileWithUserAndChat,
  StudentProfileWithUser,
} from "../../types/all-types";

export default function StudentPage({
  matchingMentors,
  studentRecordWithUser,
  favoriteMentor,
  chatSubscriptions,
}: {
  matchingMentors: MentorProfileWithUserAndChat[];
  studentRecordWithUser: StudentProfileWithUser;
  favoriteMentor: FavoriteSelectType[];
  chatSubscriptions: ChatSubscriptionSelectType[];
}) {
  const [click, setClick] = useState(false);
  const [isFavoritesShown, setIsFavoriteShown] = useState<boolean>(false);
  const router = useRouter();
  const [success, setSuccess] = useState<boolean>(false);
  let timeout: number;
  useEffect(() => {
    if (success) {
      timeout = window.setTimeout(() => {
        toast.message(
          "Preferred time sent for evaluation to mentor, successfully!"
        );
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [success]);

  const initialFavorites = favoriteMentor
    .map((fav) => fav.mentorId)
    .filter((id): id is string => id !== null);

  const isChatUnlocked = (mentorId: string) => {
    return chatSubscriptions.find(
      (sub) =>
        sub.mentorId === mentorId &&
        sub.studentId === studentRecordWithUser.userId
    );
  };

  const getChatWithStudent = (mentorId: string) => {
    for (const mentor of matchingMentors) {
      const chat = mentor.chats.find(
        (chat) =>
          chat.studentId === studentRecordWithUser.userId &&
          chat.mentorId === mentorId
      );
      if (chat) return chat;
    }
    return null;
  };
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

  const handleLogout = async () => {
    setClick(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
    setClick(false);
  };

  const calls = studentRecordWithUser.videoCall ?? [];
  const firstUnscheduledCall = calls.find(
    (vc) => vc.status === "pending" && !vc.preferredTime?.studentPreferredTime
  );

  const isVideoCallUnlocked = (mentorId: string) => {
    return studentRecordWithUser.videoCall.find(
      (sub) =>
        (sub.mentorId === mentorId &&
          sub.studentId === studentRecordWithUser.userId &&
          sub.status === "pending") ||
        sub.status === "scheduled"
    );
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
      Sup student!
      <Button onClick={handleLogout} disabled={click}>
        Logout
      </Button>
      <Link href="/video-call?status=pending">
        <Button>All Purchased Video Calls</Button>
      </Link>
      <div className="flex gap-5 w-full px-10 justify-between">
        <div className="flex flex-col gap-5 flex-wrap max-w-[600px]">
          <h1
            className={`cursor-pointer ${!isFavoritesShown ? "bg-green-400 h-fit py-2 rounded-lg px-4" : ""}`}
            onClick={() => setIsFavoriteShown(false)}
          >
            Matching mentors
          </h1>

          {matchingMentors.length > 0
            ? !isFavoritesShown && (
                <div className="flex flex-col gap-5">
                  <div className="flex  gap-5 items-center">
                    {matchingMentors.map((mentor) => {
                      const activeCall = isVideoCallUnlocked(mentor.userId);
                      const activeChat = isChatUnlocked(mentor.userId);
                      const studentChat = getChatWithStudent(mentor.userId);

                      return (
                        <div
                          key={mentor.userId}
                          className="flex flex-col  gap-5 items-center bg-gray-100 py-5 px-7 rounded-xl"
                        >
                          <div className="flex flex-col items-center gap-5">
                            <Image
                              src={mentor.imageUrl! || "/placeholder.svg"}
                              alt=""
                              width={100}
                              height={100}
                              className="rounded-full object-center"
                            />
                            <p>Name: {mentor.user.name}</p>
                          </div>
                          <p className="max-w-[200px]">Bio: {mentor.bio}</p>
                          <p>Country: {mentor.country}</p>
                          <div>
                            {isFavorited(mentor.userId) ? (
                              <>
                                <Button
                                  type="submit"
                                  variant="ghost"
                                  onClick={() =>
                                    handleRemoveFavorite(mentor.userId)
                                  }
                                  className="hover:bg-gray-200 cursor-pointer"
                                >
                                  <Star className="text-yellow-400 fill-yellow-400" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                type="submit"
                                variant="ghost"
                                onClick={() => handleClick(mentor.userId)}
                                className="hover:bg-gray-200 cursor-pointer"
                              >
                                <Star className="text-muted-foregrounds" />
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
                          </div>
                          <div className="flex  gap-5 items-center">
                            {activeChat &&
                            new Date(activeChat.endDate) > new Date() ? (
                              studentChat ? (
                                <Link
                                  href={`/chats/${studentChat?.id}`}
                                  className="bg-green-600 px-5 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 ease-in-out text-white text-nowrap"
                                >
                                  Chat with mentor
                                </Link>
                              ) : (
                                <Button disabled>Chat unavailable</Button>
                              )
                            ) : (
                              <PaymentButton
                                paymentType="chat_subscription"
                                userId={studentRecordWithUser.userId}
                                mentorId={mentor.userId}
                                userEmail={studentRecordWithUser.user.email!}
                                className="bg-gray-700 px-5 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 ease-in-out text-gray-100 cursor-pointer"
                              >
                                Unlock chat with mentor
                              </PaymentButton>
                            )}

                            {activeCall && activeCall.status !== "cancelled" ? (
                              activeCall.status !== "scheduled" ? (
                                <Link
                                  href={`/video-call/schedule/${activeCall.id}`}
                                  className="bg-blue-400 hover:bg-blue-500 transition-all duration-300  p-3 rounded-lg text-nowrap"
                                >
                                  Schedule Call
                                </Link>
                              ) : (
                                <Button disabled>Scheduled</Button>
                              )
                            ) : (
                              <PaymentButton
                                paymentType="video_call"
                                userId={studentRecordWithUser.userId}
                                mentorId={mentor.userId}
                                userEmail={studentRecordWithUser.user.email!}
                                className="bg-gray-700 px-5 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 ease-in-out text-gray-100 cursor-pointer"
                              >
                                Unlock video call with mentor
                              </PaymentButton>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {firstUnscheduledCall && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-slate-50 rounded-lg p-8 shadow-lg w-fit max-w-md mx-4">
                          <ScheduleCall
                            videoId={firstUnscheduledCall.id}
                            onSuccess={setSuccess}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            : "No mentors found for your provided favorite destination."}
        </div>

        <div
          className="flex flex-col gap-5"
          onClick={() => setIsFavoriteShown(true)}
        >
          <h1
            className={`cursor-pointer ${isFavoritesShown ? "bg-green-400 h-fit py-2 rounded-lg px-4" : ""}`}
          >
            Favorites
          </h1>
          {isFavoritesShown &&
            (favoriteMentor.length > 0 ? (
              <div className="flex gap-5 items-center  flex-wrap max-w-[600px]">
                {favoriteMentor.map((favMentor) => {
                  const matchedMentor = matchingMentors.find(
                    (mentor) => mentor.userId === favMentor.mentorId
                  );
                  return matchedMentor ? (
                    <div
                      key={favMentor.mentorId}
                      className="flex flex-col gap-5 items-center bg-yellow-100 py-5 px-7 rounded-xl"
                    >
                      <div className="flex flex-col items-center gap-5">
                        <Image
                          src={matchedMentor.imageUrl! || "/placeholder.svg"}
                          alt=""
                          width={100}
                          height={100}
                          className="rounded-full object-center"
                        />
                        <p>Name: {matchedMentor.user.name}</p>
                      </div>
                      <p className="max-w-[200px]">Bio: {matchedMentor.bio}</p>
                      <p>Country: {matchedMentor.country}</p>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              "No mentor"
            ))}
        </div>
      </div>
    </div>
  );
}
