import { getPublicMentor } from "../lib/mentors/public-mentor";

// Used by generateMetadata; only approved mentors, only public fields.
export async function getMentorById(mentorId: string) {
  return getPublicMentor(mentorId);
}
