import React from 'react'
import { MentorProfileWithUser } from '../../../types/all-types'
import HeroMentors from './HeroMentor'
import MentorList from './MentorList'

export default function Mentors({mentors}:{mentors: MentorProfileWithUser[]}) {
 return  <main className=" mb-4">
      <HeroMentors mentors={mentors} />
      <MentorList mentors={mentors} />
      {/* <TopMentorsFrom />  for future use case we can use it through ratings. */}
    </main>
}
