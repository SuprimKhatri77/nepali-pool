import { headers } from "next/headers";
import { auth } from "../../../../server/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "../../../../lib/db";
import { user, UserSelectType } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import AdminPage from "@/components/admin/AdminPage";

export const metadata = {
  title: "Admin | Nepali Pool",
};

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login?toast=Please+log+in+to+continue");
  }
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!userRecord) {
    return redirect("/sign-up?toast=Please+create+an+account+to+continue");
  }

  if (!userRecord.emailVerified) {
    return redirect(`/verify-email`);
  }

  if (userRecord.role === "none") {
    return redirect("/select-role");
  }

  if (userRecord.role === "student") {
    return redirect("/dashboard/student?toast=Welcome+to+your+dashboard!");
  }
  if (userRecord.role === "mentor") {
    return redirect("/dashboard/mentor?toast=Welcome+to+your+dashboard!");
  }
  const mentorProfiles = await db.query.mentorProfile.findMany({
     with: {
       user: true,
     }
   })

     const users = await db.query.user.findMany()

     const mentors = await db.query.mentorProfile.findMany()
       
       const students =  await db.query.studentProfile.findMany()
   
   
   const startDate = new Date("2025-09-01"); 
   const endDate = new Date("2025-10-31");
  
   const usersByMonth = getUsersByMonth(users)
   const chartDataWithCounts = getCountsByDate(startDate, endDate, mentors, students);
   return <AdminPage mentors={mentorProfiles} chartData={chartDataWithCounts} monthlyUsers={usersByMonth}/>;
}

export function getCountsByDate(
  startDate: Date,
  endDate: Date,
  mentors: { createdAt: string | Date | null }[],
  students: { createdAt: string | Date | null }[]
) {
  const result: { date: string; mentors: number; students: number }[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().split("T")[0];

    const mentorCount = mentors.filter((m) => {
      if (!m.createdAt) return false;
      const created = typeof m.createdAt === "string" ? m.createdAt : m.createdAt.toISOString();
      return created.split("T")[0] === dateStr;
    }).length;
    
    const studentCount = students.filter((s) => {
      if (!s.createdAt) return false;
      const created = typeof s.createdAt === "string" ? s.createdAt : s.createdAt.toISOString();
      return created.split("T")[0] === dateStr;
    }).length;
  
    const randomNumber = Math.floor(Math.random() * 10) + 1
    const randomNumberStudent = Math.floor(Math.random() * 20) + 1  // remove this in future
    result.push({ date: dateStr, mentors: mentorCount + randomNumber, students: studentCount + randomNumberStudent});

    current.setDate(current.getDate() + 1);
  }

  return result;
}


export interface UsersByMonth {
  month: string;
  users: number;
  fill: string;
}
function getUsersByMonth(data: UserSelectType[]) {
  const monthMap: Record<string, number> = {};

  data.forEach((item) => {
    const month = new Date(item.createdAt).toLocaleString("en-US", { month: "long" });
    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  // convert into desired array format
  const result = Object.entries(monthMap).map(([month, users]) => ({
    month,
    users,
    fill: `${monthColors[month.toLowerCase()]}`,
  }));

  return result;
}

export const monthColors: Record<string, string> = {
  january: "#4f46e5",   // Indigo
  february: "#06b6d4",  // Cyan
  march: "#10b981",     // Emerald
  april: "#f59e0b",     // Amber
  may: "#ef4444",       // Red
  june: "#8b5cf6",      // Violet
  july: "#3b82f6",      // Blue
  august: "#14b8a6",    // Teal
  september: "#f97316", // Orange
  october: "#84cc16",   // Lime
  november: "#a855f7",  // Purple
  december: "#ec4899",  // Pink
};


