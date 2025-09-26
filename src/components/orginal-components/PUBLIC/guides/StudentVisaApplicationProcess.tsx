import GuideParaCard from "./guidesParaCard/GuideParaCard";

export default function page() {
  return (
    <div className="p-10 mx-auto bg-white flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold pb-5">School Admission Requirements</h1>
      <p>Selecting the right school is crucial and should be based on factors like teaching style, course offerings, and location. After completing the school application and submitting all required documents, the school applies for a Certificate of Eligibility (COE) on the student’s behalf, which typically takes 2-3 months to process. Once the COE is granted, the student can then apply for a student visa at the nearest Japanese embassy or consulate, providing the COE, a valid passport, and other necessary documents.</p>
      <div>
        <GuideParaCard step={1} title="Application Submission" isLast={false} description="Start with filling out the school’s application form thoroughly. Then, submit all necessary documents as previously mentioned, which encompass academic certificates, transcripts, photographs, and any other required paperwork. This step is crucial for a successful application process." />
        <GuideParaCard step={2} title="Document Review and Submission" isLast={false} description="After receiving your documents, our team and school will review them. If additional information is required or corrections are needed, we will guide you through this process." />
        <GuideParaCard step={3} title="Waiting for COE Approval" isLast={false} description="The COE approval process by immigration typically takes about 2-3 months. Be aware that applications can be rejected for various reasons, such as falsified documents, incorrect application details, inaccurate educational history, or insufficient financial backing from the sponsor." />
        <GuideParaCard step={4} title="Post-Approval Steps" isLast={false} description="Once the COE is approved (usually 5-6 weeks before the course starts), the school will send you a copy of your COE, an invoice for tuition (and any other requested fees), and an acceptance letter. It’s crucial to make the payment by the due date to receive the original COE via mail." />
        <GuideParaCard step={5} title="Apply to Student Visa" isLast={false} description="With the COE documents, apply for visa at the embassy/consulate-general of Japan in your country. 1 months before." />
        <GuideParaCard step={6} title="Applying for the Student Visa" isLast={true} description="With the original COE in hand, the final step is to apply for your student visa at the nearest Japanese embassy in your country. For the student visa application, you will need to submit: -The original COE.
-The acceptance letter from the school.
-A valid passport.
-A recent passport-sized photo taken within the last six months
-The completed student visa application form." />
      </div>
    </div>
  )
}