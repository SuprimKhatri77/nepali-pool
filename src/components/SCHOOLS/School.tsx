import { SchoolSelectType } from "../../../lib/db/schema";
import HeroSchool from "./HeroSchool/HeroSchool";
import SchoolList from "./SchoolList/SchoolList";

export default function Schools({schools}:{schools: SchoolSelectType[]}) {
  return (
    <main className="bg-background text-foreground mb-4">
      <HeroSchool schools={schools} />
      <SchoolList schools={schools} />
    </main>
  );
}
