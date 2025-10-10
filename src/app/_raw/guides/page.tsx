import GuideHero from "@/components/guides/GuideHero";
import GuideProcessOne from "@/components/guides/GuideProcessOne";
import SchoolAdmissionRequirements from "@/components/guides/SchoolAdmissionRequirements";
import StudentVisaApplicationProcess from "@/components/guides/StudentVisaApplicationProcess";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";

type Props = {};

const page = (props: Props) => {
  return (
    <>
      <Header />
      <main className="bg-transparent min-h-screen mx-auto mb-4">
        <GuideHero />
        <GuideProcessOne />
        <hr className="bg-black h-[2px]" />
        <SchoolAdmissionRequirements />
        <hr className="bg-black h-[2px]" />
        <StudentVisaApplicationProcess />
      </main>
      <Footer />
    </>
  );
};

export default page;
