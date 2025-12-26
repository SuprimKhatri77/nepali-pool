import React, { useState } from "react";
import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";
import { StudentCard } from "./StudentCards";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

type Props = {
  students:
    | (ConnectStudentProfileSelectType & {
        user: UserSelectType | null;
      })[]
    | [];
    hasCurrentUserProfile: boolean
};
export default function StudentCards({ students, hasCurrentUserProfile }: Props) {
  return (
    <section className="py-4 relative">
      <JoinNepaliPoolCommunity />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-4">
        {/* receive from props */}
        {students.map((student, i) => (
          <StudentCard key={i} student={student} hasCurrentUserProfile={hasCurrentUserProfile}/>
        ))}
      </div>
    </section>
  );
}

export const JoinNepaliPoolCommunity = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [open, setOpen] = useState(false);

  const messengerLink = "https://m.me/ch/AbYIEGS3aMMTPi1b/?send_source=cm%3Acopy_invite_link";

  return (
    <div className={cn("relative", className)} {...props}>
      {/* Trigger button */}
      <Button onClick={() => setOpen(true)} className="bg-emerald-400 text-sm absolute right-2 -top-9">
        Join NepaliPool Community
      </Button>

      {/* Dialog / Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Join NepaliPool Community</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 my-4">

             <ul className="list-disc ml-6 space-y-2 text-sm">
  <li>
    <strong>Step 1:</strong> Messenger मा यो search गर्नु: <em>NepaliPool</em>
  </li>
  <li>
    <strong>Step 2:</strong> <em>Communities</em> भन्ने select गर्नु
  </li>
  <li>
    <strong>Step 3:</strong> Click गर्नु <em>NepaliPool Community</em> मा
  </li>
  <li>Join हुनुहुन्छ 🙌</li>
</ul>
           
           

            <p>OR</p>
           
            {/* QR Code */}
            <Image
              src="/community_qr.jpg" 
              alt="NepaliPool Messenger QR"
              width={192}  
              height={192} 
              className="rounded-md"
            />


          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
