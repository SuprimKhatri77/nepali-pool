import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Building2, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";

type StudentType = {
  student: ConnectStudentProfileSelectType & {
    user: UserSelectType | null;
  };
};

export const StudentCard = ({ student }: StudentType) => {
  return (
    <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row justify-between items-start">
        {/*  Name */}
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              {student.user?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {student.countryAppliedTo}, {student.cityAppliedTo}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap flex-col gap-2 text-sm">
          <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">
            {student.currentStatus}
          </span>
          {/* Examples: Language School | Master | PhD */}
        </div>
      </CardHeader>

      {/* Details */}
      <CardContent className="px-3 sm:px-6 space-y-3">
        <div className="text-sm text-gray-600">
          <div className="flex flex-wrap flex-col items-start gap-2 text-sm w-28">
            <span className="p-2 mb-2  rounded bg-emerald-50 text-emerald-700">
              More details:
            </span>
          </div>

          <p className="flex sm:items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-800">Institution:</span>{" "}
            <span className="font-semibold text-emerald-700">
              {student.universityName}
            </span>
          </p>

          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-800">Level:</span>{" "}
            {student.studyLevel}
          </p>

          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-800">Applied For:</span>{" "}
            {student.intakeYear}-{student.intakeMonth} Intake
          </p>
        </div>
      </CardContent>

      {/* Action */}
      <CardFooter className="px-6 pb-2 grid grid-cols-2 gap-3">
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Link href={"/chats/0ff7797c-3e78-4fdc-ab82-4e83ad877658"}>
            Start Conversation
          </Link>
        </Button>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          <a target="_blank" href={"https://m.me/ch/AbYIEGS3aMMTPi1b/"}>
            Join Group
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
