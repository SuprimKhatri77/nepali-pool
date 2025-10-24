"use client"
import { useState } from "react"
import { MentorProfileWithUser } from "../../../types/all-types"
import DataTable from "./mentors/DataTable"
import { SectionCards } from "./SectionCards"
import ImageViewComponent from "./ImageViewComponent"
import { StudentMentorComparision } from "./StudentMentorComparisionChart"
import { ChartPieUsers } from "./UserPieChart"
import { UsersByMonth } from "@/app/admin/dashboard/page"
import { StudentBarChart } from "./students/StudentBarChart"



export default function AdminPage({mentors, chartData, monthlyUsers}:{mentors : MentorProfileWithUser[], chartData: { date: string; mentors: number; students: number }[], monthlyUsers: UsersByMonth[]}, ) {
 const [openImage, setOpenImage] = useState(false)
 const [imageUrl, setImageUrl] = useState<string>("");
 console.log(imageUrl)
  return (
    <>
    <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards userCount={monthlyUsers.map((m)=>(
                m.users
              ))}/>  
              <div className="px-4 lg:px-6">
                <StudentMentorComparision chartData={chartData} />
              </div>
              <DataTable 
              itemsToShow={5}
              openImage={openImage} 
              setOpenImage={setOpenImage} 
              data={mentors} 
              setImageUrl={setImageUrl}
              />
             <div className=" pl-3 flex flex-wrap gap-2 w-full justify-around flex-1">
               <div className="max-w-[600px] w-full">
                <ChartPieUsers users={monthlyUsers}/>
               </div>
               <div className="max-w-[600px] w-full">
                <StudentBarChart chartData={chartData}/>
               </div>
             </div>
            </div>
          </div>
        </div>
        {openImage && (
          <ImageViewComponent onClose={() => {setOpenImage(!openImage) ; setImageUrl("")}}  imageUrl={imageUrl}/>
        )}
    </>
    
  )
}
