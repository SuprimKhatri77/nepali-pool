"use client"
import {  StudentProfileWithUser } from '../../../../types/all-types'
import { StudentBarChart } from './StudentBarChart'
import StudentDataTable from './StudentDataTable'
import SearchBarStudent from './SearchBelowHero'
import ImageViewComponent from '../ImageViewComponent'
import { useState } from 'react'


export default function AdminStudents({students, chartData}:{students: Omit<StudentProfileWithUser, "videoCall">[], chartData: {date: string, mentors: number, students: number}[]}) {
     const [openImage, setOpenImage] = useState(false)
     const [imageUrl, setImageUrl] = useState<string>("");
     console.log(students)
 return  (
  <main className=" mb-4">
      <SearchBarStudent sendTo={"/admin/students/"} students={students} ></SearchBarStudent>
      <div className='max-w-[90%] w-full mx-auto my-4'>
        <StudentDataTable data={students} itemsToShow={4}></StudentDataTable>

      </div>
      <div className='my-4'>
        <StudentBarChart chartData={chartData} />
      </div>
      {openImage && (
        <ImageViewComponent onClose={() => {setImageUrl(""); setOpenImage(!openImage)}} imageUrl={imageUrl}/>
      )}
    </main>
 )
}
