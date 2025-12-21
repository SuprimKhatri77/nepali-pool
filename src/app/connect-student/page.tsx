"use client"

import ConnectStudentHero from "@/components/students/connect-students/Hero"
import StudentCards from "@/components/students/connect-students/StudentCards"
import StudentDetailForm from "@/components/students/connect-students/StudentDetailForm"


export default function page() {
  return (
    <>
    <section className="min-h-[90%]">

      <ConnectStudentHero />
    </section>
      {/* list of students */}
      <StudentCards />

      {/* show this form to student  when first time coming to this page. */}
        <StudentDetailForm />
    </>
  )
}


