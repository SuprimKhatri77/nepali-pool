import Image from "next/image";
import { FileText, Users, DollarSign } from "lucide-react";

export default function SchoolAdmissionRequirements() {
  const applicantDocs = [
    {
      title: "Completed School Application Form",
      desc: "Applicants are required to fill out and submit the school's specific enrollment application.",
    },
    {
      title: "Final Education Certificate",
      desc: "This includes either a graduation certificate or a degree from the most recent school or college attended. Applicants currently in school should provide a certificate of enrollment.",
    },
    {
      title: "Latest Academic Transcript",
      desc: "A transcript from the most recent educational institution the applicant has attended.",
    },
    {
      title: "Recent Photographs",
      desc: "Six to eight photographs sized 3cm by 4cm, taken within the past three months, with one photo to be attached to the enrollment application.",
    },
    {
      title: "Family Register Copy",
      desc: "A copy of the applicant's family register.",
    },
    {
      title: "Proof of Employment",
      desc: "A certificate issued by the employer, necessary only for applicants who have work experience.",
    },
    {
      title: "Passport Copy",
      desc: "Required for applicants with a valid passport. Those who have visited Japan before need to include copies of the passport pages showing Japanese entry visas.",
    },
    {
      title: "Japanese Language Proficiency Evidence",
      desc: "Relevant only for applicants possessing such documentation, like results or score reports from Japanese language exams (e.g., EJU, JLPT, JPT).",
    },
  ];

  const sponsorInJapan = [
    "Letter of Support to the Minister of Justice with a registered seal or signature.",
    "Employment certificate or business registration certificate.",
    "Tax payment certificates.",
    "Resident register or alien registration card for foreign residents in Japan.",
    "Seal registration certificate.",
    "Proof of relationship with the applicant (e.g., family register, birth certificate).",
    "Bank and Income statements in the sponsor's name, in JPY or USD. It is suggested to have at least JPY 2,000,000 – 3,000,000.",
  ];

  const sponsorOutsideJapan = [
    "Letter of Support to the Minister of Justice with a registered seal or signature.",
    "Employment or business registration certificate.",
    "Tax payment certificates.",
    "Proof of relationship with the applicant (e.g., family register, birth certificate).",
    "Tax payment certificate showing earnings/income over the past three years.",
    "Bank and Income statements in the sponsor's name, in JPY or USD. It is suggested to have at least JPY 2,000,000 – 3,000,000.",
  ];

  const selfFinancing = [
    "Bank statement in the applicant's name, in JPY or USD. It is suggested to have at least JPY 2,000,000 – 3,000,000.",
    "Documentation showing annual income.",
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          School Admission Requirements
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Everything you need to know about the application process
        </p>
      </div>

      {/* Eligibility Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" />
          Eligibility Requirements for Applicants
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Applicants must be at least 18 years old and have completed 12 years
          of formal education, including elementary school, to be eligible for
          admission to Japanese language schools. Depending on the applicant's
          nationality, proof of Japanese language proficiency, such as a JLPT N5
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
      </div>

      {/* Application Documents */}
      <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-8 border border-emerald-100">
        <h3 className="text-2xl font-semibold mb-4">Application Documents</h3>
        <p className="text-gray-700 leading-relaxed">
          Document requirements can differ based on personal situations, with
          potential requests for extra paperwork. All original documents need a
          Japanese translation, for which you can seek help from your school.
          Typically, papers from academic or public bodies should be up-to-date,
          preferably issued in the last three months.
        </p>
      </div>

      {/* Documents from Applicant */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" />
          Documents Required from the Applicant
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {applicantDocs.map((doc, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{doc.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {doc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor Documents */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-600" />
          Documents Required from the Sponsor
        </h3>

        <div className="space-y-6">
          {/* Sponsor in Japan */}
          <div className="bg-white rounded-xl p-6 border border-emerald-200">
            <h4 className="text-lg font-semibold mb-4 text-emerald-700">
              A. When the Sponsor is in Japan
            </h4>
            <ul className="space-y-2">
              {sponsorInJapan.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sponsor Outside Japan */}
          <div className="bg-white rounded-xl p-6 border border-emerald-200">
            <h4 className="text-lg font-semibold mb-4 text-emerald-700">
              B. When the Sponsor is Outside Japan
            </h4>
            <ul className="space-y-2">
              {sponsorOutsideJapan.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Self-Financing */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 border border-emerald-200">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700">
                C. When the Applicant is Self-Financing
              </span>
            </h4>
            <ul className="space-y-2">
              {selfFinancing.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <span className="text-emerald-500 mt-1">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
