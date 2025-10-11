import React from 'react'
import { db } from "../../../../lib/db";
import { SchoolSelectType } from "../../../../lib/db/schema";
import SchoolList from './page';
export default async function SchoolListServer() {
  const schools: SchoolSelectType[] = await db.query.school.findMany();

  return <SchoolList schools={schools}/>
}
