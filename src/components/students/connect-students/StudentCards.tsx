import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Building2, Calendar, Clock,  XIcon } from "lucide-react";
import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";
import { capitalizeFirstLetter } from "better-auth";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaUserGraduate, FaWhatsapp } from "react-icons/fa";
import { cn } from "@/components/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog,  DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import React, { useState } from "react";

type StudentType = {
  student: ConnectStudentProfileSelectType & {
    user: UserSelectType | null;
  };
  hasCurrentUserProfile: boolean;
  hasSession: boolean,
  user: ConnectStudentProfileSelectType | undefined,
  connectWith: string[],
  setConnectWith: React.Dispatch<React.SetStateAction<string[]>>
  multipleConnect: boolean,
  // setMultipleConnect: React.Dispatch<React.SetStateAction<string[]>>
};

// has current user profile can be use later when delaing with caht 
export const StudentCard = ({ student, hasSession, user, connectWith, setConnectWith, multipleConnect }: StudentType) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isMobile = useIsMobile()
  const handleClick = (navigate: "facebook" | "whatsapp") => {
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
    const message = `I want to connect with ${student.user?.name}.`;
    const url = `https://wa.me/9779867473181?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank"); 
    return;
  }

  if(navigate === "facebook" && student.facebookProfileLink){
    window.open(student.facebookProfileLink, "_blank"); 
  }
} 

  const connectWithMultiple = (name: string) => {
    console.log("i want to connect with : ", name, "old", connectWith)

    if(multipleConnect){
      // check is already added if yes remove it from list
      const isAlreadyIncluded = connectWith.find((n)=>{
        return n.toLowerCase() === name.toLowerCase()
      })
      if(isAlreadyIncluded){
        // if i put with indexing it is much easier
        const removePrevious = connectWith.filter((n)=>{
          return n !== name
        })

        setConnectWith(removePrevious)
        return;
      }
      setConnectWith((prev) => {
      const updated = [...prev, name]
      console.log(updated)
      return updated
    })
    }
  }
  
  return (
    <>
    
    <Card onClick={() => student.user?.name && connectWithMultiple(student.user?.name)} className={cn("overflow-hidden border-gray-200 hover:shadow-lg transition-shadow", student.user?.name && connectWith.includes(student.user?.name) ? "border-2 drop-shadow-2xl border-green-400" : "")}>
      <CardHeader className="flex flex-col px-2 md:px-4">
        <div className="flex justify-between gap-2 w-full">
             <p className="text-sm text-gray-500">
                {student.cityAppliedTo !== "Not set" ? capitalizeFirstLetter(student.cityAppliedTo) : capitalizeFirstLetter(student.countryAppliedTo)}
            </p>
          <span className="px-1 py-1 text-[8px] rounded font-medium  bg-emerald-50 text-emerald-700">
            {student.currentStatus}
          </span>
        </div>  

      {
        student.universityName === "Not set" ? (
           <p className="flex items-center gap-1">
    <FaUserGraduate className="w-4 h-4 text-gray-500" />
    <span className="font-medium text-[10px] line-clamp-1 text-emerald-700">
      {capitalizeFirstLetter(student.user?.name.split(" ")[0] ?? "")}
    </span>
  </p>
        ) : (
          <p className="flex items-center gap-1">
    <Building2 className="w-4 h-4 text-gray-500" />
    <span className="font-medium text-[10px] line-clamp-1 text-emerald-700">
      {student.universityName}
    </span>
  </p>
        )
      }
         
        
        
      </CardHeader>

     

     



      {/* Action later we can add the buttons*/}
      <CardFooter className="px-2 space-y-0 grid  gap-x-3 md:px-4">
        <p className="text-left text-[8px] font-medium">Connect On</p>
       <div className={cn("flex items-center justify-between", student.facebookProfileLink ? "grid-cols-2 gap-3" : "")}>
        <div className="flex gap-2">

{/* show only when fb link is available */}
          {student.facebookProfileLink && 
            <FaFacebook onClick={() => handleClick("facebook")}  className="cursor-pointer"/>
 } 
 
  
        {/* WhatsApp */}
    <FaWhatsapp onClick={() => handleClick("whatsapp")} className="cursor-pointer"/>
        </div>

       <p onClick={(e) => {
        e.stopPropagation();
        setOpen(true)
       }} className="text-[8px] p-1 col-span-2 cursor-pointer">View More</p>
       </div>
      </CardFooter>
     
    </Card>
     {
        open && (
          <DialogStudentCard open={true} setOpen={setOpen}  student={student} />
        )
      }
    </>
    
  );
};


// for user after clicking view more 
export const DialogStudentCard = ({student, open, setOpen}:{student: (ConnectStudentProfileSelectType & {
    user: UserSelectType | null;
  }), open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) =>  {
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent
    className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full"
  >
    <DialogHeader>
      <DialogTitle></DialogTitle>
        <DialogTrigger>
   
   </DialogTrigger>
    </DialogHeader>
      <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
      <CardHeader className="flex  flex-row justify-between items-start">

        {/*  Name */}
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              {capitalizeFirstLetter(student.user?.name.split(" ")[0] ?? "No Name")}
            </h3>
            <p className="text-sm text-gray-500">
              {capitalizeFirstLetter(student.countryAppliedTo)} {student.cityAppliedTo !== "Not set" && ","} {student.cityAppliedTo !== "Not set" && capitalizeFirstLetter(student.cityAppliedTo)}
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

       <CardFooter className="flex justify-end">
     <Button onClick={() => setOpen(false)} className="flex gap-2"><XIcon></XIcon> Close</Button>
       </CardFooter>



      
    </Card>
    </DialogContent>
  </Dialog>
}