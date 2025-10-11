
import React from 'react'
import HeroMentors from './MENTORS'
import { SchoolSelectType } from '../../../lib/db/schema'
import { db } from '../../../lib/db'

export default async function HeroSchoolServer() {
  
    const schools: SchoolSelectType[] = await db.query.school.findMany()
  return <HeroMentors schools={schools}/>
}
