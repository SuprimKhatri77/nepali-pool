import React from 'react'
import SchoolNearByMentors from './[schoolId]/page'

export default function page({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  return (
    <SchoolNearByMentors params={params}/>
  )
}
