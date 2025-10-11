import HeroSchoolServer from "@/components/SCHOOLS/HeroSchool/HeroSchoolServer";
import SchoolListServer from "@/components/SCHOOLS/SchoolList/SchoolListServer";

export default function Schools() {
  return (
    <main className="bg-background text-foreground mb-4">
      <HeroSchoolServer />
      <SchoolListServer />
    </main>
  );
}
