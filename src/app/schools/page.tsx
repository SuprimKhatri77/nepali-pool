import { db } from "../../../lib/db";
import { mentorProfile, school } from "../../../lib/db/schema";
import { count } from "drizzle-orm";
import { getAllSchools } from "../../../server/lib/dal/get-all-schools";
import { Schools } from "@/modules/schools/schools";

export default async function AllSchools({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const page =
    Number((await searchParams).page) > 0
      ? Number((await searchParams).page)
      : 1;
  const limit = 6;
  const [totalResult] = await db.select({ count: count() }).from(school);

  const total = Number(totalResult.count);
  const totalPages = Math.ceil(total / limit);

  const offset = (page - 1) * limit;
  const allSchools = await getAllSchools(limit, offset);
  return (
    <Schools
      allSchools={allSchools.schools}
      total={total}
      page={page}
      offset={offset}
      totalPages={totalPages}
      limit={limit}
    />
  );
}
