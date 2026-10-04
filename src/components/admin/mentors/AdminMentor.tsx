"use client"
import React, { useState } from 'react'
import { MentorProfileWithUser } from '../../../../types/all-types'
import DataTable from './DataTable'
import ImageViewComponent from '../ImageViewComponent'
import SearchBelowHero from '@/components/SearchBelowHero'
import MentorList from '@/components/mentors/MentorList'


export default function AdminMentors({mentors}:{mentors: MentorProfileWithUser[]}) {
     const [openImage, setOpenImage] = useState(false)
     const [imageUrl, setImageUrl] = useState<string>("");
 return  <main className=" mb-4">
      <SearchBelowHero sendTo={"/admin/mentors/"} mentors={mentors}></SearchBelowHero>
      <div className='max-w-[90%] w-full mx-auto my-4'>
      <DataTable openImage={openImage} setOpenImage={setOpenImage} setImageUrl={setImageUrl} data={mentors} ></DataTable>

      </div>
      <MentorList mentors={mentors} />
      {openImage && (
        <ImageViewComponent onClose={() => {setImageUrl(""); setOpenImage(!openImage)}} imageUrl={imageUrl}/>
      )}
    </main>
}
