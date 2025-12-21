import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function StudentCards() {
  return (
              <section className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {Array.from({length: 5}).map((_,i)=>(

                 <StudentCard key={i} />
                ))}

    </div>
              </section>
  )
}


export const StudentCard = () => {

  
    return (
    <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow">
  <CardHeader className="flex flex-row justify-between items-start">
    {/* Left: Avatar + Name */}
    <div className="flex items-center gap-3">
   

      <div>
        <h3 className="font-semibold text-gray-900">
          Full Name
        </h3>
        <p className="text-sm text-gray-500">
          Australia • Sydney
        </p>
      </div>
    </div>
   <div className="flex flex-wrap flex-col gap-2 text-sm">
      <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">
        Bachelor
      </span>
      {/* Examples: Language School | Master | PhD */}
  
    </div>
   
  </CardHeader>

  {/* Details */}
  <CardContent className="px-6 space-y-3">

 

    <div className="text-sm text-gray-600">
    <div className="flex flex-wrap flex-col items-start gap-2 text-sm w-28">
      <span className="pr-2 py-1 rounded bg-emerald-50 text-emerald-700">
        More details:
      </span>
  
    </div>
      <p>
        <span className="font-medium text-gray-800">Institution:</span>{" "}
        University of Sydney
      </p>
      
       <p className="pb-3">
        <span className="font-medium text-gray-800">Status:</span>{" "}
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque, possimus.
      </p>
        <p>
      {/* applied date */}
        <span className="font-medium text-gray-800">Applied On:</span>{" "}
        12 Jan 2025
      </p>
    </div>
  </CardContent>

  {/* Action */}
  <CardFooter className="px-6 pb-2">
    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
      Start Conversation
    </Button>
  </CardFooter>
</Card>

    )
}
