"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "../../server/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import {
  FavoriteSelectType,
  MentorProfileSelectType,
  StudentProfileSelectType,
  UserSelectType,
} from "../../lib/db/schema";
import Image from "next/image";
import { addToFavorite, FormState } from "../../server/actions/addToFavorite";
import { Star } from "lucide-react";
import { removeFavorite } from "../../server/actions/removeFavorite";

type MentorProfileWithUser = MentorProfileSelectType & {
  user: UserSelectType;
};

type StudentProfileWithUser = StudentProfileSelectType & {
  user: UserSelectType;
};

// type FavoriteMentor =

export default function StudentPage({
  matchingMentors,
  studentRecordWithUser,
  favoriteMentor,
}: {
  matchingMentors: MentorProfileWithUser[];
  studentRecordWithUser: StudentProfileWithUser;
  favoriteMentor: FavoriteSelectType[];
}) {
  const [click, setClick] = useState(false);
  const router = useRouter();
  const [isFavoritesShown, setIsFavoriteShown] = useState<boolean>(false);

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
  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
      Sup student!
      <Button onClick={handleLogout} disabled={click}>
        Logout
      </Button>
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
                  <div className="flex flex-wrap gap-5 items-center">
                    {matchingMentors.map((mentor) => (
                      <div
                        key={mentor.userId}
                        className="flex flex-col gap-5 items-center bg-gray-100 py-5 px-7 rounded-xl"
                      >
                        <div className="flex flex-col items-center gap-5">
                          <Image
                            src={mentor.imageUrl!}
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
                      </div>
                    ))}
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
                          src={matchedMentor.imageUrl!}
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
