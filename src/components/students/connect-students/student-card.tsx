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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { FaWhatsapp } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  students:
    | (ConnectStudentProfileSelectType & {
        user: UserSelectType | null;
      })[]
    | [];
    hasCurrentUserProfile: boolean,
    hasSession: boolean,
    user: ConnectStudentProfileSelectType | undefined,
} & React.ComponentProps<"section">;
export default function StudentCards({ students, hasCurrentUserProfile, hasSession,user, className, ...props }: Props) {
    const [connectWith, setConnectWith] = useState<string[]>([])
    const [multipleConnect, setMultipleConnect] = useState<boolean>(false)
    const router = useRouter()
   const isMobile = useIsMobile()

    const handleClickMultiple = (navigate: "facebook" | "whatsapp") => {
        if(!hasSession) {
          router.push("/login")
          return;
        }
        if(!user?.whatsAppNumber){
          toast("First fill the form to connect with new friend",{position: "top-right"})
          if(isMobile){
            window.scrollTo({top: document.documentElement.scrollHeight - 2000, behavior:   "smooth"})
          }
          else {
            window.scrollTo({top: document.documentElement.scrollHeight -1400, behavior:   "smooth"})
          }
          return;
        }
        if (navigate === "whatsapp") {
        const message = `I want to connect with ${connectWith.join(", ")}.`;
        const url = `https://wa.me/9779867473181?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank"); 
        return;
        }
    
      if(navigate === "facebook"){
        return;
      }
      } 
  
  return (
    <section className={cn("py-4 relative space-y-4", className)} {...props}>
      <div className="flex gap-2 flex-wrap justify-between items-center px-4">
        <div className="flex gap-2 justify-center items-center">
          <p className="text-xs tracking-tight text-right">{multipleConnect ? connectWith.length === 0 ? "Select students you want to connect with" : `${connectWith.length} students selected`  : "Connect with Multiple Students"}</p>
        <Input onChange={() => {
          if(multipleConnect){
            setConnectWith([]);
            setMultipleConnect(false)
          }
          else{
            setMultipleConnect(true)
          }
        }} type="checkbox" className="size-2"/>
        </div>
        {multipleConnect && connectWith.length >= 2 ? (
        <Button onClick={() => handleClickMultiple("whatsapp")} variant={"outline"}>Connect on <FaWhatsapp /></Button>
        ): !multipleConnect && (
          <JoinNepaliPoolCommunity className="top-7" hasCurrentUserProfile={hasCurrentUserProfile} hasSession={hasSession} about="NepaliPool Messenger Community QR"/>
        )}
      </div>
      {/* //grid-cols-1 md: */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 px-2 md:px-4">
        {/* receive from props */}
        {students.map((student, i) => (
          <StudentCard key={i} multipleConnect={multipleConnect} connectWith={connectWith} setConnectWith={setConnectWith} student={student} hasCurrentUserProfile={hasCurrentUserProfile} hasSession={hasSession} user={user}/>
        ))}
      </div>
    </section>
  );
}

export const JoinNepaliPoolCommunity = ({ hasSession,hasCurrentUserProfile, className, ...props }: React.ComponentProps<"div"> & {hasCurrentUserProfile: boolean, hasSession: boolean}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const messengerLink = "https://m.me/ch/AbYIEGS3aMMTPi1b/?send_source=cm%3Acopy_invite_link";

  

  const checkUserProfile = () => {
    if(!hasSession) {
      router.push("/login")
      return ;
    }
    if(hasSession && !hasCurrentUserProfile){
      toast("Please fill up the Study Abroad Form",{position: "top-right"});
      window.scrollTo({top: document.documentElement.scrollHeight - 1400, behavior:   "smooth"})
      return ;
    }
    else {
      setOpen(true)
    }
  }

  return (
    <div className={cn("relative", className)} {...props}>
      {/* Trigger button */}
      <Button onClick={checkUserProfile} className=" text-sm absolute right-2 -top-12">
        Join Community
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

          <DialogFooter className="flex justify-between">
  <Button
    onClick={() => window.open(messengerLink, "_blank")}
    className="bg-blue-600 hover:bg-blue-700 text-white"
  >
    Join Community
  </Button>

  <Button variant="outline" onClick={() => setOpen(false)}>
    Close
  </Button>
</DialogFooter>

        </DialogContent>
      </Dialog>
    </div>
  );
};
