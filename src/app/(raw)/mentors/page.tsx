import MentorList from "@/components/mentors/MentorList";
import HeroMentors from "@/components/mentors/MENTORS";
import TopMentorsFrom from "@/components/mentors/TopMentorsFrom";


export default function Mentors() {
  return (
    <main className=" mb-4">
      <HeroMentors />
      <MentorList />
      <TopMentorsFrom />
    </main>
  );
}
