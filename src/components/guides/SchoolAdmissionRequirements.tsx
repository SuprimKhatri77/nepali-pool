import Image from "next/image";

export default function SchoolAdmissionRequirements() {
  return (
    <div className="p-10 mx-auto bg-white flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold pb-5">School Admission Requirements</h1>
      <Image
        src="/guides/guide2.png"
        alt="School admission Requirements image"
        width={750}
        height={40}
      />
      <div className="flex flex-col items-start pt-10 w-full">
        <h1 className="text-xl items-start font-semibold">
          Eligibility Requirements for Applicants
        </h1>
        <p className="text-sm pb-5">
          Applicants must be at least 18 years old and have completed 12 years
          of formal education, including elementary school, to be eligible for
          admission to Japanese language schools. Depending on the applicant’s
          nationality, proof of Japanese language proficiency, such as a JLPT N5
          certificate or evidence of 150 hours of Japanese language study, may
          be required. The application process involves submitting several
          documents, including passport photographs, a copy of the passport,
          academic transcripts or certificates, and an essay explaining the
          motivation for studying in Japan. The application periods for
          enrollments typically occur four times a year, corresponding to the
          April, July, October, and January intake periods. Applicants from OECD
          countries generally face a more streamlined documentation process,
          while those from non-OECD countries might need to provide additional
          documentation like a birth certificate and proof of financial
          capability.
        </p>
        <h1 className="text-xl items-start font-semibold">
          Application Documents
        </h1>
        <p className="text-sm pb-5">
          Document requirements can differ based on personal situations, with
          potential requests for extra paperwork. All original documents need a
          Japanese translation, for which you can seek help from your school.
          Typically, papers from academic or public bodies should be up-to-date,
          preferably issued in the last three months.
        </p>
        <h1 className="text-xl items-start font-semibold">
          Documents Required from the Applicant
        </h1>
        <ul className="pb-2">
          <li className="list-disc text-lg">
            Completed School Application Form
          </li>
          <p className="font-light">
            Applicants are required to fill out and submit the school’s specific
            enrollment application.
          </p>
        </ul>
        <ul className="pb-2">
          <li className="list-disc text-lg">Final Education Certificate</li>
          <p className="font-light">
            This includes either a graduation certificate or a degree from the
            most recent school or college attended. Applicants currently in
            school should provide a certificate of enrollment.
          </p>
        </ul>
        <ul className="pb-2">
          <li className="list-disc text-lg">Latest Academic Transcript</li>
          <p className="font-light">
            A transcript from the most recent educational institution the
            applicant has attended.
          </p>
        </ul>
        <ul className="pb-2">
          <li className="list-disc text-lg">Recent Photographs</li>
          <p className="font-light">
            Six to eight photographs sized 3cm by 4cm, taken within the past
            three months, with one photo to be attached to the enrollment
            application.
          </p>
        </ul>
        <ul className="pb-2">
          <li className="list-disc text-lg">Family Register Copy</li>
          <p className="font-light">
            A copy of the applicant’s family register.
          </p>
        </ul>
        <ul className="pb-2">
          <li className="list-disc text-lg">Proof of Employment</li>
          <p className="font-light">
            A certificate issued by the employer, necessary only for applicants
            who have work experience.
          </p>
        </ul>
        <ul className="pb-2">
          <li className="list-disc text-lg">Passport Copy</li>
          <p className="font-light">
            Required for applicants with a valid passport. Those who have
            visited Japan before need to include copies of the passport pages
            showing Japanese entry visas.
          </p>
        </ul>
        <ul>
          <li className="list-disc text-lg">
            Japanese Language Proficiency Evidence
          </li>
          <p className="font-light">
            Relevant only for applicants possessing such documentation, like
            results or score reports from Japanese language exams (e.g., EJU,
            JLPT, JPT).
          </p>
        </ul>

        <h1 className="text-xl items-start font-semibold pt-5">
          Documents Required from the Sponsor
        </h1>
        <ul className="pb-2">
          <li className="text-lg">A. When the Sponsor is in Japan:</li>
          <li className="list-disc font-light">
            Letter of Support to the Minister of Justice with a registered seal
            or signature.
          </li>
          <li className="list-disc font-light">
            Employment certificate or business registration certificate.
          </li>
          <li className="list-disc font-light">Tax payment certificates.</li>
          <li className="list-disc font-light">
            Resident register or alien registration card for foreign residents
            in Japan.
          </li>
          <li className="list-disc font-light">
            Seal registration certificate.
          </li>
          <li className="list-disc font-light">
            Proof of relationship with the applicant (e.g., family register,
            birth certificate).
          </li>
          <li className="list-disc font-light">
            Bank and Income statements in the sponsor’s name, in JPY or USD. It
            is suggested to have at least JPY 2,000,000 – 3,000,000.
          </li>
        </ul>
        <ul className="pb-2">
          <li className="text-lg">B. When the Sponsor is Outside Japan:</li>
          <li className="list-disc font-light">
            Letter of Support to the Minister of Justice with a registered seal
            or signature.
          </li>
          <li className="list-disc font-light">
            Employment or business registration certificate.
          </li>
          <li className="list-disc font-light">Tax payment certificates.</li>
          <li className="list-disc font-light">
            Proof of relationship with the applicant (e.g., family register,
            birth certificate).
          </li>
          <li className="list-disc font-light">
            Tax payment certificate showing earnings/income over the past three
            years.
          </li>
          <li className="list-disc font-light">
            Bank and Income statements in the sponsor’s name, in JPY or USD. It
            is suggested to have at least JPY 2,000,000 – 3,000,000.
          </li>
        </ul>
        <ul className="">
          <li className="text-lg">C. When the Applicant is Self-Financing:</li>
          <li className="list-disc font-light">
            Bank statement in the applicant’s name, in JPY or USD. It is
            suggested to have at least JPY 2,000,000 – 3,000,000.
          </li>
          <li className="list-disc font-light">
            Documentation showing annual income.
          </li>
        </ul>
      </div>
    </div>
  );
}
