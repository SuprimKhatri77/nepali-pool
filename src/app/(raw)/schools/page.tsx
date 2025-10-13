import Schools from "@/components/SCHOOLS/School";
import { SchoolSelectType } from "../../../../lib/db/schema";
import { db } from "../../../../lib/db";

export default async function Page() {
    const schools: SchoolSelectType[] = await db.query.school.findMany()

  return <Schools schools={schools} />
}
