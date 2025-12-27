// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Building2, Calendar, Clock } from "lucide-react";
import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";
import { capitalizeFirstLetter } from "better-auth";

type StudentType = {
  student: ConnectStudentProfileSelectType & {
    user: UserSelectType | null;
  };
  hasCurrentUserProfile: boolean
};

// has current user profile can be use later when delaing with caht 
export const StudentCard = ({ student, hasCurrentUserProfile }: StudentType) => {
  /* after group wise join feature  */
//  const cityGroupLinks: Record<string, string> = {
//   osaka: "https://m.me/osaka_group_link",
//   tokyo: "https://m.me/tokyo_group_link",
//   fukuoka: "https://m.me/fukuoka_group_link",
//   kyoto: "https://m.me/kyoto_group_link",
//   nagoya: "https://m.me/nagoya_group_link",
// };

// const city = student.cityAppliedTo?.toLowerCase();
// const groupLink = city ? cityGroupLinks[city.toLowerCase()] : undefined; // undefine main grp link


//   const navigateToGroup = () => {
//     if(!hasCurrentUserProfile) {
//       toast("Please fill up the form",{position: "top-right"})
//       window.scrollTo({"top": document.documentElement.scrollHeight - 1400, "behavior": "smooth"})
//       return;
//     }
//   if (!groupLink) {
//     alert("Group link not available for this city yet.");
//     return;
//   }

//   window.open(groupLink, "_blank");
// };

  return (
    <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row justify-between items-start">
        {/*  Name */}
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              {capitalizeFirstLetter(student.user?.name ?? "No Name")}
            </h3>
            <p className="text-sm text-gray-500">
              {capitalizeFirstLetter(student.countryAppliedTo)}, {capitalizeFirstLetter(student.cityAppliedTo)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap flex-col gap-2 text-sm">
          <span className="px-2 py-1 rounded font-medium uppercase tracking-wider bg-emerald-50 text-emerald-700">
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

      {/* Action later we can add the buttons*/}
      <CardFooter className="px-6 pb-2 grid  gap-3">
        {/* update this after chat comes  */}
          {/* <Link href={`/chats/${student.userId}`}>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            Start Conversation
        </Button>
          </Link> */}
        {/* <Button onClick={navigateToGroup} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Join {student.cityAppliedTo} Group
        </Button> */}
      </CardFooter>
    </Card>
  );
};
