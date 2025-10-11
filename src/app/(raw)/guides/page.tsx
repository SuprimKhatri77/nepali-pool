import GuideHero from "@/components/guides/GuideHero";
import GuideProcessOne from "@/components/guides/GuideProcessOne";
import SchoolAdmissionRequirements from "@/components/guides/SchoolAdmissionRequirements";
import StudentVisaApplicationProcess from "@/components/guides/StudentVisaApplicationProcess";


const page = () => {
  return (
    <>
      <main className="bg-transparent min-h-screen mx-auto mb-4">
        <GuideHero />
        <GuideProcessOne />
        <hr className="bg-black h-[2px]" />
        <SchoolAdmissionRequirements />
        <hr className="bg-black h-[2px]" />
        <StudentVisaApplicationProcess />
      </main>
    </>
  );
};

export default page;
