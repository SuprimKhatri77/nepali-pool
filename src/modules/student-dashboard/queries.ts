import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { ActionError, unwrap } from "@/utils/action-result";
import {
  listFavoriteMentors,
  listMatchingMentors,
  setFavoriteMentor,
  type MatchingMentorsPage,
  type StudentMentorCard,
} from "../../../server/actions/student-dashboard/mentors";

export const studentDashboardKeys = {
  all: ["student-dashboard"] as const,
  matchingMentors: () =>
    [...studentDashboardKeys.all, "matching-mentors"] as const,
  favorites: () => [...studentDashboardKeys.all, "favorites"] as const,
};

export const matchingMentorsInfiniteOptions = () =>
  infiniteQueryOptions({
    queryKey: studentDashboardKeys.matchingMentors(),
    queryFn: async ({ pageParam }) =>
      unwrap(await listMatchingMentors({ page: pageParam })),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

export const favoriteMentorsQueryOptions = () =>
  queryOptions({
    queryKey: studentDashboardKeys.favorites(),
    queryFn: async () => unwrap(await listFavoriteMentors()),
  });

type FavoriteVars = { mentorId: string; favorite: boolean };

// Flips the heart immediately in every cached list, rolls back if the server
// refuses, and refetches both lists afterwards so they agree with the DB.
export function useSetFavoriteMentor() {
  const queryClient = useQueryClient();
  const matchingKey = studentDashboardKeys.matchingMentors();
  const favoritesKey = studentDashboardKeys.favorites();

  return useMutation({
    mutationFn: async (vars: FavoriteVars) =>
      unwrap(await setFavoriteMentor(vars)),
    onMutate: async ({ mentorId, favorite }) => {
      await queryClient.cancelQueries({ queryKey: studentDashboardKeys.all });
      const previousMatching =
        queryClient.getQueryData<InfiniteData<MatchingMentorsPage, number>>(
          matchingKey,
        );
      const previousFavorites =
        queryClient.getQueryData<StudentMentorCard[]>(favoritesKey);

      const flip = (mentor: StudentMentorCard) =>
        mentor.userId === mentorId ? { ...mentor, isFavorite: favorite } : mentor;
      queryClient.setQueryData<InfiniteData<MatchingMentorsPage, number>>(
        matchingKey,
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map(flip),
            })),
          },
      );
      // Un-favoriting removes the card from Favorites right away; a new
      // favorite shows up there after the refetch.
      if (!favorite) {
        queryClient.setQueryData<StudentMentorCard[]>(favoritesKey, (data) =>
          data?.filter((mentor) => mentor.userId !== mentorId),
        );
      }
      return { previousMatching, previousFavorites };
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(matchingKey, context?.previousMatching);
      queryClient.setQueryData(favoritesKey, context?.previousFavorites);
      toast.error(
        error instanceof ActionError
          ? error.message
          : "Couldn't update favorites. Please try again.",
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: studentDashboardKeys.all }),
  });
}
