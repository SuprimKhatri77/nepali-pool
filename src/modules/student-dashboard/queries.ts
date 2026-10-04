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
  listStudentBookings,
  listStudentEnquiries,
} from "../../../server/actions/student-dashboard/bookings";
import { cancelServiceBooking } from "../../../server/actions/service-booking/update-booking-status";
import { withdrawEnquiry } from "../../../server/actions/mentor-enquiry/update-enquiry-status";
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
  bookings: () => [...studentDashboardKeys.all, "bookings"] as const,
  enquiries: () => [...studentDashboardKeys.all, "enquiries"] as const,
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

export const studentBookingsInfiniteOptions = () =>
  infiniteQueryOptions({
    queryKey: studentDashboardKeys.bookings(),
    queryFn: async ({ pageParam }) =>
      unwrap(await listStudentBookings({ cursor: pageParam })),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export const studentEnquiriesInfiniteOptions = () =>
  infiniteQueryOptions({
    queryKey: studentDashboardKeys.enquiries(),
    queryFn: async ({ pageParam }) =>
      unwrap(await listStudentEnquiries({ cursor: pageParam })),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

// Cancel / withdraw. Either way the list is refetched afterwards: on success
// to show the new status, on failure because the mentor most likely acted
// first and the card is out of date.
function useStatusChange(
  action: (id: string) => Promise<{ success: boolean; message: string }>,
  queryKey: readonly unknown[],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await action(id);
      if (!result.success) throw new ActionError(result.message);
      return result.message;
    },
    onSuccess: (message) => toast.success(message),
    onError: (error) =>
      toast.error(
        error instanceof ActionError
          ? error.message
          : "Something went wrong. Please try again.",
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export const useCancelBooking = () =>
  useStatusChange(cancelServiceBooking, studentDashboardKeys.bookings());

export const useWithdrawEnquiry = () =>
  useStatusChange(withdrawEnquiry, studentDashboardKeys.enquiries());

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
      await Promise.all([
        queryClient.cancelQueries({ queryKey: matchingKey }),
        queryClient.cancelQueries({ queryKey: favoritesKey }),
      ]);
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
    // Only the two mentor lists: bookings and enquiries don't change.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: matchingKey }),
        queryClient.invalidateQueries({ queryKey: favoritesKey }),
      ]),
  });
}
