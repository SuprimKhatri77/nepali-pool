import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoMentorApplications() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center px-6 bg-white">
      <Card className="w-full max-w-md text-center shadow-lg border border-gray-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-600">
            No Mentor Applications Found
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Everything looks perfectly in order. No pending mentor requests at the moment.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 items-center mt-4">
          <p className="text-gray-700 text-sm">
            Check back later for new submissions or continue managing other sections of the platform.
          </p>

          <div className="mt-3 flex gap-2 w-full">
              <Button className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-2 px-5 py-2">
                <Link href={"/admin/students"}>All Students</Link>
              </Button>
            <Button><Link href={"/admin/mentors"}>View All Mentors</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
