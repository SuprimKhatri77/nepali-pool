import { StudentFavorites } from "@/components/dashboard/student/student-favorites";
import { requireStudent } from "../../../../../server/lib/auth/guards";

export const metadata = {
  title: "Favorites | NepaliPool",
};

export default async function StudentFavoritesPage() {
  await requireStudent();

  return <StudentFavorites />;
}
