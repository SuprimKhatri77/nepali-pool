
import React from 'react'
import HeroSchool from './page'

import { SchoolSelectType } from '../../../../lib/db/schema'
import { db } from '../../../../lib/db'

export default async function HeroSchoolServer() {
  
    const schools: SchoolSelectType[] = await db.query.school.findMany()
  return <HeroSchool schools={schools}/>
}
