import HeroMentors from "@/components/orginal-components/PUBLIC/mentors/MENTORS";
import MentorList from "@/components/orginal-components/PUBLIC/mentors/MentorList";
import TopMentorsFrom from "@/components/orginal-components/PUBLIC/mentors/TopMentorsFrom";

export default function Mentors() {
  return (
    <main className="bg-gradient-to-r from-0% from-[#BEDFFF] via-52% via-[#DEE9FF] to-100% to-[#bedfff] mb-4">
      <HeroMentors />
      <MentorList />
      <TopMentorsFrom />
    </main>
  );
}
