import GuideHero from "@/components/orginal-components/PUBLIC/guides/GuideHero";
import GuideProcess1 from "@/components/orginal-components/PUBLIC/guides/GuideProcess1";
import SchoolAdmissionRequirements from "@/components/orginal-components/PUBLIC/guides/SchoolAdmissionRequirements";
import StudentVisaApplicationProcess from "@/components/orginal-components/PUBLIC/guides/StudentVisaApplicationProcess"

export default function Page() {
  return (
    <main className="bg-transparent min-h-screen mx-auto mb-4">
      <GuideHero />
      <GuideProcess1 />
      <hr className="bg-black h-[2px]"/>
      <SchoolAdmissionRequirements/>
      <hr className="bg-black h-[2px]"/>
      <StudentVisaApplicationProcess/>
    </main>
  );
}
